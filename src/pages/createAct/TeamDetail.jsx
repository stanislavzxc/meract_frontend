// TeamDetail.jsx (полная версия с заданиями)
import arrowLeft from '../../images/arrow-left.png';
import team from '../../images/teamhero.png';
import teamicon from '../../images/icon1.png';
import points from '../../images/points.png';
import styles from "./CreateAct.module.css";
import trash from '../../images/trash.png';
import navigator from '../../images/compas.png';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import agent from '../../images/agent.png';
import useTeamStore from '../../shared/stores/teamStore';
import { profileApi } from '../../shared/api/profile';

const TeamDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const processedMemberRef = useRef(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // Состояния для заданий
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [locations, setLocations] = useState([]);
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [newLocation, setNewLocation] = useState('');
    
    const { 
        heroes, 
        navigators, 
        agents, 
        teamName,
        currentTeamId,
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
        saveCurrentTeam,
        deleteTeam,
        resetCurrentTeam,
        getTeamById
    } = useTeamStore();

    const isEditingExistingTeam = currentTeamId && getTeamById(currentTeamId);

    // Функции для работы с заданиями
    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            setTasks([...tasks, { id: Date.now(), title: newTaskTitle }]);
            setNewTaskTitle('');
        }
    };

    const handleRemoveTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    // Функции для работы с локациями
    const handleAddLocation = () => {
        if (newLocation.trim()) {
            setLocations([...locations, { id: Date.now(), name: newLocation }]);
            setNewLocation('');
            setShowLocationInput(false);
        }
    };

    const handleRemoveLocation = (locationId) => {
        setLocations(locations.filter(loc => loc.id !== locationId));
    };

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
        const savedTeam = saveCurrentTeam();
        
        if (savedTeam) {
            // Здесь можно сохранить задания и локации
            console.log('Tasks:', tasks);
            console.log('Locations:', locations);
            
            toast.success(`Team "${savedTeam.name}" saved successfully!`);
            navigate('/create-act');
        }
    };

    const handleDelete = () => {
        if (currentTeamId) {
            setShowDeleteConfirm(true);
        }
    };

    const confirmDelete = () => {
        if (currentTeamId) {
            deleteTeam(currentTeamId);
            toast.success('Team deleted successfully!');
            setShowDeleteConfirm(false);
            navigate('/create-act');
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleBack = () => {
        resetCurrentTeam();
        navigate('/create-act');
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.backButton} onClick={handleBack}>
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

            {/* Tasks Section */}
            <div style={{ marginTop: '20px', width: '100%', maxWidth: '420px' }}>
                <h4 className={styles.elsetitle}>Задание 1</h4>
                <p style={{ color: 'rgb(192, 192, 192)', marginBottom: '10px' }}>
                    Укажите задание
                </p>

                {/* Список заданий */}
                <div style={{ width: '100%' }}>
                    {tasks.map((task) => (
                        <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            padding: '10px',
                            marginBottom: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <span style={{ color: '#fff' }}>{task.title}</span>
                            <img 
                                src={trash} 
                                alt="delete" 
                                onClick={() => handleRemoveTask(task.id)}
                                style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Добавление нового задания */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input 
                        type="text" 
                        className={styles.inputField} 
                        placeholder="Введите задание" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button 
                        onClick={handleAddTask}
                        style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Добавить
                    </button>
                </div>

                {/* Добавление локации */}
                <div style={{ marginTop: '15px' }}>
                    {!showLocationInput ? (
                        <button 
                            onClick={() => setShowLocationInput(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                background: 'transparent',
                                color: '#007bff',
                                border: '1px dashed #007bff',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            <span>+ Добавить локацию</span>
                        </button>
                    ) : (
                        <div style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input 
                                    type="text" 
                                    className={styles.inputField} 
                                    placeholder="Введите название локации" 
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button 
                                    onClick={handleAddLocation}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    OK
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowLocationInput(false);
                                        setNewLocation('');
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Список локаций */}
                {locations.length > 0 && (
                    <div style={{ marginTop: '15px' }}>
                        {locations.map((loc) => (
                            <div key={loc.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <span style={{ color: '#fff' }}>{loc.name}</span>
                                <img 
                                    src={trash} 
                                    alt="delete" 
                                    onClick={() => handleRemoveLocation(loc.id)}
                                    style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                                />
                            </div>
                        ))}
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

            {/* Delete Button */}
            {isEditingExistingTeam && (
                <div className={styles.item} style={{ marginTop: '20px' }}>
                    <div className={styles.active}>
                        <button 
                            onClick={handleDelete}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                width: '100%'
                            }}
                        >
                            Delete Team
                        </button>
                    </div> 
                </div>
            )}

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

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        padding: '24px',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        width: '90%',
                        border: '1px solid #333'
                    }}>
                        <h3 style={{ color: '#fff', marginBottom: '16px' }}>Confirm Delete</h3>
                        <p style={{ color: '#ccc', marginBottom: '24px' }}>
                            Are you sure you want to delete team "{teamName}"? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={cancelDelete}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    border: '1px solid #666',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamDetail;