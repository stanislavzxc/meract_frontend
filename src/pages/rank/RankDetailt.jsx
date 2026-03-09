import back from '../../images/arrow-left.png';
import styles from "./RankPage.module.css";
import logo from '../../images/user.png';
import { useNavigate, useParams } from 'react-router-dom';
import points from '../../images/points.png';
import copy from '../../images/copy.png';
import ActCard from '../acts/components/ActCard';
import { profileApi } from '../../shared/api/profile';
import { useEffect, useState } from 'react';

const RankDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [userData, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [acts, setActs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await profileApi.getUserById(id);
                console.log(data)
                const actsArray = data.actIds ? data.actIds.map(actId => ({ id: actId })) : [];
                setUser(data);
                setActs(actsArray);
            } catch (error) {
                console.error("err", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading || !userData) {
        return (
            <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
                Loading...
            </div>
        );
    }

    const copyText = () => {
        navigator.clipboard.writeText(userData.login).then(() => {
            // Success
        }).catch(err => {
            console.error('error:', err);
        });
    };

    const sendMessage = () => console.log('a');
    const sendEcho = () => console.log('a');

    const isOnline = userData.onlineStatus?.toLowerCase() === 'online' ;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_cont}>
                    <img 
                        src={back} 
                        alt="back" 
                        onClick={() => navigate('/rank')} 
                        style={{ cursor: 'pointer' }} 
                    />
                </div>
            </div>
            <div className={styles.parent}>
                <div className={styles.profile}>
                    <img src={userData.avatarUrl || logo} alt="avatar" className={styles.logo} />
                    <p className={styles.title}>{userData.fullName || 'no name'}</p>
                    {isOnline ? (
                        <p className={styles.subtitle}>online</p>
                    ) : userData.onlineStatus ? (
                        <p className={styles.subtitle}>last online {userData.onlineStatus} ago</p>
                    ) : (
                        <p className={styles.subtitle}>offline</p> 
                    )}

                    <div className={styles.pointsWrapper}>
                        <img src={points} alt="points" />
                        <p style={{ color: 'white' }}>{userData.points}</p>
                    </div>
                </div>
            </div>
            <div className={styles.cardwrapmain}>
                <div className={styles.cardcont}>
                    <div className={styles.card} onClick={() => navigate(`/rank-achive/${id}`)}>
                        <div className={styles.cardInfo}>
                            <p className={styles.userName}>Achievements</p>
                            <p className={styles.subtitle}>0 Achievements</p>
                        </div>
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
                <div className={styles.cardwrap}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.userName}>Location</p>
                            <p className={styles.subtitle}>{userData.country || 'no country'}, {userData.city || 'no city'}</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.userName} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Local time</p>
                            <p className={styles.subtitle} style={{ color: 'white' }}>({userData.timeZone})</p>
                        </div>
                    </div>
                    <div className={`${styles.card} ${styles.fullWidthCard}`}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>Language</p>
                            <div className={styles.languageBox}>
                                <p className={styles.userName}>
                                    {userData.communicationLanguages?.join(', ') || 'No languages'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.cardcont}>
                    <div className={styles.card}>
                        <div className={styles.cardInfo}>
                            <p className={styles.subtitle}>Username</p>
                            <p className={styles.userName}>{userData.login}</p>
                        </div>
                        <img 
                            className={styles.arrowIcon} 
                            src={copy}
                            alt="copy"
                            style={{ opacity: '1', cursor: 'pointer' }}
                            onClick={copyText}
                        />
                    </div>
                </div>
                <div>
                    <div className={styles.btncont}>
                        <button className={styles.active} onClick={sendMessage}>Write</button>
                        <button onClick={sendEcho}>Send Echo</button>
                    </div>
                </div>
            </div>
            <div className={styles.act}>
                <p className={styles.title}>Participated in the acts</p>
                {acts.map((act, index) => (
                    <ActCard key={act.id || index} act={act} titleact={false} />
                ))}
            </div>
        </div>
    );
};

export default RankDetails;
