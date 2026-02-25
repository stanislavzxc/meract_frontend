import { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import back from '../../images/arrow-left.png';
import logo from '../../images/user.png';
import trash from '../../images/trash.png';
import styles from './Notifications.module.css';

const accept = () => {
    console.log('Accepted');
}

const reject = () => {
    console.log('Rejected');
}

const NotificationCard = ({ card, isExpanded, onToggle, onDelete, canSwipe }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-60, -20], [1, 0]);

  useLayoutEffect(() => {
    if (canSwipe && textRef.current) {
      const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsOverflowing(hasOverflow);
    }
  }, [card.desc, canSwipe]);

  const cardContent = (
    <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      {/* Верхняя часть: Лого, Имя, Время и Текст */}
      <div style={{ display: 'flex', width: '100%' }}>
        <div className={styles.rankBadge}>
          <img src={logo} className={styles.rankImg} alt="user" />
        </div>
        <div className={styles.cardInfo} style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className={styles.userName}>{card.user}</p>
            <p style={{ color: 'gray', fontSize: 'smaller' }}>{card.time}</p>
          </div>
          <p
            ref={textRef}
            style={{
              color: 'white',
              display: !canSwipe ? 'block' : '-webkit-box',
              WebkitLineClamp: !canSwipe || isExpanded ? 'unset' : '1',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
              marginRight: '10px'
            }}
          >
            {card.desc}
          </p>
        </div>

        {/* Стрелка только для Notifications */}
        {canSwipe && (isOverflowing || isExpanded) && (
          <svg
            className={styles.arrowIcon}
            onClick={(e) => { e.stopPropagation(); onToggle(card.id); }}
            style={{
              cursor: 'pointer',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              minWidth: '24px',
              alignSelf: 'center'
            }}
            viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        )}
      </div>

      {/* Кнопки только для Invitations (когда canSwipe = false) */}
      {!canSwipe && (
        <div className={styles.btncont} style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
          <button style={{ flex: 1 }} onClick={reject}>
            Reject
          </button>
          <button className={styles.active} style={{ flex: 1 }} onClick={accept}>
            Accept
          </button>
        </div>
      )}
    </div>
  );

  if (!canSwipe) return <div style={{ marginBottom: '10px' }}>{cardContent}</div>;

  return (
    <div className={styles.swipeWrapper} style={{ position: 'relative', marginBottom: '10px' }}>
      <motion.div
        style={{ position: 'absolute', right: '20px', top: '50%', y: '-50%', opacity, zIndex: 1, cursor: 'pointer' }}
        onClick={() => onDelete(card.id)}
      >
        <img src={trash} alt="delete" style={{ width: '24px', height: '24px' }} />
      </motion.div>
      <motion.div
        drag="x"
        style={{ x, zIndex: 2, position: 'relative' }}
        dragConstraints={{ left: -70, right: 0 }}
        dragElastic={0.05}
      >
        {cardContent}
      </motion.div>
    </div>
  );
};

const Notifications = () => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(0); 
  const [expandedCards, setExpandedCards] = useState([]);

  const [notifications, setNotifications] = useState([
    { id: 1, user: 'pavel', desc: 'sadfasdfasdfasdfsadfasdfasdfasdfasdfasdfasd', time: '16:00' },
  ]);

  const [invitations, setInvitations] = useState([
    { id: 101, user: 'alex', desc: 'asdafsdfasdfasdfasdfa"', time: '14:30' },
  ]);

  const toggleExpand = (id) => {
    setExpandedCards(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteCard = (id) => {
    setNotifications(prev => prev.filter(c => c.id !== id));
  };

  const currentData = nav === 0 ? notifications : invitations;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_cont}>
          <img src={back} alt="back" onClick={() => navigate('/acts')} style={{ cursor: 'pointer' }} />
          <div className={styles.name}>
            <h1>{nav === 0 ? "Notifications" : "Invitations"}</h1>
          </div>
          <div style={{ width: '24px' }}></div>
        </div>

        <div className={styles.btncont}>
          <button className={nav === 0 ? styles.active : ""} onClick={() => setNav(0)}>
            Notifications
          </button>
          <button className={nav === 1 ? styles.active : ""} onClick={() => setNav(1)}>
            Invitations
          </button>
        </div>
      </div>

      <div className={styles.cardcont}>
        <AnimatePresence mode="wait">
          {currentData.length > 0 ? (
            <motion.div
              key={nav}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentData.map((card) => (
                <NotificationCard 
                  key={card.id}
                  card={card}
                  isExpanded={expandedCards.includes(card.id)}
                  onToggle={toggleExpand}
                  onDelete={deleteCard}
                  canSwipe={nav === 0}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', color: 'whitesmoke' }}
            >
              <p>No {nav === 0 ? 'notifications' : 'invitations'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
