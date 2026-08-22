import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { ms } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    listContainer: {
      maxHeight: theme.dimensions.height * 0.75,
      width: '100%',
      paddingHorizontal: ms(16),
    },
    listItem: {
      height: ms(60),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: ms(10),
      borderBottomWidth: ms(2),
      borderBottomColor: theme.colors.surfaceVariant,
    },
  });
