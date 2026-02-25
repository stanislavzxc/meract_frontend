import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../../images/arrow-left.png';
import styles from "./SettingsPage.module.css";
import selected from '../../images/yes.png';

const LanguageSelection = () => {
    const navigate = useNavigate();

    const [selectedLanguages, setSelectedLanguages] = useState({
        1: true 
    });

    const languages = [
        { id: 1, label: '🇺🇸 English' },
        { id: 2, label: '🇪🇸 Español' },
        { id: 3, label: '🇦🇪 العربية ' },
        { id: 4, label: '🇵🇹 Português' },
        { id: 5, label: '🇫🇷 Français' },
        { id: 6, label: '🇮🇳 Bahasa Indonesia' }
    ];

    const toggleLanguage = (id) => {
        setSelectedLanguages(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
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
                        <h1>Language</h1>
                    </div>
                    <div></div>
                </div>
            </div>

            <div className={styles.cardwrapmain}>
                {languages.map((item) => (
                    <div 
                        key={item.id} 
                        className={styles.cardcont} 
                        onClick={() => toggleLanguage(item.id)}
                    >
                        <div className={styles.card}>
                            <div className={styles.cardInfo}>
                                <p className={styles.userName}>{item.label}</p>
                            </div>
                            
                            <div className={styles.selectionArea}>
                                {selectedLanguages[item.id] && (
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

export default LanguageSelection;
