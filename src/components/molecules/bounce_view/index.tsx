import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type BounceViewProps = AnimatedProps<PressableProps>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BounceViewComp: React.FC<BounceViewProps> = props => {
  const scaleValue = useSharedValue(1);

  const onPressIn = () => {
    scaleValue.value = withSpring(0.9);
  };

  const onPressOut = () => {
    scaleValue.value = withSpring(1);
  };

  const scaleAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scaleValue.value,
      },
    ],
  }));

  return (
    <AnimatedPressable
      style={[props.style, scaleAnimation]}
      onPressIn={props?.disabled ? undefined : onPressIn}
      onPressOut={props?.disabled ? undefined : onPressOut}
      onPress={props.onPress}
    >
      {props.children}
    </AnimatedPressable>
  );
};

const BounceView = React.memo(BounceViewComp);
export default BounceView;
