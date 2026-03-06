import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import back from '../../images/arrow-left.png';
import styles from "./SettingsPage.module.css";
import selected from '../../images/yes.png';
import { profileApi } from '../../shared/api/profile';
const LocalTime = () => {
    const navigate = useNavigate();
    const {name} = useParams();
    const [selectedId, setSelectedId] = useState(1);

    const [timeZones, setTimeZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(name || ''); 
    
    useEffect(() => {
        const fetchData = async () => {
            try {
            const data = await profileApi.getTimezone();
            setTimeZones(data.zones);
            console.log(data, 'localllllllll');
    
            } catch (error) {
            console.error("Ошибка при загрузке:", error);
            }
        };
        fetchData();
    }, [])
    const handleSelect = async (zone) => {
    setSelectedZone(zone); 
    try {
        await profileApi.updateTimezone(zone);
    } catch (e) {
        console.error("error:", e);
    }
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
    {timeZones.map((item, index) => (
        <div 
            key={index} 
            className={styles.cardcont} 
            onClick={() => handleSelect(item)} 
        >
            <div className={styles.card}>
                <div className={styles.cardInfo}>
                    <p className={styles.userName}>{item}</p>
                </div>
                
                <div className={styles.selectionArea}>
                    {selectedZone === item && (
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
