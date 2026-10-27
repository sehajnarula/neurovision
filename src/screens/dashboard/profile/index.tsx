import BaseText from 'components/base_components/base_text';
import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  Avatar,
  Button,
  Divider,
  MaterialBottomTabScreenProps,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DashbordBottomTabBarParamList } from 'types/navigation_types';
import { ms } from 'utilities/scale_utils';
import { style } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import ThemeSelectorDialog from 'components/modals/theme_selector_modal';
import { useDialog } from 'context/app_dialog_provider';
import { logoutUser } from 'utilities/utils';

type ProfileScreenProps = MaterialBottomTabScreenProps<
  DashbordBottomTabBarParamList,
  'ProfileScreen'
>;

const ProfileScreen: React.FC<ProfileScreenProps> = props => {
  const theme = useTheme();
  const styles = style(theme);
  const userData = useSelector((state: RootState) => state.loginData.loginData);
  const [showSelectThemeDialog, setShowSelectThemeDialog] = React.useState(false);
  const { showDialog, hideDialog } = useDialog();
  const dispatch = useDispatch();

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
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Avatar.Text size={ms(90)} label="SN" />
        <BaseText style={[styles.name, {}]}>{userData?.userName}</BaseText>
        {/* <BaseText
          style={[styles.email, { color: theme.colors.textColor.placeholder }]}
        >
          {userData?.email}
        </BaseText> */}
      </Animated.View>

      <View style={styles.section}>
        <BaseText
          style={[styles.sectionTitle, { color: theme.colors.primary }]}
        >
          Account Info
        </BaseText>
        <Divider style={styles.divider} />

        <BaseText style={styles.itemLabel}>Phone</BaseText>
        <BaseText style={styles.itemValue}>+91 98765 43210</BaseText>

        <BaseText style={styles.itemLabel}>Address</BaseText>
        <BaseText style={styles.itemValue}>221B Baker Street, London</BaseText>
      </View>

      <View style={styles.section}>
        <BaseText
          style={[styles.sectionTitle, { color: theme.colors.primary }]}
        >
          Settings
        </BaseText>
        <Divider style={styles.divider} />

        <Button
          mode="outlined"
          style={styles.actionBtn}
          onPress={() => console.log('Edit Profile')}
        >
          Edit Profile
        </Button>

        <Button
          mode="outlined"
          style={styles.actionBtn}
          onPress={() => setShowSelectThemeDialog(true)}>
          Change Theme
        </Button>

        <ThemeSelectorDialog
          visible={showSelectThemeDialog}
          onClose={() => setShowSelectThemeDialog(false)}
        />

        <Button
          mode="outlined"
          style={styles.actionBtn}
          onPress={() => console.log('Change Password')}
        >
          Change Password
        </Button>

        <Button
          mode="outlined"
          style={styles.actionBtn}
          onPress={() => handleLogoutClick()}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
