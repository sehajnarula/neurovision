import { StyleSheet, ViewStyle } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';

export const globalStyle = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    screenContainer: {
      height: '100%',
      width: '100%',
    },
    floatingActionButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      borderRadius: theme.radius.regular,
      backgroundColor: theme.colors.primary,
    },
  });

export const flex1: ViewStyle = {
  flex: 1,
};

export const centerAlignJustify: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
};

export const getTitleTextSize = (title: string, theme: MD3CustomTheme) => {
  if (title.length < 40) {
    return theme.fonts.titleMedium;
  }

  return theme.fonts.titleSmall;
};
