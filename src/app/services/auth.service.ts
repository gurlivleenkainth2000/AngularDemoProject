import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, collection, setDoc, query, where, Timestamp, onSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userModel: UserModel | null = null;

  // Various Firebase Auth Error's Code  
  errorCodeMessages: { [key: string]: string } = {
    'auth/user-not-found': 'User not found with this email address',
    'auth/wrong-password': 'Wrong Password. Please enter correct password.',
    'auth/email-already-in-use': 'Email Address already used by another user. Please use different address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Invalid Email Address',
  }

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(auth, (user) => {
      if(user !== null) {
        console.log(">>> User is already signed");
        this.fetchUserDetailsFromFirestore(user.uid);
      } else {
        console.log(">>> User is not sign in");
        this.userModel = null;
      }
    }, (error) => {
      console.log(error);
    })
  }

  loginUser({ email, password }: { email: string; password: string }): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((resp: UserCredential) => {
          this.router.navigate(['/'])
          this.fetchUserDetailsFromFirestore(resp.user.uid);
          resolve(resp)
        })
        .catch((error) => reject(this.errorCodeMessages[error.code] ?? "Something went Wrong. Please Try Again..."))
    })
  }
  
  registerUser({ name, email, password }: { name: string; password: string; email: string }): Promise<UserCredential> {
    return new Promise((resolve, reject) =>{
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((resp: UserCredential) => {
          this.router.navigate(['/'])
          this.saveUserToFirestore({ name, email, password, authId: resp.user.uid })
          resolve(resp)
        })
        .catch((error) => reject(this.errorCodeMessages[error.code] ?? "Something went Wrong. Please Try Again..."))
    })
  }

  signoutCurrentUser() {
    this.auth.signOut();
  }

  saveUserToFirestore({name, email, authId, password}: { name: string, email: string, authId: string, password: string }) {
    let userObj = {
      name,
      email,
      authId,
      password,
      userId: doc(collection(this.firestore, "users")).id,
      createdOn: Timestamp.now(),
      active: true
    }
    let docRef = doc(this.firestore, `users/${userObj.userId}`);
    setDoc(docRef, { ...userObj }, { merge: true })
  }

  fetchUserDetailsFromFirestore(authId: string) {
    let queryRef = query(
      collection(this.firestore, "users"),
      where("authId", "==", authId)
    )

    const unsubscribe = onSnapshot(queryRef, (values) => {
      if(values.docs.length === 0) {
        // If user not found then there is no need snapshot 
        // for viewing changes so we here unsubscribing the subscribe
        unsubscribe();
      } else {
        this.userModel = { ...values.docs[0].data() as UserModel }
      }
    })
  }
}
