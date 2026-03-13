import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import api from "../../shared/api/api";
import { useAuthStore } from "../../shared/stores/authStore";
import styles from "./ActsDetail.module.css";

import arrowLeft from '../../images/arrow-left.png';
import iconguild from '../../images/BG.png'; 
import userimg from '../../images/user.png';
import sound from '../../images/Sound.png';
import star from '../../images/star.png';
import share from'../../images/sharewhite.png';
import { actApi } from "../../shared/api/act";
import { useSoundStore } from "../../shared/stores/soundStore";
export default function ActDetail(act) {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = true;
const { soundStates, toggleSound } = useSoundStore();
let isEnabled = !!soundStates[id];
  const [guild, setGuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [navMethod, setNavMethod] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [selectedNav, setSelectedNav] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navigators, setnavigators] = useState([
    { id: 1, name: 'gold digger', avatar: userimg, description: 'desctiption', percent:'15.8', },
    { id: 2, name: 'platinum', avatar: userimg, description: 'desctiption', percent:'15.8', },
    { id: 3, name: 'digger', avatar: userimg, description: 'desctiption', percent:'72.8',},
  ]);
  const [heroes, setheroes] = useState([
    { id: 1, name: 'gold digger', avatar: userimg, description: 'desctiption', percent:'15.8', },
    { id: 2, name: 'platinum', avatar: userimg, description: 'desctiption', percent:'15.8', },
    { id: 3, name: 'digger', avatar: userimg, description: 'desctiption', percent:'72.8',},
  ]);

const maxNavPercent = Math.max(...navigators.map(a => parseFloat(a.percent) || 0));

const maxHeroPercent = Math.max(...heroes.map(a => parseFloat(a.percent) || 0));

  const [isLive, setIsLive] = useState('');
  const [title, setTitle] = useState('Loading');
  const [description, setDescription] = useState('loading');
  const [seasons, setSeasons] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState(0);
  const [genre, setGenre] = useState([]);
  const [time, setTime] = useState('0 min');

  useEffect(() => {
    const fetchActDetails = async () => {
      try {
        const data = await actApi.getAct(id);
        console.log(data);

        if (data) {
          // 2. Связываем данные из API со стейтами
          setIsLive(data.status);
          setTitle(data.title || 'Untitled');
          setDescription(data.description || act.description ||'No description available');
          
          // Если есть дата старта, вырезаем год
          if (data.startedAt) {
            setDate(new Date(data.startedAt).getFullYear().toString());
          }

          // Если жанры/теги приходят в массиве tags
          if (data.tags) {
            setGenre(data.tags.map(t => t.name || t));
          }

          // Рассчитываем время (разница между startedAt и endedAt в минутах)
          if (data.startedAt && data.endedAt) {
            const diff = Math.round((new Date(data.endedAt) - new Date(data.startedAt)) / 60000);
            setTime(`${diff} min`);
          }
          
          

// Рейтинг (если есть поле likes или рейтинг в API)
          setRating(data.likes || 0); 
        }
      } catch (error) {
        console.error("Ошибка загрузки акта:", error);
      } 
    };
    
    if (id) fetchActDetails();
  }, [id]);

  
const handlenavigatorClick = (clickedNav) => {
  if (!isAdmin) return;
  
  // Просто устанавливаем выбранного навигатора или снимаем выбор
  if (selectedNav?.id === clickedNav.id) {
    setSelectedNav(null); // Снимаем выбор, если кликнули на того же
  } else {
    setSelectedNav(clickedNav); // Выбираем нового
  }
};

const handleheroClick = (clickedHero) => {
  if (!isAdmin) return;
  
  // Просто устанавливаем выбранного героя или снимаем выбор
  if (selectedHero?.id === clickedHero.id) {
    setSelectedHero(null); // Снимаем выбор, если кликнули на того же
  } else {
    setSelectedHero(clickedHero); // Выбираем нового
  }
};


const join = () => {
  navigate(`/stream/${id}`, { state: { act } });

}
  const bannerUrl = iconguild;
  const topBannerStyle = {
    backgroundImage: `url(${bannerUrl})`,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '40vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
  };

  return (
    <div className={styles.container}>
      <div style={topBannerStyle} />

      <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <div className={styles.backButton} onClick={() => navigate("/acts")}>
                <img src={arrowLeft} alt="Back" className={styles.backIcon} />
            </div>

            <div className={styles.menuContainer}>
                <img 
                    src={sound} 
                    alt="Sound" 
                    className={`${styles.menuIcon} ${isEnabled ? styles.activeIcon : ""}`} 
                    onClick={() => toggleSound(id)} 
                />
                <img src={share} alt="Share" className={styles.menuIcon} />
            </div>
        </div>



        <div className={`${styles.card} ${styles.firstcard}`} style={{marginTop:'100px',}}>

          <div className={styles.infoblock} style={{width:'100%',}}>
                      <div className={styles.inner}>
                        {isLive === 'ONLINE' && (
                          <div className={styles.online}> 
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org">
                              <circle cx="10" cy="10" r="5" fill="white" />
                            </svg>
                            <p className={styles.live}>Live</p>
                          </div>
                        )}
                               <div style={{display:'flex',gap:'5px', alignItems:'baseline',}}>
          
                    <h1 className={styles.title}>{title}</h1>
                   
                    </div>
                        <p className={styles.desc}>{description}</p>
                        <div style={{display:'flex', gap:'15px',}}>
                          <div style={{display:'flex',gap:'5px'}}>
                            <img src={star} alt="" style={{width: '20px',height: '20px',}}/>
                            <p style={{color:'#00F300'}}>{rating}</p>
                          </div>
                          <p className={styles.desc} style={{color:'#c0c0c0',}}>{date}</p>
                          {seasons && seasons == 1 
                            ? <p className={styles.desc} style={{color:'#c0c0c0'}}>1 Season</p>
                            : <p className={styles.desc} style={{color:'#c0c0c0'}}>{seasons || 0} Seasons</p>
                          }
                        </div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '2px 0' }}>
                          {genre && genre.map((item, index) => (
                            <div key={index} style={{ padding: '2px 4px', borderRadius: '8px' }}>
                              <div style={{ 
                                background: '#252525', 
                                width: 'fit-content', 
                                padding: '4px 8px', 
                                borderRadius: '8px', 
                                border: 'none' 
                              }}>
                                <p className={styles.desc} style={{ color: 'white', margin: 0 }}>
                                  {item}
                                </p>
                              </div>
                            </div>
                        ))}
                        </div>


                      </div>
                      <div className={styles.savecard}>
                        <div style={{display:'flex', gap:'5px',}} >
                          {time[0] != '0' ?
                          <>
                          <h3>Live stream via:</h3>
                          <p style={{color:'#c0c0c0',}}>{time}</p>
                          </>
                          :
                          <h3>Live</h3>

                          }
                        </div>
                      <div className={styles.savebutton} style={{marginTop:'0px',}}>
                        <button className={styles.active} onClick={() => join()}>Watch</button>
                      </div>
                    </div>
                    </div>
                    
        </div>

       
        {/* <div className={styles.parentnav}>
  <div className={styles.navigators}>
    <div className={styles.cardcontfirst}>
      <p className={styles.title} style={{ fontSize: '18px', margin: '0px' }}>Select the act navigator</p>
      <p className={styles.subtitle} style={{ fontSize: '14px', margin: '0px', color:'rgb(181, 179, 179)', }}>We need to decide who will be the navigator in the act.</p>

      {navigators.map((navigator) => {
        const isMax = parseFloat(navigator.percent) === maxNavPercent && maxNavPercent !== 0;
        const isSelected = selectedNav?.id === navigator.id;

        return (
          <div 
            key={navigator.id} 
            className={`${styles.members} ${isSelected ? styles.selected : ""}`} 
            onClick={() => handlenavigatorClick(navigator)}
            style={{
              transform: isSelected ? 'translateY(-8px)' : 'none',
              transition: 'transform 0.2s ease',
              border: isSelected ? '1px solid #009DFF' : 'none',
              cursor: 'pointer'
            }}
          >
            <div className={styles.rankBadge}>
              <img src={navigator.avatar} alt="avatar" className={styles.rankImg} />
            </div>
            <div className={styles.cardInfo}>
              <p className={styles.userName}>{navigator.name}</p>
              <p className={styles.userName} style={{ color: '#b5b3b3' }}>{navigator.description}</p>
            </div>
            {selectedNav && (
              <p style={{ 
                marginLeft: 'auto', 
                fontWeight: 'bold',
                color: isMax ? '#009DFF' : '#FFFFFFB2' 
              }}>
                {navigator.percent}%
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
</div>

<div className={styles.parentnav}>
  <div className={styles.navigators}>
    <div className={styles.cardcontfirst}>
      <p className={styles.title} style={{ fontSize: '18px', margin: '0px' }}>Select an Act Hero</p>
      <p className={styles.subtitle} style={{ fontSize: '14px', margin: '0px', color:'rgb(181, 179, 179)', }}>We need to decide who will be the hero in the act.</p>

      {heroes.map((hero) => {
        const isMax = parseFloat(hero.percent) === maxHeroPercent && maxHeroPercent !== 0;
        const isSelected = selectedHero?.id === hero.id;

        return (
          <div 
            key={hero.id} 
            className={`${styles.members} ${isSelected ? styles.selected : ""}`} 
            onClick={() => handleheroClick(hero)}
            style={{
              transform: isSelected ? 'translateY(-8px)' : 'none',
              transition: 'transform 0.2s ease',
              border: isSelected ? '1px solid #009DFF' : 'none',
              cursor: 'pointer'
            }}
          >
            <div className={styles.rankBadge}>
              <img src={hero.avatar} alt="avatar" className={styles.rankImg} />
            </div>
            <div className={styles.cardInfo}>
              <p className={styles.userName}>{hero.name}</p>
              <p className={styles.userName} style={{ color: '#b5b3b3' }}>{hero.description}</p>
            </div>
            {selectedHero && (
              <p style={{ 
                marginLeft: 'auto', 
                fontWeight: 'bold',
                color: isMax ? '#009DFF' : '#FFFFFFB2' 
              }}>
                {hero.percent}%
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
</div> */}



      </div>
    </div>
  );
}
