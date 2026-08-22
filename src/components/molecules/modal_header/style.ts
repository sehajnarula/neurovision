import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { ms } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    mainConatiner: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headingTextUserName: { width: '100%', flex: 1 },
    closeIcon: {
      borderRadius: theme.radius.regular,
      padding: ms(7),
      backgroundColor: theme.colors.primary,
    },
  });
