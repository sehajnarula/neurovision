import BaseText from 'components/base_components/base_text';
import BounceView from 'components/molecules/bounce_view';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';
import CustomLoader from '../custom_loader';

type AnimatedLoaderButtonProps = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  height?: number;
  width?: number;
  buttonColor?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  alignSelfCenter?: boolean;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  animate?: boolean;
};

const AnimatedLoaderButtonComp: React.FC<AnimatedLoaderButtonProps> = props => {
  const theme = useTheme();
  const {
    title,
    isLoading = false,
    height = SCREEN_HEIGHT * 0.055,
    width = SCREEN_WIDTH * 0.8,
    fontSize = ms(height * 0.3),
    borderWidth = 0,
    borderRadius = theme.radius.regular,
    borderColor = theme.colors.borderColor.regular,
    alignSelfCenter = false,
    onPress,
    leftIcon = null,
    disabled = false,
    animate = true,
  } = props;

  const textOpacity = useSharedValue(1);

  React.useEffect(() => {
    if (disabled) {
      textOpacity.value = 1;
      return;
    }

    if (isLoading && animate) {
      textOpacity.value = withTiming(0, { duration: 200 });
    } else {
      textOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [isLoading, disabled, animate]);

  return (
    <BounceView
      onPress={() => {
        if (isLoading || disabled) return;
        onPress?.();
      }}
      disabled={isLoading || disabled}
    >
      <View
        style={[
          {
            height: height && height,
            width: width,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: disabled
              ? theme.colors.buttonColor.disabled
              : (props?.buttonColor ?? theme.colors.buttonColor.regular),
            borderRadius: borderRadius,
            borderWidth: borderWidth,
            borderColor: borderColor,
            alignSelf: alignSelfCenter ? 'center' : 'auto',
            minWidth: ms(50),
            position: 'relative',
          },
        ]}
      >
        {/* Text Content */}
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              gap: ms(10),
              alignItems: 'center',
              opacity: animate ? textOpacity : isLoading ? 0 : 1,
            },
          ]}
          pointerEvents={isLoading ? 'none' : 'auto'}
        >
          {leftIcon && leftIcon}
          <BaseText
            style={[
              theme.fonts.bold,
              {
                color: props?.textColor ?? theme.colors.textColor.white,
                fontSize: fontSize,
                textAlign: 'center',
              },
            ]}
          >
            {title}
          </BaseText>
        </Animated.View>

        {/* Loader - Positioned Absolutely in Center */}
        {isLoading && (
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CustomLoader
              color={props?.textColor ?? theme.colors.iconColor.white}
              size={height > ms(50) ? ms(40) : ms(30)}
            />
          </View>
        )}
      </View>
    </BounceView>
  );
};

const AnimatedLoaderButton = React.memo(AnimatedLoaderButtonComp);
export default AnimatedLoaderButton;
