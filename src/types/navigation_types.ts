export type AppStackParamList = {
  DashBoardScreen: undefined;
  PatientDashboardScreen: undefined;
  RecipesScreen: undefined;
  UpdateUserScreen: undefined;
  PatientUpdateUserScreen: undefined;
  CreateReportScreen: undefined;
  ViewReportScreen: {
    reportId: string;
  };
  PatientViewReportScreen: {
    reportId: string;
  };
};

export type AuthenticationStackParamList = {
  LoginScreen: undefined;
  SignUpScreen: undefined;
  SplashScreen: undefined;
  ForgotPasswordScreen: undefined;
};

export type DashbordBottomTabBarParamList = {
  HomeScreen: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
};

export type PatientDashbordBottomTabBarParamList = {
  HomeScreen: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
};

export type PatientAppStackParamList = {
  PatientDashboardScreen: undefined;
  PatientUpdateUserScreen: undefined;
  PatientViewReportScreen: { reportId: string };
};
