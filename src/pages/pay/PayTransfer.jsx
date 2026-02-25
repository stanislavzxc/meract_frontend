import styles from "./PayPage.module.css";
import back from '../../images/arrow-left.png';
import search from '../../images/search.png'
import userimg from '../../images/user.png'

import { useNavigate } from 'react-router-dom';
const PayTransfer = () => {
    const navigate = useNavigate();
     const cards = [
    { id: 1, user: 'pavel', img:userimg, status:'online', },
    { id: 2, user: 'pavel', img:userimg,status:'2', },
  ];
   return(
    <div className={styles.container}>
        <div className={styles.header_cont}>
                            <img src={back} alt="back" onClick={() => navigate('/wallet')} style={{ cursor: 'pointer' }} />
                            <div className="name"><h1>Transfer Echo</h1></div>
                            <div></div>
        </div>
        <div className={styles.nav}>
                  <div className={styles.searchWrapper}>
                    <img src={search} alt="search" className={styles.searchIcon} />
                    <input type="text" placeholder="Enter username" className={styles.input} />
                  </div>
        </div>
        <div className={styles.cardcont}>
            <p style={{color:'rgb(173, 173, 173)',}}>Your contacts</p>
                {cards.map((card, index) => (
                  <div 
                    key={card.id} 
                    className={styles.card} 
                    onClick={() => navigate(`/wallet/transfer/${card.id}`)}
        >
                    <div className={styles.rankBadge}>
                      <img src={card.img} alt="rank" className={styles.rankImg} />
                    </div>
        
                    <div className={styles.cardInfo}>
                      <p className={styles.userName}>{card.user}</p>
                      <div >
                        { card.status == 'online' ?

                         <p style={{color: '#00F300'}}>{card.status}</p>
                         :
                        <p style={{color:'rgb(173, 173, 173)'}}>{card.status} hours ago</p>
                        }

                      </div>
                    </div>
        
                   
                  </div>
                ))}
              </div>
    </div>
   ) 
}
export default PayTransfer;