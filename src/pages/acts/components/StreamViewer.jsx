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
import { io } from 'socket.io-client'; // ВАЖНО!
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

  // WebSocket состояние
  const [wsConnected, setWsConnected] = useState(false);
  const socketRef = useRef(null);

  console.log("StreamViewer - Initial streamData:", streamData);

  // Use chat hook
  const actId = streamData?.id || channelName?.replace("act_", "");
  const { user } = useAuthStore();
  // const { messages: chatMessages, sendMessage, sending } = useChat(actId);

  // Spot Agent state
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

  const remoteVideoRef = useRef(null);
  const clientRef = useRef(null);
  const isConnectingRef = useRef(false);
  const streamStartTimeRef = useRef(null);

  // Extract user ID
  const baseUserId = useMemo(() => {
    if (user?.id) {
      return user.id;
    } else if (user?.token) {
      const tokenData = useAuthStore.getState().getToken();
      return tokenData?.sub || tokenData?.id || 888888;
    }
    return 888888;
  }, [user]);

  // Extract stream ID
  const streamId = useMemo(() => {
    return channelName?.replace("act_", "") || streamData?.id || "default";
  }, [channelName, streamData]);

  // Create UNIQUE UID for viewer
  const userIdNum = useMemo(() => {
    const randomComponent = Math.floor(Math.random() * 1000);
    const uid = parseInt(streamId) * 1000000 + (baseUserId % 100000) * 100 + randomComponent;
    return uid;
  }, [streamId, baseUserId]);

  // Use passed channelName or create from streamData
  const actualChannelName = channelName?.startsWith("act_")
    ? channelName
    : `act_${channelName || streamData?.id || "default"}`;

  // ВАЖНО: WebSocket подключение к MainGateway
  useEffect(() => {
    if (!actId || !user?.id) {
      console.log("Waiting for actId and userId...");
      return;
    }

    console.log("🔌 Connecting to MainGateway WebSocket...");
    
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      path: '/socket.io',
      query: {
        actId: actId,
        userId: user.id,
        token: useAuthStore.getState().getToken()
      }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to MainGateway');
      setWsConnected(true);
      
      // Присоединяемся к комнате акта
      socket.emit('joinAct', { actId: parseInt(actId) });
    });

    socket.on('streamStarted', (data) => {
      console.log('📡 Stream started event:', data);
      setActualStreamData(prev => ({ 
        ...prev, 
        status: 'ONLINE',
        ...data 
      }));
    });

    socket.on('streamStopped', (data) => {
      console.log('📡 Stream stopped event:', data);
      setActualStreamData(prev => ({ 
        ...prev, 
        status: 'OFFLINE' 
      }));
    });

    socket.on('publisherJoined', (data) => {
      console.log('📡 Publisher joined:', data);
      // Здесь Agora подключится автоматически через другой useEffect
    });

    socket.on('streamUpdate', (data) => {
      console.log('📡 Stream update:', data);
      setActualStreamData(prev => ({ ...prev, ...data }));
    });

    socket.on('actUpdate', (data) => {
      console.log('📡 Act update:', data);
      if (data.status) {
        setActualStreamData(prev => ({ ...prev, status: data.status }));
      }
    });

    socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from MainGateway:', reason);
      setWsConnected(false);
    });

    return () => {
      console.log('🔌 Cleaning up WebSocket...');
      if (socketRef.current) {
        socketRef.current.emit('leaveAct', { actId: parseInt(actId) });
        socketRef.current.disconnect();
      }
    };
  }, [actId, user?.id, user?.token]);

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
        // Не показываем toast, так как это не критично
        setRecordings([]);
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

  // Initialize Leaflet icons
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

  // Get user location
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

  // Connect to Agora when stream is ONLINE
  useEffect(() => {
    const connectToAgora = async () => {
      if (isConnectingRef.current) {
        console.log("Already connecting, skipping...");
        return;
      }

      // Проверяем статус стрима
      if (!actualStreamData || actualStreamData.status !== 'ONLINE') {
        console.log("Stream is not ONLINE, skipping connection");
        return;
      }

      isConnectingRef.current = true;
      setError(null);

      try {
        console.log("🔴 Getting Agora token for channel:", actualChannelName);
        console.log("🔴 User ID:", userIdNum);

        const response = await api.get(
          `/act/token/${actualChannelName}/SUBSCRIBER/uid?uid=${userIdNum}&expiry=3600`
        );
        
        const token = response.data.token;
        console.log("🔴 Token received:", token ? "✅" : "❌");

        if (!token) {
          throw new Error("No token received");
        }

        console.log("🔴 Creating Agora client...");
        const client = AgoraRTC.createClient({ 
          mode: "live", 
          codec: "vp8" 
        });
        
        await client.setClientRole("audience");
        clientRef.current = client;

        client.on("user-published", async (user, mediaType) => {
          console.log("🔴 User published:", user.uid, mediaType);
          
          try {
            await client.subscribe(user, mediaType);
            console.log("🔴 Subscribed to", mediaType);

            if (mediaType === "video") {
              if (remoteVideoRef.current) {
                user.videoTrack?.play(remoteVideoRef.current);
                console.log("🔴 Playing video");
              }
            }
            
            if (mediaType === "audio") {
              user.audioTrack?.play();
              console.log("🔴 Playing audio");
            }

            setRemoteUsers((prev) => [
              ...prev.filter((u) => u.uid !== user.uid),
              user,
            ]);
          } catch (err) {
            console.error("🔴 Error subscribing:", err);
          }
        });

        client.on("user-unpublished", (user) => {
          console.log("🔴 User unpublished:", user.uid);
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        console.log("🔴 Joining channel with App ID:", import.meta.env.VITE_AGORA_APP_ID);
        
        await client.join(
          import.meta.env.VITE_AGORA_APP_ID,
          actualChannelName,
          token,
          userIdNum
        );

        console.log("🔴 Successfully joined channel!");
        setIsConnected(true);
        streamStartTimeRef.current = Date.now();

      } catch (err) {
        console.error("🔴 Connection error:", err);
        setError(err.response?.data?.message || err.message);
        setIsConnected(false);
      } finally {
        isConnectingRef.current = false;
      }
    };

    connectToAgora();

    return () => {
      console.log("🔴 Cleaning up connection...");
      if (clientRef.current && isConnected) {
        clientRef.current.leave();
        clientRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [actualStreamData?.status, actualChannelName, userIdNum]);

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
      if (actualStreamData?.startLatitude && actualStreamData?.startLongitude) {
        setStartLocation({
          latitude: actualStreamData.startLatitude,
          longitude: actualStreamData.startLongitude,
        });
      }

      if (actualStreamData?.destinationLatitude && actualStreamData?.destinationLongitude) {
        setDestinationLocation({
          latitude: actualStreamData.destinationLatitude,
          longitude: actualStreamData.destinationLongitude,
        });
      }

      // ... rest of route fetching logic
    };

    if (actualStreamData) {
      fetchRouteData();
    }
  }, [actualStreamData]);

  const disconnectFromStream = async () => {
    try {
      console.log("Disconnecting from stream:", streamData?.id);

      if (clientRef.current) {
        await clientRef.current.leave();
      }

      clientRef.current = null;
      setIsConnected(false);
      setRemoteUsers([]);
      streamStartTimeRef.current = null;

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
    // if (chatMessage.trim() && !sending) {
    //   sendMessage(chatMessage);
    //   setChatMessage("");
    // }
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
    // if (!sending) {
    //   sendMessage(emoji);
    //   setShowEmojiPicker(false);
    // }
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

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      {/* Индикатор WebSocket */}
      {wsConnected && (
        <div className={styles.wsIndicator}>
          <span className={styles.wsDot}>●</span> Live
        </div>
      )}

      {actualStreamData?.status === 'ONLINE' ? (
        <>
          <div className={styles.header}>
            <div className={styles.header_cont}>
              <img src={back} alt="Back" onClick={handleClose} />
              <div className={styles.online}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="5" fill="white" />
                </svg>
                <p className={styles.live}>LIVE</p>
                {isConnected && (
                  <span className={styles.duration}>{formatDuration(streamDuration)}</span>
                )}
              </div>
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
            <div 
              ref={remoteVideoRef} 
              className={styles.videoElement}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#1a1a1a',
              }}
            />
            
            {!isConnected && !error && (
              <div className={styles.connectingOverlay}>
                <p>Connecting to stream...</p>
              </div>
            )}
            
            {error && (
              <div className={styles.errorOverlay}>
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            )}
            
            {isConnected && remoteUsers.length === 0 && (
              <div className={styles.waitingOverlay}>
                <p>Waiting for streamer...</p>
              </div>
            )}
            
            {isConnected && remoteUsers.length > 0 && (
              <div className={styles.connectedOverlay}>
                <p>Connected - {remoteUsers.length} publisher(s)</p>
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
                onClick={() => setIsTasksModalOpen(true)}
              >
                <img src={tasks_image} alt="Tasks" />
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
                  <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                      color: "black",
                      weight: 4,
                      opacity: 0.8,
                    }}
                  />
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
              <img src={back} alt="Back" onClick={handleClose} />
            </div>
          </div>
          <div className={styles.waitingContainer}>
            <h2 style={{color:'white', margin:'auto', textAlign:'center'}}>
              {actualStreamData?.liveIn ? 
                `Stream starts in ${actualStreamData.liveIn}` : 
                "Stream will start soon"}
            </h2>
          </div>
        </>
      )}
<div className={styles.statusIndicator}>
  <span>WebSocket: {wsConnected ? '✅' : '❌'}</span>
  <span style={{color:'white',}}>Stream: {actualStreamData?.status || 'UNKNOWN'}</span>
  <span style={{color:'white',}}>Publishers: {remoteUsers.length}</span>
</div>
    </div>
  );
};

export default StreamViewer;