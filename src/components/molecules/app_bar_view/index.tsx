import { useNavigation } from '@react-navigation/native';
import BaseText from 'components/base_components/base_text';
import React from 'react';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { MaterialIcon } from 'utilities/constants';
import { getTitleTextSize } from 'utilities/global_styles';
import { ms } from 'utilities/scale_utils';
import { style } from './style';

type BackWithTitleCompProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  right?: React.ReactNode;
};

const AppBarViewComp: React.FC<BackWithTitleCompProps> = props => {
  const { title, subtitle } = props;
  const theme = useTheme();
  const viewStyle = style(theme);
  const navigation = useNavigation();

  return (
    <View style={viewStyle.mainContainer}>
      {/* Back Button */}
      <IconButton
        icon={MaterialIcon.CHEVRON_LEFT}
        size={ms(30)}
        style={viewStyle.backButton}
        iconColor={theme.colors.onPrimary}
        mode="contained"
        containerColor={'rgba(255, 255, 255, 0.15)'}
        onPress={props?.onBackPress ? props?.onBackPress : navigation.goBack}
      />

      {/* Title Section */}
      <View style={viewStyle.titleContainer}>
        <BaseText
          style={[viewStyle.title, getTitleTextSize(title, theme)]}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {title}
        </BaseText>
        {subtitle && (
          <BaseText
            style={viewStyle.subtitle}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {subtitle}
          </BaseText>
        )}
      </View>

      {/* Spacer */}
      <View style={viewStyle.spacer} />

      {/* Right component (optional) */}
      {props?.right && (
        <View style={viewStyle.rightContainer}>{props.right}</View>
      )}
    </View>
  );
};

export const AppBarView = React.memo(AppBarViewComp);
