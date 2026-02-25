import styles from "./StartPage.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import banner from '../../../images/banner.mp4'
const StartPage = () => {
  const [showCard, setShowCard] = useState(false); 
  const [clicks, setClicks] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 1000);

    return () => clearTimeout(timer); 
  }, []);

  const handleButtonClick = () => {
    setClicks((prev) => prev + 1);
    if (clicks + 1 >= 3) {
      localStorage.setItem("hasPassedStart", "true");
      navigate("/login"); 
    }
  };

  return (
    <div className={styles.container}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={styles.video}
        poster="/images/banner-poster.jpg"
      >
        <source src={banner} type="video/mp4" />
      </video>

      <div className={`${styles.card} ${showCard ? styles.cardVisible : ""}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to Meract</h1>
          <p className={styles.subtitle}>
            Watch the video about the project to learn more
          </p>
        </div>
        <button
          type="button" 
          onClick={handleButtonClick}
          className={styles.button}
        >
          Click {clicks < 3 ? "3 times" : "to continue"}
        </button>
        
      </div>
    </div>
  );
};

export default StartPage;
