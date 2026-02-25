import CustomSelect from "../../shared/ui/CustomSelect";
import NavBar from "../../shared/ui/NavBar/NavBar";
import styles from "./GuildsPage.module.css";
import GuildCard from "./components/GuildCard";
import { useUserGuild } from "./hooks/useUserGuild";
import menu from '../../images/menu.png';
import notification from '../../images/notification.png';
import filter from '../../images/setting.png';
import search from '../../images/search.png';
import Menu from '../Menu/Menu.jsx';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function GuildsPage() {
  const { guild, loading, error } = useUserGuild();
  const navigate = useNavigate();  
  let [isOpen, setIsOpen] = useState(false);
  
 const [guilds, setGuilds] = useState([
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
  const handleSortChange = (option) => {
    console.log("Selected sort option:", option);
  };

  return (
    <div className={styles.container}>
      {isOpen && <Menu
      onClose={() => setIsOpen(false)}
    
    />}
        <div className={styles.actsPage}>
    
        <div className="header">
          <div className={styles.header_cont}>
           <img src={menu} alt="" 
                onClick={() => setIsOpen(!isOpen)}
                />
          <div className="name">
            <h1>Guild</h1>
          </div>
          <img src={notification} alt="notifications" onClick={() => navigate('/notifications')}/>
          
          </div>
          <div className="nav">
            <div className={styles.searchWrapper}>
      <img src={search} alt="search" className={styles.searchIcon} />
      <input type="text" placeholder="Search" className={styles.input} />
      <img src={filter} alt="filter" className={styles.filterIcon} onClick={() => navigate('/guilds-filters')}/>
    </div>
    
          </div>
        </div>
    
          <div className={styles.contentWrapper}>
            <div className={styles.streamsList}>
              {guilds.map((guild, index) => (
                <GuildCard key={index} guild={guild} />
              ))}
            </div>
          </div>
          
          <NavBar />
        </div>
      </div>
  );
}
