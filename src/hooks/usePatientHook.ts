import {
    collection,
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    query,
    where,
} from '@react-native-firebase/firestore';

import React from 'react';

export interface PatientReport {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    image: string;
    tumorDetected: boolean;
    wholeTumorMl: number;
    tumorCoreMl: number;
    volumeMl: {
        edema: number;
        enhancingTumor: number;
        necroticCore: number;
    };
    createdAt: any;
}

const usePatientReports = (patientId: string | null) => {
    const [reports, setReports] = React.useState<PatientReport[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!patientId) {
            setReports([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const db = getFirestore();

        const reportsQuery = query(
            collection(db, 'reports'),
            where('patientId', '==', patientId),
        );

        const unsubscribe = onSnapshot(
            reportsQuery,
            async snapshot => {
                try {
                    const reportList = await Promise.all(
                        snapshot.docs.map(async reportDoc => {
                            const reportData = reportDoc.data();

                            let doctorName = 'Unknown Doctor';

                            if (reportData.doctorId) {
                                const doctorRef = doc(
                                    db,
                                    'users',
                                    reportData.doctorId,
                                );

                                const doctorSnapshot = await getDoc(doctorRef);

                                if (doctorSnapshot.exists()) {
                                    const doctorData = doctorSnapshot.data();
                                    doctorName =
                                        doctorData?.name ??
                                        doctorData?.userName ??
                                        'Unknown Doctor';
                                }
                            }

                            return {
                                id: reportDoc.id,
                                patientId: reportData.patientId,
                                doctorId: reportData.doctorId,
                                doctorName,
                                image: reportData.image,
                                tumorDetected: reportData.tumorDetected,
                                wholeTumorMl: reportData.wholeTumorMl,
                                tumorCoreMl: reportData.tumorCoreMl,
                                volumeMl: reportData.volumeMl,
                                createdAt: reportData.createdAt,
                            } as PatientReport;
                        }),
                    );

                    setReports(reportList);
                    setLoading(false);
                } catch (err) {
                    console.error('Fetch patient reports error:', err);
                    setError('Unable to fetch patient reports.');
                    setLoading(false);
                }
            },
            err => {
                console.error('Patient reports listener error:', err);
                setError(err.message);
                setLoading(false);
            },
        );

        return unsubscribe;
    }, [patientId]);

    return {
        reports,
        loading,
        error,
    };
};

export default usePatientReports;