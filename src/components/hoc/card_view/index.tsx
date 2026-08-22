import React from 'react';
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { MD3CustomTheme, useTheme } from 'react-native-paper';
import { ms } from 'utilities/scale_utils';

type CardViewCompProps = PressableProps & {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const CardViewComp: React.FC<CardViewCompProps> = props => {
  const theme = useTheme();
  const styles = style(theme);
  return (
    <View style={[styles.cardView, props?.style]}>
      {props?.children ?? null}
    </View>
  );
};

const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    cardView: {
      padding: ms(10),
      borderRadius: theme.radius.small,
      backgroundColor: theme.colors.card.cardBackground,
      marginVertical: ms(10),
      boxShadow: `1px 1px 5px 2px ${theme.colors.shadow}`,
    },
  });

const CardView = React.memo(CardViewComp);
export default CardView;
