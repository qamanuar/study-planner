// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  // Load session on mount
  useEffect(() => {
  const handleOAuthRedirect = async () => {
    await supabase.auth.getSessionFromUrl();
  };

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  };

  handleOAuthRedirect().then(getSession);

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => {
    listener?.subscription?.unsubscribe();
  };
}, []);


  // Email/Password Sign In
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
  };

  // Sign Up
  const signUpNewUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    // ✅ Case: User already registered (verified)
    if (error) {
      console.log("existed")
      if (error.message === "User already registered") {
        return {
          success: false,
          error: { message: "Email is already verified. Please log in." },
        };
      }

      // Other Supabase errors
      return { success: false, error };
    }

    // ⚠️ Case: Email exists, but not verified yet
    if (data.user && data.user.identities.length === 0) {
      console.log("not verified")
      return {
        success: false,
        error: {
          message:
            "Email is already existed. login or verify the email",
        },
      };
    }

    // ✅ Success
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: {
        message: "Unexpected error occurred",
        details: err,
      },
    };
  }
};


  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{ session, signIn, signUpNewUser, signOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
