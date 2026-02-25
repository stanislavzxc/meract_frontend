import styles from './termofuse.module.css'
import arrowLeft from '../../../images/arrow-left.png';
import { useNavigate } from "react-router-dom";


 const TermOfUse = () => {
  const navigate = useNavigate();
   return (
     <div className={styles.container}>
       <div className={styles.backButton} onClick={() => navigate("/login")}>
         <img src={arrowLeft} alt="Back" className={styles.backIcon} />
         <p className={styles.backText}>
           Back
         </p>
       </div>
       <h1 className={styles.title}>Terms of Use</h1>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>Introduction</h3>
         <p className={styles.subtitle}>These terms govern your use of our application ("App"). By accessing or using the App, you agree to be bound by these terms. If you do not accept all of the terms herein, then please stop using the App immediately.</p>
       </div>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>Acceptance of Terms</h3>
         <p className={styles.subtitle}>You acknowledge that you have read, understood, and agreed to comply with these terms before downloading or using the App. Your continued access or usage constitutes acceptance of these terms.</p>
       </div>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>User Account</h3>
         <p className={styles.subtitle}>To use certain features of the App, you may need to create an account. You are responsible for maintaining the confidentiality of your login credentials and for any activity under your account.</p>
       </div>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>Content Guidelines</h3>
         <p className={styles.subtitle}>You must not post content that is unlawful, harmful, threatening, abusive, harassing, defamatory, obscene, invasive of another's privacy, hateful, racially or ethnically offensive, or otherwise objectionable.</p>
       </div>
       <div className={styles.paragraph}>
         <h3 className={styles.elsetitle}>Intellectual Property Rights</h3>
         <p className={styles.subtitle}>All intellectual property rights in the App belong to us unless specifically stated otherwise. The trademarks, logos, service marks, designs, graphics, sounds, music, videos, information, data, software, text, scripts, collections of content, and other materials contained within the App are protected by copyrights, trademarks, patents, and/or other proprietary rights and laws.</p>
       </div>
     </div>
   )
 }


export default TermOfUse
