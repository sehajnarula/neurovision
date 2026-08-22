import BaseText from 'components/base_components/base_text';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { MD3CustomTheme, useTheme } from 'react-native-paper';
import { ms, vs } from 'utilities/scale_utils';

export type SegmentedTabData = {
  value: string;
  label: string;
};

type SegmentedTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: SegmentedTabData[];
  style?: StyleProp<ViewStyle>;
};

const SegmentedTabsComp: React.FC<SegmentedTabsProps> = props => {
  const { activeTab, onTabChange, tabs, style: containerStyle } = props;
  const theme = useTheme();
  const styles = style(theme);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.segmentedControl}>
        {tabs.map(tab => {
          const isActive = tab.value === activeTab;

          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabChange(tab.value)}
              activeOpacity={0.8}
            >
              <BaseText
                style={[styles.tabText, isActive && styles.activeTabText]}
              >
                {tab.label}
              </BaseText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const style = (theme: MD3CustomTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: ms(16),
      paddingVertical: vs(12),
      backgroundColor: theme.colors.surface,
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.radius.regular,
      padding: ms(4),
      gap: ms(4),
      boxShadow: `1px 1px 1px 2px ${theme.colors.shadow}`,
    },
    tab: {
      flex: 1,
      paddingHorizontal: ms(16),
      paddingVertical: vs(8),
      borderRadius: theme.radius.regular,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    activeTab: {
      backgroundColor: theme.colors.surface,
      boxShadow: `1px 1px 1px 2px ${theme.colors.shadow}`,
    },
    tabText: {
      fontSize: ms(14),
      fontWeight: '600',
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
    },
    activeTabText: {
      color: theme.colors.onSurface,
    },
  });

const SegmentedTabs = React.memo(SegmentedTabsComp);
export default SegmentedTabs;
