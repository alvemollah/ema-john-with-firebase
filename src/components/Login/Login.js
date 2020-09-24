import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { handleGoogleSignIn, initializeLoginFramework, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';

function Login() {

  const [newUser, setNewUser] = useState(false);

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: "",
    password: "",
    photo : ""
    
  })

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const signOut = () => {
    handleSignOut()
    .then(res => {
      handleResponse(res, false);
    })
  }

  const handleResponse = (res, redirect) => {
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
      history.replace(from);
    }
}

const handleBlur = (event) => {
  let isFieldValid = true;

  if(event.target.name === "email") {
    isFieldValid = /\S+@\S+\.\S+/.test(event.target.value)
  }

  if(event.target.name === "password"){
    const isPasswordValid = event.target.value.length > 6;
    const passwordHasNumber = /\d{1}/.test(event.target.value);
    isFieldValid = isPasswordValid && passwordHasNumber;
  }

  if(isFieldValid){
    const newUserInfo = {...user};
    newUserInfo[event.target.name] = event.target.value;
    setUser(newUserInfo);
  }
}

const handleSubmit = (event) => {

  if(newUser && user.email && user.password){
   createUserWithEmailAndPassword(user.name, user.email, user.password)
   .then(res => {
    handleResponse(res, true);
   })
  }

  if(!newUser && user.email && user.password){
    signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      handleResponse(res, true);
   })
  }

  event.preventDefault();
}

  

  return (
    <div style={{textAlign: 'center'}}>
      <button onClick={fbSignIn}>Sign In With Facebook</button>
      <br/>
     {
       user.isSignedIn ? <button onClick={signOut}>Sign Out</button> :
       <button onClick={googleSignIn}>Sign In</button>
     }

     {
      user.isSignedIn && <div><p>Welcome, {user.name}</p>
                              <p>email: {user.email}</p>
                              <img src={user.photo} alt=""/>
      </div>
     }


     <h1>My Own Authentication</h1>

     <form onSubmit={handleSubmit}>
       <input type="checkbox" name="newUser"  onChange={() => setNewUser(!newUser)}id=""/>
       <label htmlFor="newUser">New User SignUp</label>
        <br/>
      {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Enter Your Name"/>}
      <br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Enter Your Email" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Enter Your Password" required/>
      <br/>
      <input type="submit" value={newUser ? "Sign Up" : "Sign in"}/>
     </form>

      <p style={{color:"red"}}>{user.error}</p>
      {user.success && <p style={{color:"green"}}>Your account {newUser ? "Created " : 'Logged In'}successfully</p>}
      
    </div>

    
  );
}

export default Login;
