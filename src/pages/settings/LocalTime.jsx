import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../../images/arrow-left.png';
import styles from "./SettingsPage.module.css";
import selected from '../../images/yes.png';

const LocalTime = () => {
    const navigate = useNavigate();

    // Состояние теперь хранит ID только одного выбранного часового пояса
    const [selectedId, setSelectedId] = useState(1);

    const timeZones = [
        { id: 1, label: '12:00' },
        { id: 2, label: '11:00'},
        { id: 3, label: '10:00' },
        { id: 4, label: '9:00'},
        { id: 5, label: '8:00' },
        { id: 6, label: '7:00' },
        { id: 7, label: '6:00' },
        { id: 8, label: '5:00' },
        { id: 9, label: '4:00' },
        { id: 10, label: '3:00' },
        { id: 11, label: '2:00' }

    ];

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_cont}>
                    <img 
                        src={back} 
                        alt="back" 
                        onClick={() => navigate('/settings/profile')} 
                        className={styles.backBtn}
                    />
                    <div className="name">
                        <h1>Local time</h1>
                    </div>
                    <div></div>
                </div>
            </div>

            <div className={styles.cardwrapmain}>
                {timeZones.map((item) => (
                    <div 
                        key={item.id} 
                        className={styles.cardcont} 
                        onClick={() => handleSelect(item.id)}
                    >
                        <div className={styles.card}>
                            <div className={styles.cardInfo}>
                                <p className={styles.userName}>UTC -{item.label}</p>
                            </div>
                            
                            <div className={styles.selectionArea}>
                                {selectedId === item.id && (
                                    <img src={selected} alt="selected" className={styles.selectedIcon} />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>  
    );
};

export default LocalTime;
