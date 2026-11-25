
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    View,
    Platform
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

import {
    getFirestore,
    doc,
    getDoc,
} from '@react-native-firebase/firestore';

import BaseText from 'components/base_components/base_text';
import { AppStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
import { generatePDF } from 'react-native-html-to-pdf';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs'

type ViewReportScreenProps = NativeStackScreenProps<
    AppStackParamList,
    'ViewReportScreen'
>;

interface Report {
    id: string;
    patientId: string;
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
}

const ViewReportScreen: React.FC<ViewReportScreenProps> = ({ route }) => {
    const theme = useTheme();

    const { reportId } = route.params;

    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingPDF, setDownloadingPDF] = useState(false);

    const handleGeneratePDF = async () => {
        if (!report || downloadingPDF) {
            return;
        }

        setDownloadingPDF(true);

        try {
            if (typeof generatePDF !== 'function') {
                throw new Error(
                    'PDF module is not available. Please rebuild the app.',
                );
            }

            // Generate an optimized Cloudinary image URL
            const imageSource = report.image
                ? report.image.replace(
                    '/upload/',
                    '/upload/f_jpg,q_auto:good,w_1200,c_limit/',
                )
                : '';

            // Unique filename for every download
            const uniqueId = `${report.id}_${Date.now()}`;
            const fileName = `MRI_Report_${uniqueId}`;

            // HTML content
            const htmlContent = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    padding: 25px;
                    color: #222;
                  }
    
                  h1 {
                    text-align: center;
                    color: #243B64;
                  }
    
                  h2 {
                    color: #243B64;
                    margin-top: 25px;
                  }
    
                  .image {
                    width: 100%;
                    height: 300px;
                    object-fit: contain;
                    margin-top: 15px;
                  }
    
                  .row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #ddd;
                  }
    
                  .value {
                    font-weight: bold;
                  }
                </style>
              </head>
    
              <body>
                <h1>MRI Analysis Report</h1>
    
                <h2>MRI Segmentation Image</h2>
    
                ${imageSource
                    ? `<img class="image" src="${imageSource}" />`
                    : '<p>Image not available.</p>'
                }
    
                <h2>Diagnosis</h2>
    
                <div class="row">
                  <span>Tumour Detected</span>
                  <span class="value">
                    ${report.tumorDetected ? 'Yes' : 'No'}
                  </span>
                </div>
    
                <div class="row">
                  <span>Whole Tumour Volume</span>
                  <span class="value">
                    ${report.wholeTumorMl ?? 0} mL
                  </span>
                </div>
    
                <div class="row">
                  <span>Tumour Core Volume</span>
                  <span class="value">
                    ${report.tumorCoreMl ?? 0} mL
                  </span>
                </div>
    
                <h2>Tumour Volume Details</h2>
    
                <div class="row">
                  <span>Edema</span>
                  <span class="value">
                    ${report.volumeMl?.edema ?? 0} mL
                  </span>
                </div>
    
                <div class="row">
                  <span>Enhancing Tumour</span>
                  <span class="value">
                    ${report.volumeMl?.enhancingTumor ?? 0} mL
                  </span>
                </div>
    
                <div class="row">
                  <span>Necrotic Core</span>
                  <span class="value">
                    ${report.volumeMl?.necroticCore ?? 0} mL
                  </span>
                </div>
    
              </body>
            </html>
            `;

            // Generate PDF
            const pdf = await generatePDF({
                html: htmlContent,
                fileName,
                base64: false,
            });

            if (!pdf.filePath) {
                throw new Error('PDF generation failed.');
            }

            // Verify generated PDF
            const pdfExists = await RNFS.exists(pdf.filePath);

            if (!pdfExists) {
                throw new Error('Generated PDF file does not exist.');
            }

            const pdfInfo = await RNFS.stat(pdf.filePath);

            if (Number(pdfInfo.size) <= 0) {
                throw new Error('Generated PDF is empty.');
            }

            // Save PDF to Android Downloads
            if (Platform.OS === 'android') {
                const destinationPath =
                    `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;

                await RNFS.moveFile(
                    pdf.filePath,
                    destinationPath,
                );

                const saved = await RNFS.exists(destinationPath);

                if (!saved) {
                    throw new Error('Unable to save PDF to Downloads.');
                }

                console.log('PDF saved at:', destinationPath);

                Alert.alert(
                    'PDF Saved',
                    `Your report has been saved in Downloads:\n${fileName}.pdf`,
                );
            } else {
                // iOS: Keep PDF in app storage
                Alert.alert(
                    'PDF Generated',
                    `Report generated successfully:\n${pdf.filePath}`,
                );
            }

        } catch (error) {
            console.error('PDF generation error:', error);

            Alert.alert(
                'PDF Error',
                error instanceof Error
                    ? error.message
                    : 'Unable to generate PDF.',
            );
        } finally {
            setDownloadingPDF(false);
        }
    };

    // const handleGeneratePDF = async () => {
    //     try {
    //         if (!report) {
    //             Alert.alert('Error', 'Report data is not available.');
    //             return;
    //         }

    //         if (typeof generatePDF !== 'function') {
    //             console.error('generatePDF function is not available.');

    //             Alert.alert(
    //                 'Module Error',
    //                 'PDF module is not available. Please rebuild the app.',
    //             );
    //             return;
    //         }

    //         const htmlContent = `
    //   <html>
    //     <head>
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    //       <style>
    //         body {
    //           font-family: Arial, sans-serif;
    //           padding: 25px;
    //           color: #222;
    //         }

    //         h1 {
    //           text-align: center;
    //           color: #243B64;
    //         }

    //         h2 {
    //           color: #243B64;
    //           margin-top: 25px;
    //         }

    //         .image {
    //           width: 100%;
    //           height: 300px;
    //           object-fit: contain;
    //           margin-top: 15px;
    //         }

    //         .row {
    //           display: flex;
    //           justify-content: space-between;
    //           padding: 12px 0;
    //           border-bottom: 1px solid #ddd;
    //         }

    //         .value {
    //           font-weight: bold;
    //         }
    //       </style>
    //     </head>

    //     <body>
    //       <h1>MRI Analysis Report</h1>

    //       <h2>MRI Segmentation Image</h2>
    //       <img class="image" src="${report.image}" />

    //       <h2>Diagnosis</h2>

    //       <div class="row">
    //         <span>Tumour Detected</span>
    //         <span class="value">
    //           ${report.tumorDetected ? 'Yes' : 'No'}
    //         </span>
    //       </div>

    //       <div class="row">
    //         <span>Whole Tumour Volume</span>
    //         <span class="value">${report.wholeTumorMl ?? 0} mL</span>
    //       </div>

    //       <div class="row">
    //         <span>Tumour Core Volume</span>
    //         <span class="value">${report.tumorCoreMl ?? 0} mL</span>
    //       </div>

    //       <h2>Tumour Volume Details</h2>

    //       <div class="row">
    //         <span>Edema</span>
    //         <span class="value">${report.volumeMl?.edema ?? 0} mL</span>
    //       </div>

    //       <div class="row">
    //         <span>Enhancing Tumour</span>
    //         <span class="value">
    //           ${report.volumeMl?.enhancingTumor ?? 0} mL
    //         </span>
    //       </div>

    //       <div class="row">
    //         <span>Necrotic Core</span>
    //         <span class="value">
    //           ${report.volumeMl?.necroticCore ?? 0} mL
    //         </span>
    //       </div>
    //     </body>
    //   </html>
    // `;

    //         // Step 1: Generate PDF in temporary storage
    //         const pdf = await generatePDF({
    //             html: htmlContent,
    //             fileName: `MRI_Report_${report.id}`,
    //             base64: false,
    //         });

    //         if (!pdf.filePath) {
    //             throw new Error('PDF generation failed. File path not found.');
    //         }

    //         // Step 2: Save PDF
    //         if (Platform.OS === 'android') {
    //             const destinationPath =
    //                 `${RNFS.DownloadDirectoryPath}/MRI_Report_${report.id}.pdf`;

    //             // Remove an existing file with the same name
    //             const fileExists = await RNFS.exists(destinationPath);

    //             if (fileExists) {
    //                 await RNFS.unlink(destinationPath);
    //             }

    //             await RNFS.moveFile(pdf.filePath, destinationPath);

    //             console.log('PDF saved at:', destinationPath);

    //             Alert.alert(
    //                 'PDF Saved',
    //                 `Your report has been saved to Downloads/MRI_Report_${report.id}.pdf`,
    //             );
    //         } else {
    //             // iOS: Keep the generated PDF in app storage.
    //             // No sharing is performed.
    //             console.log('PDF saved at:', pdf.filePath);

    //             Alert.alert(
    //                 'PDF Generated',
    //                 `Your report has been generated successfully:\n${pdf.filePath}`,
    //             );
    //         }
    //     } catch (error) {
    //         console.error('PDF Error:', error);
    //         Alert.alert('Error', 'Failed to generate PDF.');
    //     }
    // };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError(null);

                const db = getFirestore();

                const reportRef = doc(db, 'reports', reportId);
                const reportSnapshot = await getDoc(reportRef);

                if (!reportSnapshot.exists()) {
                    setError('Report not found.');
                    return;
                }

                const reportData = reportSnapshot.data();

                setReport({
                    id: reportSnapshot.id,
                    patientId: reportData.patientId,
                    doctorId: reportData.doctorId,
                    image: reportData.image,
                    tumorDetected: reportData.tumorDetected,
                    wholeTumorMl: reportData.wholeTumorMl,
                    tumorCoreMl: reportData.tumorCoreMl,
                    volumeMl: reportData.volumeMl,
                });
            } catch (err: any) {
                console.log('Fetch report error:', err);
                setError(err.message ?? 'Unable to fetch report.');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [reportId]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                />
                <BaseText>Loading report...</BaseText>
            </View>
        );
    }

    if (error || !report) {
        return (
            <View style={styles.centerContainer}>
                <BaseText>
                    {error ?? 'Report not found.'}
                </BaseText>
            </View>
        );
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* MRI Image */}


            <BaseText style={{ color: theme.colors.primary, fontSize: ms(12), marginTop: vs(15), alignSelf: 'flex-end' }}
                onPress={handleGeneratePDF}>
                {downloadingPDF ? 'Generating PDF...' : 'Download'}
            </BaseText>

            <BaseText style={styles.heading}>
                MRI Segmentation Image
            </BaseText>

            {report.image ? (
                <Image
                    source={{ uri: report.image }}
                    style={styles.image}
                    resizeMode="contain"
                />
            ) : (
                <View style={styles.noImageContainer}>
                    <BaseText>Image not available.</BaseText>
                </View>
            )}

            {/* Diagnosis */}

            <BaseText style={styles.heading}>
                Diagnosis
            </BaseText>

            <View style={styles.diagnosisContainer}>
                <View style={styles.row}>
                    <BaseText style={styles.label}>
                        Tumour Detected
                    </BaseText>

                    <BaseText style={styles.value}>
                        {report.tumorDetected ? 'Yes' : 'No'}
                    </BaseText>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <BaseText style={styles.label}>
                        Whole Tumour Volume
                    </BaseText>

                    <BaseText style={styles.value}>
                        {report.wholeTumorMl ?? 0} mL
                    </BaseText>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <BaseText style={styles.label}>
                        Tumour Core Volume
                    </BaseText>

                    <BaseText style={styles.value}>
                        {report.tumorCoreMl ?? 0} mL
                    </BaseText>
                </View>
            </View>

            {/* Volume Details */}

            <BaseText style={styles.heading}>
                Tumour Volume Details
            </BaseText>

            <View style={styles.diagnosisContainer}>
                <View style={styles.row}>
                    <BaseText style={styles.label}>
                        Edema
                    </BaseText>

                    <BaseText style={styles.value}>
                        {report.volumeMl?.edema ?? 0} mL
                    </BaseText>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <BaseText style={styles.label}>
                        Enhancing Tumour
                    </BaseText>

                    <BaseText style={styles.value}>
                        {report.volumeMl?.enhancingTumor ?? 0} mL
                    </BaseText>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <BaseText style={styles.label}>
                        Necrotic Core
                    </BaseText>

                    <BaseText style={styles.value}>
                        {report.volumeMl?.necroticCore ?? 0} mL
                    </BaseText>
                </View>
            </View>
        </ScrollView>
    );
};

export default ViewReportScreen;

const styles = StyleSheet.create({
    container: {
        padding: ms(16),
        paddingBottom: vs(30),
    },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: vs(12),
    },

    heading: {
        fontSize: ms(18),
        fontWeight: 'bold',
        marginBottom: vs(12),
        marginTop: vs(16),
    },

    image: {
        width: '100%',
        height: vs(280),
        borderRadius: 8,
    },

    noImageContainer: {
        height: vs(150),
        justifyContent: 'center',
        alignItems: 'center',
    },

    diagnosisContainer: {
        padding: ms(14),
        borderRadius: 8,
        gap: vs(12),
        backgroundColor: '#F5F5F5',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    label: {
        fontSize: ms(14),
    },

    value: {
        fontSize: ms(14),
        fontWeight: 'bold',
    },

    divider: {
        height: 1,
        backgroundColor: '#DDDDDD',
    },
});
