import notification from '../../images/notification.png';
import styles from "./PayPage.module.css";
import back from '../../images/arrow-left.png';
import zxc from '../../images/newpoint.png';

import copyIcon from '../../images/copy.png'; 
import { useNavigate, useParams } from 'react-router-dom';

const PayDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const balance = 1000;

    const item = { 
        id: id || 'TX123456789', 
        type: 'Purchase Echo', 
        desc: 'meract shop', 
        value: 1000, 
        date: '25/02/26 14:30', 
        status: 'success', 
        sender: 'xxxkilla' 
    };
const handleCopy = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => alert('Copied!'))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
};

const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed', err);
    }
    
    document.body.removeChild(textArea);
};

    const details = [
        { label: 'Status:', value: item.status, isStatus: true },
        { label: 'Date & time:', value: item.date },
        { label: 'Transaction ID:', value: item.id, isCopyable: true }, // Добавили флаг
        { label: 'Type:', value: item.type },
        { label: 'Sender:', value: item.sender },
    ];

    return (
        <div className={styles.container}>
            {/* Шапка и баланс без изменений */}
            <div className={styles.header}>
                <div className={styles.header_cont}>
                    <img src={back} alt="back" onClick={() => navigate('/wallet')} style={{ cursor: 'pointer' }} />
                    <div className={styles.name}><h1>Transaction</h1></div>
                    <img src={notification} alt="notifications" onClick={() => navigate('/notifications')} />
                </div>
            </div>
        <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', gap:'20px',}}>
            <div className={styles.pointwrap}>
                <img src={zxc} alt="" style={{width:'60px',}}/>
            </div>
        <h1 style={{ color: '#00F300', fontWeight: 'bold', marginTop:'2px', }}>+{item.value}</h1>

        </div>

            {/* Список деталей */}
            <div className={styles.parent} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {details.map((detail, index) => (
                    <div 
                        key={index} 
                        className={styles.card} 
                        style={{ 
                            background: 'rgba(28, 28, 28, 0.74)', 
                            border: '1px solid #FFFFFF0D',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            minHeight: '66px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        <p className={styles.cardname} style={{ margin: 0 }}>{detail.label}</p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {detail.isStatus ? (
                                <div className={item.status === 'success' ? styles.succes : styles.fail}>
                                    <p style={{ margin: 0 }}>{detail.value}</p>
                                </div>
                            ) : (
                                <div className={styles.itemcard} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <p style={{ margin: 0, color: 'white' }}>{detail.value}</p>
                                    {/* Если есть флаг копирования — рисуем иконку */}
                                    {detail.isCopyable && (
                                        <img 
                                            src={copyIcon} 
                                            alt="copy" 
                                            onClick={() => handleCopy(detail.value)}
                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PayDetail;
