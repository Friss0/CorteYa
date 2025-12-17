import React, { useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const signIn = async () => {
            try {
                const userCredential = await signInAnonymously(auth);
                console.log("✅ Authenticated anonymously:", userCredential.user.uid);
                setUser(userCredential.user);
            } catch (error) {
                console.error("❌ Authentication failed:", error);
            } finally {
                setLoading(false);
            }
        };

        // Listen for auth state changes (persisting session)
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                console.log("🔄 Auth State: Valid session found", currentUser.uid);
                setUser(currentUser);
                setLoading(false);
            } else {
                console.log("🔄 Auth State: No session, signing in...");
                signIn();
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-500">Conectando...</span>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthProvider;
