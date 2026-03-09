import React, { useEffect, useState, useMemo } from "react"; // Добавили useMemo
import { useNavigate } from "react-router-dom";
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
  const [acts, setActs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 1. Состояние для поиска
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocIndex, setSelectedLocIndex] = useState(1);
  
  const { clearAll } = useSequelStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await actApi.getAllActs();
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

  const filteredActs = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return acts;

    return acts.filter((act) => {
      const title = act.name ? String(act.name).toLowerCase() : "";
      return title.includes(query);
    });
  }, [searchTerm, acts]);

  return (
    <div className={styles.container}>
      {isOpen && <Menu onClose={() => setIsOpen(false)} />}
      
      <div className={styles.actsPage}>
        <div className="header">
          <div className={styles.header_cont}>
            <img src={menu} alt="menu" onClick={() => setIsOpen(!isOpen)} style={{cursor: 'pointer'}} />
            <div className="name"><h1>ACT Hub</h1></div>
            <img src={notification} alt="notification" onClick={() => navigate('/notifications')} style={{cursor: 'pointer'}} />
          </div>
          <div className="nav">
            <div className={styles.searchWrapper}>
              <img src={search} alt="search" className={styles.searchIcon} />
              {/* 3. Привязка инпута к поиску */}
              <input 
                type="text" 
                placeholder="Search" 
                className={styles.input} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img src={filter} alt="filter" className={styles.filterIcon} onClick={() => navigate('/filters')} style={{cursor: 'pointer'}} />
            </div>
          </div>
        </div>

        {/* Слайдер локаций (без изменений) */}
        <div className={styles.locationSliderSection}>
          <div className={styles.sliderHeader}>
            <h1 className={styles.sliderTitle}>Location:</h1>
            <p className={styles.currentLocation}>{locations[selectedLocIndex]}</p>
          </div>
          <div className={styles.customRangeWrapper}>
            <div className={styles.rangeTrack}></div>
            <div className={styles.activeTrack} style={{ width: `${(selectedLocIndex / (locations.length - 1)) * 100}%` }}></div>
            <div className={styles.thumbcont} style={{ left: `${(selectedLocIndex / (locations.length - 1)) * 100}%` }}>
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
            {/* 4. Рендерим отфильтрованный список */}
            {filteredActs.map((act, index) => (
              <ActCard key={act.id || index} act={act} titleact={true} />
            ))}
          </div>
          
          {/* 5. Показ заглушки, если ничего не найдено */}
          {filteredActs.length === 0 && !loading && (
             <div className="name" style={{display:'contents'}}>
               <h1 style={{textAlign: 'center', marginTop: '20px', opacity: 0.5}}>
                 {searchTerm ? "No results found" : "No acts"}
               </h1>
             </div>
          )}
        </div>
        
        <NavBar />
      </div>
    </div>
  );
}
