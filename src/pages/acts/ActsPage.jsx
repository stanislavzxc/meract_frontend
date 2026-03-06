import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../shared/api/api";
import { useSequelStore } from "../../shared/stores/sequelStore";
import NavBar from "../../shared/ui/NavBar/NavBar";
import styles from "./ActsPage.module.css";
import ActCard from "./components/ActCard";
import menu from '../../images/menu.png';
import notification from '../../images/notification.png';
import filter from '../../images/setting.png';
import search from '../../images/search.png';
import Menu from '../Menu/Menu.jsx';
import thumb from '../../images/thumb.png';
import { actApi } from "../../shared/api/act.js";

const locations = ["Japan", "Spain", "Russia", 'Kazahstan', 'USA'];

export default function ActsPage() {
  const [acts, setActs] = useState([
    // {
    //   id: 1,
    //   title: "Voices in the Crowd",
    //   description: "Lorem ipsum is a dummy text",
    //   navigator: "Graphite8",
    //   heroes: ["Graphite8", "NeonFox"],
    //   location: "Spain",
    //   distance: "2,500km Away",
    //   upvotes: 12,
    //   downvotes: 12,
    //   liveIn: "2h 15m",
    //   isMock: true,
    //   status: 'ONLINE',
    // },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocIndex, setSelectedLocIndex] = useState(1); // Spain по умолчанию
  
  const { clearAll } = useSequelStore();
  const navigate = useNavigate();

  useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await actApi.getAllActs();
            console.log(data, 'acts!!!!!!!!!!!!!')
            setActs(data);
          } catch (error) {
            console.error("Ошибка при загрузке:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []); 

  useEffect(() => {
    localStorage.removeItem("createActFormState");
    clearAll();
  }, [clearAll]);



  return (
    <div className={styles.container}>
      {isOpen && <Menu onClose={() => setIsOpen(false)} />}
      
      <div className={styles.actsPage}>
        {/* HEADER */}
        <div className="header">
          <div className={styles.header_cont}>
            <img src={menu} alt="menu" onClick={() => setIsOpen(!isOpen)} />
            <div className="name"><h1>ACT Hub</h1></div>
            <img src={notification} alt="notification" onClick={() => navigate('/notifications')} />
          </div>
          <div className="nav">
            <div className={styles.searchWrapper}>
              <img src={search} alt="search" className={styles.searchIcon} />
              <input type="text" placeholder="Search" className={styles.input} />
              <img src={filter} alt="filter" className={styles.filterIcon} onClick={() => navigate('/filters')} />
            </div>
          </div>
        </div>

      <div className={styles.locationSliderSection}>
  {/* Заголовок теперь СВЕРХУ полоски */}
  <div className={styles.sliderHeader}>
    <h1 className={styles.sliderTitle}>Location:</h1>
    <p className={styles.currentLocation}>{locations[selectedLocIndex]}</p>
  </div>

  <div className={styles.customRangeWrapper}>
    {/* Фон линии (серый) */}
    <div className={styles.rangeTrack}></div>

    {/* Пройденный путь (синий) */}
    <div 
      className={styles.activeTrack} 
      style={{ width: `${(selectedLocIndex / (locations.length - 1)) * 100}%` }}
    ></div>
    
    {/* Контейнер-бегунок */}
    <div 
      className={styles.thumbcont}
      style={{ left: `${(selectedLocIndex / (locations.length - 1)) * 100}%` }}
    >
      <img src={thumb} alt="thumb" className={styles.rangeThumb} />
    </div>

    <input 
      type="range" 
      min="0" 
      max={locations.length - 1} 
      value={selectedLocIndex} 
      step="1"
      onChange={(e) => setSelectedLocIndex(parseInt(e.target.value))}
      className={styles.hiddenInput}
    />
  </div>

  
</div>



        {/* CONTENT */}
        <div className={styles.contentWrapper}>
          <div className={styles.streamsList}>
            {acts.map((act, index) => (
              <ActCard key={index} act={act} titleact={true} />
            ))}
          </div>
          {acts.length == 0 &&
             <div className="name" style={{display:'contents',}}><h1>No acts</h1></div>
          }
        </div>
        
        <NavBar />
      </div>
    </div>
  );
}
