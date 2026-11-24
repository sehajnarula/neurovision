
import { useState } from 'react';

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
} from '@react-native-firebase/firestore';

type UserDetails = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    userType?: string;
};

export const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserDetails | null>(null);

    // Fetch existing user details using Firebase UID
    const fetchUserDetails = async (uid: string) => {
        setLoading(true);
        setError(null);

        try {
            const db = getFirestore();

            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                throw new Error('User details not found');
            }

            const userData = {
                id: uid,
                ...userSnap.data(),
            } as UserDetails;

            setUser(userData);

            return userData;
        } catch (err: any) {
            console.log('Fetch user error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update only name and phone number
    const updateUserDetails = async (
        name: string,
        phoneNumber: string,
    ) => {
        if (!user?.id) {
            throw new Error('User details not fetched');
        }

        setLoading(true);
        setError(null);

        try {
            const db = getFirestore();

            const userRef = doc(db, 'users', user.id);

            await updateDoc(userRef, {
                name,
                phoneNumber,
            });

            const updatedUser = {
                ...user,
                name,
                phoneNumber,
            };

            setUser(updatedUser);

            return updatedUser;
        } catch (err: any) {
            console.log('Update user error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchUserDetails,
        updateUserDetails,
        loading,
        error,
        user,
    };
};
