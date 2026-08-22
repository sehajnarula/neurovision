import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';

export const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    mainContainer: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
