import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RankPage.module.css";
import back from '../../images/arrow-left.png';
import notification from '../../images/notification.png';

export default function RankFilters() {
  const navigate = useNavigate();

  // Раздельные состояния для двух разных дропдаунов
  const [category, setCategory] = useState("Category 1");
  const [isCatOpen, setIsCatOpen] = useState(false);
  
  const [location, setLocation] = useState("Location 1");
  const [isLocOpen, setIsLocOpen] = useState(false);

  const catOptions = ["Category 1", "Category 2", "Category 3"];
  const locOptions = ["London", "New York", "Tokyo"];

  const Save = () => {
    // Убраны несуществующие переменные, которые вешали кнопку
    console.log({ category, location });
    navigate('/rank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.actsPage}>
        <div className="header">
          <div className={styles.header_cont}>
            <img src={back} alt="back" onClick={() => navigate('/rank')} style={{cursor: 'pointer'}}/>
            <div className="name"><h1>Sorting the leaders</h1></div>
            <img src={notification} alt="notification" onClick={() => navigate('/notification')} style={{cursor: 'pointer'}}/>
          </div>
        </div>

        <div className={styles.dropparent}>
          {/* Category Dropdown */}
          <div className={styles.dropdownContainer}>
            <p className={styles.title}>Category</p>
            <div className={styles.dropdownHeader} onClick={() => setIsCatOpen(!isCatOpen)}>
              <span>{category}</span>
              <svg className={`${styles.arrowIcon} ${isCatOpen ? styles.rotate : ""}`} width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isCatOpen && (
              <div className={styles.dropdownList}>
                {catOptions.map((opt) => (
                  <div key={opt} className={styles.dropdownItem} onClick={() => { setCategory(opt); setIsCatOpen(false); }}>{opt}</div>
                ))}
              </div>
            )}
          </div>

          {/* Location Dropdown */}
          <div className={styles.dropdownContainer}>
            <p className={styles.title}>Location</p>
            <div className={styles.dropdownHeader} onClick={() => setIsLocOpen(!isLocOpen)}>
              <span>{location}</span>
              <svg className={`${styles.arrowIcon} ${isLocOpen ? styles.rotate : ""}`} width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isLocOpen && (
              <div className={styles.dropdownList}>
                {locOptions.map((opt) => (
                  <div key={opt} className={styles.dropdownItem} onClick={() => { setLocation(opt); setIsLocOpen(false); }}>{opt}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
{/* Save Button */}
                <div className={styles.item}>
                  <div className={styles.btncont}>
                    <button 
                      className={styles.active} 
                      style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: '20px' }}
                      onClick={() => Save()}
                    >
                      Save
                    </button>
                  </div>
                </div>
    </div>
  );
}
