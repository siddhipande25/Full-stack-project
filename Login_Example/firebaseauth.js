// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
   apiKey: "AIzaSyAutk_C94hzgKYOCkryN9YsO6aQYEQC0EQ",
   authDomain: "loginu-2811b.firebaseapp.com",
   projectId: "loginu-2811b",
   storageBucket: "loginu-2811b.firebasestorage.app",
   messagingSenderId: "834361701796",
   appId: "1:834361701796:web:7b1016c5de9838e78dfd31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId){
   var messageDiv=document.getElementById(divId);
   messageDiv.style.display="block";
   messageDiv.innerHTML=message;
   messageDiv.style.opacity=1;
   setTimeout(function(){
       messageDiv.style.opacity=0;
   },5000);
}
const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('rEmail').value;
   const password=document.getElementById('rPassword').value;
   const firstName=document.getElementById('fName').value;
   const lastName=document.getElementById('lName').value;

   const auth=getAuth();
   const db=getFirestore();

   createUserWithEmailAndPassword(auth, email, password)
   .then((userCredential)=>{
       console.log('Signup successful:', userCredential);
       const user=userCredential.user;
       const userData={
           email: email,
           firstName: firstName,
           lastName:lastName
       };
       showMessage('Account Created Successfully', 'signUpMessage');
       const docRef=doc(db, "users", user.uid);
       setDoc(docRef,userData)
       .then(()=>{
           console.log('User data saved successfully');
           localStorage.setItem('loggedInUserId', user.uid);
           window.location.href='homepage.html';
       })
       .catch((error)=>{
           console.error("Error writing document:", error);
           console.error("Error code:", error.code);
           console.error("Error message:", error.message);
       });
   })
   .catch((error)=>{
       console.error('Signup error:', error);
       console.error('Error code:', error.code);
       console.error('Error message:', error.message);
       const errorCode=error.code;
       if(errorCode=='auth/email-already-in-use'){
           showMessage('Email Address Already Exists !!!', 'signUpMessage');
       }
       else{
           showMessage('Unable to create User: ' + error.message, 'signUpMessage');
       }
   })
});

const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('email').value;
   const password=document.getElementById('password').value;
   const auth=getAuth();

   signInWithEmailAndPassword(auth, email,password)
   .then((userCredential)=>{
       console.log('Login successful:', userCredential);
       showMessage('login is successful', 'signInMessage');
       const user=userCredential.user;
       localStorage.setItem('loggedInUserId', user.uid);
       window.location.href='homepage.html';
   })
   .catch((error)=>{
       console.error('Login error:', error);
       console.error('Error code:', error.code);
       console.error('Error message:', error.message);
       const errorCode=error.code;
       if(errorCode==='auth/invalid-credential'){
           showMessage('Incorrect Email or Password', 'signInMessage');
       }
       else{
           showMessage('Account does not Exist', 'signInMessage');
       }
   })
})