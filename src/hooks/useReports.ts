
import { useEffect, useState } from 'react';

import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
} from '@react-native-firebase/firestore';

export interface Report {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    image: string;
    tumorDetected: boolean;
    wholeTumorMl: number;
    tumorCoreMl: number;
    volumeMl: {
        edema: number;
        enhancingTumor: number;
        necroticCore: number;
    };
    createdAt: Date | null;
}

const useReports = (doctorId: string | null) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doctorId) {
            console.log('Doctor ID not available');

            setReports([]);
            setLoading(false);
            return;
        }

        console.log('Fetching reports for doctor:', doctorId);

        setLoading(true);
        setError(null);

        const db = getFirestore();

        const reportsQuery = query(
            collection(db, 'reports'),
            where('doctorId', '==', doctorId),
        );

        const unsubscribe = onSnapshot(
            reportsQuery,
            async snapshot => {
                console.log('Doctor reports found:', snapshot.size);

                try {
                    const reportList: Report[] = await Promise.all(
                        snapshot.docs.map(async reportDoc => {
                            const reportData = reportDoc.data();

                            let patientName = 'Unknown Patient';

                            // Fetch patient details
                            if (reportData.patientId) {
                                try {
                                    const patientRef = doc(
                                        db,
                                        'users',
                                        reportData.patientId,
                                    );

                                    const patientSnapshot = await getDoc(patientRef);

                                    if (patientSnapshot.exists()) {
                                        const patientData = patientSnapshot.data();

                                        patientName =
                                            patientData?.name ??
                                            patientData?.userName ??
                                            'Unknown Patient';
                                    }
                                } catch (patientError) {
                                    console.log(
                                        'Patient details fetch error:',
                                        patientError,
                                    );
                                }
                            }

                            // Convert Firestore timestamp to JavaScript Date
                            const timestamp = reportData.createdAt;

                            let createdAt: Date | null = null;

                            if (timestamp?.toDate) {
                                createdAt = timestamp.toDate();
                            } else if (timestamp?._seconds != null) {
                                createdAt = new Date(
                                    timestamp._seconds * 1000 +
                                    (timestamp._nanoseconds ?? 0) / 1000000,
                                );
                            } else if (timestamp) {
                                const parsedDate = new Date(timestamp);

                                createdAt = isNaN(parsedDate.getTime())
                                    ? null
                                    : parsedDate;
                            }

                            return {
                                id: reportDoc.id,
                                patientId: reportData.patientId ?? '',
                                patientName,
                                doctorId: reportData.doctorId ?? '',
                                image: reportData.image ?? '',
                                tumorDetected: reportData.tumorDetected ?? false,
                                wholeTumorMl: reportData.wholeTumorMl ?? 0,
                                tumorCoreMl: reportData.tumorCoreMl ?? 0,
                                volumeMl: reportData.volumeMl ?? {
                                    edema: 0,
                                    enhancingTumor: 0,
                                    necroticCore: 0,
                                },
                                createdAt,
                            };
                        }),
                    );

                    // Sort reports by latest date
                    reportList.sort((a, b) => {
                        return (
                            (b.createdAt?.getTime() ?? 0) -
                            (a.createdAt?.getTime() ?? 0)
                        );
                    });

                    setReports(reportList);
                    setLoading(false);
                } catch (err: any) {
                    console.error('Doctor reports processing error:', err);

                    setError(err?.message ?? 'Unable to fetch reports.');
                    setLoading(false);
                }
            },
            err => {
                console.error('Doctor reports listener error:', err);

                setError(err.message);
                setLoading(false);
            },
        );

        return unsubscribe;
    }, [doctorId]);

    return {
        reports,
        loading,
        error,
    };
};

export default useReports;
