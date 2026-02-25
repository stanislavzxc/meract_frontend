import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../../images/arrow-left.png';
import styles from "./SettingsPage.module.css";
import selected from '../../images/yes.png';
import filter from '../../images/add.png'
import search from '../../images/search.png'

const LocationPage = () => {
    const navigate = useNavigate();

    const [selectedLanguages, setSelectedLanguages] = useState({
        1: true 
    });

    const languages = [
        { id: 1, label: '🇺🇸 America', name:'america', },
        { id: 2, label: '🇪🇸 Spain', name:'spain', },
    ];

    const Save = () => {
    // Проверяем, поддерживает ли браузер геопозицию
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    // Запрашиваем доступ
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Успех: координаты получены
            const { latitude, longitude } = position.coords;
            console.log("Latitude:", latitude, "Longitude:", longitude);
            
            // Здесь можно отправить данные на сервер или сохранить в стейт
        },
        (error) => {
            // Ошибка: пользователь отклонил запрос или произошел сбой
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                default:
                    alert("An unknown error occurred.");
                    break;
            }
        },
        {
            enableHighAccuracy: true, // Запрос высокой точности (GPS)
            timeout: 5000,            // Время ожидания 5 секунд
            maximumAge: 0             // Не использовать кэшированные данные
        }
    );
};

    

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                    <div className={styles.header_cont}>
                      <img 
                        src={back} 
                        alt="menu" 
                        onClick={() => navigate('/settings/profile')}
                        style={{ cursor: 'pointer' }} 
                      />
                      <div className={styles.name}>
                        <div className="name"><h1>Location</h1></div>
                      </div>
                      <div></div>
                    </div>
                     <div >
                        
                      </div>
                    <div className={styles.nav}>
                      <div className={styles.searchWrapper}>
                        <img src={search} alt="search" className={styles.searchIcon} />
                        <input type="text" placeholder="Search" className={styles.input} />
                        <img 
                          src={filter} 
                          alt="filter" 
                          className={styles.filterIcon} 
                          onClick={() => navigate('/chat-create')} 
                        />
                      </div>
                    </div>
                  </div>

            <div className={styles.cardwrapmain}>
                {languages.map((item) => (
                    <div 
                        key={item.id} 
                        className={styles.cardcont} 
                        onClick={() => navigate(`/settings/location/${item.name}`)}
                    >
                        <div className={styles.card}>
                            <div className={styles.cardInfo}>
                                <p className={styles.userName}>{item.label}</p>
                            </div>
                            
                            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                       <polyline points="9 18 15 12 9 6"></polyline>
                                                   </svg>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.savebutton}>
                            <button className={styles.active} onClick={Save}>Allow access to geodata</button>
                        </div>
        </div>  
    );
};

export default LocationPage;
