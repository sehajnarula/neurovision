
import { View, FlatList, TouchableOpacity } from 'react-native';
import BaseText from 'components/base_components/base_text';
import { Divider, useTheme } from 'react-native-paper';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from 'types/navigation_types';

interface ReportItem {
    id: string;
    patientName: string;
    title?: string;
    createdAt: any;
}

interface ReportListProps {
    data: ReportItem[];
    navigation: NativeStackNavigationProp<
        AppStackParamList,
        'ViewReportScreen'>;
}

const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date instanceof Date) {
        return date.toLocaleDateString();
    }
    if (typeof date?.toDate === 'function') {
        return date.toDate().toLocaleDateString();
    }
    return String(date);
};

const ReportList = ({ data, navigation }: ReportListProps) => {
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
                            navigation.navigate("ViewReportScreen", {
                                reportId: item.id
                            });
                        }}
                    >
                        <BaseText
                            style={[
                                styles.sectionTitle,
                                { color: theme.colors.primary },
                            ]}
                        >
                            {item.title ?? 'MRI Analysis Report'}
                        </BaseText>

                        <Divider style={styles.divider} />

                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <BaseText style={styles.itemLabel}>
                                {item.patientName}
                            </BaseText>
                            <BaseText style={{ marginTop: 5 }}>
                                Uploaded On: {formatDate(item.createdAt)}
                            </BaseText>
                        </View>

                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ReportList;
