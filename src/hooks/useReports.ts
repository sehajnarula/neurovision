
import { useEffect, useState } from 'react';

import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
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

type ReportUserField = 'patientId' | 'doctorId';

const useReports = (
    userId: string | null,
    userField: ReportUserField,
) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setReports([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const db = getFirestore();

        const reportsQuery = query(
            collection(db, 'reports'),
            where(userField, '==', userId),
            orderBy('createdAt', 'desc'),
        );

        const unsubscribe = onSnapshot(
            reportsQuery,
            async snapshot => {
                try {
                    const reportList: Report[] = await Promise.all(
                        snapshot.docs.map(async reportDoc => {
                            const reportData = reportDoc.data();

                            const patientRef = doc(
                                db,
                                'users',
                                reportData.patientId,
                            );

                            const patientSnapshot = await getDoc(patientRef);

                            const patientData = patientSnapshot.exists()
                                ? patientSnapshot.data()
                                : null;

                            // Convert Firestore timestamp into JavaScript Date
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
                                patientId: reportData.patientId,
                                patientName: patientData?.name ?? 'Unknown Patient',
                                doctorId: reportData.doctorId,
                                image: reportData.image,
                                tumorDetected: reportData.tumorDetected,
                                wholeTumorMl: reportData.wholeTumorMl,
                                tumorCoreMl: reportData.tumorCoreMl,
                                volumeMl: reportData.volumeMl,
                                createdAt,
                            } as Report;
                        }),
                    );

                    setReports(reportList);
                    setLoading(false);
                } catch (err: any) {
                    console.log('Fetch patient details error:', err);
                    setError(err.message);
                    setLoading(false);
                }
            },
            err => {
                console.log('Fetch reports error:', err);
                setError(err.message);
                setLoading(false);
            },
        );

        return unsubscribe;
    }, [userId, userField]);

    return {
        reports,
        loading,
        error,
    };
};

export default useReports;