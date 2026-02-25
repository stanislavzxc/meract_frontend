import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import arrowLeft from '../../../images/arrow-left.png';
import addIcon from '../../../images/add.png'; 
import styles from "./signup.module.css";
import { useSignUp } from "./hooks/useSignUp";

const ModalLayout = ({ title, children, onClose, onSave, saveText = 'Save' }) => (
    <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <h1 className={styles.modalTitle}>{title}</h1>
            </div>
            {children}
            <div className={styles.modalButtons}>
                <button className={styles.active} onClick={onSave}>
                    {saveText}
                </button>
            </div>
        </div>
    </div>
);
export default function SignUp() {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [surname, setSurname] = useState("");
  const [repeat_password, setRepeat] = useState("");
  const [agred, setAgred] = useState(false);
  
  const [step, setStep] = useState(1); 
  
  const [passwordOtp, setPasswordOtp] = useState(['', '', '', '']);
  const passwordInputRefs = useRef([]);

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const { signUp, verify, loading, error, success } = useSignUp();
  const navigate = useNavigate();

  const avatarModules = import.meta.glob('../../../images/icon*.png', { 
    eager: true, 
    import: 'default' 
  });
  let avatars = Object.values(avatarModules);
  avatars = avatars.slice(0,20);
  const isCustomAvatar = selectedAvatar && !avatars.includes(selectedAvatar);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const customUrl = URL.createObjectURL(file);
      setSelectedAvatar(customUrl);
    }
    e.target.value = ""; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repeat_password) {
      alert('Passwords do not match');
      return;
    }
    if (!selectedAvatar) {
      alert('Please choose an avatar');
      return;
    }

    const ok = await signUp(email, password, username, surname, selectedAvatar); 
    if(ok) setStep(2);
  };

  const handleCloseModal = () => {
    setStep(1); 
  };

  const signUpMethod = () => {
    setStep(2); 
  };

  const  vefifycode = async() => {
    console.log('Код из модалки:', passwordOtp.join(''));
     const ok = await verify(passwordOtp.join(''));
     if(ok) setStep(1);  
  };

  const handlePasswordOtpChange = (val, idx) => {
    const newOtp = [...passwordOtp];
    newOtp[idx] = val.slice(-1);
    setPasswordOtp(newOtp);
    if (val && idx < 3) passwordInputRefs.current[idx + 1]?.focus();
  };

  const handlePasswordKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !passwordOtp[idx] && idx > 0) {
      passwordInputRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <div className={styles.container}>
      { step == 1 ?
      <div className={styles.contentWrapper}>
        <div className={styles.backButton} onClick={() => navigate("/login")}>
          <img src={arrowLeft} alt="Back" className={styles.backIcon} />
          <p className={styles.backText}>Back</p>
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>We are glad to see you</h1>
            <p className={styles.subtitle}>To continue, register</p>
          </div>

          <div className={styles.avatarSection}>
            <p className={styles.title} style={{fontSize:'16px',}}>Choose your avatar</p>
            <div className={styles.avatarList}>
              
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileUpload}
              />

              <div 
                className={`${styles.avatarWrapper} ${styles.addButton} ${isCustomAvatar ? styles.activeAvatar : ''}`}
                onClick={() => fileInputRef.current.click()}
              >
                {isCustomAvatar ? (
                  <img src={selectedAvatar} alt="Custom" className={styles.avatarImg} />
                ) : (
                  <img src={addIcon} alt="Add" className={styles.addImg} />
                )}
              </div>
              {avatars.map((src, index) => (
                <div 
                  key={index}
                  className={`${styles.avatarWrapper} ${selectedAvatar === src ? styles.activeAvatar : ''}`}
                  onClick={() => setSelectedAvatar(src)}
                >
                  <img src={src} alt={`Avatar ${index + 1}`} className={styles.avatarImg} />
                </div>
              ))}
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Username"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || success}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Name and surname"
                className={styles.input}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                disabled={loading || success}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Enter your password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Repeat your password"
                className={styles.input}
                value={repeat_password}
                onChange={(e) => setRepeat(e.target.value)}
                disabled={loading || success}
              />
            </div>

            <div className={styles.checkbox_wrapper}>
              <input 
                type="checkbox" 
                id="check" 
                checked={agred} 
                onChange={(e) => setAgred(e.target.checked)}
              />
              <label htmlFor="check">
                I agree to the{" "}
                <span onClick={() => navigate("/termofuse")} className={styles.signupLink}>
                  terms of use
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={loading || !email || !password || success || !agred || !selectedAvatar}
            
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>

            {error && <p className={styles.error}>{error}</p>}
            {success && (
              <p className={styles.successText}>Registration successful!</p>
            )}
          </form>
        </div>
      </div>
      
      : 
      <div className={styles.contentWrapper}>
      <div className={styles.backButton} onClick={() => setStep(1)} style={{zIndex:'99999',}}>
          <img src={arrowLeft} alt="Back" className={styles.backIcon} />
          <p className={styles.backText}>Back</p>
        </div>
        <ModalLayout 
          title="Enter the code" 
          onClose={handleCloseModal} 
          onSave={vefifycode} 
          saveText="Confirm"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', }}>
            <p style={{ color: '#FFFFFFB2' }}>
              Please enter the code that we sent to your email: <span style={{color:'#0093FE'}}>{email}</span>
            </p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'space-between' }}>
              {passwordOtp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => passwordInputRefs.current[idx] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handlePasswordOtpChange(e.target.value, idx)}
                  className={styles.modalInput}
                  style={{ textAlign: 'center', height: '50px',  }}
                  placeholder="0"
                />
              ))}
            </div>
          </div>
        </ModalLayout>
        </div>

      }    

    </div>
  );
}
