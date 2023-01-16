import React from 'react';
import {auth , provider}  from '../../firebaseConfig.js';
import style from '../../styles/login.module.css';
import {doc , setDoc} from 'firebase/firestore';
const Login = () => {


    const signin = async() => {
        await auth.signInWithPopup(provider).catch(alert);
    }
      
    return (
        <div>
            <div className={style.container}>
                <h2>React Chat</h2>
            </div>
            <div className={style.btnwrapper}>
                <button
                 className={style.googlebuttn} 
                 onClick={signin}>Sign In with Google</button>
            </div>
        </div>
    );
}
  
export default Login;