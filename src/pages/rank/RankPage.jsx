import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../shared/api/api";
import { useAuthStore } from "../../shared/stores/authStore";
import styles from "./RankPage.module.css";

import notification from '../../images/notification.png'
import filter from '../../images/setting.png'
import search from '../../images/search.png'
import rang1 from '../../images/rang1.png'
import rang2 from '../../images/rang2.png'
import rang3 from '../../images/rang3.png'
import rang4 from '../../images/rang4.png'
import points from '../../images/points.png'
import back from '../../images/arrow-left.png';
import { rankApi } from "../../shared/api/rank";
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export default function RankPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  
  const [loading, setLoading] = useState(false);
  const [nav, setNav] = useState(0);
  const [data, setData] = useState({
    0: [], // initiators
    1: [], // navigators
    2: []  // heroes
  });

  const fetchData = async (type) => {
    setLoading(true);
    try {
      let result = [];
      if (type === 0) result = await rankApi.getInitiators();
      else if (type === 1) result = await rankApi.getNavigators();
      else if (type === 2) result = await rankApi.getHeroes();
      
      setData(prev => ({ ...prev, [type]: result }));
      console.log(result)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  const handleNavChange = (type) => {
    setNav(type);
    if (data[type].length === 0) {
      fetchData(type);
    }
  };

  const getRankImage = (index) => {
    const images = [rang1, rang2, rang3];
    return images[index] || rang4;
  };

  const getCardStyle = (index) => {
    const baseBg = "rgba(255, 255, 255, 0.08)";
    const gradientEnd = "rgba(0, 149, 252, 0) 100%"; 
    const colors = [
      "rgba(135, 87, 183, 0.4)", 
      "rgba(135, 209, 255, 0.25)", 
      "rgba(253, 147, 77, 0.25)"
    ];

    if (index > 2) return { background: baseBg };

    return {
      background: `linear-gradient(90deg, ${colors[index]} 0%, ${gradientEnd}), ${baseBg}`,
      backgroundBlendMode: "normal", 
    };
  };

  const currentList = data[nav];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_cont}>
          <img src={back} alt="back" onClick={() => navigate('/acts')} style={{ cursor: 'pointer' }} />
          <div className={styles.name}>
            <h1>Leaders</h1>
          </div>
          <img src={notification} alt="notifications" onClick={() => navigate('/notifications')}/>
        </div>
        <div className={styles.btncont}>
          <button className={nav === 0 ? styles.active : ""} onClick={() => handleNavChange(0)}>Initiator</button>
          <button className={nav === 1 ? styles.active : ""} onClick={() => handleNavChange(1)}>Navigator</button>
          <button className={nav === 2 ? styles.active : ""} onClick={() => handleNavChange(2)}>Hero</button>
        </div>
        <div className={styles.nav}>
          <div className={styles.searchWrapper}>
            <img src={search} alt="search" className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.input} />
            <img src={filter} alt="filter" className={styles.filterIcon} onClick={() => navigate('/rank-filters')} />
          </div>
        </div>
      </div>

      <div className={styles.cardcont}>
        {loading ? (
          <h3 style={{color:'white', margin:'auto'}}>Loading...</h3>
        ) : currentList.length > 0 ? (
          currentList.map((card, index) => (
            <div 
              key={card.id} 
              className={styles.card} 
              style={getCardStyle(index)}
              onClick={() => navigate(`/rank/${card.userId}`)}
            >
              <div className={styles.rankBadge}>
                <img src={getRankImage(index)} alt="rank" className={styles.rankImg} />
                <span className={styles.rankId}>{card.id}</span>
              </div>
              <div className={styles.cardInfo}>
                <p className={styles.userName}>{card.name || 'no name'}</p>
                <div className={styles.pointsWrapper}>
                  <img src={points} alt="points" />
                  <p style={{color:'white'}}>{card.points || 0}</p>
                </div>
              </div>
              <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          ))
        ) : (
          <h3 style={{color:'white', margin:'auto'}}>Nothing found</h3>
        )}
      </div>
    </div>
  );
};
