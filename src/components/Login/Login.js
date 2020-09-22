import React, { useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import { useContext } from 'react';
import { UserContext } from '../../App';
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);



function Login() {

  var provider = new firebase.auth.GoogleAuthProvider();
  const FacebookProvider = new firebase.auth.FacebookAuthProvider();

  const [newUser, setNewUser] = useState(false);

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: "",
    password: "",
    photo : ""
    
  })

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const handleSignIn = () => {

    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email, photoURL} = res.user;

      const signedInUser = {
        isSignedIn : true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser)
    
    })
    .catch(error => {
      console.log(error)
      console.log(error.message)
    })
  }

const handleFbLogin = () => {
  firebase.auth().signInWithPopup(FacebookProvider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}
  


  const handleSignOut = () => {

    firebase.auth().signOut()

    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: "",
        email: "",
        photo : "",
        error: "",
        success: false
      }
      setUser(signedOutUser)

    })
    .catch(error => {
      console.log(error)
    })
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
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    
    .then(res => {
      const newUserInfo = {...user}
      newUserInfo.error = "";
      newUserInfo.success = true;
      setUser(newUserInfo)
      updateUserName(user.name)
    })
    .catch(error =>{
      const newUserInfo = {...user}
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      setUser(newUserInfo);
    });
  }

  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user}
      newUserInfo.error = "";
      newUserInfo.success = true;
      setUser(newUserInfo)
      setLoggedInUser(newUserInfo)
      console.log('New User', res.user)
    })
    .catch(error => {
      const newUserInfo = {...user}
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      setUser(newUserInfo);
    });
  }

  event.preventDefault();
}


const updateUserName = name => {
  const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log('updated user successfully')
    }).catch(function(error) {
      console.log(error)
    });

}

  return (
    <div style={{textAlign: 'center'}}>
      <button onClick={handleFbLogin}>Sign In With Facebook</button>
      <br/>
     {
       user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
       <button onClick={handleSignIn}>Sign In</button>
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
