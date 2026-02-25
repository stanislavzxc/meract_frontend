import notification from '../../images/notification.png'
import styles from "./PayPage.module.css";
import back from '../../images/arrow-left.png';
import point from '../../images/Echo.png';
import { useNavigate } from 'react-router-dom';

const PayPage = () => {
    const navigate = useNavigate();
    const balance = 1000;
    
    const cards = [
        { id: 1, type: 'Purchase Echo', desc: 'meract shop', value: 1000, date: '25/02/26' },
        { id: 2, type: 'Purchase Echo', desc: 'meract shop', value: 1000, date: '25/02/26' },
        { id: 3, type: 'Purchase Echo', desc: 'meract shop', value: 1000, date: '20/02/26' },
    ];

    // 1. Группировка данных по дате
    const groupedCards = cards.reduce((acc, card) => {
        if (!acc[card.date]) {
            acc[card.date] = [];
        }
        acc[card.date].push(card);
        return acc;
    }, {});


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_cont}>
                    <img 
                        src={back} 
                        alt="back" 
                        onClick={() => navigate('/acts')} 
                        style={{ cursor: 'pointer' }} 
                    />
                    <div className={styles.name}>
                        <div className="name"><h1>Wallet</h1></div>
                    </div>
                    <img src={notification} alt="notifications" onClick={() => navigate('/notifications')}/>
                </div>
            </div>

            <div className={styles.card} style={{flexDirection:'column', gap:'20px', alignItems:"flex-start",}}>
                <div style={{display: 'flex', flexDirection:'column', gap:'5px',}}>
                    <p style={{color:'#FFFFFF66',}}>Balance</p>
                    <div style={{display:'flex', gap:'5px',}}>
                        <img src={point} alt="" />
                        <h1 style={{color:'white',}}>{balance}</h1>
                    </div>
                </div>
                <div className={styles.btncont}>
                    <button className={styles.active} onClick={() => navigate('/wallet/shop')}>Buy</button>
                    <button onClick={() => navigate('/wallet/transfer')}>Transfer</button>
                </div>
            </div>

            <div className={styles.parent}>
                <p style={{color:'white', fontWeight:'500', fontSize:'21px', marginBottom: '15px'}}>
                    Transaction history
                </p>

                {/* 2. Рендеринг групп по датам */}
                {Object.keys(groupedCards).map((date) => (
                    <div key={date} className={styles.dateGroup}>
                        <p style={{ color: '#bbbbbb', fontSize: '14px', margin: '10px 0' }}>{date}</p>
                        
                        {groupedCards[date].map((item) => (
                            <div key={item.id} 
                            className={styles.card}
                             style={{ marginBottom: '10px' }}
                        onClick={() => navigate(`/wallet/${item.id}`)} 

                             >
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center',  }}
                                
                                >
                                    <div style={{display:'flex', flexDirection:'column', gap:'5px',}}>
                                        <p style={{ color: 'white', margin: 0 }}>{item.type}</p>
                                        <p style={{ color: '#FFFFFF66', fontSize: '14px', margin: 0 }}>{item.desc}</p>
                                    </div>
                                    <div className={styles.flex}>
                                        <p style={{ color: '#00F300', fontWeight: 'bold', marginTop:'2px', }}>+{item.value}</p>
                                        <img src={point} alt="" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div> 
    );
}

export default PayPage;
