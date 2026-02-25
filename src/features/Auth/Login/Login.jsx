import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "./hooks/useAuth";
import google from '../../../images/google.png'
import discord from '../../../images/discord.png'
import twitch from '../../../images/twitch.png'
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/acts");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await signIn(email, password);
    if (ok) navigate("/acts");
  };

  const handleRegister = () => {
    navigate("/registration");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };
  const handleTwitchAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitch`;
  };
  const handleDiscordAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
  };

  return (
    <div className={styles.container}>
      <div className = {styles.parent}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to Meract</h1>
          <p className={styles.subtitle}>Log in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={styles.input}
              autoFocus
              disabled={loading}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
              disabled={loading}
            />
          </div>


          {/* <div className={styles.checkbox_wrapper}>
            <input type="checkbox" id="check" />
            <label htmlFor="check">Remember Password</label>
          </div> */}

          <a href="#" onClick={handleForgotPassword} className={styles.forgotLink}>
            Forget Password?
          </a>

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don't have an account yet? 
            <span
              onClick={handleRegister}
              className={styles.signupLink}
            >
              Sign up
            </span>
          </p>
        </div>

         
      </div>
      <div className={styles.ordiv}>
         <hr />     
        <p className={styles.orText}>or</p>
         <hr />     
      </div>
        <div className={styles.imgcont}>
        <div className={styles.ico_wrapper}>
          <div
            className={styles.ico}
            onClick={handleTwitchAuth}
          >
            <img src={twitch} alt="twitch" width={22} />
            

          </div>
        </div>
        <div className={styles.ico_wrapper}>
          <div
            className={styles.ico}
            onClick={handleDiscordAuth}
          >
            <img src={discord}alt="discord" width={22} />

          </div>
        </div>
        <div className={styles.ico_wrapper}>
          <div
            className={styles.ico}
            onClick={handleGoogleAuth}
          >
            <img src={google} alt="google" width={22} />
          </div>
        </div>
        </div>
     </div>
    </div>
  );
}
