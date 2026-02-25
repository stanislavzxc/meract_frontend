import back from '../../images/arrow-left.png';
import styles from "./RankPage.module.css";
import logo from '../../images/discord.png';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import points from '../../images/points.png';
import copy from '../../images/copy.png' ;
import ActCard from '../acts/components/ActCard';

const RankDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const pointsValue = 1000;
    const username = '@xxxkilla';
    const acts =
            [
              {
              id: 1,
              title: "Voices in the Crowd",
              description:
                "Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing",
              navigator: "Graphite8",
              heroes: ["Graphite8", "NeonFox", "ShadowWeave", "EchoStorm1"],
              location: "Puerto de la Cruz (ES)",
              distance: "2,500km Away",
              upvotes: 12,
              downvotes: 12,
              liveIn: "2h 15m",
              isMock: true,
              status:'ONLINE',
            },
            ]

   const copyText = () => {
  navigator.clipboard.writeText(username).then(() => {
    // alert(`Copied: ${username}`);
  }).catch(err => {
    console.error('Ошибка копирования:', err);
  });
};
  const sendMessage = () => {
    console.log('a')
  }
  const sendEcho = () => {
    console.log('a')
  }

    return(
         <div className={styles.container}>
              <div className={styles.header}>
                <div className={styles.header_cont}>
                  <img 
                    src={back} 
                    alt="back" 
                    onClick={() => navigate('/rank')} 
                    style={{ cursor: 'pointer' }} 
                  />
                  
                </div>
              </div>
              <div className={styles.parent}>
                <div className={styles.profile}>
                    <img src={logo} alt="" className={styles.logo}/>
                    <p className={styles.title}>Name</p>
                    <p className={styles.subtitle}>last online 5 minuts ago</p>
                     <div className={styles.pointsWrapper}>
                                    <img src={points} alt="points" />
                                    <p style={{color:'white'}}>{pointsValue}</p>
                                  </div>
                </div>
              </div>
              <div className={styles.cardwrapmain}>
              <div className={styles.cardcont}>
                        <div 
                          className={styles.card} 
                          onClick={() => navigate(`/rank-achive/${id}`)}
              >
                   
              
                          <div className={styles.cardInfo}>
                            <p className={styles.userName}>Achievements</p>
                            <p className={styles.subtitle}>0 Achievements</p>
                          </div>
              
                          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org">

                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
              </div>
             <div className={styles.cardwrap}>
  {/* Первая карточка (Location) */}
  <div className={styles.card} >
    <div className={styles.cardInfo}>
      <p className={styles.userName}>Location</p>
      <p className={styles.subtitle}>Japan, Tokio</p>
    </div>
  </div>

  {/* Вторая карточка (Local Time) */}
  <div className={styles.card} >
    <div className={styles.cardInfo}>
      <p className={styles.userName} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Local time</p>
      <p className={styles.subtitle} style={{ color: 'white' }}>11:00 <span className={styles.subtitle}>(UTC + 3:00)</span></p>
    </div>
  </div>

  {/* ТРЕТЬЯ КАРТОЧКА (снизу на всю ширину) */}
  <div className={`${styles.card} ${styles.fullWidthCard}`} >
  <div className={styles.cardInfo}>
    <p className={styles.subtitle}>Language</p>
    <div className={styles.languageBox}>
      {/* SVG иконка флага Японии */}
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org">
        <circle cx="8" cy="8" r="8" fill="white"/>
        <circle cx="8" cy="8" r="3.5" fill="#BC002D"/>
      </svg>
      <p className={styles.userName}>Japanese</p>
    </div>
  </div>
</div>

            </div>
              <div className={styles.cardcont}>
                        <div 
                          className={styles.card} 
              >
                   
              
                          <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>Username</p>
                            <p className={styles.userName}>{username}</p>
                          </div>
              
                          <img 
                            className={styles.arrowIcon} 
                            src={copy}
                            style={{opacity:'1', cursor:'pointer',}}
                          onClick={() => copyText()}

                          ></img>
                        </div>
             </div>

              <div>
                          <div className={styles.btncont}>
                            <button className={styles.active} onClick={() => sendMessage()}>Write</button>
                            <button onClick={() => sendEcho()}>Send Echo</button>
                          </div>
                        </div>
              </div>
              <div className={styles.act}>
                <p className={styles.title}>Participated in the acts</p>
                {acts.map((act, index) => (
                              <ActCard key={index} act={act} titleact={false}/>
                            ))}
              </div>
        </div>
    )
};
export default RankDetails;
