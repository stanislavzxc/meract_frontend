import styles from './GuildAbout.module.css'
import arrowLeft from '../../../images/arrow-left.png';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import iconguild from '../../../images/iconguild.png'; 

 const GuildAbout = () => {
    const { id } = useParams();
    const name = 'name';
    const date = '10.11.2025';
    const description = 'description here description heredescription heredescription heredescription heredescription heredescription heredescription heredescription here';
    const members = 1000;
  const navigate = useNavigate();
   return (
     <div className={styles.container}>
       <div className={styles.backButton} onClick={() => navigate(`/guilds/${id}`)}>
         <img src={arrowLeft} alt="Back" className={styles.backIcon} />
         <p className={styles.backText}>
           Back
         </p>
       </div>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>Guild</h3>
         <div style={{display:'flex', gap:'10px', alignItems:'center',}}>
            <img src={iconguild} alt=''className={styles.iconguild}/>
            <p className={styles.elsetitle}>{name}</p>
         </div>
       </div>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>Сreation date</h3>
         <p className={styles.subtitle}>{date}</p>
       </div>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>Description</h3>
         <p className={styles.subtitle}>{description}</p>
       </div>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>Members</h3>
         <p className={styles.subtitle}>{members}</p>
       </div>
     
     </div>
   )
 }


export default GuildAbout
