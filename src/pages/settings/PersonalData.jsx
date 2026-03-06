import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import back from '../../images/arrow-left.png';
import logo from '../../images/discord.png';
import userimg from '../../images/icon1.png';
import changeIcon from '../../images/change.png'; 
import styles from "./SettingsPage.module.css";
import close from '../../images/Close.png';
import { profileApi } from '../../shared/api/profile';

const PersonalData = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [modalValue, setModalValue] = useState('');

    const [avatar, setAvatar] = useState(null);
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [date, setDate] = useState('');
    const [lang, setLang] = useState([]);
    const [time, setTime] = useState();
    const [location, setLocation] = useState();

        
    useEffect(() => {
    const fetchData = async () => {
        try {
        const data = await profileApi.getProfile();
        console.log(data, 'dataaaa');

        setAvatar(data.avatarUrl);
        setUsername(data.login || "No login"); 
        setFullname(data.fullName || "no name");
        setDate(data.createdAt.split('T')[0]);
        setLang(data.communicationLanguages);
        setTime(data.timeZone)
        setLocation(`${data.country}, ${data.city}`);
        } catch (error) {
        console.error("Ошибка при загрузке:", error);
        }
    };

    fetchData();
    }, []);

    const DeleteLogo = async() =>{
        try {
        await profileApi.deletePhoto();
        await profileApi.updatePhoto(await toBase64(userimg));
        console.log(data, 'dataaaa');

        } catch (error) {
        console.error("Ошибка при загрузке:", error);
        }
    }
   const UpdateLogo = async (fileOrUrl) => {
    try {
        let fileToUpload;

        if (fileOrUrl instanceof File) {
            // Если это уже файл из инпута — используем его напрямую
            fileToUpload = fileOrUrl;
        } else {
            // Если это URL, его нужно сначала скачать и превратить в Blob/File
            // Но чаще всего из инпута приходит именно File
            const response = await fetch(fileOrUrl);
            const blob = await response.blob();
            fileToUpload = new File([blob], "avatar.jpg", { type: blob.type });
        }

        // ПЕРЕДАЕМ САМ ФАЙЛ, А НЕ BASE64
        const response = await profileApi.updatePhoto(fileToUpload);
        
        console.log('Фото успешно обновлено:', response);
    } catch (error) {
        console.error("Ошибка при сохранении фото:", error);
    }
};

    
    const toBase64 = (url) => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    }));

    const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setAvatar(imageUrl);

        await UpdateLogo(file); 
    }
};


    const triggerChange = () => fileInputRef.current.click();
    const handleDelete = async () => {
        setAvatar(userimg);
        await DeleteLogo();
    } 

    const openModal = (type) => {
    setModalType(type);
    setModalValue(type === 'Full name' ? fullname : username);
    setIsModalOpen(true);
};


    const closeModal = () => setIsModalOpen(false);
    const handleSave = async () => {
    try {
        if (modalType === 'Name') {
            await profileApi.updateFullname(modalValue);
            setFullname(modalValue); 
        } else if (modalType === 'Username') {
            await profileApi.updateUsername(modalValue); 
            setUsername(modalValue); 
        }
        closeModal();
    } catch (error) {
        console.error("Ошибка при сохранении:", error);
    }
};

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
                <h3 className={styles.modalTitle}>Edit {modalType}</h3>
                <img src={close} alt="close" onClick={closeModal} style={{cursor: 'pointer'}}/>
            </div>
            <input 
                type="text" 
                className={styles.modalInput} 
                value={modalValue} 
                onChange={(e) => setModalValue(e.target.value)}
                placeholder={`Enter new ${modalType}`}
            />
            <div className={styles.modalButtons}>
                <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button className={styles.active} onClick={handleSave}>Save</button>
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
                <div className={styles.cardcont} onClick={() => {
                    navigate(`/settings/lang`);
                    }}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.userName}>
                                Language: {lang && lang.length > 0 ? lang.join(', ') : 'Not selected'}
                            </p>

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
                <div className={styles.cardcont} onClick={() => navigate(`/settings/time/${time}`)}>
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
