import notification from '../../images/notification.png';
import styles from "./PayPage.module.css";
import back from '../../images/arrow-left.png';
import candy1 from '../../images/candy1.png';
import candy2 from '../../images/candy2.png';
import candy3 from '../../images/candy3.png';
import candy4 from '../../images/candy4.png';

import { useNavigate } from 'react-router-dom';

const PayStore = () => {
    const navigate = useNavigate();

    // Данные для карточек
    const products = [
        { id: 1, title: '50', price: '8.99', img: candy1, discount:'', },
        { id: 2, title: '250', price: '38.99', img: candy2, discount:'10',},
        { id: 3, title: '500', price: '88.99', img: candy3, discount:'40',},
        { id: 4, title: '1500', price: '180.99', img: candy4,discount:'60',},
    ];
    products[2].btnStyle = styles.active;
    products[3].btnStyle = styles.most;
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_cont}>
                    <img src={back} alt="back" onClick={() => navigate('/wallet')} style={{ cursor: 'pointer' }} />
                    <div className="name"><h1>Meract shop</h1></div>
                    <img src={notification} alt="notifications" onClick={() => navigate('/notifications')} />
                </div>
            </div>

            {/* Сетка магазина */}
            <div className={styles.storeGrid}>
                {products.map((product) => (
                    <div 
                    key={product.id} 
                    className={`${styles.storeCard} ${product.id === 4 ? styles.mostcard : ''}`}
                    >
                        {product.id !== 1 && (
    <div 
        className={styles.discount} 
        style={{
            background: product.id === 4 ? '#009DFF' : '' 
        }}
    >
        <p>-{product.discount}%</p>
    </div>
)}

                        <div className={styles.productImage}>
                           <img src={product.img} alt="" />
                        </div>
                        <div className={styles.productInfo}>
                            <div style={{padding:'0px 0px 10px 0px', display:'flex', flexDirection:'column', gap:'5px',}}>
                            <p className={styles.productTitle}>{product.title} ECHO</p>
                            <p className={styles.productPrice}>{product.price}$</p>
                            </div>
                        <div className={styles.btncont}>
                            <button className={product.btnStyle || styles.button} onClick={() => navigate('/wallet/shop')}>Buy</button>
                        </div>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PayStore;
