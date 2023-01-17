
import React,{useEffect,useState} from 'react';
import firebase from 'firebase/compat/app';
import {auth,provider,db} from '../../firebaseConfig.js';
import Message from '../message';
import { collection, 
        query, 
        doc,
        where,
        Query,
        setDoc, 
        getDoc, 
        updateDoc, 
        serverTimestamp, 
        arrayUnion,
        Timestamp} from "firebase/firestore";
import uuid from 'react-uuid';
import Pic from '../../userPic/user.png';

import style from '../../styles/mainpage.module.css';
const Mainpage = () => {


    const [UsersData, setUsersData] = useState([])
    const [SelectedUser, setSelectedUser] = useState()
    const [newMessage, setnewMessage] = useState('')
    const [CombinedId, setCombinedId] = useState()
    useEffect(() => {
        console.log(auth.currentUser.displayName)
        getDataFromFirebase();
    }, [])

    const getDataFromFirebase = async()=>{
        const collectionRef = firebase.firestore().collection('users');

        // Get the data from the collection
        collectionRef.get().then((snapshot) => {
          const items = snapshot.docs.map((doc) => doc.data());
          const newUserData = items.filter((item)=>item.uid!==auth.currentUser.uid);
          setUsersData(newUserData)
        });
        
    }

    const logout = () => {
        auth.signOut();
    }

    useEffect(() => {
        console.log(Pic.src)
    }, [])
    
  

    const handleClick = async(item)=>{

        setSelectedUser(item)
        const combinedId = item.uid > auth.currentUser.uid? 
                            item.uid + auth.currentUser.uid:
                            auth.currentUser.uid + item.uid


        setCombinedId(combinedId)
        try {
            const res = await getDoc(doc(db,"chats",combinedId));
      
            if(!res.exists()){
               
                const r = await setDoc(doc(db,"chats",combinedId),{message:[]});


                await updateDoc(doc(db,"userChat",item.uid),{
                    [combinedId + ".userInfo"] : {
                        uid : auth.currentUser.uid,
                        name : auth.currentUser.displayName,
                        pic : auth.currentUser.photoURL
                    },
                    [combinedId + ".date"] : serverTimestamp()
                });

                await updateDoc(doc(db,"userChat",auth.currentUser.uid),{
                    [combinedId + ".userInfo"] : {
                        uid : item.uid,
                        name : item.name,
                        pic : item.pic
                    },
                    [combinedId + ".date"] : serverTimestamp()
                });

              
                

            }
        } catch (error) {
            console.log(error)
        }

        
    }

    const handleSubmit = async(e)=>{
          e.preventDefault();
          console.log(newMessage)  
          setnewMessage('')
          try {
             await updateDoc(doc(db,"chats",CombinedId),{
                message: arrayUnion({
                    id: uuid(),
                    newMessage,
                    senderId: auth.currentUser.uid,
                    date: Timestamp.now(),

                }),
            });
          } catch (error) {
            console.log(error)
          }

         
    }
    
    const handleCallback = (bottomRef)=>{
          }


    return (
        <>
            <div className={style.container}>
                <h2>React Chat</h2>
                <button onClick={logout}>
                    Logout
                </button>
            </div>
            <div className={style.wrapper}>

                <div className={style.all_users}>
                    <div className={style.upperDiv}>
                        <p>{auth.currentUser?.displayName} Chat</p>
                    </div>
                    {UsersData.map((item)=>{
                        return(
                            <>
                                <div key={item.uid} className={style.user_wrapper} onClick={()=>handleClick(item)} >
                                    <img src={item.pic?item.pic : Pic.src} alt="Profile Pic"></img>
                                    <p>{item.name}</p>
                                </div>
                            </>
                        )
                    })}
                </div>
                <div className={style.msgcontainer}>
                    <div className={style.loggedInUser}>
                        <p>{SelectedUser?.name}</p>
                    </div>
                    <div className={style.over}>   
                        {SelectedUser?<Message selfId = {auth.currentUser?.uid} callback={handleCallback} combine = {CombinedId} /> : <p className={style.emptyMessage}>Open the chat</p>}
                    </div>
                    <div className={style.msgInput} >
                        <input type='text' name='message' value={newMessage} onChange={(e)=>setnewMessage(e.target.value)} placeholder='Enter Message' />
                        <button onClick={handleSubmit}>Send</button>
                    </div>
                </div>
            </div>
         
        </>
    );
}
  
export default Mainpage;