import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { style } from './style';

const ListLoaderComp: React.FC = () => {
  const theme = useTheme();
  return (
    <View style={style(theme).loaderContainer}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

export const ListLoader = React.memo(ListLoaderComp);
