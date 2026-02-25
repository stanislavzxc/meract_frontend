import { useNavigate } from "react-router-dom";
import default_back from '../../../images/act_back_default.png';
import styles from "./ActCard.module.css";
import star from '../../../images/star.png';
export default function ActCard({ act, titleact }) {
  const navigate = useNavigate();

  const isLive = act.status;
  const title = act.name || act.title;
  const description = act.description;
  const heroes = 'Heroes: Graphite8, EPICA, Moment';
  const navigator = 'Graphite8, Grinar, Levina ';
  const location = 'Tokyo, Japan';
  const distance = 1000;
  const rating = 9.5;
  let rawImageUrl = act.imageUrl || act.previewFileName;
  let finalImage;

  if (!rawImageUrl) {
    finalImage = default_back;
  } else if (rawImageUrl.startsWith('http')) {
    finalImage = rawImageUrl;
  } else {
    finalImage = `https://meract.com${rawImageUrl}`;
  }

  const cardStyle = {
    backgroundImage: `url(${finalImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const handleCardClick = () => {
    navigate(`/acts/${act.id}`, { state: { act } });
  };

  if (act.isMock) {
    return (
      <div className={styles.parent}>
        { titleact === true &&

        <p className={styles.subtitle}>Popular</p>
        }
        <div className={styles.actCard} onClick={handleCardClick} style={cardStyle}>
          <div className={styles.infoblock}>
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
          <div style={{display:'flex',gap:'5px'}}>
            <img src={star} alt="" style={{width: '20px',
  height: '20px',}}/>
            <p style={{color:'#00F300'}}>{rating}</p>
          </div>
          </div>
              <p className={styles.desc}>{description}</p>
             <div style={{gap:'2px', background:'#181818', width:'fit-content', padding:'4px 5px', borderRadius:'10px',}}>
           <p className={styles.desc} style={{fontSize:'small',color:'white',fontWeight:'bolder'}}>Heroes: {heroes}</p>
          <p className={styles.desc} style={{fontSize:'small',color:'white', fontWeight:'bolder'}}>Navigator: {navigator}</p>
          </div>
              <div style={{display:'flex', gap:'5px', alignItems:'center',}}>
                <div style={{ background:'#111111', width:'fit-content', padding:'4px 5px', borderRadius:'8px', border:'none',}}>
              <p className={styles.desc} style={{ color:'#c0c0c0',}}>{location}</p>
                </div>
              <div style={{  padding: '2px 4px', borderRadius: '8px' }}>
                <div style={{ background:'#252525', width:'fit-content', padding:'4px 5px', borderRadius:'8px', border:'none',}}>
                  <p className={styles.desc} style={{ color:'#c0c0c0',}}>{distance}km away</p>
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.actCard} style={cardStyle} onClick={handleCardClick}>
      <div className={styles.overlay} />
      <div className={styles.infoblock}>
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
          <div style={{display:'flex',gap:'5px'}}>
            <img src={star} alt="" style={{width: '20px',
  height: '20px',}}/>
            <p style={{color:'#00F300'}}>{rating}</p>
          </div>
          </div>
          <p className={styles.desc}>{description}</p>
        <div style={{gap:'2px', background:'#181818', width:'fit-content', padding:'4px 5px', borderRadius:'10px',}}>
           <p className={styles.desc} style={{fontSize:'small',color:'white',fontWeight:'bolder'}}>Heroes: {heroes}</p>
          <p className={styles.desc} style={{fontSize:'small',color:'white', fontWeight:'bolder'}}>Navigator: {navigator}</p>
          </div>

            <div style={{display:'flex', gap:'5px', alignItems:'center',}}>
                <div style={{ background:'#111111', width:'fit-content', padding:'4px 5px', borderRadius:'8px', border:'none',}}>
              <p className={styles.desc} style={{ color:'#c0c0c0',}}>{location}</p>
                </div>
              <div style={{  padding: '2px 4px', borderRadius: '8px' }}>
                <div style={{ background:'#252525', width:'fit-content', padding:'4px 5px', borderRadius:'8px', border:'none',}}>
                  <p className={styles.desc} style={{ color:'#c0c0c0',}}>{distance}km away</p>
                </div>
              </div>

              </div>
        </div>
      </div>

      {/* <div className={styles.stripe}></div>
      <div className={styles.blocks}>
        <p>{act.location}</p>
        <p>{act.distance}</p>
      </div>
      <div className={styles.info}>
        <div className={styles.arrows}>
          <span className={styles.arrow}>
            <img src="/icons/arrowUp.svg" alt="arrow" />
            <h2>{act.upvotes}</h2>
          </span>
          <span className={styles.arrow}>
            <img src="/icons/arrowDown.svg" alt="arrow" />
            <h2>{act.downvotes}</h2>
          </span>
        </div>
        <h4>{act.liveIn}</h4>
      </div> */}
    </div>
  );
}
