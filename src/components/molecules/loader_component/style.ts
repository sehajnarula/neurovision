import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';

export const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    mainContainer: {
      height: theme.dimensions.height,
      width: theme.dimensions.width,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.loader.backdrop,
    },
    loaderBackgroundContainer: {
      height: theme.dimensions.width * 0.4,
      width: theme.dimensions.width * 0.4,
      borderRadius: theme.radius.regular,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.loader.background,
    },
  });
