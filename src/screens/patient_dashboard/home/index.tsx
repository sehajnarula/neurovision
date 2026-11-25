
import BaseText from 'components/base_components/base_text';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import {
  MaterialBottomTabScreenProps,
  useTheme,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getAuth } from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootState } from 'store';
import { PatientDashbordBottomTabBarParamList, PatientAppStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';

import usePatientReports from '../../../hooks/usePatientHook';
import PatientReportList from 'components/list_items/patient_report_list';

type HomeScreenProps = MaterialBottomTabScreenProps<
  PatientDashbordBottomTabBarParamList,
  'HomeScreen'
>;

const HomeScreen: React.FC<HomeScreenProps> = props => {
  const userData = useSelector(
    (state: RootState) => state.loginData.loginData,
  );

  const theme = useTheme();

  // Get logged-in patient's Firebase UID
  const patientId = getAuth().currentUser?.uid ?? null;

  // Fetch reports belonging to this patient
  const {
    reports,
    loading,
    error,
  } = usePatientReports(patientId);

  const parentNavigation = props.navigation.getParent() as
    | NativeStackNavigationProp<
      PatientAppStackParamList,
      'PatientViewReportScreen'
    >
    | undefined;

  return (
    <View style={styles.mainContainer}>
      <BaseText
        style={[
          theme.fonts.displayLarge,
          {
            marginHorizontal: ms(20),
            textAlign: 'center',
          },
        ]}
      >
        Welcome {userData?.userName ?? ''}
      </BaseText>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
          />
          <BaseText style={styles.message}>
            Loading reports...
          </BaseText>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <BaseText style={styles.message}>
            Unable to load reports.
          </BaseText>
        </View>
      ) : reports.length > 0 ? (
        parentNavigation ? (
          <PatientReportList
            data={reports}
            navigation={parentNavigation}
          />
        ) : (
          <View style={styles.centerContainer}>
            <BaseText style={styles.message}>
              Navigation unavailable.
            </BaseText>
          </View>
        )
      ) : (
        <View style={styles.centerContainer}>
          <BaseText style={styles.message}>
            There are no approved reports.
          </BaseText>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: vs(20),
    paddingVertical: vs(15),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginHorizontal: ms(20),
    textAlign: 'center',
    marginTop: vs(10),
  },
});
