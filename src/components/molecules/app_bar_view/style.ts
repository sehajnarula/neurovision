import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { ms, vs } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    // Main Container
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: ms(16),
      paddingVertical: vs(12),
      minHeight: vs(64),
      borderBottomStartRadius: theme.radius.large,
      borderBottomEndRadius: theme.radius.large,
    },
    // Back Button
    backButton: { marginRight: ms(15), height: ms(40), width: ms(40) },

    // Title Container
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      color: theme.colors.onPrimary,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    subtitle: {
      color: theme.colors.onPrimary,
      fontSize: ms(12),
      marginTop: vs(2),
      opacity: 0.85,
      fontWeight: '500',
    },

    // Spacer
    spacer: {
      flex: 0,
    },

    // Right Container
    rightContainer: {
      marginLeft: ms(12),
    },
  });
