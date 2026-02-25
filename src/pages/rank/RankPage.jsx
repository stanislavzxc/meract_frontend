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
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState(0);
  // Имитация данных (замените на ranks, если данные приходят из API)
  const cards = [
    { id: 1, user: 'pavel', pointsValue: 1000 },
    { id: 2, user: 'pavel', pointsValue: 950 },
    { id: 3, user: 'pavel', pointsValue: 800 },
    { id: 4, user: 'pavel', pointsValue: 700 },
    { id: 5, user: 'pavel', pointsValue: 600 },
  ];

  const getRankImage = (index) => {
    if (index === 0) return rang1;
    if (index === 1) return rang2;
    if (index === 2) return rang3;
    return rang4;
  };

  const getCardStyle = (index) => {
  const baseBg = "rgba(255, 255, 255, 0.08)";
  
  const gradientEnd = "rgba(0, 149, 252, 0) 100%"; 
  
  let color;
  if (index === 0) color = "rgba(135, 87, 183, 0.4)"; 
  else if (index === 1) color = "rgba(135, 209, 255, 0.25)"; 
  else if (index === 2) color = "rgba(253, 147, 77, 0.25)"; 
  else return { background: baseBg }; 

  return {
    background: `linear-gradient(90deg, ${color} 0%, ${gradientEnd}), ${baseBg}`,
    backgroundBlendMode: "normal", 
  };
};


  useEffect(() => {
    const fetchUserRanks = async () => {
      let userId = user?.id;
      if (!userId && token) {
        const decoded = decodeToken(token);
        userId = decoded?.sub;
      }
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/rank/user/${userId}`);
        setRanks(response.data.map((item) => item.rank));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRanks();
  }, [user?.id, token]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_cont}>
          <img 
            src={back} 
            alt="back" 
            onClick={() => navigate('/acts')} 
            style={{ cursor: 'pointer' }} 
          />
          <div className={styles.name}>
            <div className="name"><h1>Leaders</h1></div>
          </div>
          <img src={notification} alt="notifications" onClick={() => navigate('/notifications')}/>
        </div>
         <div >
            <div className={styles.btncont}>
              <button className={nav === 0 ? styles.active : ""} onClick={() => setNav(0)}>Initiator</button>
              <button className={nav === 1 ? styles.active : ""} onClick={() => setNav(1)}>Navigator</button>
              <button className={nav === 2 ? styles.active : ""} onClick={() => setNav(2)}>Hero</button>
            </div>
          </div>
        <div className={styles.nav}>
          <div className={styles.searchWrapper}>
            <img src={search} alt="search" className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.input} />
            <img 
              src={filter} 
              alt="filter" 
              className={styles.filterIcon} 
              onClick={() => navigate('/rank-filters')} 
            />
          </div>
        </div>
      </div>

      <div className={styles.cardcont}>
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className={styles.card} 
            style={getCardStyle(index)}
            onClick={() => navigate(`/rank/${card.id}`)}
>
            <div className={styles.rankBadge}>
              <img src={getRankImage(index)} alt="rank" className={styles.rankImg} />
              <span className={styles.rankId}>{card.id}</span>
            </div>

            <div className={styles.cardInfo}>
              <p className={styles.userName}>{card.user}</p>
              <div className={styles.pointsWrapper}>
                <img src={points} alt="points" />
                <p style={{color:'white',}}>{card.pointsValue}</p>
              </div>
            </div>

            <svg 
              className={styles.arrowIcon} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
