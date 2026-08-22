import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { vs } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    imageContainer: {
      alignSelf: 'center',
      padding: 10,
      backgroundColor: theme.colors.backdrop,
      borderRadius: theme.radius.regular,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(15),
    },
    logoImage: {
      height: theme.dimensions.height * 0.04,
      width: theme.dimensions.width * 0.55,
    },
  });
