import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../shared/stores/authStore";
import styles from "./ChatPage.module.css";
import notification from '../../images/notification.png';
import filter from '../../images/add.png';
import search from '../../images/search.png';
import back from '../../images/menu.png';
import Menu from '../Menu/Menu.jsx';
import NavBar from "../../shared/ui/NavBar/NavBar";
import userimg from '../../images/user.png';
import { chatApi } from "../../shared/api/chat.js";

const getPreviewText = (msg) => {
  if (!msg) return 'No messages';
  if (msg.fileType) {
    switch (msg.fileType) {
      case 'image': return '🖼 Photo';
      case 'video': return '📹 Video';
      case 'audio':
      case 'voice': return '🎤 Voice message';
      default: return '📎 File';
    }
  }
  if (msg.text) {
    const text = msg.text;
    return text.length > 35 ? text.substring(0, 35) + '...' : text;
  }
  return 'No messages';
};

export default function ChatPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await chatApi.getAll();
        setCards(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const filteredChats = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return cards;
    return cards.filter(card => 
      card.name?.toLowerCase().includes(query)
    );
  }, [searchTerm, cards]);

  const toChat = (type, id, userId) => {
    type === 'direct' ? navigate(`/chat/${id}/${userId}`) : navigate(`/acts`);
  };

  return (
    <div className={styles.container}>
      {isOpen && <Menu onClose={() => setIsOpen(false)} />}
      
      <div className={styles.header}>
        <div className={styles.header_cont} style={{ padding: '20px 0px' }}>
          <img 
            src={back} 
            alt="menu" 
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: 'pointer' }} 
          />
          <div className={styles.name}>
            <h1>Chat</h1>
          </div>
          <img src={notification} alt="notifications" onClick={() => navigate('/notifications')} style={{ cursor: 'pointer' }} />
        </div>

        <div className={styles.nav}>
          <div className={styles.searchWrapper}>
            <img src={search} alt="search" className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search" 
              className={styles.input} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img 
              src={filter} 
              alt="filter" 
              className={styles.filterIconnew} 
              onClick={() => navigate('/chat-create')} 
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      <div className={styles.cardcont}>
        {loading ? (
          <h3 style={{ color: 'white', margin: 'auto' }}>Loading...</h3>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((card) => (
            <div 
              key={card.id} 
              className={styles.card} 
              onClick={() => toChat(card.type, card.id, card.partner?.id)}
            >
              <div className={styles.rankBadge}>
                <img src={card.imageUrl || userimg} alt="avatar" className={styles.rankImg} />
              </div>

              <div className={styles.cardInfo}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className={styles.userName}>{card.name}</p>
                  <p style={{ color: 'gray', fontSize: 'smaller' }}>
                    {card.lastMessageAt ? new Date(card.lastMessageAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ 
                    color: '#bbb', 
                    fontSize: '13px', 
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80%'
                  }}>
                    {getPreviewText(card.lastMessage)}
                  </p>
                  {card.unreadCount > 0 && (
                    <span className={styles.unreadBadge}>{card.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <h3 style={{ color: 'white', margin: 'auto' }}>
            {searchTerm ? "No chats found" : "Nothing found"}
          </h3>
        )}
      </div>
      <NavBar />
    </div>
  );
}
