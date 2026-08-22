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

type ProfileScreenProps = MaterialBottomTabScreenProps<
  DashbordBottomTabBarParamList,
  'ProfileScreen'
>;

const ProfileScreen: React.FC<ProfileScreenProps> = props => {
  const theme = useTheme();
  const styles = style(theme);
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Avatar.Text size={ms(90)} label="SN" />
        <BaseText style={[styles.name, {}]}>Shubham Negi</BaseText>
        <BaseText
          style={[styles.email, { color: theme.colors.textColor.placeholder }]}
        >
          shubham@example.com
        </BaseText>
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
          onPress={() => console.log('Change Password')}
        >
          Change Password
        </Button>

        <Button
          mode="contained"
          style={[styles.actionBtn, { backgroundColor: theme.colors.error }]}
          onPress={() => console.log('Logout')}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
