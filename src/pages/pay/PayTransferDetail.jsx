import React, { useState } from 'react';
import styles from "./PayPage.module.css";
import back from '../../images/arrow-left.png';
import userimg from '../../images/user.png';
import point from '../../images/Echo.png';

import { useNavigate, useParams } from 'react-router-dom';

const PayTransferDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Состояние для суммы (только целые числа)
    const [amount, setAmount] = useState('');

    // Данные получателя
    const card = { id: 1, user: 'pavel', img: userimg, status: 'online' };

    // Обработчик ввода: разрешает только цифры
    const handleInputChange = (e) => {
        const value = e.target.value;
        // Регулярное выражение /^\d*$/ пропускает только пустую строку или цифры
        if (/^\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleSend = () => {
        if (!amount || parseInt(amount) === 0) {
            console.log('Введите сумму');
            return;
        }
        console.log(`Sending ${amount} Echo to ${card.user} (ID: ${id})`);
        // Здесь логика отправки
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header_cont}>
                <img 
                    src={back} 
                    alt="back" 
                    onClick={() => navigate('/wallet/transfer')} 
                    style={{ cursor: 'pointer' }} 
                />
                <div className="name"><h1>Transfer Echo</h1></div>
                <div style={{ width: '24px' }}></div> {/* Заглушка для центровки */}
            </div>

            {/* Recipient Card */}
            <div className={styles.cardcont}>
                <h3 style={{ color: '#fff', marginBottom: '10px' }}>Recipient</h3>
                <div className={styles.card}>
                    <div className={styles.rankBadge}>
                        <img src={card.img} alt="user" className={styles.rankImg} />
                    </div>

                    <div className={styles.cardInfo}>
                        <p className={styles.userName}>{card.user}</p>
                        <div>
                            {card.status === 'online' ? (
                                <p style={{ color: '#00F300', fontSize: '14px' }}>{card.status}</p>
                            ) : (
                                <p style={{ color: '#adadad', fontSize: '14px' }}>{card.status} hours ago</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Amount Input Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <h3 style={{ color: '#fff' }}>Amount</h3>
                <div className={styles.nav}>
                    <div className={styles.searchWrapper}>
                        <input 
                            type="text" 
                            inputMode="numeric" 
                            placeholder="0" 
                            className={styles.input} 
                            style={{ padding: '15px 15px' }}
                            value={amount}
                            onChange={handleInputChange}
                        />
                        <img 
                            src={point} 
                            alt="currency" 
                            className={styles.filterIcon} 
                        />
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className={styles.savebutton}>
                <button 
                    className={amount > 0 ? styles.active : styles.disabled} 
                    onClick={handleSend}
                    disabled={!amount || amount === '0'}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default PayTransferDetail;
