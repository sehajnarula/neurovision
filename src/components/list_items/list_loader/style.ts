import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';

export const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    loaderContainer: {
      height: theme.dimensions.height * 0.1,
      width: theme.dimensions.width * 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
