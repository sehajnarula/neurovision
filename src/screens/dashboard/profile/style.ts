import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { ms, vs } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    container: {
      padding: ms(20),
      gap: vs(20),
    },
    header: {
      alignItems: 'center',
      gap: vs(8),
    },
    name: {
      fontSize: ms(20),
      fontWeight: '600',
    },
    email: {
      fontSize: ms(14),
    },
    section: {
      backgroundColor: theme.colors.card.cardBackground,
      borderRadius: ms(12),
      padding: ms(16),
      elevation: 2,
    },
    sectionTitle: {
      fontSize: ms(16),
      fontWeight: '500',
      marginBottom: vs(8),
    },
    divider: {
      marginBottom: vs(12),
    },
    itemLabel: {
      fontSize: ms(14),
      fontWeight: '500',
      marginTop: vs(8),
    },
    itemValue: {
      fontSize: ms(14),
      marginLeft: ms(4),
    },
    actionBtn: {
      marginTop: vs(10),
    },
  });
