import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../../images/arrow-left.png';
import close from '../../images/Close.png';
import styles from "./SettingsPage.module.css";
import copy from '../../images/copy.png';
// ЕДИНСТВЕННЫЙ ModalLayout для всех модалок
const ModalLayout = ({ title, children, onClose, onSave, saveText = 'Save' }) => (
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
                    {saveText}
                </button>
            </div>
        </div>
    </div>
);

const SecurityPage = () => {
    const navigate = useNavigate();
    
    // Основные данные
    const [email] = useState('killa@example.com');
    const [password] = useState('************');
    const [phone] = useState('+7999999999');
    const [googleStatus] = useState('not connected');
    const [activeModal, setActiveModal] = useState(null);
    const [notifs, setNotifs] = useState({ 1: true, 2: true, 3: true });
    
    // Состояния для Email модалки
    const [emailStep, setEmailStep] = useState(1);
    const [emailOtp, setEmailOtp] = useState(['', '', '', '']);
    const [newEmail, setNewEmail] = useState('');
    const emailInputRefs = useRef([]);

    // Состояния для Password модалки
    const [passwordStep, setPasswordStep] = useState(1);
    const [passwordOtp, setPasswordOtp] = useState(['', '', '', '']);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const passwordInputRefs = useRef([]);

    // Состояния для Phone модалки (3 шага)
    const [phoneStep, setPhoneStep] = useState(1);
    const [phoneOtp, setPhoneOtp] = useState(['', '', '', '']); // для старого номера
    const [phoneOtp2, setPhoneOtp2] = useState(['', '', '', '']); // для нового номера
    const [newPhone, setNewPhone] = useState('');
    const phoneInputRefs = useRef([]);
    const phoneInputRefs2 = useRef([]);

    // Состояния для Auth модалки (Google Authenticator)
        const [authStep, setAuthStep] = useState(1);
        const [authOtp, setAuthOtp] = useState(['', '', '', '', '', '']); // 6 цифр
        const authInputRefs = useRef([]);
        const code = '634054tlfr./gRDGHDFGy';
    // Обработчики для второго OTP (новый номер)
    const handlePhoneOtp2Change = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...phoneOtp2];
        newOtp[index] = value.substring(value.length - 1);
        setPhoneOtp2(newOtp);
        if (value && index < 3) {
            phoneInputRefs2.current[index + 1]?.focus();
        }
    };
   const copyText = () => {
  // Проверяем поддержку clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
    //   alert('Code copied to clipboard!');
    }).catch(err => {
      console.error('Ошибка копирования:', err);
      fallbackCopy();
    });
  } else {
    fallbackCopy();
  }
};

