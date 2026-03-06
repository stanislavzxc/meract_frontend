import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../shared/api/api";
import { useAuthStore } from "../../shared/stores/authStore";
import styles from "./ChatPage.module.css";

import notification from '../../images/notification.png'
import filter from '../../images/add.png'
import search from '../../images/search.png'
import rang1 from '../../images/rang1.png'
import rang2 from '../../images/rang2.png'
import rang3 from '../../images/rang3.png'
import rang4 from '../../images/rang4.png'
import points from '../../images/points.png'
import back from '../../images/menu.png';
import Menu from '../Menu/Menu.jsx';
import NavBar from "../../shared/ui/NavBar/NavBar";
import userimg from '../../images/user.png';
import { chatApi } from "../../shared/api/chat.js";

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export default function ChatPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  let [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState([]);
// { id: 1, user: 'pavel', desc: 'asdasdad', time:'16:00', },
//     { id: 2, user: 'pavel', desc: 'asdadasdad', time:'16:00', },
 


  useEffect(() => {
    const fetchUserRanks = async () => {
      try {
        const data = await chatApi.getAll();
        console.log(data)
        setCards(data)
      } catch (error) {
        console.error(error);
      } 
    };
    fetchUserRanks();
  }, []);
  const toChat = (type, id, userId) =>{
    type == 'direct' ? navigate(`/chat/${id}/${userId}`) : navigate(`/acts`) 
  }
  return (
    <div className={styles.container}>
         {isOpen && <Menu
      onClose={() => setIsOpen(false)}
    
    />}
      <div className={styles.header}>
        <div className={styles.header_cont}>
          <img 
            src={back} 
            alt="menu" 
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: 'pointer' }} 
          />
          <div className={styles.name}>
            <div className="name"><h1>Chat</h1></div>
          </div>
          <img src={notification} alt="notifications" onClick={() => navigate('/notifications')}/>
        </div>
         <div >
            
          </div>
        <div className={styles.nav}>
          <div className={styles.searchWrapper}>
            <img src={search} alt="search" className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.input} />
            <img 
              src={filter} 
              alt="filter" 
              className={styles.filterIcon} 
              onClick={() => navigate('/chat-create')} 
            />
          </div>
        </div>
      </div>

      <div className={styles.cardcont}>
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className={styles.card} 
            
            onClick={() => toChat(card.type, card.id, card.partner.id)}
>
            <div className={styles.rankBadge}>
              <img src={card.imageUrl || userimg} alt="rank" className={styles.rankImg} />
            </div>

            <div className={styles.cardInfo}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <p className={styles.userName}>{card.name}</p>
                           <p style={{ color: 'gray', fontSize: 'smaller' }}>
                              {new Date(card.lastMessageAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>

                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
                <p style={{color:'#bbb',}}>{card.lastMessage || 'no messages'}</p>
                {card.unreadCount > 0 &&
                  <div className={styles.circle}>{card.unreadCount}</div>
                }
                </div>
            </div>

          </div>
        ))}
      </div>
      <NavBar />
    </div>
  );
}
