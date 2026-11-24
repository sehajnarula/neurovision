import ThemeSelectorDialog from 'components/modals/theme_selector_modal';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import React from 'react';
import { View } from 'react-native';
import { MaterialBottomTabScreenProps, useTheme } from 'react-native-paper';
import { DashbordBottomTabBarParamList } from 'types/navigation_types';
import { style } from './style';
import { useDialog } from 'context/app_dialog_provider';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'utilities/utils';

type SettingsScreenProps = MaterialBottomTabScreenProps<
  DashbordBottomTabBarParamList,
  'SettingsScreen'
>;

const SettingsScreen: React.FC<SettingsScreenProps> = props => {
  const theme = useTheme();
  const styles = style(theme);
  const { showDialog, hideDialog } = useDialog();
  const dispatch = useDispatch();
  const [showSelectThemeDialog, setShowSelectThemeDialog] =
    React.useState(false);

  const handleLogoutClick = React.useCallback(() => {
    showDialog({
      message: 'Do you want to logout?',
      title: 'Logout',
      actionType: 'error',
      isConfirmDestructive: true,
      onConfirm: () => logoutUser(dispatch),
      onDismiss: hideDialog,
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <AnimatedLoaderButton
        title={'Change Theme'}
        onPress={() => setShowSelectThemeDialog(true)}
      />
      <ThemeSelectorDialog
        visible={showSelectThemeDialog}
        onClose={() => setShowSelectThemeDialog(false)}
      />
      <AnimatedLoaderButton
        isLoading={false}
        title={'Logout'}
        onPress={handleLogoutClick}
      />
    </View>
  );
};

export default SettingsScreen;
