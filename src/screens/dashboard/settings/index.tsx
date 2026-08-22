import ThemeSelectorDialog from 'components/modals/theme_selector_modal';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import React from 'react';
import { View } from 'react-native';
import { MaterialBottomTabScreenProps, useTheme } from 'react-native-paper';
import { DashbordBottomTabBarParamList } from 'types/navigation_types';
import { style } from './style';

type SettingsScreenProps = MaterialBottomTabScreenProps<
  DashbordBottomTabBarParamList,
  'SettingsScreen'
>;

const SettingsScreen: React.FC<SettingsScreenProps> = props => {
  const theme = useTheme();
  const styles = style(theme);
  const [showSelectThemeDialog, setShowSelectThemeDialog] =
    React.useState(false);

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
    </View>
  );
};

export default SettingsScreen;
