import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ms } from 'utilities/scale_utils';
import CustomLoader from '../custom_loader';
import { style } from './style';

const LoaderComp: React.FC = () => {
  const theme = useTheme();
  const viewStyle = style(theme);

  return (
    <View style={style(theme).mainContainer}>
      <View style={viewStyle.loaderBackgroundContainer}>
        <CustomLoader size={ms(75)} type="spinner" />
      </View>
    </View>
  );
};

export const LoaderComponent = React.memo(LoaderComp);
