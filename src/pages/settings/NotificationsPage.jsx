import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../../images/arrow-left.png';
import styles from "./SettingsPage.module.css";

const NotificationsPage = () => {
    const navigate = useNavigate();

    const [notifs, setNotifs] = useState({
        all: false,
        progress: false,
        guild: true,
        mentions: false,
        updates: false
    });

    const toggleNotif = (key) => {
        setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const notificationList = [
        { id: 'all', label: 'All notifications' },
        { id: 'progress', label: 'ACT Progress' },
        { id: 'guild', label: 'Guild invitations and approval' },
        { id: 'mentions', label: 'Mentions in chats' },
        { id: 'updates', label: 'Real-time ACT status updates' }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_cont}>
                    <img 
                        src={back} 
                        alt="back" 
                        onClick={() => navigate('/settings')} 
                        className={styles.backBtn}
                    />
                    <div className="name">
                        <h1>Notifications</h1>
                    </div>
                    <div></div>
                </div>
            </div>

            <div className={styles.cardwrapmain}>
                {notificationList.map((item) => (
                    <div 
                        key={item.id} 
                        className={styles.cardcont} 
                        onClick={() => toggleNotif(item.id)}
                    >
                        <div className={styles.card}>
                            <div className={styles.cardInfo}>
                                <p className={styles.userName}>{item.label}</p>
                            </div>
                            
                            <div className={`${styles.switch} ${notifs[item.id] ? styles.switchOn : ''}`}>
                                <div className={styles.toggle}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>  
    );
};

export default NotificationsPage;
