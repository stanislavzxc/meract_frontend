import React, { useEffect, useMemo, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../../shared/api/api";
import { useSpotAgent } from "../../../shared/hooks/useSpotAgent";
import { useAuthStore } from "../../../shared/stores/authStore";
import useChat from "../hooks/useChat";
import EmojiPicker from "./EmojiPicker";
import styles from "./StreamViewer.module.css";

import back from '../../../images/arrow-left.png';
import tasks_image from '../../../images/tasks.png';
import messages from '../../../images/messages.png';
import geo from '../../../images/geo.png';

// Function to extract data from JWT token
const parseJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
};

const StreamViewer = ({ channelName, streamData, id, onClose }) => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [streamDuration, setStreamDuration] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [userPosition, setUserPosition] = useState([55.751244, 37.618423]);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  // Состояния для записей
  const [recordings, setRecordings] = useState([]);
  const [loadingRecordings, setLoadingRecordings] = useState(false);
  const [showRecordingPlayer, setShowRecordingPlayer] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [recordingsExpanded, setRecordingsExpanded] = useState(false);

  console.log("StreamViewer - Initial streamData:", streamData);

  // Use chat hook
  const actId = streamData?.id || channelName?.replace("act_", "");
  const { messages: chatMessages, sendMessage, sending } = useChat(actId);

  // Spot Agent state
  const [isSpotAgentModalOpen, setIsSpotAgentModalOpen] = useState(false);
  const { user } = useAuthStore();
  const {
    candidates,
    assignedAgents,
    loading: spotAgentLoading,
    error: spotAgentError,
    fetchCandidates,
    fetchAssigned,
    apply,
  } = useSpotAgent(actId);

  const [actualStreamData, setActualStreamData] = useState(streamData);

  // Spot Agent computed values
  const currentUserId = user?.id || user?.sub;
  const isInitiator = currentUserId === actualStreamData?.userId;
  const spotAgentCount = actualStreamData?.spotAgentCount || 0;
  const hasApplied = candidates.some((c) => c.userId === currentUserId);

  // Load actual stream data from server
  useEffect(() => {
    const loadStreamData = async () => {
      if (!actId) return;

      try {
        console.log("StreamViewer - Loading stream data for actId:", actId);
        const response = await api.get(`/act/find-by-id/${actId}`);
        console.log("StreamViewer - Loaded stream data:", response.data);
        setActualStreamData(response.data);
      } catch (error) {
        console.error("Error loading stream data:", error);
        setActualStreamData(streamData);
      }
    };

    loadStreamData();
  }, [actId, streamData]);

  // Fetch spot agent data when spotAgentCount > 0
  useEffect(() => {
    if (spotAgentCount > 0) {
      fetchCandidates();
      fetchAssigned();
    }
  }, [spotAgentCount, fetchCandidates, fetchAssigned]);

  // Загрузка записей
  useEffect(() => {
    const fetchRecordings = async () => {
      if (!actId) return;
      
      setLoadingRecordings(true);
      try {
        const response = await api.get(`/agora-recording/recordings/act/${actId}`);
        setRecordings(response.data || []);
      } catch (err) {
        console.error('Error fetching recordings:', err);
        toast.error('Failed to load recordings');
      } finally {
        setLoadingRecordings(false);
      }
    };

    if (actId) {
      fetchRecordings();
    }
  }, [actId]);

  // Handle apply as spot agent
  const handleApplyAsSpotAgent = async () => {
    try {
      await apply();
      toast.success("Spot Agent application submitted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to submit application");
    }
  };

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
      );
    }
  }, []);

  const remoteVideoRef = useRef(null);
  const clientRef = useRef(null);
  const isConnectingRef = useRef(false);
  const streamStartTimeRef = useRef(null);

  // Extract user ID (use user.id first, then from token)
  const baseUserId = useMemo(() => {
    if (user?.id) {
      return user.id;
    } else if (user?.token) {
      const tokenData = parseJWT(user.token);
      return tokenData?.sub || tokenData?.id || 888888;
    }
    return 888888; // Fixed fallback for anonymous users
  }, [user]);

  // Extract stream ID
  const streamId = useMemo(() => {
    return channelName?.replace("act_", "") || streamData?.id || "default";
  }, [channelName, streamData]);

  // Create UNIQUE UID for viewer
  const userIdNum = useMemo(() => {
    const randomComponent = Math.floor(Math.random() * 100);
    const uid = parseInt(streamId) * 1000000 + baseUserId * 100 + randomComponent;

    window.__STREAM_UIDS__ = window.__STREAM_UIDS__ || {};
    window.__STREAM_UIDS__[`${uid}_viewer`] = Date.now();

    return uid;
  }, [streamId, baseUserId]);

  // Use passed channelName or create from streamData
  const actualChannelName = channelName?.startsWith("act_")
    ? channelName
    : `act_${channelName || streamData?.id || "default"}`;

  // Подключение к стриму
  useEffect(() => {
    const getViewerToken = async () => {
      if (isConnectingRef.current) {
        console.log("Already connecting, skipping...");
        return;
      }

      isConnectingRef.current = true;

      try {
        console.log(
          "Getting viewer token for channel:",
          actualChannelName,
          "userId:",
          userIdNum,
        );

        const response = await api.get(
          `/act/token/${actualChannelName}/SUBSCRIBER/uid?uid=${userIdNum}&expiry=3600`,
        );
        setToken(response.data.token);

        console.log("Viewer token received:", response.data.token);

        await connectToStream(response.data.token);
      } catch (err) {
        console.error("Error getting viewer token:", err);
        setError("Failed to get viewer token");
      } finally {
        isConnectingRef.current = false;
      }
    };

    getViewerToken();

    return () => {
      isConnectingRef.current = false;
      if (isConnected && clientRef.current) {
        disconnectFromStream();
      }
    };
  }, [streamData?.id, actualChannelName, userIdNum]);

  // В начале компонента, после получения actualStreamData
  useEffect(() => {
    if (actualStreamData) {
      console.log('✅ Stream is ONLINE!');
      console.log('Channel name:', actualChannelName);
      console.log('Recording status:', actualStreamData.recordingStatus);
      console.log('Started at:', actualStreamData.startedAt);
      console.log('User ID for connection:', userIdNum);
      
      // Проверяем, есть ли координаты
      if (!actualStreamData.startLatitude || !actualStreamData.startLongitude) {
        console.warn('⚠️ Start location is missing! Map may not work correctly.');
      }
    }
  }, [actualStreamData, actualChannelName, userIdNum]);

  // Timer for stream duration
  useEffect(() => {
    if (!isConnected) return;

    if (!streamStartTimeRef.current) {
      streamStartTimeRef.current = Date.now();
    }

    const timer = setInterval(() => {
      if (streamStartTimeRef.current) {
        const elapsed = Math.floor(
          (Date.now() - streamStartTimeRef.current) / 1000,
        );
        setStreamDuration(elapsed);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isConnected]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest(`.${styles.chatInput}`)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Reset timer on disconnect
  useEffect(() => {
    if (!isConnected) {
      streamStartTimeRef.current = null;
      setStreamDuration(0);
    }
  }, [isConnected]);

  // Fetch tasks when modal is opened
  const fetchTasks = async () => {
    if (!actId) return;

    setLoadingTasks(true);
    try {
      const response = await api.get(`/act/${actId}/tasks`);
      setTasks(response.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (isTasksModalOpen) {
      fetchTasks();
    }
  }, [isTasksModalOpen, actId]);

  // Fetch route data from actualStreamData
  useEffect(() => {
    const fetchRouteData = async () => {
      console.log("StreamViewer - Fetching route data:", {
        startLatitude: actualStreamData?.startLatitude,
        startLongitude: actualStreamData?.startLongitude,
        destinationLatitude: actualStreamData?.destinationLatitude,
        destinationLongitude: actualStreamData?.destinationLongitude,
      });

      if (actualStreamData?.startLatitude && actualStreamData?.startLongitude) {
        const start = {
          latitude: actualStreamData.startLatitude,
          longitude: actualStreamData.startLongitude,
        };
        setStartLocation(start);
        console.log("StreamViewer - Start location set:", start);
      }

      if (
        actualStreamData?.routePoints &&
        Array.isArray(actualStreamData.routePoints) &&
        actualStreamData.routePoints.length > 0
      ) {
        const sorted = [...actualStreamData.routePoints].sort(
          (a, b) => (a.order || 0) - (b.order || 0),
        );
        const lastPoint = sorted[sorted.length - 1];
        const destination = {
          latitude: lastPoint.latitude,
          longitude: lastPoint.longitude,
        };
        setDestinationLocation(destination);
        console.log(
          "StreamViewer - Destination location set (last routePoint):",
          destination,
        );

        if (
          actualStreamData?.startLatitude &&
          actualStreamData?.startLongitude
        ) {
          try {
            const waypoints = [];
            waypoints.push(
              `${actualStreamData.startLongitude},${actualStreamData.startLatitude}`,
            );

            sorted.forEach((p) => {
              waypoints.push(`${p.longitude},${p.latitude}`);
            });

            const waypointsString = waypoints.join(";");

            const response = await fetch(
              `https://router.project-osrm.org/route/v1/foot/${waypointsString}?overview=full&geometries=geojson`,
            );
            const data = await response.json();

            if (data.routes && data.routes[0]) {
              const coordinates = data.routes[0].geometry.coordinates.map(
                (coord) => [coord[1], coord[0]],
              );
              setRouteCoordinates(coordinates);
              console.log(
                "StreamViewer - Route coordinates set through all points:",
                coordinates.length,
                "points",
              );
            }
          } catch (error) {
            console.error("Error fetching route through all points:", error);
          }
        }
      } else if (
        actualStreamData?.destinationLatitude &&
        actualStreamData?.destinationLongitude
      ) {
        const destination = {
          latitude: actualStreamData.destinationLatitude,
          longitude: actualStreamData.destinationLongitude,
        };
        setDestinationLocation(destination);
        console.log("StreamViewer - Destination location set:", destination);
        
        if (
          actualStreamData?.startLatitude &&
          actualStreamData?.startLongitude
        ) {
          try {
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/foot/${actualStreamData.startLongitude},${actualStreamData.startLatitude};${actualStreamData.destinationLongitude},${actualStreamData.destinationLatitude}?overview=full&geometries=geojson`,
            );
            const data = await response.json();

            if (data.routes && data.routes[0]) {
              const coordinates = data.routes[0].geometry.coordinates.map(
                (coord) => [coord[1], coord[0]],
              );
              setRouteCoordinates(coordinates);
              console.log(
                "StreamViewer - Route coordinates set:",
                coordinates.length,
                "points",
              );
            }
          } catch (error) {
            console.error("Error fetching route:", error);
          }
        }
      }
    };

    if (actualStreamData) {
      fetchRouteData();
    }
  }, [actualStreamData]);

  const connectToStream = async (streamToken) => {
    if (!streamToken) {
      setError("No token available");
      return;
    }

    try {
      setIsConnected(false);
      setError(null);

      console.log(
        "Connecting to stream for act:",
        streamData?.id,
        "channel:",
        actualChannelName,
        "token:",
        streamToken,
      );

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      console.log("Agora client created, attempting to join...");

      await client.join(
        import.meta.env.VITE_AGORA_APP_ID,
        actualChannelName,
        streamToken,
        userIdNum,
      );

      console.log("Successfully joined channel as viewer");
      setIsConnected(true);

      client.on("user-published", async (user, mediaType) => {
        console.log("User published:", user.uid, mediaType);

        await client.subscribe(user, mediaType);

        if (mediaType === "video" && remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current);
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }

        setRemoteUsers((prev) => [
          ...prev.filter((u) => u.uid !== user.uid),
          user,
        ]);
      });

      client.on("user-unpublished", (user) => {
        console.log("User unpublished:", user.uid);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      console.log("Connected to stream successfully");
    } catch (err) {
      console.error("Error connecting to stream:", err);
      setError("Failed to connect to stream: " + err.message);
      setIsConnected(false);
    }
  };

  const disconnectFromStream = async () => {
    try {
      console.log("Disconnecting from stream:", streamData?.id);

      if (clientRef.current) {
        await clientRef.current.leave();
      }

      const uidKey = `${userIdNum}_viewer`;
      if (window.__STREAM_UIDS__ && window.__STREAM_UIDS__[uidKey]) {
        delete window.__STREAM_UIDS__[uidKey];
      }

      clientRef.current = null;
      setIsConnected(false);
      setRemoteUsers([]);

      console.log("Disconnected from stream successfully");
    } catch (err) {
      console.error("Error disconnecting from stream:", err);
      setError("Failed to disconnect from stream: " + err.message);
    }
  };

  const handleClose = async () => {
    await disconnectFromStream();

    if (onClose) {
      onClose();
    }

    navigate("/acts");
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() && !sending) {
      sendMessage(chatMessage);
      setChatMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    if (!sending) {
      sendMessage(emoji);
      setShowEmojiPicker(false);
    }
  };

  const handleCloseEmojiPicker = () => {
    setShowEmojiPicker(false);
  };

  // Обработчики для записей
  const handlePlayRecording = async (recording) => {
    try {
      const response = await api.get(`/agora-recording/recordings/stream/${recording.key}`);
      setRecordingUrl(response.data.url);
      setSelectedRecording(recording);
      setShowRecordingPlayer(true);
    } catch (err) {
      console.error('Error getting stream URL:', err);
      toast.error('Failed to load recording');
    }
  };

  const handleDownloadRecording = async (recording) => {
    try {
      const response = await api.get(`/agora-recording/recordings/download-url/${recording.key}`);
      window.open(response.data.url, '_blank');
    } catch (err) {
      console.error('Error getting download URL:', err);
      toast.error('Failed to download recording');
    }
  };

  const handleDeleteRecording = async (recording) => {
    if (!window.confirm('Are you sure you want to delete this recording?')) return;
    
    try {
      await api.delete(`/agora-recording/recordings/${recording.key}`);
      setRecordings(prev => prev.filter(r => r.key !== recording.key));
      toast.success('Recording deleted');
    } catch (err) {
      console.error('Error deleting recording:', err);
      toast.error('Failed to delete recording');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
  <div className={styles.container}>
    {actualStreamData?.status === 'ONLINE' ? (
      <>
        <div className={styles.header}>
          <div className={styles.header_cont}>
            <img src={back} alt="" onClick={() => navigate(`/acts/${id}`)}/>
            {actualStreamData?.status === 'ONLINE' && 
              <div className={styles.online}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org">
                  <circle cx="10" cy="10" r="5" fill="white" />
                </svg>
                <p className={styles.live}>Live</p>
              </div>
            }
          </div>

          {(streamData?.navigator ||
            streamData?.hero ||
            streamData?.initiator) && (
            <div className={styles.rolesNavigation}>
              {streamData?.navigator && (
                <span>Navigator: {streamData.navigator}</span>
              )}
              {streamData?.navigator && streamData?.hero && (
                <span className={styles.roleSeparator}>;</span>
              )}
              {streamData?.hero && <span>Hero: {streamData.hero}</span>}
              {streamData?.hero && streamData?.initiator && (
                <span className={styles.roleSeparator}>;</span>
              )}
              {streamData?.initiator && (
                <span>Initiator: {streamData.initiator}</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.videoContainer}>
          <div ref={remoteVideoRef} className={styles.videoElement} />
        </div>

        <div className={styles.chatContainer}>
          <div className={styles.chatActions}>
            <button
              className={styles.actionButton}
              onClick={() => setShowMap(true)}
            >
              <img src={geo} alt="Location" />
            </button>
            <button
              className={styles.actionButton}
              onClick={() => setIsTasksModalOpen(true)}
            >
              <img src={tasks_image} alt="File" />
            </button>
            <button className={styles.actionButton}>
              <img src={messages} alt="Chat" />
            </button>
            {!isInitiator &&
              spotAgentCount > 0 &&
              assignedAgents.length < spotAgentCount && (
                <button
                  className={`${styles.actionButton} ${hasApplied ? styles.spotAgentApplied : styles.spotAgentButton}`}
                  onClick={handleApplyAsSpotAgent}
                  disabled={spotAgentLoading || hasApplied}
                  title={
                    hasApplied ? "Application submitted" : "Become a Spot Agent"
                  }
                >
                  {hasApplied ? (
                    <span className={styles.spotAgentIcon}>✓</span>
                  ) : (
                    <span className={styles.spotAgentIcon}>🙋</span>
                  )}
                </button>
              )}
          </div>
        </div>

        {/* Блок записей */}
        {!loadingRecordings && recordings.length > 0 && (
          <div className={styles.recordingsContainer}>
            <div 
              className={styles.recordingsHeader}
              onClick={() => setRecordingsExpanded(!recordingsExpanded)}
            >
              <span>📹 Recordings ({recordings.length})</span>
              <span className={styles.expandIcon}>{recordingsExpanded ? '▼' : '▶'}</span>
            </div>

            {recordingsExpanded && (
              <div className={styles.recordingsList}>
                {recordings.map((recording) => (
                  <div key={recording.key} className={styles.recordingItem}>
                    <div className={styles.recordingInfo}>
                      <span className={styles.recordingDate}>
                        {formatDate(recording.createdAt)}
                      </span>
                      <span className={styles.recordingSize}>
                        {recording.size ? formatSize(recording.size) : 'Unknown size'}
                      </span>
                      <span className={styles.recordingDuration}>
                        {recording.duration || 'Unknown duration'}
                      </span>
                    </div>
                    
                    <div className={styles.recordingActions}>
                      <button
                        className={styles.recordingButton}
                        onClick={() => handlePlayRecording(recording)}
                        title="Play"
                      >
                        ▶️
                      </button>
                      <button
                        className={styles.recordingButton}
                        onClick={() => handleDownloadRecording(recording)}
                        title="Download"
                      >
                        ⬇️
                      </button>
                      <button
                        className={`${styles.recordingButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteRecording(recording)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showMap && (
          <div className={styles.mapOverlay}>
            {console.log("StreamViewer - Rendering Map with state:", {
              startLocation,
              destinationLocation,
              routeCoordinatesLength: routeCoordinates?.length,
              routeCoordinates: routeCoordinates,
            })}
            <button
              className={styles.closeMapButton}
              onClick={() => setShowMap(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>

            <MapContainer
              center={
                startLocation
                  ? [startLocation.latitude, startLocation.longitude]
                  : userPosition
              }
              zoom={15}
              style={{
                width: "100%",
                height: "100%",
                filter: "grayscale(100%) invert(1)",
              }}
              zoomControl={true}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {startLocation && (
                <Circle
                  center={[startLocation.latitude, startLocation.longitude]}
                  radius={50}
                  pathOptions={{
                    color: "black",
                    fillColor: "black",
                    fillOpacity: 0.8,
                    weight: 2,
                  }}
                />
              )}
              {routeCoordinates && routeCoordinates.length > 0 && (
                <>
                  <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                      color: "black",
                      weight: 4,
                      opacity: 0.8,
                    }}
                  />
                  {console.log(
                    "StreamViewer - Rendering Polyline with",
                    routeCoordinates.length,
                    "points",
                  )}
                </>
              )}
              {actualStreamData?.routePoints &&
                actualStreamData.routePoints.length > 0 &&
                actualStreamData.routePoints
                  .slice()
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((pt) => {
                    const isStartPoint =
                      startLocation &&
                      Math.abs(pt.latitude - startLocation.latitude) < 0.0001 &&
                      Math.abs(pt.longitude - startLocation.longitude) < 0.0001;

                    if (isStartPoint) return null;

                    const icon = L.divIcon({
                      className: "custom-marker-icon",
                      html: `<div style="
                        background-color: black;
                        color: white;
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 14px;
                        border: 2px solid white;
                      ">${(pt.order != null ? pt.order : 0) + 1}</div>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                    });

                    return (
                      <Marker
                        key={`point-${pt.id}`}
                        position={[pt.latitude, pt.longitude]}
                        icon={icon}
                      />
                    );
                  })}
            </MapContainer>
            <div className={styles.chatContainer}>
              <div className={styles.chatActions}>
                <button
                  className={styles.actionButton}
                  style={{backgroundColor:'#0093FF'}}
                  onClick={() => setShowMap(false)}
                >
                  <img src={geo} alt="Location" />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => {
                    setShowMap(false);
                    setIsTasksModalOpen(true);
                  }}
                >
                  <img src={tasks_image} alt="File" />
                </button>
                <button className={styles.actionButton}>
                  <img src={messages} alt="Chat" />
                </button>
                {!isInitiator &&
                  spotAgentCount > 0 &&
                  assignedAgents.length < spotAgentCount && (
                    <button
                      className={`${styles.actionButton} ${hasApplied ? styles.spotAgentApplied : styles.spotAgentButton}`}
                      onClick={handleApplyAsSpotAgent}
                      disabled={spotAgentLoading || hasApplied}
                      title={
                        hasApplied ? "Application submitted" : "Become a Spot Agent"
                      }
                    >
                      {hasApplied ? (
                        <span className={styles.spotAgentIcon}>✓</span>
                      ) : (
                        <span className={styles.spotAgentIcon}>🙋</span>
                      )}
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}

        {isTasksModalOpen && (
          <div
            className={styles.modalOverlay}
            style={{padding:'15px'}}
            onClick={() => setIsTasksModalOpen(false)}
          >
            <div className={styles.header} style={{backdropFilter: 'none', background:'none'}}>
              <div className={styles.header_cont}>
                <div className={styles.backButton} onClick={() => setIsTasksModalOpen(false)}>
                  <img src={back} alt="Back" className={styles.backIcon} />
                </div>
                <h2 className="name" style={{color:'white'}}>Act's tasks</h2>
                <div></div>
              </div>
            </div>
            <div className={styles.none}>
              {loadingTasks ? (
                <div className={styles.loadingTasks}>Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className={styles.noTasks}>No tasks available</div>
              ) : (
                <div className={styles.cardcont} style={{marginTop:'100px'}}>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`${styles.taskItem} ${task.isCompleted ? styles.taskCompleted : ""} ${styles.card}`}
                    >
                      <div className={styles.taskCheckbox}>
                        <input
                          type="checkbox"
                          id={`task-${task.id}`}
                          checked={task.isCompleted}
                          disabled
                          readOnly
                        />
                        <label htmlFor={`task-${task.id}`}></label>
                      </div>
                      <div className={styles.taskContent}>
                        <div className={styles.taskTitle}>{task.title}</div>
                        {task.isCompleted && task.completedAt && (
                          <div className={styles.taskCompletedTime}>
                            Completed:{" "}
                            {new Date(task.completedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.chatContainer}>
              <div className={styles.chatActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => setShowMap(true)}
                >
                  <img src={geo} alt="Location" />
                </button>
                <button
                  className={styles.actionButton}
                  style={{backgroundColor:'#0093FF'}}
                  onClick={() => setIsTasksModalOpen(true)}
                >
                  <img src={tasks_image} alt="File" />
                </button>
                <button className={styles.actionButton}>
                  <img src={messages} alt="Chat" />
                </button>
                {!isInitiator &&
                  spotAgentCount > 0 &&
                  assignedAgents.length < spotAgentCount && (
                    <button
                      className={`${styles.actionButton} ${hasApplied ? styles.spotAgentApplied : styles.spotAgentButton}`}
                      onClick={handleApplyAsSpotAgent}
                      disabled={spotAgentLoading || hasApplied}
                      title={
                        hasApplied ? "Application submitted" : "Become a Spot Agent"
                      }
                    >
                      {hasApplied ? (
                        <span className={styles.spotAgentIcon}>✓</span>
                      ) : (
                        <span className={styles.spotAgentIcon}>🙋</span>
                      )}
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}

        {showRecordingPlayer && selectedRecording && (
          <div className={styles.modalOverlay}>
            <div className={styles.recordingPlayer}>
              <div className={styles.recordingPlayerHeader}>
                <h3>Recording Playback</h3>
                <button 
                  onClick={() => setShowRecordingPlayer(false)} 
                  className={styles.closePlayerButton}
                >
                  ×
                </button>
              </div>
              
              <video
                src={recordingUrl}
                controls
                autoPlay
                className={styles.recordingVideo}
              />
            </div>
          </div>
        )}
      </>
    ) : (
      <>
       <div className={styles.header}>
          <div className={styles.header_cont}>
            <img src={back} alt="" onClick={() => navigate(`/acts/${id}`)}/>
          </div>
          
        </div>
        <h2 style={{color:'white', margin:'auto',}}>Translation will start soon</h2>
      </>

    )}
  </div>
);
};
export default StreamViewer;