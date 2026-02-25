export const PasswordModal = ({ onClose, email }) => {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
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
            console.log('Password Changed', { currentPassword, newPassword });
            onClose();
        }
    };

    const handleClose = () => {
        setStep(1);
        setOtp(['', '', '', '']);
        setCurrentPassword('');
        setNewPassword('');
        onClose();
    };

    return (
        <ModalLayout 
            title="Change Password" 
            onClose={handleClose} 
            onSave={handleSave}
            saveText={step === 1 ? "Confirm" : "Save"}
        >
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
                                    height: '50px',
                                    width: '50px'
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
    );
};