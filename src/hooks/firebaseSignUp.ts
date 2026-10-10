import { useState } from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from '@react-native-firebase/auth';

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';

export const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const signUp = async (
        name: string,
        email: string,
        password: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            // Firebase instances
            const auth = getAuth();
            const db = getFirestore();

            // 1. Create Firebase user
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const firebaseUser = response.user;

            // 2. Update Firebase user's display name
            await updateProfile(firebaseUser, {
                displayName: name,
            });

            // 4. Create user document in Firestore
            const userRef = doc(db, 'users', firebaseUser.uid);

            await setDoc(userRef, {
                name,
                email,
                createdAt: serverTimestamp(),
            });

            // 5. Create application user object
            const userData = {
                id: firebaseUser.uid,
                name,
                email,
            };

            // 6. Update local state
            setUser(userData);

            return userData;
        } catch (err: any) {
            console.log('signup error', err);

            setError(err.message);

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        signUp,
        loading,
        error,
        user,
    };
};
