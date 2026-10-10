import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

export const useSignIn = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const dispatch = useDispatch();

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            // 1. Get Firebase Auth instance
            const auth = getAuth();

            // 2. Sign in user
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const firebaseUser = response.user;

            // 3. Get Firestore instance
            const db = getFirestore();

            // 4. Get user's document
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userRef);

            const userDataFromDB = userDoc.data();

            // 5. Create application user object
            const userData = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name:
                    userDataFromDB?.name ||
                    firebaseUser.displayName ||
                    '',
            };

            setUser(userData);

            return userData;
        } catch (err: any) {
            console.log('signinerror', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        signIn,
        loading,
        error,
        user,
    };
};