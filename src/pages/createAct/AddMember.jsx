import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatApi } from "../../shared/api/chat";
import styles from "../pay/PayPage.module.css";
import back from '../../images/arrow-left.png';
import search from '../../images/search.png';
import userimg from '../../images/user.png';


const AddMember = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const [cards, setCard] = useState([]);
    useEffect(() => {
                  const fetchTransaction = async () => {
                      try {
                          const data = await chatApi.getAll();
                          const filterdata = data.filter(card => card.type == 'direct');
                          setCard(filterdata);
                          console.log(data)
                      } catch (error) {
                          console.error("err:", error);
                      } 
                  };
                  fetchTransaction();
    }, []);

const handleConfirm = (selectedMember) => {
    navigate('/team', { 
      state: { 
        selectedMember: {
          id: selectedMember.partner.id,
          name: selectedMember.partner.login,
          imageUrl: selectedMember.partner.avatarUrl,
          type: type
        }
      }
    });
}; 
    return(
           <div className={styles.container}>
                   <div className={styles.header_cont}>
                                       <img src={back} alt="back" onClick={() => navigate('/team')} style={{ cursor: 'pointer' }} />
                                       <div className="name"><h1>Select user</h1></div>
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
           {cards.length > 0 ?
                       <>
                           {cards.map((card, index) => (
                             <div 
                               key={card.id} 
                               className={styles.card} 
                               onClick={() => handleConfirm(card)}
                   >
                               <div className={styles.rankBadge}>
                                 <img src={card.imageUrl || userimg} alt="no avatar" className={styles.rankImg} style={{color:'white', fontSize:'small',}}/>
                               </div>
                   
                               <div className={styles.cardInfo}>
                                 <p className={styles.userName}>{card.name || 'no name'}</p>
                                 <div >
                                   {/* { card.status == 'online' ?
           
                                    <p style={{color: '#00F300'}}>{card.status}</p>
                                    :
                                   <p style={{color:'rgb(173, 173, 173)'}}>{card.status} hours ago</p>
                                   } */}
           
                                 </div>
                               </div>
                   
                              
                             </div>
                           ))}
                       </>
                       : <p style={{color:'white', margin:'auto', textAlign:'center',}}>No contacts</p> 
           
           }
           
                   </div>
               </div>
    )
}
export default AddMember;