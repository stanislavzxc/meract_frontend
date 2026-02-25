import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import userimg from '../../images/user.png';
import styles from "./RankPage.module.css";
import notification from '../../images/notification.png';
import back from '../../images/arrow-left.png';

const RankAchive = () =>{
    const navigate = useNavigate();
    const { id } = useParams();

    const isAdmin = true;
    const [selectedToSwap, setSelectedToSwap] = useState(null);
    const [achivemenets, setAchivemenets] = useState([
        { id: 1, name: 'gold digger', avatar: userimg, description: 'desctiption', isBest: true },
        { id: 2, name: 'platinum', avatar: userimg, description: 'desctiption', isBest: true },
        { id: 3, name: 'digger', avatar: userimg, description: 'desctiption', isBest: false },
        { id: 4, name: 'platina', avatar: userimg, description: 'desctiption', isBest: false },
      ]);
    const handleAchiveClick = (clickedAchive) => {
    if (!isAdmin) return;

    if (!selectedToSwap) {
      setSelectedToSwap(clickedAchive);
    } else {
      if (selectedToSwap.id === clickedAchive.id) {
        setSelectedToSwap(null);
        return;
      }

      const updated = achivemenets.map(a => {
        if (a.id === clickedAchive.id) return { ...a, isBest: selectedToSwap.isBest };
        if (a.id === selectedToSwap.id) return { ...a, isBest: clickedAchive.isBest };
        return a;
      });

      setAchivemenets(updated);
      setSelectedToSwap(null);
    }
  };
    return(
         <div className={styles.container}>
              <div className={styles.actsPage}>
                <div className="header">
                  <div className={styles.header_cont}>
                    <img src={back} alt="back" onClick={() => navigate(`/rank/${id}`)} style={{cursor: 'pointer'}}/>
                    <div className="name"><h1>Achievements</h1></div>
                    <img src={notification} alt="notification" onClick={() => navigate('/notifications')} style={{cursor: 'pointer'}}/>
                  </div>
                </div>
                 <div className={styles.achivemenets}>
                            <div className={styles.cardcontfirst}>
                                <div style={{display:'flex',flexDirection:'column',gap:'5px',}}>

                              <p className={styles.title} style={{ fontSize: '18px', margin: '0px' }}>Best achievements</p>
                             {isAdmin && <p className={styles.subtitle} style={{ fontSize: '14px', margin: '0px' }}>Indicate achievements that you are especially proud of</p>}
                                </div>
                              
                              {achivemenets.filter(a => a.isBest).map((achive) => (
                                <div 
                                  key={achive.id} 
                                  className={`${styles.members} ${selectedToSwap?.id === achive.id ? styles.selected : ""}`} 
                                  onClick={() => handleAchiveClick(achive)}
                                  style={{
                                    transform: selectedToSwap?.id === achive.id ? 'translateY(-8px)' : 'none',
                                    transition: 'transform 0.2s ease',
                                    border: selectedToSwap?.id === achive.id ? '1px solid #3abafe' : 'none'
                                  }}
                                >
                                  <div className={styles.rankBadge}><img src={achive.avatar} alt="avatar" className={styles.rankImg} /></div>
                                  <div className={styles.cardInfo}>
                                    <p className={styles.userName}>{achive.name}</p>
                                    <p className={styles.userName} style={{ color: '#b5b3b3' }}>{achive.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                
                            <div className={styles.cardcont} style={{ marginTop: '20px' }}>
                              {achivemenets.filter(a => !a.isBest).map((achive) => (
                                <div 
                                  key={achive.id} 
                                  className={`${styles.members} ${selectedToSwap?.id === achive.id ? styles.selected : ""}`} 
                                  onClick={() => handleAchiveClick(achive)}
                                  style={{
                                    transform: selectedToSwap?.id === achive.id ? 'translateY(-8px)' : 'none',
                                    transition: 'transform 0.2s ease',
                                    border: selectedToSwap?.id === achive.id ? '1px solid #3abafe' : 'none'
                                  }}
                                >
                                  <div className={styles.rankBadge}><img src={achive.avatar} alt="avatar" className={styles.rankImg} /></div>
                                  <div className={styles.cardInfo}>
                                    <p className={styles.userName}>{achive.name}</p>
                                    <p className={styles.userName} style={{ color: '#b5b3b3' }}>{achive.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                 </div>
            </div>
        </div>

    )
}
export default RankAchive;