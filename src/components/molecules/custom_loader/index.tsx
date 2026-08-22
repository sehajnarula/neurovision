import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type CustomLoaderProps = {
  size?: number;
  color?: string;
  dotCount?: number;
  type?: 'dots' | 'pulse' | 'spinner' | 'bars';
};

const CustomLoaderComp: React.FC<CustomLoaderProps> = props => {
  const { size = 60, color = '#007AFF', dotCount = 3, type = 'dots' } = props;
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: type === 'pulse' ? 1200 : 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );
  }, [type]);

  // Dots Loader
  const DotsLoader = () => {
    const dots = Array.from({ length: dotCount });

    return (
      <View style={[styles.container, { width: size * 2, height: size / 3 }]}>
        {dots.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const delay = index * 0.2;
            const scale = interpolate(
              progress.value,
              [delay, delay + 0.3, delay + 0.6, 1],
              [1, 1.5, 1, 1],
              'clamp',
            );
            const opacity = interpolate(
              progress.value,
              [delay, delay + 0.3, delay + 0.6, 1],
              [0.4, 1, 0.4, 0.4],
              'clamp',
            );

            return {
              transform: [{ scale }],
              opacity,
            };
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: size / 5,
                  height: size / 5,
                  backgroundColor: color,
                  marginHorizontal: size / 15,
                },
                animatedStyle,
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Pulse Loader
  const PulseLoader = () => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.3, 1]);
      const opacity = interpolate(progress.value, [0, 0.5, 1], [1, 0.3, 1]);

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View
          style={[
            styles.pulse,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: size / 15,
              borderColor: color,
            },
            animatedStyle,
          ]}
        />
      </View>
    );
  };

  // Spinner Loader
  const SpinnerLoader = () => {
    const animatedStyle = useAnimatedStyle(() => {
      const rotation = interpolate(progress.value, [0, 1], [0, 360]);

      return {
        transform: [{ rotate: `${rotation}deg` }],
      };
    });

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View
          style={[
            styles.spinner,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: size / 10,
              borderColor: `${color}30`,
              borderTopColor: color,
            },
            animatedStyle,
          ]}
        />
      </View>
    );
  };

  // Bars Loader
  const BarsLoader = () => {
    const bars = Array.from({ length: 4 });

    return (
      <View style={[styles.container, styles.barsContainer, { height: size }]}>
        {bars.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const delay = index * 0.15;
            const scaleY = interpolate(
              progress.value,
              [delay, delay + 0.3, delay + 0.6, 1],
              [0.4, 1, 0.4, 0.4],
              'clamp',
            );

            return {
              transform: [{ scaleY }],
            };
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.bar,
                {
                  width: size / 8,
                  height: size,
                  backgroundColor: color,
                  marginHorizontal: size / 20,
                  borderRadius: size / 16,
                },
                animatedStyle,
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderLoader = () => {
    switch (type) {
      case 'pulse':
        return <PulseLoader />;
      case 'spinner':
        return <SpinnerLoader />;
      case 'bars':
        return <BarsLoader />;
      default:
        return <DotsLoader />;
    }
  };

  return renderLoader();
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dot: {
    borderRadius: 100,
  },
  pulse: {
    backgroundColor: 'transparent',
  },
  spinner: {
    backgroundColor: 'transparent',
  },
  barsContainer: {
    alignItems: 'flex-end',
  },
  bar: {
    alignSelf: 'center',
  },
});

const CustomLoader = React.memo(CustomLoaderComp);
export default CustomLoader;
