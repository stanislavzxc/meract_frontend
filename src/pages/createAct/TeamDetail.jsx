// TeamDetail.jsx
import arrowLeft from '../../images/arrow-left.png';
import team from '../../images/teamhero.png';
import teamicon from '../../images/icon1.png';
import points from '../../images/points.png';
import styles from "./CreateAct.module.css";
import trash from '../../images/trash.png';
import navigator from '../../images/compas.png';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import agent from '../../images/agent.png';
import useTeamStore from '../../shared/stores/teamStore';
import { profileApi } from '../../shared/api/profile';

const TeamDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const processedMemberRef = useRef(null);
    
    const { 
        heroes, 
        navigators, 
        agents, 
        teamName,
        isHeroRecruitmentOpen,
        isNavigatorRecruitmentOpen,
        heroVotingStartTime,
        heroVotingStartDate,
        heroVotingHours,
        navigatorVotingStartTime,
        navigatorVotingStartDate,
        navigatorVotingHours,
        setTeamName,
        setHeroRecruitment,
        setNavigatorRecruitment,
        setHeroVotingTime,
        setHeroVotingDate,
        setHeroVotingHours,
        setNavigatorVotingTime,
        setNavigatorVotingDate,
        setNavigatorVotingHours,
        addHero,
        addNavigator,
        addAgent,
        removeMember,
        resetTeam // Добавляем сброс
    } = useTeamStore();

    useEffect(() => {
        const fetchUserAndAdd = async () => {
            if (location.state?.selectedMember) {
                const { selectedMember } = location.state;
                
                if (processedMemberRef.current === selectedMember.id) {
                    navigate('/team', { replace: true, state: {} });
                    return;
                }
                
                processedMemberRef.current = selectedMember.id;
                
                try {
                    const user = await profileApi.getUserById(selectedMember.id);
                    
                    const isDuplicate = () => {
                        switch(selectedMember.type) {
                            case 'hero':
                                return heroes.some(h => h.id === selectedMember.id);
                            case 'navigator':
                                return navigators.some(n => n.id === selectedMember.id);
                            case 'agent':
                                return agents.some(a => a.id === selectedMember.id);
                            default:
                                return false;
                        }
                    };

                    if (isDuplicate()) {
                        toast.warning(`This ${selectedMember.type} has already been added!`);
                    } else {
                        const newMember = {
                            id: selectedMember.id,
                            img: selectedMember.img || selectedMember.imageUrl || teamicon, 
                            name: selectedMember.name,
                            points: user.points || '1000'
                        };

                        switch(selectedMember.type) {
                            case 'hero':
                                addHero(newMember);
                                toast.success(`✅ Hero ${selectedMember.name} added successfully!`);
                                break;
                            case 'navigator':
                                addNavigator(newMember);
                                toast.success(`🧭 Navigator ${selectedMember.name} added successfully!`);
                                break;
                            case 'agent':
                                addAgent(newMember);
                                toast.success(`🕵️ Agent ${selectedMember.name} added successfully!`);
                                break;
                        }
                    }
                    
                    navigate('/team', { replace: true, state: {} });
                    
                } catch (error) {
                    console.error('err:', error);
                    toast.error('❌ Failed to add member. Please try again.');
                    navigate('/team', { replace: true, state: {} });
                } finally {
                    setTimeout(() => {
                        processedMemberRef.current = null;
                    }, 500);
                }
            }
        };

        fetchUserAndAdd();
    }, [location.state, addHero, addNavigator, addAgent, navigate, heroes, navigators, agents]);

    const handleSave = () => {
        // Формируем данные для передачи
        const teamData = {
            name: teamName,
            heroAvatar: heroes.length > 0 ? heroes[0].img : null, // Аватарка первого героя
            membersCount: heroes.length + navigators.length + agents.length,
            // Можно передать и другие данные если нужно
            heroes: heroes,
            navigators: navigators,
            agents: agents,
            isHeroRecruitmentOpen,
            isNavigatorRecruitmentOpen,
            heroVotingStartTime,
            heroVotingStartDate,
            heroVotingHours,
            navigatorVotingStartTime,
            navigatorVotingStartDate,
            navigatorVotingHours
        };
        
        // Передаем данные через state
        navigate('/create-act', { 
            state: { teamData },
            replace: true 
        });
        
        // Опционально: сбрасываем store
        // resetTeam();
    };

    return (
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
                    placeholder="Team Name" 
                    value={teamName} 
                    onChange={(e) => setTeamName(e.target.value)}
                />
            </div>

            {/* Heroes Section */}
            <h4 className={styles.elsetitle}>Invite a hero</h4>
            <p style={{color:'rgb(192, 192, 192)'}}>Indicate the possible heroes for whom the audience will vote.</p>
            
            <div className={styles.teamsGrid}> 
                {heroes.map((hero) => (
                    <div className={styles.paragraph} key={hero.id}>
                        <div className={styles.teamwrap}>
                            <div className={styles.guildImgContainer} style={{border:'none'}}>
                                <div className={styles.emptyPlaceholder}>
                                    <img src={hero.img || teamicon} alt={hero.name} style={{maxWidth:'200px'}}/>
                                </div>
                            </div>
                            <h4 className={styles.elsetitle}>{hero.name}</h4>
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <div className={styles.pointsWrapper}>
                                    <img src={points} alt="points" />
                                    <p style={{color:'white'}}>{hero.points}</p>
                                </div>
                                <img 
                                    src={trash} 
                                    alt="delete" 
                                    onClick={() => removeMember('hero', hero.id)}
                                    style={{cursor: 'pointer'}}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            
                <div className={styles.paragraph}>
                    <div 
                        className={styles.guildImgContainer} 
                        onClick={() => navigate('/add-member/hero')} 
                        style={{height:'260px', padding:'10px 0px', cursor: 'pointer'}}
                    >
                        <div className={styles.emptyPlaceholder}>
                            <img src={team} alt="Add icon" style={{width:'fit-content'}}/>
                            <p style={{color:'#BFBFBF'}}>Add the next candidate to the vote</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Open Recruitment Checkbox for Heroes */}
            <div className={styles.recruitmentWrapper}>
                <label className={styles.checkboxContainer}>
                    <input 
                        type="checkbox" 
                        checked={isHeroRecruitmentOpen} 
                        onChange={() => setHeroRecruitment(!isHeroRecruitmentOpen)} 
                    />
                    <span className={styles.checkmark}></span>
                    <p>Open recruitment for heroes</p>
                </label>
                
                {isHeroRecruitmentOpen && (
                    <div className={styles.recruitmentDetails}>
                        <div className={styles.recruitmentItem}>
                            <p className={styles.recruitmentLabel}>Voting start date</p>
                            <div className={styles.datetimeContainer}>
                                <input 
                                    type="time" 
                                    className={styles.timeInput} 
                                    value={heroVotingStartTime}
                                    onChange={(e) => setHeroVotingTime(e.target.value)}
                                />
                                <input 
                                    type="date" 
                                    className={styles.dateInput} 
                                    value={heroVotingStartDate}
                                    onChange={(e) => setHeroVotingDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.recruitmentItem}>
                            <p className={styles.recruitmentLabel}>Voting time</p>
                            <div className={styles.votingTimeContainer}>
                                <div className={styles.inputWrapper}>
                                    <input 
                                        type="number" 
                                        className={styles.hoursInput} 
                                        value={heroVotingHours}
                                        onChange={(e) => setHeroVotingHours(parseInt(e.target.value) || 1)}
                                        min="1" 
                                        max="168"
                                    />
                                    <span className={styles.inputSuffix}>hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigators Section */}
            <div style={{marginTop:'20px'}}>
                <h4 className={styles.elsetitle}>Invite a navigator</h4>
                <p style={{color:'rgb(192, 192, 192)'}}>Specify possible navigators for which viewers will vote.</p>
                
                <div className={styles.teamsGrid}> 
                    {navigators.map((nav) => (
                        <div className={styles.paragraph} key={nav.id}>
                            <div className={styles.teamwrap}>
                                <div className={styles.guildImgContainer} style={{border:'none'}}>
                                    <div className={styles.emptyPlaceholder}>
                                        <img src={nav.img || teamicon} alt={nav.name} style={{maxWidth:'200px'}}/>
                                    </div>
                                </div>
                                <h4 className={styles.elsetitle}>{nav.name}</h4>
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <div className={styles.pointsWrapper}>
                                        <img src={points} alt="points" />
                                        <p style={{color:'white'}}>{nav.points}</p>
                                    </div>
                                    <img 
                                        src={trash} 
                                        alt="delete" 
                                        onClick={() => removeMember('navigator', nav.id)}
                                        style={{cursor: 'pointer'}}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                
                    <div className={styles.paragraph}>
                        <div 
                            className={styles.guildImgContainer} 
                            onClick={() => navigate('/add-member/navigator')} 
                            style={{height:'260px', padding:'10px 0px', cursor: 'pointer'}}
                        >
                            <div className={styles.emptyPlaceholder}>
                                <img src={navigator} alt="Add icon" style={{width:'fit-content'}}/>
                                <p style={{color:'#BFBFBF'}}>Add the next candidate to the vote</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Open Recruitment Checkbox for Navigators */}
            <div className={styles.recruitmentWrapper}>
                <label className={styles.checkboxContainer}>
                    <input 
                        type="checkbox" 
                        checked={isNavigatorRecruitmentOpen} 
                        onChange={() => setNavigatorRecruitment(!isNavigatorRecruitmentOpen)} 
                    />
                    <span className={styles.checkmark}></span>
                    <p>Open recruitment for navigators</p>
                </label>
                
                {isNavigatorRecruitmentOpen && (
                    <div className={styles.recruitmentDetails}>
                        <div className={styles.recruitmentItem}>
                            <p className={styles.recruitmentLabel}>Voting start date</p>
                            <div className={styles.datetimeContainer}>
                                <input 
                                    type="time" 
                                    className={styles.timeInput} 
                                    value={navigatorVotingStartTime}
                                    onChange={(e) => setNavigatorVotingTime(e.target.value)}
                                />
                                <input 
                                    type="date" 
                                    className={styles.dateInput} 
                                    value={navigatorVotingStartDate}
                                    onChange={(e) => setNavigatorVotingDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.recruitmentItem}>
                            <p className={styles.recruitmentLabel}>Voting time</p>
                            <div className={styles.votingTimeContainer}>
                                <div className={styles.inputWrapper}>
                                    <input 
                                        type="number" 
                                        className={styles.hoursInput} 
                                        value={navigatorVotingHours}
                                        onChange={(e) => setNavigatorVotingHours(parseInt(e.target.value) || 1)}
                                        min="1" 
                                        max="168"
                                    />
                                    <span className={styles.inputSuffix}>hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Agents Section */}
            <div style={{marginTop:'20px'}}>
                <h4 className={styles.elsetitle}>Invite a spot agent</h4>
                <p style={{color:'rgb(192, 192, 192)'}}>Specify possible spot agents for which viewers will vote.</p>
                
                <div className={styles.teamsGrid}> 
                    {agents.map((agentItem) => (
                        <div className={styles.paragraph} key={agentItem.id}>
                            <div className={styles.teamwrap}>
                                <div className={styles.guildImgContainer} style={{border:'none'}}>
                                    <div className={styles.emptyPlaceholder}>
                                        <img src={agentItem.img || teamicon} alt={agentItem.name} style={{maxWidth:'200px'}}/>
                                    </div>
                                </div>
                                <h4 className={styles.elsetitle}>{agentItem.name}</h4>
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <div className={styles.pointsWrapper}>
                                        <img src={points} alt="points" />
                                        <p style={{color:'white'}}>{agentItem.points}</p>
                                    </div>
                                    <img 
                                        src={trash} 
                                        alt="delete" 
                                        onClick={() => removeMember('agent', agentItem.id)}
                                        style={{cursor: 'pointer'}}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                
                    <div className={styles.paragraph}>
                        <div 
                            className={styles.guildImgContainer} 
                            onClick={() => navigate('/add-member/agent')} 
                            style={{height:'260px', padding:'10px 0px', cursor: 'pointer'}}
                        >
                            <div className={styles.emptyPlaceholder}>
                                <img src={agent} alt="Add icon" style={{width:'fit-content'}}/>
                                <p style={{color:'#BFBFBF'}}>Add the next candidate to the vote</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className={styles.item}>
                <div className={styles.active}>
                    <button 
                        className={styles.savebutton} 
                        onClick={handleSave}
                    >
                        Save Team
                    </button>
                </div> 
            </div>  
        </div>
    );
};

export default TeamDetail;