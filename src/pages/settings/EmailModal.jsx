// EmailModal.jsx
import React, { useState, useRef } from 'react';
import styles from "./SettingsPage.module.css";

export const EmailModal = ({ onClose, onSave, email }) => {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newEmail, setNewEmail] = useState('');
    const inputRefs = useRef([]);

    const handleOtpChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSave = () => {
        if (step === 1) {
            if (otp.join('').length === 4) {
                setStep(2);
            } else {
                alert("Please enter 4-digit code");
            }
        } else {
            onSave(newEmail);
            onClose();
        }
    };

    const handleClose = () => {
        setStep(1);
        setOtp(['', '', '', '']);
        setNewEmail('');
        onClose();
    };

    return (
        <>
            {step === 1 ? (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '15px',
                    marginBottom: '20px' 
                }}>
                    <p style={{ textAlign: 'flex-start', color: '#FFFFFFB2' }}>
                        Please enter the code that we sent to your email: <span style={{color:'#0093FE'}}>{email}</span>
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        justifyContent: 'space-between'
                    }}>
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={el => inputRefs.current[idx] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                className={styles.modalInput}
                                placeholder='0'
                                style={{ 
                                    textAlign: 'center', 
                                    height: '50px' 
                                }}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <input 
                    type="email" 
                    className={styles.modalInput} 
                    placeholder="Enter new email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    autoFocus 
                    style={{ marginBottom: '20px' }}
                />
            )}
        </>
    );
};