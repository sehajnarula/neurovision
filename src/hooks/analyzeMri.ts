
import { useCallback, useState } from 'react';
import axios from 'axios';

import { axiosInstance } from 'api/api_client';
import { TUMOR_SEGMENTATION_BASE_URL } from 'utilities/constants';

export interface MRIFile {
    uri: string;
    name: string;
    type?: string;
}

export interface MRIUploadFiles {
    flair: MRIFile;
    t1: MRIFile;
    t1ce: MRIFile;
    t2: MRIFile;
}

export interface TumorPredictionResponse {
    tumor_detected: boolean;

    volume_ml: {
        necrotic_core: number;
        edema: number;
        enhancing_tumor: number;
    };

    whole_tumor_ml: number;
    tumor_core_ml: number;
    voxel_volume_mm3: number;

    voxels: {
        necrotic_core: number;
        edema: number;
        enhancing_tumor: number;
    };

    legend: {
        necrotic_core: string;
        edema: string;
        enhancing_tumor: string;
    };

    previews: {
        axial: {
            slice_index: number;
            image: string;
        };
        coronal: {
            slice_index: number;
            image: string;
        };
        sagittal: {
            slice_index: number;
            image: string;
        };
    };
}

const tumorApi = axiosInstance(TUMOR_SEGMENTATION_BASE_URL);

const useTumorPrediction = () => {
    const [loading, setLoading] = useState(false);

    const [data, setData] =
        useState<TumorPredictionResponse | null>(null);

    const [error, setError] = useState<string | null>(null);

    const predictTumor = useCallback(
        async (files: MRIUploadFiles) => {
            try {
                setLoading(true);
                setError(null);
                setData(null);

                const formData = new FormData();

                const appendFile = (
                    fieldName: string,
                    file: MRIFile,
                ) => {
                    formData.append(fieldName, {
                        uri: file.uri,
                        name: file.name,
                        type:
                            file.type ??
                            'application/octet-stream',
                    } as any);
                };

                appendFile('flair', files.flair);
                appendFile('t1', files.t1);
                appendFile('t1ce', files.t1ce);
                appendFile('t2', files.t2);

                const response =
                    await tumorApi.post<TumorPredictionResponse>(
                        '/predict/app',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            timeout: 300000,
                        },
                    );

                setData(response.data);

                return response.data;
            } catch (err: unknown) {
                let message = 'Unable to process MRI prediction';

                if (axios.isAxiosError(err)) {
                    const detail = err.response?.data?.detail;

                    message =
                        (typeof detail === 'string' ? detail : undefined) ||
                        err.response?.data?.message ||
                        err.message ||
                        message;
                } else if (err instanceof Error) {
                    message = err.message;
                }

                setError(message);

                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        predictTumor,
        loading,
        data,
        error,
        reset,
    };
};

export default useTumorPrediction;
