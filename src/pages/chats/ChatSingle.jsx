import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ChatPage.module.css';

// Изображения
import back from '../../images/arrow-left.png';
import guildMenu from '../../images/guildmenu.png';
import userimg from '../../images/user.png';
import sendIcon from '../../images/send.png';
import microphone from '../../images/microphone.png';
import trashIcon from '../../images/trash1.png';
import notificationIcon from '../../images/notification.png';
import { chatApi } from '../../shared/api/chat';

const ChatSingle = () => {
  const navigate = useNavigate();
  const { id, userId } = useParams();
  
  const [text, setText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mode, setMode] = useState('send'); 
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [card, setUser] = useState({});

  useEffect(() => {
  const fetchChatData = async () => {
    try {
      const [messagesData, chatInfo] = await Promise.all([
        chatApi.getMessages(id),
        chatApi.getAll(userId)
      ]);
      const profiledata = chatInfo.find(chat => chat.id == id)
      setMessages(messagesData);
      setUser(profiledata.partner); 
      
      console.log('Сообщения:', messagesData);
      console.log('Данные чата:', chatInfo);
    } catch (error) {
      console.error('Ошибка при загрузке данных чата:', error);
    }
  };

  if (id) { 
    fetchChatData();
  }
}, [id]); 


  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);

  
  // Логика отправки сообщения
  const pushMessage = (content) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: content, sender: 'me', time: timeStr },
    ]);
  };

  const sendText = () => {
    if (!text.trim()) return;
    pushMessage(text);
    setText('');
  };

  // Голосовые сообщения
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);
      setIsRecording(true);

      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        pushMessage(`<audio controls src="${url}" style="max-width:200px"></audio>`);
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        setMode('send'); // Возвращаемся в режим текста после отправки
      };

      mediaRecorder.current.start();
    } catch (err) {
      console.error("Доступ к микрофону запрещен", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
    }
  };

  // Обработка нажатий на иконку (send/mic)
  const handleActionDown = () => {
    if (text.trim()) {
      sendText();
    } else if (mode === 'send') {
      setMode('mic');
    } else {
      startRecording();
    }
  };

  const handleActionUp = () => {
    if (mode === 'mic' && isRecording) {
      stopRecording();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header} style={{ borderBottom: '1px solid #FFFFFF0D', paddingBottom: '15px' }}>
        <div className={styles.header_cont}>
          <img 
            src={back} 
            alt="back" 
            onClick={() => navigate('/chats')} 
            style={{ cursor: 'pointer' }} 
          />
          
          {/* Клик по юзеру теперь работает корректно */}
          <div 
            className={styles.userClickArea}
            onClick={() => navigate(`/rank/${id}`)}
          >
            <div className={styles.rankBadge}>
              <img src={card.avatarUrl || userimg} alt="avatar" className={styles.rankImg} />
            </div>
            <div className={styles.cardInfo}>
              <p className={styles.userName}>{card.login}</p>
              <p style={{ color: '#bbb', fontSize: '12px', margin: 0 }}>
                Online {card.time} minutes ago
              </p>
            </div>
          </div>

          <div className={styles.menuContainer}>
            <img 
              src={guildMenu} 
              alt="menu" 
              style={{ cursor: 'pointer' }} 
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }} 
            />
            {isMenuOpen && (
              <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dpopitem}>
                  <img src={notificationIcon} alt="" />
                  <span>Turn off notifications</span>
                </div>
                <div className={styles.dpopitem}>
                  <img src={trashIcon} alt="" />
                  <span>Delete chat</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MESSAGES BODY */}
      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.chatMsg} ${msg.sender === 'me' ? styles.myMessage : styles.companionMessage}`}
          >
            <p className={styles.msgText} dangerouslySetInnerHTML={{ __html: msg.text }} />
            <span className={styles.msgTime}>{msg.time}</span>
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className={styles.inputArea}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Message..."
            className={styles.input}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.trim() && mode === 'mic') setMode('send');
            }}
            onKeyDown={handleKey}
          />
          <img
            src={mode === 'send' ? sendIcon : microphone}
            alt="action"
            className={`${styles.filterIcon} ${isRecording ? styles.recordingActive : ''}`}
            onMouseDown={handleActionDown}
            onMouseUp={handleActionUp}
            onMouseLeave={handleActionUp}
            onTouchStart={handleActionDown}
            onTouchEnd={handleActionUp}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSingle;
