import { doc, onSnapshot } from 'firebase/firestore'
import React,{useEffect,useState,useRef} from 'react'
import style from '../styles/message.module.css';
import {auth,provider,db} from '../firebaseConfig.js';
const message = (props) => {

const [Messages, setMessages] = useState([])
const bottomRef = useRef(null);

    useEffect(() => {

        if(props.combine){
            const unSub = onSnapshot(doc(db,"chats",props.combine),(doc)=>{
                doc.exists() && setMessages(doc.data().message);
            })
        }

    }, [props.combine])

    useEffect(() => {
     console.log(Messages)
    }, [Messages])
    

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'})
   
        props.callback(bottomRef)
      }, [Messages]);
    



  return (
    <div className={style.msgcontainer2} ref = {bottomRef} >
        {Messages?.map((item)=>{
            if(item.senderId == props.selfId){
                return(
                    <div className={style.selfMsg}>
                        <p>{item.newMessage}</p>
                    </div>
                )
            }else{
                return(
                    <div  className={style.OppMsg}>
                        <p>{item.newMessage}</p>
                    </div>
                )
            }
        })}
    </div>
  )
}

export default message