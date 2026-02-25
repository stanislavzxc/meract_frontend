import { useCallback, useEffect, useRef, useState } from "react";
import arrowLeft from '../../images/arrow-left.png';
import { MdDelete } from "react-icons/md";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../shared/api/api";
import { useActsStore } from "../../shared/stores/actsStore";
import { useAuthStore } from "../../shared/stores/authStore";
import { useSequelStore } from "../../shared/stores/sequelStore";
import { ActFormat, ActType, SelectionMethods } from "../../shared/types/act";
import styles from "./CreateAct.module.css";
import StreamHost from "./components/StreamHost";
import { useCreateAct } from "./hooks/useCreateAct";
import { useCreateSequel } from "./hooks/useCreateSequel";
import iconguild from '../../images/iconguild.png'; 
import team from '../../images/team.png';
import add from '../../images/add.png';
import teamicon from '../../images/icon1.png';
import points from '../../images/points.png';
export default function CreateAct() {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [actType, setActType] = useState(ActType.SINGLE);
  const [formatType, setFormatType] = useState(ActFormat.SINGLE);
  const [settingsType, setSettingsType] = useState("option1");
  const [heroMethod, setHeroMethod] = useState(SelectionMethods.VOTING);
  const [navigatorMethod, setNavigatorMethod] = useState(
    SelectionMethods.VOTING,
  );
  const [spotAgentMethod, setSpotAgentMethod] = useState(
    SelectionMethods.VOTING,
  );
  const [spotAgentCount, setSpotAgentCount] = useState(0);
  const [biddingTime, setBiddingTime] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sequelCoverPreview, setSequelCoverPreview] = useState(null);

  const [sequelTitle, setSequelTitle] = useState("");
  const [sequelEpisodes, setSequelEpisodes] = useState("");
  const [sequelPhoto, setSequelPhoto] = useState(null);

  const [createdAct, setCreatedAct] = useState(null);
  const [showStream, setShowStream] = useState(false);

  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const teams = [
    {id:1,img: teamicon, name:'team1', points:'1000',}, 
  
  ];

  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    location,
    routeDestination,
    routeCoordinates,
    routePoints,
    setRouteDestination,
    setRouteCoordinates,
    addRoutePoint,
    removeRoutePoint,
    clearRoute,
    clearRoutePoints,
  } = useAuthStore();

  // Using store for reliable tasks storage
  const {
    createActFormState,
    setCreateActTasks,
    addCreateActTask,
    updateCreateActTask,
    deleteCreateActTask,
    clearCreateActForm,
  } = useActsStore();

  const avatarInputRef = useRef(null);
      const evidenceInputRef = useRef(null);
  
      const isAdmin = true;
  
      // Состояния для основной информации
      const [name, setName] = useState('');
      const [description, setDescription] = useState('');
      const [avatar, setAvatar] = useState(iconguild);
  
      // Состояние для списка динамических карточек (доказательств)
      const [evidences, setEvidences] = useState([]);
  
      // Обработка загрузки аватара (одиночное фото)
      const handleAvatarChange = (e) => {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setAvatar(reader.result);
              reader.readAsDataURL(file);
          }
      };
  
      const handleAddEvidence = (e) => {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  const newEvidence = {
                      id: Date.now(), 
                      src: reader.result,
                      type: file.type.startsWith('video') ? 'video' : 'image'
                  };
                  setEvidences(prev => [...prev, newEvidence]);
              };
              reader.readAsDataURL(file);
          }
          e.target.value = '';
      };
  
      const removeEvidence = (id) => {
          setEvidences(prev => prev.filter(item => item.id !== id));
      };
  
      const Save = () => {
          console.log('Saving data:', { name, description, avatar, evidences });
          navigate(`/acts`);
      };
  const tasks = createActFormState.tasks;
  const {
    selectedSequelId,
    selectedSequel,
    selectedIntroId,
    selectedIntro,
    selectedOutroId,
    selectedOutro,
    selectedMusicIds,
    selectedMusic,
    clearSelectedSequel,
    clearSelectedIntro,
    clearSelectedOutro,
    clearSelectedMusic,
  } = useSequelStore();
  const { createAct, loading, error, success, resetState } = useCreateAct();
  const {
    createSequel,
    loading: sequelLoading,
    error: sequelError,
    success: sequelSuccess,
    resetState: resetSequelState,
  } = useCreateSequel();

  // Debugging selectedSequelId changes from store
  useEffect(() => {
    console.log("selectedSequelId from store changed:", selectedSequelId);
    console.log("selectedSequel from store:", selectedSequel);
    console.log("selectedIntroId from store:", selectedIntroId);
    console.log("selectedIntro from store:", selectedIntro);
    console.log("selectedOutroId from store:", selectedOutroId);
    console.log("selectedOutro from store:", selectedOutro);
    console.log("selectedMusicIds from store:", selectedMusicIds);
    console.log("selectedMusic from store:", selectedMusic);
  }, [
    selectedSequelId,
    selectedSequel,
    selectedIntroId,
    selectedIntro,
    selectedOutroId,
    selectedOutro,
    selectedMusicIds,
    selectedMusic,
  ]);

  // Utility function for converting base64 to File
  const base64ToFile = useCallback((base64, fileName = "image.png") => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }, []);

  const openTasksModal = async () => {
    console.log("openTasksModal called, createdAct:", createdAct);
    setIsTasksModalOpen(true);

    if (createdAct?.id) {
      await fetchTasks();
    }
  };

  const closeTasksModal = () => {
    setIsTasksModalOpen(false);
    setNewTaskTitle("");
  };

  const fetchTasks = async () => {
    if (!createdAct?.id) return;

    try {
      setLoadingTasks(true);
      const response = await api.get(`/act/${createdAct.id}/tasks`);
      setCreateActTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  const createTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    if (!createdAct?.id) {
      const localTask = {
        id: `temp-${Date.now()}`,
        title: newTaskTitle,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        local: true,
      };
      addCreateActTask(localTask);
      setNewTaskTitle("");
      toast.success("Task added (will be saved when act is created)");
      return;
    }

    try {
      const response = await api.post(`/act/${createdAct.id}/tasks`, {
        title: newTaskTitle,
      });
      addCreateActTask(response.data);
      setNewTaskTitle("");
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task?.local) {
      updateCreateActTask(taskId, {
        isCompleted: !currentStatus,
        completedAt: !currentStatus ? new Date().toISOString() : null,
      });
      toast.success(!currentStatus ? "Task completed!" : "Task reopened");
      return;
    }

    if (!createdAct?.id) return;

    try {
      const response = await api.patch(
        `/act/${createdAct.id}/tasks/${taskId}`,
        {
          isCompleted: !currentStatus,
        },
      );
      updateCreateActTask(taskId, response.data);
      toast.success(
        response.data.isCompleted ? "Task completed!" : "Task reopened",
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task?.local) {
      deleteCreateActTask(taskId);
      toast.success("Task deleted");
      return;
    }

    if (!createdAct?.id) return;

    try {
      await api.delete(`/act/${createdAct.id}/tasks/${taskId}`);
      deleteCreateActTask(taskId);
      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  // Saving local tasks to server after act creation
  const saveLocalTasksToServer = async (actId) => {
    const localTasks = tasks.filter((task) => task.local);

    if (localTasks.length === 0) {
      console.log("No local tasks to save");
      return;
    }

    console.log("Saving local tasks to server:", localTasks);
    console.log("Act ID:", actId);

    try {
      const savedTasks = await Promise.all(
        localTasks.map(async (task) => {
          try {
            console.log("Sending task to server:", task.title);
            const response = await api.post(`/act/${actId}/tasks`, {
              title: task.title,
            });
            console.log("Task saved successfully:", response.data);
            return { oldId: task.id, newTask: response.data };
          } catch (error) {
            console.error("Error saving task:", task.title, error);
            console.error(
              "Error details:",
              error.response?.data || error.message,
            );
            return null;
          }
        }),
      );

      const savedTasksFiltered = savedTasks.filter((t) => t !== null);

      if (savedTasksFiltered.length > 0) {
        savedTasksFiltered.forEach(({ oldId }) => {
          deleteCreateActTask(oldId);
        });

        savedTasksFiltered.forEach(({ newTask }) => {
          addCreateActTask(newTask);
        });

        toast.success(
          `${savedTasksFiltered.length} task(s) saved successfully`,
        );
      }
    } catch (error) {
      console.error("Error saving local tasks:", error);
      toast.error("Some tasks could not be saved");
    }
  };

  // Functions for saving and restoring form state
  const saveFormState = () => {
    const formState = {
      title,
      actType,
      formatType,
      settingsType,
      heroMethod,
      navigatorMethod,
      spotAgentMethod,
      spotAgentCount,
      biddingTime,
      imagePreview,
      timestamp: Date.now(),
    };
    localStorage.setItem("createActFormState", JSON.stringify(formState));
  };

  const restoreFormState = useCallback(() => {
    try {
      const savedState = localStorage.getItem("createActFormState");
      console.log("Restoring form state, savedState:", savedState);
      if (savedState) {
        const formState = JSON.parse(savedState);
        console.log("Parsed form state:", formState);
        if (Date.now() - formState.timestamp < 30 * 60 * 1000) {
          console.log(
            "Restoring form state from localStorage (excluding selectedSequelId, managed by store)",
          );
          setTitle(formState.title || "");
          setActType(formState.actType || ActType.SINGLE);
          setFormatType(formState.formatType || ActFormat.SINGLE);
          setSettingsType(formState.settingsType || "option1");
          setHeroMethod(formState.heroMethod || SelectionMethods.VOTING);
          setNavigatorMethod(
            formState.navigatorMethod || SelectionMethods.VOTING,
          );
          setSpotAgentMethod(
            formState.spotAgentMethod || SelectionMethods.VOTING,
          );
          setSpotAgentCount(formState.spotAgentCount || 0);
          setBiddingTime(formState.biddingTime || 5);
          setImagePreview(formState.imagePreview || null);

          if (formState.imagePreview) {
            try {
              const restoredFile = base64ToFile(
                formState.imagePreview,
                "restored-image.png",
              );
              setSelectedFile(restoredFile);
              console.log("Restored file from base64:", restoredFile);
            } catch (error) {
              console.error("Error restoring file from base64:", error);
            }
          }
        } else {
          console.log("Saved form state is too old, not restoring");
        }
      } else {
        console.log("No saved form state found");
      }
    } catch (error) {
      console.error("Error restoring form state:", error);
    }
  }, [base64ToFile]);

  useEffect(() => {
    restoreFormState();
  }, [restoreFormState]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFormState();
    }, 500);

    return () => clearTimeout(timeoutId);
  });

  const handleTimeChange = (direction) => {
    if (isAnimating) return;

    let newTime;
    if (direction === "increase") {
      newTime = Math.min(20, biddingTime + 5);
    } else {
      newTime = Math.max(5, biddingTime - 5);
    }

    if (newTime === biddingTime) return;

    setIsAnimating(true);
    setBiddingTime(newTime);

    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleCreateAct = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your act");
      return;
    }

    if (!isAuthenticated) {
      alert("You must be logged in to create an act");
      navigate("/login");
      return;
    }

    console.log("Selected sequel ID before creating act:", selectedSequelId);
    console.log("Selected intro ID before creating act:", selectedIntroId);
    console.log("Selected outro ID before creating act:", selectedOutroId);
    console.log("Selected music IDs before creating act:", selectedMusicIds);
    console.log("Location from store:", location);
    console.log("Route destination from store:", routeDestination);
    console.log("Route coordinates from store:", routeCoordinates);
    console.log(
      "Will add destination coordinates:",
      routeDestination ? true : false,
    );

    // Form route points array: starting point (order: 0) + selected points
    const formattedRoutePoints = [];

    // Add starting point with order: 0 if geolocation is available
    if (location) {
      formattedRoutePoints.push({
        latitude: location.latitude,
        longitude: location.longitude,
        order: 0,
      });
    }

    // Add remaining route points with order offset +1
    if (routePoints && routePoints.length > 0) {
      routePoints.forEach((point) => {
        formattedRoutePoints.push({
          latitude: point.latitude,
          longitude: point.longitude,
          order: point.order + 1,
        });
      });
    }

    const actData = {
      title: title.trim(),
      type: actType,
      format: formatType,
      heroMethods: heroMethod,
      navigatorMethods: navigatorMethod,
      spotAgentMethods: spotAgentCount > 0 ? spotAgentMethod : null,
      spotAgentCount: spotAgentCount,
      biddingTime: new Date(Date.now() + biddingTime * 60 * 1000).toISOString(),
      photo: selectedFile,
      musicIds: selectedMusicIds.length > 0 ? selectedMusicIds : [],
      ...(selectedSequelId !== null &&
        selectedSequelId !== undefined && { sequelId: selectedSequelId }),
      ...(selectedIntroId !== null &&
        selectedIntroId !== undefined && { introId: selectedIntroId }),
      ...(selectedOutroId !== null &&
        selectedOutroId !== undefined && { outroId: selectedOutroId }),
      ...(location && {
        startLatitude: location.latitude,
        startLongitude: location.longitude,
      }),
      ...(routeDestination && {
        destinationLatitude: routeDestination.latitude,
        destinationLongitude: routeDestination.longitude,
      }),
      ...(formattedRoutePoints.length > 0 && {
        routePoints: formattedRoutePoints,
      }),
    };

    console.log("Creating act with data:", actData);
    console.log("Act data includes coordinates:", {
      hasStartCoordinates: !!(location?.latitude && location?.longitude),
      hasDestinationCoordinates: !!(
        routeDestination?.latitude && routeDestination?.longitude
      ),
    });

    const result = await createAct(actData);

    if (result) {
      console.log("Act created successfully:", result);
      console.log("result.actId:", result.actId);
      console.log("Spot agent data sent:", {
        spotAgentCount: actData.spotAgentCount,
        spotAgentMethods: actData.spotAgentMethods,
      });

      localStorage.removeItem("createActFormState");

      clearSelectedSequel();
      clearSelectedIntro();
      clearSelectedOutro();
      clearSelectedMusic();

      console.log("Tasks before saving to server:", tasks);

      const newActId = result.actId || result.id;
      console.log("Setting createdAct with id:", newActId);

      setCreatedAct({
        id: newActId,
        title: title.trim(),
      });

      await saveLocalTasksToServer(newActId);

      setShowStream(true);
    }
  };

  const handleStopStream = () => {
    setShowStream(false);
    setCreatedAct(null);
    clearRoute();
    clearCreateActForm();
    navigate("/acts");
  };

  if (showStream && createdAct) {
    return (
      <StreamHost
        actId={createdAct.id}
        actTitle={createdAct.title}
        onStopStream={handleStopStream}
        startLocation={location}
        destinationLocation={routeDestination}
        routeCoordinates={routeCoordinates}
      />
    );
  }

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleActType = (type) => {
    setActType(type);
  };

  const handleFormatType = (type) => {
    setFormatType(type);
  };

  const handleSettingsType = (type) => {
    setSettingsType(type);
  };

  const handleHeroMethod = (method) => {
    setHeroMethod(method);
  };

  const handleNavigatorMethod = (method) => {
    setNavigatorMethod(method);
  };

  const handleGoBack = () => {
    navigate("/acts");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSequelTitle("");
    setSequelEpisodes("");
    setSequelPhoto(null);
    setSequelCoverPreview(null);
    resetSequelState();
  };

  const handleSequelCoverChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSequelPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSequelCoverPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSequelPhoto(null);
      setSequelCoverPreview(null);
    }
  };

  const handleCreateSequel = async (e) => {
    e.preventDefault();

    if (!sequelTitle.trim()) {
      alert("Please enter a sequel title");
      return;
    }

    if (!sequelEpisodes.trim() || isNaN(parseInt(sequelEpisodes))) {
      alert("Please enter a valid episode number");
      return;
    }

    if (!sequelPhoto) {
      alert("Please upload a sequel cover");
      return;
    }

    const sequelData = {
      title: sequelTitle.trim(),
      episodes: parseInt(sequelEpisodes),
      photo: sequelPhoto,
    };

    const result = await createSequel(sequelData);

    if (result) {
      toast.success("Sequel created successfully!");
      closeModal();
      setSequelTitle("");
      setSequelEpisodes("");
      setSequelPhoto(null);
      setSequelCoverPreview(null);
      resetSequelState();
    }
  };

  const ModalStripe = () => {
    return (
      <svg
        width="297"
        height="2"
        viewBox="0 0 297 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 1H297" stroke="#3ABAFF" stroke-opacity="0.5" />
      </svg>
    );
  };

  return (
    <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.backButton} onClick={() => navigate(`/acts`)}>
                        <img src={arrowLeft} alt="Back" className={styles.backIcon} />
                    </div>
                    <h1>New act</h1>
                    <div></div>
                </div>
    
                {/* Admin Section: Basic Info & Main Photo */}
                    <>
                        <div className={styles.paragraph}>
                            <h3 className={styles.elsetitle}>Basic information</h3>
                            <input 
                                type="text" 
                                className={styles.inputField} 
                                placeholder="Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                            />
                            <textarea 
                                className={styles.textareaField} 
                                placeholder="Description" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </>
    
                <h4 className={styles.elsetitle}>Act Galery</h4>
                {evidences.map((item) => (
                  
                    <div key={item.id} className={styles.paragraph}>
    
                        <div className={styles.guildImgContainer}>
                            {item.type === 'video' ? (
                                <video src={item.src} className={styles.guildimg} controls />
                            ) : (
                                <img src={item.src} alt="Evidence" className={styles.guildimg} />
                            )}
                        </div>
                        <button className={styles.button} onClick={() => removeEvidence(item.id)}>
                            Delete
                        </button>
                    </div>
                ))}
                {evidences.length === 0 && (
                    <div className={styles.paragraph}>
                        <div 
                            className={styles.guildImgContainer} 
                            onClick={() => evidenceInputRef.current.click()}
                            style={{ maxHeight: '50px', cursor: 'pointer' }}
                        >
                            <div className={styles.emptyPlaceholder} style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                                <p>Add photo or video</p>
                                <img src={add} alt="Add icon" />
                            </div>
                        </div>
                        <input 
                            type="file" 
                            hidden 
                            ref={evidenceInputRef} 
                            onChange={handleAddEvidence} 
                            accept="image/*,video/*"
                        />
                    </div>
                )}
                <div>
                      <h4 className={styles.elsetitle}>Teams</h4>
                      <p style={{color:'rgb(192, 192, 192)',}}>Specify possible spot agents for which viewers will vote.</p>
                      <div className={styles.teamsGrid}> 
                      
                      {teams.map((team) => (
                        <div className={styles.paragraph} key={team.id}>
                          <div className={styles.teamwrap}>
                          <div className={styles.guildImgContainer} style={{border:'none',}}>
                            <div className={styles.emptyPlaceholder}>
                              <img src={team.img} alt="team" />
                              <p>Team {team.id}</p>
                            </div>
                          </div>
                            <h4 className={styles.elsetitle}>{team.name}</h4>
                            <div className={styles.pointsWrapper}>
                                <img src={points} alt="points" />
                                <p style={{color:'white'}}>{team.points}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* 4-я карточка "Add" (теперь она в сетке вместе с остальными) */}
                      <div className={styles.paragraph} >
                        <div className={styles.guildImgContainer} onClick={() => navigate('/team')} style={{height:'260px', padding:'10px 0px',}}>
                          <div className={styles.emptyPlaceholder}>
                            <img src={team} alt="Add icon" />
                            <p>Add team</p>
                          </div>
                        </div>

                        <input type="file" hidden ref={evidenceInputRef} onChange={handleAddEvidence} />
                      </div>

                    </div>
                </div>
    
                {/* Save Button */}
                <div className={styles.item}>
                    <div className={styles.active}>
                        <button className={styles.savebutton} onClick={Save}>
                            Create Act
                        </button>
                    </div> 
                </div>          
            </div>
  );
}

// Component for handling map clicks
function LocationSelector({
  setRouteDestination,
  setRouteCoordinates,
  startLocation,
  addRoutePoint,
  routePoints,
}) {
  useMapEvents({
    async click(e) {
      const destination = {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      };
      console.log("Map clicked, adding route point:", destination);

      addRoutePoint(destination);

      setRouteDestination(destination);
      console.log("Start location:", startLocation);

      if (startLocation) {
        try {
          const allPoints = [
            startLocation,
            ...routePoints.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude,
            })),
            destination,
          ];

          const coordsString = allPoints
            .map((p) => `${p.longitude},${p.latitude}`)
            .join(";");

          const response = await fetch(
            `https://router.project-osrm.org/route/v1/foot/${coordsString}?overview=full&geometries=geojson`,
          );
          const data = await response.json();

          if (data.routes && data.routes[0]) {
            const coordinates = data.routes[0].geometry.coordinates.map(
              (coord) => [coord[1], coord[0]],
            );
            setRouteCoordinates(coordinates);
            toast.success(`Route point ${routePoints.length + 1} added!`);
          }
        } catch (error) {
          console.error("Error fetching route:", error);
          toast.error("Failed to build route");
        }
      }
    },
  });

  return null;
}
