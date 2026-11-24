import BaseText from 'components/base_components/base_text';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { useDialog } from 'context/app_dialog_provider';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialBottomTabScreenProps, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { PatientDashbordBottomTabBarParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';

type HomeScreenProps = MaterialBottomTabScreenProps<
  PatientDashbordBottomTabBarParamList,
  'HomeScreen'
>;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { showDialog, hideDialog } = useDialog();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.loginData.loginData);
  const theme = useTheme();

  return (
    <View style={style.mainContainer}>
      <View
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <BaseText
          style={[theme.fonts.displayLarge, { color: theme.colors.textColor.primary, alignSelf: 'flex-end', marginRight: ms(15) }]}
          children='+'
        />
        <BaseText
          style={[theme.fonts.displayLarge, { marginHorizontal: ms(20), textAlign: 'center' }]}
          children={`Welcome ${userData?.userName ?? ''}, There are no approved reports.`}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: vs(25),
    // justifyContent: 'center',
    // alignItems: 'center',
  },

});
