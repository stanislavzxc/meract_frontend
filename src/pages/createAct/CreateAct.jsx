import { useCallback, useEffect, useRef, useState } from "react";
import arrowLeft from '../../images/arrow-left.png';
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
import team from '../../images/team.png';
import add from '../../images/add.png';
import teamicon from '../../images/icon1.png';
import points from '../../images/points.png';
import { actApi } from "../../shared/api/act";
export default function CreateAct() {
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  
  // Основные состояния формы
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Состояния для акта
  const [title, setTitle] = useState("");
  const [actType, setActType] = useState(ActType.SINGLE);
  const [formatType, setFormatType] = useState(ActFormat.SINGLE);
  const [settingsType, setSettingsType] = useState("option1");
  const [heroMethod, setHeroMethod] = useState(SelectionMethods.VOTING);
  const [navigatorMethod, setNavigatorMethod] = useState(SelectionMethods.VOTING);
  const [spotAgentMethod, setSpotAgentMethod] = useState(SelectionMethods.VOTING);
  const [spotAgentCount, setSpotAgentCount] = useState(0);
  const [biddingTime, setBiddingTime] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [createdAct, setCreatedAct] = useState(null);
  const [showStream, setShowStream] = useState(false);

  // Модальные окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sequelCoverPreview, setSequelCoverPreview] = useState(null);
  const [sequelTitle, setSequelTitle] = useState("");
  const [sequelEpisodes, setSequelEpisodes] = useState("");
  const [sequelPhoto, setSequelPhoto] = useState(null);

  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Teams data
  const teams = [
    {id: 1, img: teamicon, name: 'team1', points: '1000'},
  ];

  // Сторы
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
    clearRoute,
  } = useAuthStore();

  const {
    createActFormState,
    setCreateActTasks,
    addCreateActTask,
    updateCreateActTask,
    deleteCreateActTask,
    clearCreateActForm,
  } = useActsStore();

  const {
    selectedSequelId,
    selectedIntroId,
    selectedOutroId,
    selectedMusicIds,
    clearSelectedSequel,
    clearSelectedIntro,
    clearSelectedOutro,
    clearSelectedMusic,
  } = useSequelStore();

  const { createAct } = useCreateAct();
  const {
    createSequel,
    resetState: resetSequelState,
  } = useCreateSequel();

  const tasks = createActFormState.tasks;

  // Обработка фото
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  // Сохранение и восстановление состояния формы
  const saveFormState = () => {
    const formState = {
      name,
      description,
      photoPreview,
      title,
      actType,
      formatType,
      settingsType,
      heroMethod,
      navigatorMethod,
      spotAgentMethod,
      spotAgentCount,
      biddingTime,
      timestamp: Date.now(),
    };
    localStorage.setItem("createActFormState", JSON.stringify(formState));
  };

  const restoreFormState = useCallback(() => {
    try {
      const savedState = localStorage.getItem("createActFormState");
      if (savedState) {
        const formState = JSON.parse(savedState);
        if (Date.now() - formState.timestamp < 30 * 60 * 1000) {
          setName(formState.name || "");
          setDescription(formState.description || "");
          setPhotoPreview(formState.photoPreview || null);
          setTitle(formState.title || "");
          setActType(formState.actType || ActType.SINGLE);
          setFormatType(formState.formatType || ActFormat.SINGLE);
          setSettingsType(formState.settingsType || "option1");
          setHeroMethod(formState.heroMethod || SelectionMethods.VOTING);
          setNavigatorMethod(formState.navigatorMethod || SelectionMethods.VOTING);
          setSpotAgentMethod(formState.spotAgentMethod || SelectionMethods.VOTING);
          setSpotAgentCount(formState.spotAgentCount || 0);
          setBiddingTime(formState.biddingTime || 5);
        }
      }
    } catch (error) {
      console.error("Error restoring form state:", error);
    }
  }, []);

  useEffect(() => {
    restoreFormState();
  }, [restoreFormState]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFormState();
    }, 500);
    return () => clearTimeout(timeoutId);
  });

  const handleCreateAct = async () => {
  if (!name.trim()) {
    toast.error("Please enter a name");
    return;
  }



  if (!photoFile) {
    toast.error("Please select a photo");
    return;
  }

  setIsSubmitting(true);

  try {
    console.log("Sending data:", { name, description, photoFile });
    
    const result = await actApi.createAct(name, description, photoFile);
    console.log("Server response:", result);
    
    if (result) {
      localStorage.removeItem("createActFormState");
      
      clearSelectedSequel();
      clearSelectedIntro();
      clearSelectedOutro();
      clearSelectedMusic();

      // Проверяем структуру ответа
      const newActId = result.actId || result.id || result.data?.id;
      console.log("Act created with ID:", newActId);
      navigate('/acts');
      

      

      toast.success("Act created successfully!");
    }
  } catch (error) {
    console.error("Full error:", error);
    console.error("Error response:", error.response?.data);
    toast.error(error.response?.data?.message || "Failed to create act");
  } finally {
    setIsSubmitting(false);
  }
};

  // Сохранение задач
  const saveLocalTasksToServer = async (actId) => {
    const localTasks = tasks.filter((task) => task.local);
    if (localTasks.length === 0) return;

    try {
      await Promise.all(
        localTasks.map(async (task) => {
          await api.post(`/act/${actId}/tasks`, { title: task.title });
        })
      );
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  // Управление временем
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

  // Модальное окно для создания сиквела
  const handleCreateSequel = async (e) => {
    e.preventDefault();
    if (!sequelTitle.trim()) {
      toast.error("Please enter a sequel title");
      return;
    }
    if (!sequelEpisodes.trim() || isNaN(parseInt(sequelEpisodes))) {
      toast.error("Please enter a valid episode number");
      return;
    }
    if (!sequelPhoto) {
      toast.error("Please upload a sequel cover");
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
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSequelTitle("");
    setSequelEpisodes("");
    setSequelPhoto(null);
    setSequelCoverPreview(null);
    resetSequelState();
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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.backButton} onClick={() => navigate('/acts')}>
          <img src={arrowLeft} alt="Back" className={styles.backIcon} />
        </div>
        <h1>New act</h1>
        <div></div>
      </div>

      {/* Basic Information */}
      <div className={styles.paragraph}>
        <h3 className={styles.elsetitle}>Basic information</h3>
        <input 
          type="text" 
          className={styles.inputField} 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
        <textarea 
          className={styles.textareaField} 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows={4}
        />
      </div>

      {/* Photo Upload */}
      <h4 className={styles.elsetitle}>Act Photo</h4>
      {photoPreview ? (
        <div className={styles.paragraph}>
          <div className={styles.guildImgContainer}>
            <img src={photoPreview} alt="Preview" className={styles.guildimg} />
          </div>
          <button 
            className={styles.button} 
            onClick={handleRemovePhoto}
            disabled={isSubmitting}
          >
            Delete
          </button>
        </div>
      ) : (
        <div className={styles.paragraph}>
          <div 
            className={styles.guildImgContainer} 
            onClick={() => photoInputRef.current?.click()}
            style={{ maxHeight: '100px', cursor: 'pointer' }}
          >
            <div className={styles.emptyPlaceholder}>
              <p>Click to upload photo</p>
              <img src={add} alt="Add icon" />
            </div>
          </div>
          <input 
            type="file" 
            hidden 
            ref={photoInputRef} 
            onChange={handlePhotoChange} 
            accept="image/*"
          />
        </div>
      )}

      {/* Teams */}
      <div>
        <h4 className={styles.elsetitle}>Teams</h4>
        <p style={{color:'rgb(192, 192, 192)'}}>
          Specify possible spot agents for which viewers will vote.
        </p>
        <div className={styles.teamsGrid}> 
          {teams.map((team) => (
            <div className={styles.paragraph} key={team.id}>
              <div className={styles.teamwrap}>
                <div className={styles.guildImgContainer} style={{border:'none'}}>
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
          <div className={styles.paragraph}>
            <div 
              className={styles.guildImgContainer} 
              onClick={() => navigate('/team')} 
              style={{height:'260px', padding:'10px 0px', cursor: 'pointer'}}
            >
              <div className={styles.emptyPlaceholder}>
                <img src={team} alt="Add icon" />
                <p>Add team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className={styles.item}>
        <div className={styles.active}>
          <button 
            className={styles.savebutton} 
            onClick={handleCreateAct}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Act'}
          </button>
        </div> 
      </div>          
    </div>
  );
}