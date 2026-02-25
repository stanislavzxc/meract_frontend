import styles from '../../src/features/Auth/forgotPassword/forgot.module.css';
const NotFoundPage = () =>{
    return(
    <div className={styles.container}> 
        <div style={{margin:'auto',color:'white', textAlign:'center',}}>
            <h1 style={{fontSize:'52px',}}>404</h1>
            <p>Oops... something went wrong</p>
        </div>
    </div>

    )
}
export default NotFoundPage;
