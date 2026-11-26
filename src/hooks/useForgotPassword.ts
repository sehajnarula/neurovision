
import { useState } from 'react';
import {
    getAuth,
    sendPasswordResetEmail,
} from '@react-native-firebase/auth';

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendResetEmail = async (email: string) => {
        try {
            setLoading(true);
            setError(null);

            const auth = getAuth();

            await sendPasswordResetEmail(
                auth,
                email.trim(),
            );

            return true;
        } catch (err: any) {
            console.log('Forgot password error:', err);

            let errorMessage = 'Unable to send password reset email.';

            switch (err.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email address.';
                    break;

                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;

                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Please try again later.';
                    break;

                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        sendResetEmail,
        loading,
        error,
    };
};
