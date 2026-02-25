import arrowLeft from '../../images/arrow-left.png';
import team from '../../images/teamhero.png';
import teamicon from '../../images/icon1.png';
import points from '../../images/points.png';
import styles from "./CreateAct.module.css";
import trash from '../../images/trash.png';
import navigator from '../../images/compas.png';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agent from '../../images/agent.png';
const TeamDetail = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('Team1');
    const [isOpenRecruitment, setIsOpenRecruitment] = useState(false);

    const [heroes, setTeams] = useState([
        { id: 1, img: teamicon, name: 'team1', points: '1000' }
    ]);
    const [navigators, setNavig] = useState([
            { id: 1, img: teamicon, name: 'team1', points: '1000' }
        ]);
    const [agents, setAgents] = useState([
            { id: 1, img: teamicon, name: 'team1', points: '1000' }
        ]); 
    const deletemember = (name, id) => {
        if(name == 'hero'){
            setTeams(prevTeams => prevTeams.filter(hero => hero.id !== id));
        }
        if(name == 'navigator'){
            setNavig(prevTeams => prevTeams.filter(hero => hero.id !== id));
        }
        if(name == 'agent'){
            setAgents(prevTeams => prevTeams.filter(hero => hero.id !== id));
        }
    }
    return(
         <div className={styles.container}>
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.backButton} onClick={() => navigate('/create-act')}>
                                <img src={arrowLeft} alt="Back" className={styles.backIcon} />
                            </div>
                            <h1>Team</h1>
                            <div></div>
                        </div>
                        <div className={styles.paragraph}>
                            <input 
                                type="text" 
                                className={styles.inputField} 
                                placeholder="Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <h4 className={styles.elsetitle}>Invite a hero</h4>
                        <p style={{color:'rgb(192, 192, 192)',}}>Indicate the possible heroes for whom the audience will vote.</p>
                        <div className={styles.teamsGrid}> 
                            
                            {heroes.map((team) => (
                              <div className={styles.paragraph} key={team.id}>
                                <div className={styles.teamwrap}>
                                <div className={styles.guildImgContainer} style={{border:'none',}}>
                                  <div className={styles.emptyPlaceholder}>
                                    <img src={team.img} alt="team" />
                                    <p>Team {team.id}</p>
                                  </div>
                                </div>
                                  <h4 className={styles.elsetitle}>{team.name}</h4>
                                  <div style={{display:'flex', justifyContent:'space-between',}}>
                                    <div className={styles.pointsWrapper}>
                                        <img src={points} alt="points" />
                                        <p style={{color:'white'}}>{team.points}</p>
                                    </div>
                                    <img src={trash} alt="" onClick={() => deletemember('hero', team.id)}/>
                                  </div>
                                </div>
                              </div>
                            ))}
                        
                            <div className={styles.paragraph}>
                            <div className={styles.guildImgContainer} onClick={() => navigate('/create-act')} style={{height:'260px', padding:'10px 0px',}}>
                                <div className={styles.emptyPlaceholder && styles.addhero}>
                                  <img src={team} alt="Add icon" style={{width:'fit-content',}}/>
                                  <p style={{color:'#BFBFBF',}}>Add the next candidate to the vote</p>
                                </div>
                              </div>
                            </div>
                        
                          </div>
                         <div className={styles.recruitmentWrapper }>
                            <label className={styles.checkboxContainer}>
                                <input 
                                    type="checkbox" 
                                    checked={isOpenRecruitment} 
                                    onChange={() => setIsOpenRecruitment(!isOpenRecruitment)} 
                                />
                                <span className={styles.checkmark}></span>
                                <p>Open recruitment</p>
                            </label>
                        </div>
                        <div style={{marginTop:'20px',}}>

                            <h4 className={styles.elsetitle}>Invite a navigator</h4>
                            <p style={{color:'rgb(192, 192, 192)',}}>Specify possible navigators for which viewers will vote.</p>
                            <div className={styles.teamsGrid}> 
                                
                                {navigators.map((team) => (
                                <div className={styles.paragraph} key={team.id}>
                                    <div className={styles.teamwrap}>
                                    <div className={styles.guildImgContainer} style={{border:'none',}}>
                                    <div className={styles.emptyPlaceholder}>
                                        <img src={team.img} alt="team" />
                                        <p>{team.name}</p>
                                    </div>
                                    </div>
                                    <h4 className={styles.elsetitle}>{team.name}</h4>
                                    <div style={{display:'flex', justifyContent:'space-between',}}>
                                        <div className={styles.pointsWrapper}>
                                            <img src={points} alt="points" />
                                            <p style={{color:'white'}}>{team.points}</p>
                                        </div>
                                        <img src={trash} alt="" onClick={() => deletemember('navigator', team.id)}/>
                                    </div>
                                    </div>
                                </div>
                                ))}
                            
                                <div className={styles.paragraph}>
                                <div className={styles.guildImgContainer} onClick={() => navigate('/create-act')} style={{height:'260px', padding:'10px 0px',}}>
                                    <div className={styles.emptyPlaceholder && styles.addhero}>
                                    <img src={navigator} alt="Add icon" style={{width:'fit-content',}}/>
                                    <p style={{color:'#BFBFBF',}}>Add the next candidate to the vote</p>
                                    </div>
                                </div>
                                </div>
                            
                            </div>
                        </div>
                         <div style={{marginTop:'20px',}}>

                            <h4 className={styles.elsetitle}>Invite a spot agent</h4>
                            <p style={{color:'rgb(192, 192, 192)',}}>Specify possible spot agents for which viewers will vote.</p>
                            <div className={styles.teamsGrid}> 
                                
                                {agents.map((team) => (
                                <div className={styles.paragraph} key={team.id}>
                                    <div className={styles.teamwrap}>
                                    <div className={styles.guildImgContainer} style={{border:'none',}}>
                                    <div className={styles.emptyPlaceholder}>
                                        <img src={team.img} alt="team" />
                                        <p>{team.name}</p>
                                    </div>
                                    </div>
                                    <h4 className={styles.elsetitle}>{team.name}</h4>
                                    <div style={{display:'flex', justifyContent:'space-between',}}>
                                        <div className={styles.pointsWrapper}>
                                            <img src={points} alt="points" />
                                            <p style={{color:'white'}}>{team.points}</p>
                                        </div>
                                        <img src={trash} alt="" onClick={() => deletemember('agent', team.id)}/>
                                    </div>
                                    </div>
                                </div>
                                ))}
                            
                                <div className={styles.paragraph}>
                                <div className={styles.guildImgContainer} onClick={() => navigate('/create-act')} style={{height:'260px', padding:'10px 0px',}}>
                                    <div className={styles.emptyPlaceholder && styles.addhero}>
                                    <img src={agent} alt="Add icon" style={{width:'fit-content',}}/>
                                    <p style={{color:'#BFBFBF',}}>Add the next candidate to the vote</p>
                                    </div>
                                </div>
                                </div>
                            
                            </div>
                        </div>

                    </div>
    )
}
export default TeamDetail;