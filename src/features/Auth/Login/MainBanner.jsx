import styles from "./mainbanner.module.css"; 
const MainBanner = () => {
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
        <source src="../../../images/banner.mp4" type="video/mp4" />
        {/* <source src="/videos/main-banner.webm" type="video/webm" /> */}
      </video>
    </div>
  );
};

export default MainBanner;
