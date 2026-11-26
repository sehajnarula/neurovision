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
import { getAuth } from '@react-native-firebase/auth';
import useReports from '../../../hooks/useReports';

type HomeScreenProps = MaterialBottomTabScreenProps<
  DashbordBottomTabBarParamList,
  'HomeScreen'
>;

const HomeScreen: React.FC<HomeScreenProps> = props => {
  const { showDialog, hideDialog } = useDialog();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.loginData.loginData);
  const doctorId = getAuth().currentUser?.uid;
  const theme = useTheme();

  const {
    reports,
    loading,
    error,
  } = useReports(doctorId ?? null);

  return (
    <View style={style.mainContainer}>
      <BaseText
        style={[theme.fonts.displayLarge, { color: theme.colors.textColor.primary, alignSelf: 'flex-end', marginRight: ms(15) }]}
        children='+'
        onPress={() => { props.navigation.getParent()?.navigate('CreateReportScreen') }} />
      {reports.length > 0 ? (
        <ReportList
          data={reports}
          navigation={props.navigation.getParent()}
        />
      ) : (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <BaseText
            style={[theme.fonts.displayLarge, { marginHorizontal: ms(20), textAlign: 'center' }]}
            children={`Welcome ${userData?.userName ?? ''}, There are no reports to check right now`}
          />
        </View>
      )}

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
