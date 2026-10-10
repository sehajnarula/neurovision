import { useState } from 'react';
import axios from 'axios';

const CLOUD_NAME = 'dhysnyzr8';
const UPLOAD_PRESET = 'my_unsigned_upload';

export const useUploadOnCloudinary = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);

    const uploadFile = async (file: any) => {
        try {
            setLoading(true);
            setError(null);

            const data = new FormData();

            data.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.name,
            });

            data.append('upload_preset', UPLOAD_PRESET);

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return res.data;

        } catch (err: any) {
            console.error('Upload error:', err.response?.data || err.message);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadFile,
        loading,
        error,
    };
};