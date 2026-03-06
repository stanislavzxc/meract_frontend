import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChatPage.module.css";
import back from '../../images/arrow-left.png';
import plus from '../../images/add.png';

import { useRef } from "react";
import { chatApi } from "../../shared/api/chat";
export default function ChatCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const avatarInputRef = useRef(null);

  const Save = async() => {
    await chatApi.createChat(1); 
    navigate('/chats');
  };
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
  
  return (
    <div className={styles.container}>
      <div className={styles.actsPage}>
        <div className="header">
          <div className={styles.header_cont}>
            <img src={back} alt="back" onClick={() => navigate('/chats')} style={{cursor: 'pointer'}}/>
            <div className="name"><h1>New chat</h1></div>
            <div></div>
          </div>
        </div>

        <div className={styles.dropparent}>
            <input 
                                type="text" 
                                className={styles.inputField} 
                                placeholder="Name chat" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                            />
        </div>
        <div className={styles.dropparent}>
            <h4 className={styles.elsetitle}>Avatar chat</h4>

                            <div 
                                className={styles.guildImgContainer} 
                                onClick={() => !avatar && avatarInputRef.current.click()}
                            >
                                {avatar ? (
                                    <img src={avatar} alt="" className={styles.guildimg}/>
                                ) : (
                                    <>
                                    <div style={{display:'flex',justifyContent:'space-between', alignItems:'center',width:'100%', padding:'0px 20px 0px 10px',}}>
                                    <div className={styles.emptyPlaceholder}>Add photo</div>
                                    <img src={plus} alt="" />
                                    </div>
                                    </>
                                )}
                                
                            </div>
                            
                            <input 
                                type="file" 
                                hidden 
                                ref={avatarInputRef} 
                                onChange={(e) => handleFileChange(e, setAvatar)} 
                                accept="image/*"
                            />
                            {avatar && <button className={styles.delete} onClick={() => setAvatar(null)}>Delete</button>}
                            
        </div>
                    <button 
                      className={styles.active} 
                      style={{ width: '100%', justifyContent: 'space-between', display: 'flex', marginTop: '20px', padding:'16px 20px',maxWidth:'420px' }}
                      onClick={() => Save()}
                    >
                      Add members
                      <img src={plus} alt="" />

                    </button>
      </div>
                <div className={styles.item}>
                  <div className={styles.btncont}>
                    <button 
                      className={styles.active} 
                      style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: '20px',  maxWidth:'420px'}}
                      onClick={() => Save()}
                    >
                      Create a chat
                    </button>
                  </div>
                </div>
    </div>
  );
}
