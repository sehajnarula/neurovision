import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useThemeContext } from 'context/theme_provider';
import React from 'react';
import { useTheme } from 'react-native-paper';
import PatientDashboardNavigator from 'navigation/patient_dashboard_navigator';
import PatientUpdateUserScreen from 'screens/patient_dashboard/patientUpdateUser';
import PatientViewReportScreen from 'screens/patient_dashboard/patientviewreport';
import { PatientAppStackParamList } from 'types/navigation_types';

const Stack = createNativeStackNavigator<PatientAppStackParamList>();

const PatientAppNavigator: React.FC = () => {
  const theme = useTheme();
  const { isDarkTheme } = useThemeContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: isDarkTheme ? 'light' : 'dark',
        statusBarTranslucent: false,
        statusBarBackgroundColor: theme.colors.statusBar.backgroundColor,
      }}>
      <Stack.Screen
        name="PatientDashboardScreen"
        component={PatientDashboardNavigator}
      />
      <Stack.Screen
        name="PatientUpdateUserScreen"
        component={PatientUpdateUserScreen}
      />
      <Stack.Screen
        name="PatientViewReportScreen"
        component={PatientViewReportScreen}
      />
    </Stack.Navigator>
  );
};

export default PatientAppNavigator;
