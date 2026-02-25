import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import back from '../../images/arrow-left.png';
import logo from '../../images/discord.png';
import userimg from '../../images/user.png';
import changeIcon from '../../images/change.png'; 
import styles from "./SettingsPage.module.css";
import close from '../../images/Close.png';

const PersonalData = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [avatar, setAvatar] = useState(logo);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');

    const username = '@xxxkilla';
    const fullname = 'Anton Kurva';
    const date = '30.11.2025';
    const lang = 'English';
    const location = 'Japan,Tokyo';
    const time = '(GMT+3, MSK)';

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    const triggerChange = () => fileInputRef.current.click();
    const handleDelete = () => setAvatar(userimg);

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={styles.container}>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*" 
            />

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                            <h2 className={styles.modalTitle}>Edit {modalType}</h2>
                            <img src={close} alt="close" onClick={closeModal} style={{cursor: 'pointer'}}/>
                        </div>
                        <input 
                            type="text" 
                            className={styles.modalInput} 
                            placeholder={`Enter new ${modalType}`}
                        />
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                            <button className={styles.active} onClick={closeModal}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.header}>
                <div className={styles.header_cont}>
                    <img 
                        src={back} 
                        alt="back" 
                        onClick={() => navigate('/settings')} 
                        className={styles.backBtn}
                    />
                    <div className="name">
                        <h1>Profile</h1>
                    </div>
                    <img src={changeIcon} alt="notifications" onClick={() => navigate('/notifications')} className={styles.pointer}/>
                </div>
            </div>

            <div className={styles.sectionMargin}>
                <p className={styles.title} style={{fontSize:'18px',}}>Profile photo</p>
                <div className={styles.parent}>
                    <div className={styles.profile}>
                        <img src={avatar} alt="avatar" className={styles.logo} />
                        <div className={styles.btncont}>
                            <button className={styles.active} onClick={triggerChange}>Change</button>
                            <button onClick={handleDelete} style={{ background: '#E74209' }}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.cardwrapmain}>
                <div className={styles.cardcont} onClick={() => openModal('Name')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>First and last name</p>
                            <p className={styles.userName}>{fullname}</p>
                        </div>
                        <p className={styles.changeLink}>Change</p>
                    </div>
                </div>

                <div className={styles.cardcont} onClick={() => openModal('Username')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>Username</p>
                            <p className={styles.userName}>{username}</p>
                        </div>
                        <p className={styles.changeLink}>Change</p>
                    </div>
                </div>

                <div className={styles.cardcont}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>Registration date:</p>
                            <p className={styles.userName}>{date}</p>
                        </div>
                    </div>
                </div>

                {/* Карточка Language */}
                <div className={styles.cardcont} onClick={() => navigate('/settings/lang')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.userName}>Language: {lang}</p>
                        </div>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>

                {/* Карточка Location */}
                <div className={styles.cardcont} onClick={() => navigate('/settings/location')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.userName}>Location: {location}</p>
                        </div>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>

                {/* Карточка Local Time */}
                <div className={styles.cardcont} onClick={() => navigate('/settings/time')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.userName}>Local time: {time}</p>
                        </div>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalData;
