import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import BaseText from 'components/base_components/base_text';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, MD3CustomTheme, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashbordBottomTabBarParamList } from 'types/navigation_types';
import {
  BottomTabBarIconSize,
  BottomTabBarLabelSize,
  MaterialIcon,
  SCREEN_WIDTH,
} from 'utilities/constants';
import { ms, vs } from 'utilities/scale_utils';

const getBottomTabIcon = (name: string, focused: boolean) => {
  const tabName = name as keyof DashbordBottomTabBarParamList;
  const getImageSource = () => {
    switch (tabName) {
      case 'HomeScreen':
        return focused ? MaterialIcon.HOME : MaterialIcon.HOME_OUTLINE;
      case 'ProfileScreen':
        return focused ? MaterialIcon.ACCOUNT : MaterialIcon.ACCOUNT_OUTLINE;
      case 'SettingsScreen':
        return focused ? MaterialIcon.SETTINGS : MaterialIcon.SETTINGS_OUTLINE;
      default:
        return undefined;
    }
  };
  return (
    <Icon
      source={getImageSource()}
      size={BottomTabBarIconSize}
      color={focused ? '#FFFFFF' : '#A1A1A1'}
    />
  );
};

const getTabName = (name: string) => {
  const tabName = name as keyof DashbordBottomTabBarParamList;
  switch (tabName) {
    case 'HomeScreen':
      return 'Home';
    case 'ProfileScreen':
      return 'Profile';
    case 'SettingsScreen':
      return 'Settings';
    default:
      return '';
  }
};
const DashboardBottomTabBarComp: React.FC<BottomTabBarProps> = props => {
  const { navigation, state } = props;
  const theme = useTheme();
  const styles = style(theme);
  const { bottom } = useSafeAreaInsets();
  const tabWidth = theme.dimensions.width / state.routes.length;
  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) {
            navigation.dispatch({
              ...CommonActions.navigate(route.name, route.params),
              target: state.key,
            });
          }
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[styles.tabButton, { width: tabWidth }]}
          >
            <View style={[styles.tabInner, isFocused && styles.focusedIcon]}>
              {getBottomTabIcon(route.name, isFocused)}
            </View>
            <BaseText style={styles.tabName}>{getTabName(route.name)}</BaseText>
          </Pressable>
        );
      })}
    </View>
  );
};
const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.statusBar.backgroundColor,
      paddingTop: vs(12),
    },
    tabButton: {
      width: SCREEN_WIDTH / 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabInner: {
      paddingVertical: ms(2.5),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabName: {
      marginTop: vs(4),
      color: theme.colors.textColor.white,
      fontSize: BottomTabBarLabelSize,
    },
    focusedIcon: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.circle,
      width: '50%',
    },
  });
const DashboardBottomTabBar = React.memo(DashboardBottomTabBarComp);
export default DashboardBottomTabBar;
