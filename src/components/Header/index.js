import React, { useEffect } from 'react'
import "./styles.css";
import { useAuthState} from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userImg from '../../assets/user.svg';

function Header() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();//for link page react-router-dom
  useEffect(() => {
    if(user){
      navigate("/dashboard");
    }
  },[user, loading]);

  function logoutFnc(){
    // alert("Logout!!!");
    try {
      signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Logged out Success...");
        navigate("/");//page jumping signinsignup page
      }).catch((error) => {
        // An error happened.
        toast.error(error.message);
      });
      
    } 
    catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="navbar">
      <p className='logo'>Financely.</p>
      <div style={{display:"flex", alignItems:"center",gap:"0.75rem"}}>
        <img
          src={ user && user.photoURL  ? user.photoURL : userImg}
          // src = {userImg}
          alt={"this is user img"}
          style={{borderRadius:"50%", height:"2rem", width:"2rem"}}
        />
        
        {user && (
          <p className='logo link' onClick={logoutFnc}>Logout</p>
        )}
      </div>
    </div>
  )
}

export default Header