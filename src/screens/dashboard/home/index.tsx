import BaseText from 'components/base_components/base_text';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { useDialog } from 'context/app_dialog_provider';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialBottomTabScreenProps, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { DashbordBottomTabBarParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
// import useReportsApi from 'api/report_api';
import ReportList from 'components/list_items/report_list';
import { useState } from 'react';

type HomeScreenProps = MaterialBottomTabScreenProps<
  DashbordBottomTabBarParamList,
  'HomeScreen'
>;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { showDialog, hideDialog } = useDialog();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.loginData.loginData);
  const theme = useTheme();
  const [reports, setReports] = useState([]);

  const dummyReports = [
    {
      id: 1,
      title: 'Report 1',
      description: 'Description 1',
      date: '2022-01-01',
    },
    {
      id: 2,
      title: 'Report 2',
      description: 'Description 2',
      date: '2022-01-01',
    },
    {
      id: 3,
      title: 'Report 3',
      description: 'Description 3',
      date: '2022-01-01',
    },
  ]

  return (
    <View style={style.mainContainer}>
      <BaseText
        style={[theme.fonts.displayLarge, { color: theme.colors.textColor.primary, alignSelf: 'flex-end', marginRight: ms(15) }]}
        children='+'
      />
      {/* <View
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <BaseText
          style={[theme.fonts.displayLarge, { marginHorizontal: ms(20), textAlign: 'center' }]}
          children={`Welcome ${userData?.userName ?? ''}, There are no reports to check right now`}
        />

      </View> */}

      <ReportList
        data={dummyReports}
      />

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
