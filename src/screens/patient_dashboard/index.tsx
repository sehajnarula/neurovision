import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PatientDashboardNavigator from 'navigation/patient_dashboard_navigator';
import React from 'react';
import { AppStackParamList } from 'types/navigation_types';

type PatientDashboardScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'PatientDashboardScreen'
>;

const PatientDashboardScreen: React.FC<PatientDashboardScreenProps> = props => {
  return <PatientDashboardNavigator />;
};

export default PatientDashboardScreen;
