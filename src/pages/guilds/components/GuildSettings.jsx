import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from './GuildSettings.module.css';
import arrowLeft from '../../../images/arrow-left.png';
import iconguild from '../../../images/iconguild.png'; 
import notification from '../../../images/notification.png';
import coverguild from '../../../images/iconguild.png'; 

const GuildSettings = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const isAdmin = true;
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('name');
    const [description, setDescription] = useState('desc');
    const [avatar, setAvatar] = useState(iconguild);
    const [cover, setCover] = useState(coverguild);

    const handleFileChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const Save = () => {
        console.log('save');
        navigate(`/guilds/${id}`)
    } 
    const AddUser = () => {
        console.log('save');
        
    } 
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.backButton} onClick={() => navigate(`/guilds/${id}`)}>
                    <img src={arrowLeft} alt="Back" className={styles.backIcon} />
                    <p className={styles.backText}>Back</p>
                </div>
                <h1>Setting Guild</h1>
                <img src={notification} alt="Notification" />
            </div>
{isAdmin && (

<>
            <div className={styles.paragraph}>
                <h3 className={styles.elsetitle}>Basic information</h3>
                <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Name guild" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                />
                 <textarea 
                    className={styles.textareaField} 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className={styles.paragraph}>
                <h4 className={styles.elsetitle}>Guild avatar</h4>
                <div 
                    className={styles.guildImgContainer} 
                    onClick={() => !avatar && avatarInputRef.current.click()}
                >
                    {avatar ? (
                        <img src={avatar} alt="" className={styles.guildimg}/>
                    ) : (
                        <div className={styles.emptyPlaceholder}>+ Upload Photo</div>
                    )}
                </div>
                <input 
                    type="file" 
                    hidden 
                    ref={avatarInputRef} 
                    onChange={(e) => handleFileChange(e, setAvatar)} 
                    accept="image/*"
                />
                {avatar && <button className={styles.button} onClick={() => setAvatar(null)}>Delete</button>}
            </div>   

            <div className={styles.paragraph}>
                <h4 className={styles.elsetitle}>Cover</h4>
                <div 
                    className={styles.guildImgContainer} 
                    onClick={() => !cover && coverInputRef.current.click()}
                >
                    {cover ? (
                        <img src={cover} alt="" className={styles.guildimg}/>
                    ) : (
                        <div className={styles.emptyPlaceholder}>+ Upload Cover</div>
                    )}
                </div>
                <input 
                    type="file" 
                    hidden 
                    ref={coverInputRef} 
                    onChange={(e) => handleFileChange(e, setCover)} 
                    accept="image/*"
                />
                {cover && <button className={styles.button} onClick={() => setCover(null)}>Delete</button>}
            </div>   
</>
)}
            <div className={styles.paragraph}>
                <div>
                <h4 className={styles.elsetitle}>Invite users</h4>
                <p className={styles.subtitle}>Enter your email address or user name to invite the user</p>
                </div>
                 <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUserName(e.target.value)}
                />
                <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className={styles.active}>
                        <button className={styles.savebutton} onClick={AddUser}>
                        Add user
                        </button>
                </div> 
            </div>
            <div className={styles.paragraph}>

                <div className={styles.active}>
                        <button className={styles.savebutton} onClick={Save}>
                        Save
                        </button>
                </div> 
            </div>          
        </div>
    );
};

export default GuildSettings;
