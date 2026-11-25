
import { useState } from 'react';
import axios from 'axios';

const CLOUD_NAME = 'key';
const UPLOAD_PRESET = 'my_unsigned_upload';

const cloudinaryApi = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const useUploadOnCloudinary = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const uploadImage = async (imageData: string) => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();

            formData.append('file', imageData);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await axios.post(
                cloudinaryApi,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data;
        } catch (err: any) {
            console.log(
                'Cloudinary Error:',
                err.response?.data || err.message
            );

            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadImage,
        loading,
        error,
    };
};
