// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe9w63ftIwyPhqCki-PyDD2y2TXZMmPis",
  authDomain: "netflix-clone-59046.firebaseapp.com",
  projectId: "netflix-clone-59046",
  storageBucket: "netflix-clone-59046.appspot.com",
  messagingSenderId: "788637414283",
  appId: "1:788637414283:web:2aa82d9a6e6de9f9b1b58e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
const auth = getAuth(app);

type AuthContextType = ReturnType<typeof useProvideAuth>;
// AuthContextType  is of type , whatever is returned by useProvideAuth
// hover over it to check it

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

function useProvideAuth() {
  // User(rhs) is coming/imported from firebase/auth
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // onAuthStateChanged - detects if there are any changes to user object
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // when there are any changes , we update user
      user ? setUser(user) : setUser(null);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  // Runs only in first render

  const signUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password).then(({ user }) => {
      setUser(user);
      return user;
    });

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
      setUser(user);
      return user;
    });
  const signOutUser = signOut(auth).then(() => setUser(null));
  //TODOS:   shouldn't this be function like signIn & signUp

  return { signUp, signIn, signOut: signOutUser, user };
}

export const useAuth = () => useContext(AuthContext) ?? ({} as AuthContextType);
