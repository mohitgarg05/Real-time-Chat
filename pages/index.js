import styles from '../styles/Home.module.css'
import Login from './login/index';
import {useEffect} from 'react';
import Logout from './logout/index';
import {useAuthState} from 'react-firebase-hooks/auth';
import {doc , setDoc} from 'firebase/firestore';
import {auth , provider, db}  from './firebaseConfig.js';
export default function Home() {

    const [user] = useAuthState(auth);
    

    useEffect(() => {
        if(user) storeUser();
    }, [user])
    
    const storeUser = async()=>{
      console.log(user.photoURL)

        await setDoc(doc(db,"users",user.uid),{
          uid : user.uid,
          name : user.displayName,
          pic : user.photoURL
        })

        await setDoc(doc(db,"userChat",user.uid),{});
    }
    

  return (
    <>
      {user? <Logout/> : <Login /> }
    </>
  )
}
