
import { View, FlatList, TouchableOpacity } from 'react-native';
import BaseText from 'components/base_components/base_text';
import { Divider, useTheme } from 'react-native-paper';
import { style } from '../../list_items/patient_report_list/style';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PatientAppStackParamList } from 'types/navigation_types';
import type { PatientReport } from '../../../hooks/usePatientHook';

interface ReportListProps {
    data: PatientReport[];
    navigation: NativeStackNavigationProp<
        PatientAppStackParamList,
        'PatientViewReportScreen'
    >;
}

const formatDate = (timestamp: any) => {
    if (!timestamp) {
        return 'N/A';
    }

    const date =
        timestamp?._seconds != null
            ? new Date(
                timestamp._seconds * 1000 +
                (timestamp._nanoseconds ?? 0) / 1_000_000,
            )
            : typeof timestamp?.toDate === 'function'
                ? timestamp.toDate()
                : new Date(timestamp);

    if (isNaN(date.getTime())) {
        return 'N/A';
    }

    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const PatientReportList = ({ data, navigation }: ReportListProps) => {
    const theme = useTheme();
    const styles = style(theme);

    return (
        <View>
            <FlatList
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.section}
                        onPress={() => {
                            navigation.navigate('PatientViewReportScreen', {
                                reportId: item.id,
                            });
                        }}
                    >
                        <BaseText
                            style={[
                                styles.sectionTitle,
                                { color: theme.colors.primary },
                            ]}
                        >
                            MRI Analysis Report
                        </BaseText>

                        <Divider style={styles.divider} />

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            {/* <BaseText style={styles.itemLabel}>
                                Approved By: {item.doctorName}
                            </BaseText> */}

                            <BaseText style={{ marginTop: 5 }}>
                                Date: {formatDate(item.createdAt)}
                            </BaseText>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default PatientReportList;
