import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../../images/arrow-left.png';
import close from '../../images/Close.png';
import styles from "./SettingsPage.module.css";

// 1. ПРАВИЛЬНЫЙ LAYOUT (принимает onSave и saveText)
const ModalLayout = ({ title, children, onClose, onSave, saveText }) => (
    <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <img src={close} alt="close" onClick={onClose} style={{ cursor: 'pointer', width: '20px' }} />
            </div>
            {children}
            <div className={styles.modalButtons}>
                <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button className={styles.active} onClick={onSave}>
                    {saveText || 'Save'}
                </button>
            </div>
        </div>
    </div>
);