// Запасной метод копирования
const fallbackCopy = () => {
  const textarea = document.createElement('textarea');
  textarea.value = code;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  
  try {
    document.execCommand('copy');
    // alert('Code copied to clipboard!');
  } catch (err) {
    console.error('Fallback: Ошибка копирования', err);
    // alert('Failed to copy code');
  }
  
  document.body.removeChild(textarea);
};
    const handlePhoneKeyDown2 = (e, index) => {
        if (e.key === 'Backspace' && !phoneOtp2[index] && index > 0) {
            phoneInputRefs2.current[index - 1]?.focus();
        }
    };


    const toggleNotif = (id) => {
        setNotifs(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Обработчики для Email OTP
    const handleEmailOtpChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...emailOtp];
        newOtp[index] = value.substring(value.length - 1);
        setEmailOtp(newOtp);
        if (value && index < 3) {
            emailInputRefs.current[index + 1]?.focus();
        }
    };

    const handleEmailKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
            emailInputRefs.current[index - 1]?.focus();
        }
    };

   

    const handlePasswordKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !passwordOtp[index] && index > 0) {
            passwordInputRefs.current[index - 1]?.focus();
        }
    };

    // Обработчики для Phone OTP
    const handlePhoneOtpChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...phoneOtp];
        newOtp[index] = value.substring(value.length - 1);
        setPhoneOtp(newOtp);
        if (value && index < 3) {
            phoneInputRefs.current[index + 1]?.focus();
        }
    };

    const handlePhoneKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !phoneOtp[index] && index > 0) {
            phoneInputRefs.current[index - 1]?.focus();
        }
    };

    const handleEmailSave = () => {
        if (emailStep === 1) {
            if (emailOtp.join('').length === 4) {
                setEmailStep(2);
            } else {
                alert("Please enter 4-digit code");
            }
        } else {
            console.log('New Email Saved:', newEmail);
            handleCloseModal();
        }
    };

    const handlePasswordSave = () => {
        if (passwordStep === 1) {
            if (passwordOtp.join('').length === 4) {
                setPasswordStep(2);
            } else {
                alert("Please enter 4-digit code");
            }
        } else {
            console.log('Password Changed', { currentPassword, newPassword });
            handleCloseModal();
        }
    };

    const handlePhoneSave = () => {
    if (phoneStep === 1) {
        if (phoneOtp.join('').length === 4) {
            setPhoneStep(2);
            setPhoneOtp(['', '', '', '']); // очищаем первый OTP
        } else {
            alert("Please enter 4-digit code from your old phone");
        }
    } else if (phoneStep === 2) {
        if (newPhone.length >= 10) {
            setPhoneStep(3);
        } else {
            alert("Please enter a valid phone number");
        }
    } else if (phoneStep === 3) {
        if (phoneOtp2.join('').length === 4) {
            console.log('Phone changed to:', newPhone);
            handleCloseModal();
        } else {
            alert("Please enter 4-digit code from your new phone");
        }
    }
};
// Обработчики для Password OTP
const handlePasswordOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...passwordOtp];
    newOtp[index] = value.substring(value.length - 1);
    setPasswordOtp(newOtp);
    if (value && index < 3) {
        passwordInputRefs.current[index + 1]?.focus();
    }
};
   const handleAuthSave = () => {
    if (authStep === 1) {
        // Переходим к вводу кода
        setAuthStep(2);
    } else {
        if (authOtp.join('').length === 6) {
            console.log('Google Authenticator Connected with code:', authOtp.join(''));
            handleCloseModal();
        } else {
            alert("Please enter 6-digit code from Google Authenticator");
        }
    }
};
    

   const handleCloseModal = () => {
    setActiveModal(null);
    // Сбрасываем email состояния
    setEmailStep(1);
    setEmailOtp(['', '', '', '']);
    setNewEmail('');
    // Сбрасываем password состояния
    setPasswordStep(1);
    setPasswordOtp(['', '', '', '']);
    setCurrentPassword('');
    setNewPassword('');
    // Сбрасываем phone состояния
    setPhoneStep(1);
    setPhoneOtp(['', '', '', '']);
    setPhoneOtp2(['', '', '', '']);
    setNewPhone('');
    // Сбрасываем auth состояния
    setAuthStep(1);
    setAuthOtp(['', '', '', '', '', '']);
};

    const notificationList = [
        { id: 1, label: 'All' },
        { id: 2, label: 'Users of joint acts' },
        { id: 3, label: 'Members of my guild' },
    ];

    return (
        <div className={styles.container}>
            {/* Email модалка */}
            {activeModal === 'email' && (
                <ModalLayout 
                    title="Edit Email" 
                    onClose={handleCloseModal} 
                    onSave={handleEmailSave}
                    saveText={emailStep === 1 ? "Confirm" : "Save"}
                >
                    {emailStep === 1 ? (
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
                                {emailOtp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={el => emailInputRefs.current[idx] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleEmailOtpChange(e.target.value, idx)}
                                        onKeyDown={(e) => handleEmailKeyDown(e, idx)}
                                        className={styles.modalInput}
                                        placeholder='0'
                                        style={{ 
                                            textAlign: 'center', 
                                            height: '50px',
                                            width: '50px'
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
                </ModalLayout>
            )}

            {/* Password модалка с двухшаговой проверкой */}
            {activeModal === 'pass' && (
                <ModalLayout 
                    title="Change Password" 
                    onClose={handleCloseModal} 
                    onSave={handlePasswordSave}
                    saveText={passwordStep === 1 ? "Confirm" : "Save"}
                >
                    {passwordStep === 1 ? (
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
                                {passwordOtp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={el => passwordInputRefs.current[idx] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handlePasswordOtpChange(e.target.value, idx)}
                                        onKeyDown={(e) => handlePasswordKeyDown(e, idx)}
                                        className={styles.modalInput}
                                        placeholder='0'
                                        style={{ 
                                            textAlign: 'center', 
                                            height: '50px',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '20px' }}>
                            <input 
                                type="password" 
                                className={styles.modalInput} 
                                placeholder="Current password" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            />
                            <input 
                                type="password" 
                                className={styles.modalInput} 
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    )}
                </ModalLayout>
            )}

           {/* Phone модалка с двухшаговой проверкой */}
            {activeModal === 'phone' && (
    <ModalLayout 
        title="Changing the phone number" 
        onClose={handleCloseModal} 
        onSave={handlePhoneSave}
        saveText={
            phoneStep === 1 ? "Confirm" : 
            phoneStep === 2 ? "Send Code" : 
            "Save"
        }
    >
        {phoneStep === 1 && (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '20px' 
            }}>
                <p style={{ textAlign: 'flex-start', color: '#FFFFFFB2' }}>
                    Please enter the code that we sent to your old phone: <span style={{color:'#0093FE'}}>{phone}</span>
                </p>
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    justifyContent: 'space-between'
                }}>
                    {phoneOtp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => phoneInputRefs.current[idx] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handlePhoneOtpChange(e.target.value, idx)}
                            onKeyDown={(e) => handlePhoneKeyDown(e, idx)}
                            className={styles.modalInput}
                            placeholder='0'
                            style={{ 
                                textAlign: 'center', 
                                height: '50px',
                            }}
                        />
                    ))}
                </div>
            </div>
        )}

        {phoneStep === 2 && (
            <input 
                type="tel" 
                className={styles.modalInput} 
                placeholder="Enter new phone number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                autoFocus 
                style={{ marginBottom: '20px' }}
            />
        )}

        {phoneStep === 3 && (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '20px' 
            }}>
                <p style={{ textAlign: 'flex-start', color: '#FFFFFFB2' }}>
                    Please enter the code that we sent to your new phone: <span style={{color:'#0093FE'}}>{newPhone}</span>
                </p>
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    justifyContent: 'space-between'
                }}>
                    {phoneOtp2.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => phoneInputRefs2.current[idx] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handlePhoneOtp2Change(e.target.value, idx)}
                            onKeyDown={(e) => handlePhoneKeyDown2(e, idx)}
                            className={styles.modalInput}
                            placeholder='0'
                            style={{ 
                                textAlign: 'center', 
                                height: '50px',
                            }}
                        />
                    ))}
                </div>
            </div>
        )}
    </ModalLayout>
)}
            {/* Google Authenticator модалка с двухшаговой проверкой */}
            {activeModal === 'auth' && (
                <ModalLayout 
                    title="Google Authenticator" 
                    onClose={handleCloseModal} 
                    onSave={handleAuthSave}
                    saveText={authStep === 1 ? "Next" : "Verify"}
                >
                    {authStep === 1 ? (
                        <>
                            <p style={{ color: '#FFFFFFB2', fontSize: '14px', textAlign: 'center', marginBottom: '15px' }}>
                                Scan the QR-code in your Google Authenticator app to connect.
                            </p>
                            <div style={{ 
                                background: '#1E1E1E', 
                                width: '200px', 
                                height: '200px', 
                                margin: '0 auto 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed #0093FE',
                                borderRadius: '10px'
                            }}>
                                <span style={{ color: '#0093FE' }}>QR Code Placeholder</span>
                            </div>
                            <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
                                Scan the code or enter the secret key into your Google Authenticator device
                            </p>
                             <div className={styles.cardcont}>
                                                    <div 
                                                      className={styles.card} 
                                          >
                                               
                                          
                                                      <div className={styles.cardInfo}>
                                                        <p className={styles.subtitle}>code</p>
                                                        <p className={styles.userName}>{code}</p>
                                                      </div>
                                          
                                                      <img 
                                                        className={styles.arrowIcon} 
                                                        src={copy}
                                                        style={{opacity:'1', cursor:'pointer',}}
                                                      onClick={() => copyText()}
                            
                                                      ></img>
                                                    </div>
                                         </div>
                        </>
                    ) : (
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: '20px',
                            marginBottom: '20px' 
                        }}>
                            <p style={{ textAlign: 'center', color: '#FFFFFFB2' }}>
                                Enter the 6-digit code from Google Authenticator
                            </p>
                            <div style={{ 
                                display: 'flex', 
                                gap: '5px', 
                                justifyContent: 'center'
                            }}>
                                {authOtp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={el => authInputRefs.current[idx] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleAuthOtpChange(e.target.value, idx)}
                                        onKeyDown={(e) => handleAuthKeyDown(e, idx)}
                                        className={styles.modalInput}
                                        placeholder='0'
                                        style={{ 
                                            textAlign: 'center', 
                                            height: '50px',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </ModalLayout>
            )}
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.header_cont}>
                    <img src={back} alt="back" onClick={() => navigate('/settings')} className={styles.backBtn} />
                    <div className="name"><h1>Security</h1></div>
                    <div></div>
                </div>
            </div>

            {/* Карточки */}
            <div className={styles.cardwrapmain}>
                <div className={styles.cardcont} onClick={() => setActiveModal('email')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>email</p>
                            <p className={styles.userName}>{email}</p>
                        </div>
                        <p className={styles.changeLink}>Change</p>
                    </div>
                </div>

                <div className={styles.cardcont} onClick={() => setActiveModal('pass')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>password</p>
                            <p className={styles.userName}>{password}</p>
                        </div>
                        <p className={styles.changeLink}>Change</p>
                    </div>
                </div>

                <div className={styles.cardcont} onClick={() => setActiveModal('phone')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>phone number</p>
                            <p className={styles.userName}>{phone}</p>
                        </div>
                        <p className={styles.changeLink}>Change</p>
                    </div>
                </div>

                <div className={styles.cardcont} onClick={() => setActiveModal('auth')}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>Google Authenticator</p>
                            <p className={styles.userName} style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{googleStatus}</p>
                        </div>
                        <p className={styles.changeLink}>Connect</p>
                    </div>
                </div>
            </div>

            {/* Переключатели */}
            <div className={styles.cardwrapmain}>
                <p className={styles.title} style={{ fontSize: '18px' }}>Who can send me messages</p>
                {notificationList.map((item) => (
                    <div key={item.id} className={styles.cardcont} onClick={() => toggleNotif(item.id)}>
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

export default SecurityPage;