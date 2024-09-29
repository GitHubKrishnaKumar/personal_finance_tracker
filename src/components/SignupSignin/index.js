import React, { useState } from 'react'
import "./styles.css";
import Input from '../Input/input';
import Button from '../Button';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { auth, db, provider } from '../../firebase';
import { doc, setDoc , getDoc} from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from 'react-toastify';
import { Await, useNavigate } from 'react-router-dom';

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm]= useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Signup function
  function signupWithEmail(){
    setLoading(true);
    console.log("Name : ",name);
    console.log("Email : ",email);
    console.log("Password : ",password);
    console.log("ConfirmPassword : ",confirmPassword);
  
    // Authentication the user or basically create a new account using email and password
    if(name !="" && email != "" && password != "" && confirmPassword != ""){
      if(confirmPassword == password){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log("User>>>", user);
          toast.success("User Created...");
          setLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          // ...create doc with user id and following id
          createDoc(user);
          //page link using router(useNavigate)
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
          // ..
        });
      }
      else{
        toast.error("Password and Confirm password does not match.");
        setLoading(false);
      }
    }
    else{
      toast.error("All Fields are mandatory!");
      setLoading(false);
    }
  }
  // login function
  function loginUsingEmail(){
    setLoading(true);
    console.log("Email : ",email);
    console.log("Password : ",password);
    // login using email and pass in firebase code
    if(email != "" && password != ""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("User Logged In!");
        console.log("User Logged in!", user);
        //page link using router(useNavigate)
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
      });
    }
    else{
      toast.error("All fields are mandatory...");
      setLoading(false);
    }
  }
  //create doc function
  async function createDoc(user){
    //make sure that the doc with the uid doesn't exist
    // Create a doc..  
    if(!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    setLoading(true);
    if(!userData.exists()){
      try{
        await setDoc(doc(db, "users", user.uid), 
        {name : user.displayName ? user.displayName : name,
          email : user.email,
          photoURL : user.photoURL ? user.photoURL : "",
          createdAt : new Date(),
        }
        );
        toast.success("Doc Created ");
        setLoading(false);
      }
      catch(e){
        toast.error(e.message);
        setLoading(false);
      }
    }
    else{
      // toast.error("Doc already exist");
      setLoading(false);
    }
  }

  //Signup using google
  function googleAuth(){
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        createDoc(user);//create doc in firebase
        setLoading(false);
        console.log("User>>", user);
        toast.success("User Authenticated ");
        navigate("/dashboard");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    } 
    catch (e) {
      setLoading(false);
      toast.error(e.message);
    }

    
  }

  return (
    <>
    {loginForm ? 
      (
        <div className='signup-wrapper'>
          <h2 className='title'>
            Login on<span style={{color:"var(--theme)"}}>Financely.</span>
          </h2>
          <form>
            
            <Input type="email"
              label={"Email"}
              state={email}
              setState={setEmail} 
              placeholder={"Enter Your Mail"} 
            />
            <Input type="password"
              label={"Password"}
              state={password}
              setState={setPassword} 
              placeholder={"Enter Your Password"} 
            />
            <Button 
              disable = {loading}
              text={loading ? "Loading..." : "LoginUsing Email and Password."} 
              onClick={loginUsingEmail}
            />
            <p className='p-login'>or</p>
            <Button 
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login Using Google"} 
              blue={true} 
            />
            <p className='p-login'
              style={{cursor:'pointer'}}
              onClick={()=> setLoginForm(!loginForm)}>
              Or Have An Account Already? Click Here 
            </p>
          </form>
        </div>
      ) : (
        <div className='signup-wrapper'>
          <h2 className='title'>
            Sign Up on<span style={{color:"var(--theme)"}}>Financely.</span>
          </h2>
          <form>
            <Input 
              label={"Full Name"}
              state={name}
              setState={setName} 
              placeholder={"Enter Your Name"} 
            />
            <Input type="email"
              label={"Email"}
              state={email}
              setState={setEmail} 
              placeholder={"Enter Your Mail"} 
            />
            <Input type="password"
              label={"Password"}
              state={password}
              setState={setPassword} 
              placeholder={"Enter Your Password"} 
            />
            <Input type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword} 
              placeholder={"Enter Your Confirm Password"} 
            />
            <Button 
              disable = {loading}
              text={loading ? "Loading..." : "Signup Using Email and Password."} onClick={signupWithEmail}
            />
            <p className='p-login'>or</p>
            <Button 
              onClick={googleAuth}
              text={loading ? "Loading..." : "Signup Using Google"} blue={true} 
            />
            <p className='p-login'
              style={{cursor:'pointer'}}
              onClick={()=> setLoginForm(!loginForm)}
            >
              Or Have An Account Already? Click Here 
            </p>
          </form>
        </div>
    )}
    </>
  )
}

export default SignupSigninComponent