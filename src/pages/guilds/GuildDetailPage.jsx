import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import api from "../../shared/api/api";
import { useAuthStore } from "../../shared/stores/authStore";
import styles from "./GuildDetailPage.module.css";

import arrowLeft from '../../images/arrow-left.png';
import guildmenu from '../../images/guildmenu.png';
import iconguild from '../../images/iconguild.png?url'; 
import userimg from '../../images/user.png';
import ActCard from "../acts/components/ActCard";
import exit from '../../images/exit.png';
import about from '../../images/about.png'; 
import notification from '../../images/notification.png'; 
import adduser from '../../images/adduser.png'; 
import guildsetting from '../../images/guildsetting.png';
export default function GuildDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = true;

  const [guild, setGuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [navMethod, setNavMethod] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [selectedToSwap, setSelectedToSwap] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [achivemenets, setAchivemenets] = useState([
    { id: 1, name: 'gold digger', avatar: userimg, description: 'desctiption', isBest: true },
    { id: 2, name: 'platinum', avatar: userimg, description: 'desctiption', isBest: true },
    { id: 3, name: 'digger', avatar: userimg, description: 'desctiption', isBest: false },
    { id: 4, name: 'platina', avatar: userimg, description: 'desctiption', isBest: false },
  ]);

  const descRef = useRef(null);
  const title = 'Name';
  const usersCount = 1000;
  const description = 'The description text goes here...The description text goes here...The description text goes here...The description text goes here...es here...The description text goes here...es here...The description text goes here...';
  const actscount = 1;
  const members = [
    { id: 1, user: 'pavel', avatar: userimg, status: 'online' },
    { id: 2, user: 'alexey', avatar: userimg, status: '2 hours ago' },
  ];

  const [acts, setActs] = useState([
        {
          id: 1,
          title: "Voices in the Crowd",
          description:
            "Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing",
          navigator: "Graphite8",
          heroes: ["Graphite8", "NeonFox", "ShadowWeave", "EchoStorm1"],
          location: "Puerto de la Cruz (ES)",
          distance: "2,500km Away",
          upvotes: 12,
          downvotes: 12,
          liveIn: "2h 15m",
          isMock: true,
          status:'ONLINE',
        },
      ]);
  useEffect(() => {
    if (descRef.current) {
      setIsOverflowing(descRef.current.scrollHeight > 60);
    }
  }, [description, loading]);

  useEffect(() => {
    const fetchGuildDetails = async () => {
      try {
        const response = await api.get(`/guild/${id}`);
        setGuild(response.data);
        const userIsMember = response.data.members?.some(m => m.id === user?.id || m.userId === user?.id) || response.data.ownerId === user?.id;
        setIsMember(userIsMember);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuildDetails();
  }, [id, user?.id]);

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);

  const handleAchiveClick = (clickedAchive) => {
    if (!isAdmin) return;

    if (!selectedToSwap) {
      setSelectedToSwap(clickedAchive);
    } else {
      if (selectedToSwap.id === clickedAchive.id) {
        setSelectedToSwap(null);
        return;
      }

      const updated = achivemenets.map(a => {
        if (a.id === clickedAchive.id) return { ...a, isBest: selectedToSwap.isBest };
        if (a.id === selectedToSwap.id) return { ...a, isBest: clickedAchive.isBest };
        return a;
      });

      setAchivemenets(updated);
      setSelectedToSwap(null);
    }
  };

const join = () => {
  console.log('sent')

}
  const bannerUrl = iconguild;
  const topBannerStyle = {
    backgroundImage: `url(${bannerUrl})`,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '40vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
  };

  return (
    <div className={styles.container}>
      <div style={topBannerStyle} />

      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.backButton} onClick={() => navigate("/guilds")}>
            <img src={arrowLeft} alt="Back" className={styles.backIcon} />
            <p className={styles.backText}>Back</p>
        </div>

        <div className={styles.menuContainer}>
        <img 
          src={guildmenu} 
          alt="Menu" 
          className={styles.menuIcon} 
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }} 
        />
        
        {isMenuOpen && (
          <div 
            className={styles.dropdown} 
            onClick={(e) => e.stopPropagation()} 
          >
            <div className={styles.dpopitem}>
              <img src={notification} alt="" />
              <div className={styles.menuItem}>Turn off notifications</div>
            </div>
            <div className={styles.dpopitem}>
              <img src={adduser} alt="" />
              <div className={styles.menuItem} onClick={() => navigate(`/guild-settings/${id}`)}>Invite member</div>
            </div>
           
            <div className={styles.dpopitem} >
              <img src={about} alt="" />
              <div className={styles.menuItem} onClick={() => navigate(`/guild-about/${id}`)}>About guild</div>
            </div>
            {isAdmin &&
             <div className={styles.dpopitem}>
              <img src={guildsetting} alt="" />
              <div className={styles.menuItem} onClick={() => navigate(`/guild-settings/${id}`)}>Guild settings</div>
            </div>
            }

             <div className={styles.dpopitem}>
              <img src={exit} alt="" />
              <div className={styles.menuItem}>Leave guild</div>
            </div>
          </div>
        )}
        </div>

        </div>


        <div className={styles.card}>
          <div className={styles.head}>
            <img src={iconguild} alt="" className={styles.avatar} />
            <div className={styles.headtext}>
              <h1 className={styles.title}>{guild?.name || title}</h1>
              <div className={styles.usersdiv}>
                <img src={userimg} alt="" />
                <p className={styles.desc} style={{ color: '#c9c8c8' }}>{usersCount}</p>
              </div>
            </div>
          </div>

          <div className={styles.descriptionContainer}>
            <p ref={descRef} className={`${styles.descriptionText} ${!isExpanded ? styles.collapsed : ""}`}>
              {description}
            </p>
            {isOverflowing && (
              <p className={styles.toggleBtn} onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Hide" : "Read it in full"}
              </p>
            )}
          </div>
          <div className={styles.savebutton}>
            <button className={styles.active} onClick={() => join()}>Submit a request</button>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.btncont}>
            <button className={navMethod === 0 ? styles.active : ""} onClick={() => setNavMethod(0)}>Guild Acts</button>
            <button className={navMethod === 1 ? styles.active : ""} onClick={() => setNavMethod(1)}>Members</button>
            <button className={navMethod === 2 ? styles.active : ""} onClick={() => setNavMethod(2)}>Achievements</button>
          </div>
        </div>
        <div className={styles.parentnav}>

        {navMethod === 1 && (
          <div className={styles.cardcont}>
            {members.map((member) => (
              <div key={member.id} className={styles.members}>
                <div className={styles.rankBadge}>
                  <img src={member.avatar} alt="avatar" className={styles.rankImg} />
                </div>
                <div className={styles.cardInfo}>
                  <p className={styles.userName}>{member.user}</p>
                  <p className={styles.userName} style={{ color: member.status === 'online' ? '#00F300' : '#c0c0c0' }}>
                    {member.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {navMethod === 2 && (
          <div className={styles.achivemenets}>
            <div className={styles.cardcontfirst}>
              <p className={styles.title} style={{ fontSize: '18px', margin: '0px' }}>Best achievements</p>
              {achivemenets.filter(a => a.isBest).map((achive) => (
                <div 
                  key={achive.id} 
                  className={`${styles.members} ${selectedToSwap?.id === achive.id ? styles.selected : ""}`} 
                  onClick={() => handleAchiveClick(achive)}
                  style={{
                    transform: selectedToSwap?.id === achive.id ? 'translateY(-8px)' : 'none',
                    transition: 'transform 0.2s ease',
                    border: selectedToSwap?.id === achive.id ? '1px solid #3abafe' : 'none'
                  }}
                >
                  <div className={styles.rankBadge}><img src={achive.avatar} alt="avatar" className={styles.rankImg} /></div>
                  <div className={styles.cardInfo}>
                    <p className={styles.userName}>{achive.name}</p>
                    <p className={styles.userName} style={{ color: '#b5b3b3' }}>{achive.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cardcont} style={{ marginTop: '20px' }}>
              {achivemenets.filter(a => !a.isBest).map((achive) => (
                <div 
                  key={achive.id} 
                  className={`${styles.members} ${selectedToSwap?.id === achive.id ? styles.selected : ""}`} 
                  onClick={() => handleAchiveClick(achive)}
                  style={{
                    transform: selectedToSwap?.id === achive.id ? 'translateY(-8px)' : 'none',
                    transition: 'transform 0.2s ease',
                    border: selectedToSwap?.id === achive.id ? '1px solid #3abafe' : 'none'
                  }}
                >
                  <div className={styles.rankBadge}><img src={achive.avatar} alt="avatar" className={styles.rankImg} /></div>
                  <div className={styles.cardInfo}>
                    <p className={styles.userName}>{achive.name}</p>
                    <p className={styles.userName} style={{ color: '#b5b3b3' }}>{achive.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {navMethod === 0 && (
          <div className={styles.cardcont}>
            <p className={styles.subtitle} style={{color:'#979595',}}>Guild Acts: <span style={{color:'white', fontWeight:'bolder',}}>{actscount}/160</span></p>
            {acts.map((act, index) => (
              <ActCard key={index} act={act} titleact={false}/>
            ))}
          </div>
        )}

        </div>

      </div>
    </div>
  );
}
