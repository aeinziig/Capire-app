import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SectionList,
  Animated,
  Easing,
} from 'react-native';
import { colorTokens, borderRadiusTokens } from '@/styles/design-tokens';

// Helper to convert token string (e.g., "16px") to number
const tokenToNumber = (token: string): number => {
  return parseInt(token);
};

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
};

const Skeleton: React.FC<SkeletonProps> = ({
  width = tokenToNumber('100%'),
  height = tokenToNumber('16px'),
  borderRadius = tokenToNumber(borderRadiusTokens.md),
  margin,
  padding,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    pulseAnim.setValue(0);
    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const pulseWidth = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0%', '100%', '0%'],
  });

  const marginStyle = typeof margin === 'number'
    ? { margin }
    : margin
      ? {
          marginTop: margin.top,
          marginRight: margin.right,
          marginBottom: margin.bottom,
          marginLeft: margin.left
        }
      : {};
  const paddingStyle = typeof padding === 'number'
    ? { padding }
    : padding
      ? {
          paddingTop: padding.top,
          paddingRight: padding.right,
          paddingBottom: padding.bottom,
          paddingLeft: padding.left
        }
      : {};

  const backgroundStyle: any = {
    width: typeof width === 'number' ? width : width,
    height: typeof height === 'number' ? height : height,
    borderRadius,
    backgroundColor: colorTokens.neutralLightGray,
    ...marginStyle,
    ...paddingStyle,
  };

  const gradientStyle: any = {
    ...backgroundStyle,
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: pulseWidth,
    backgroundColor: `rgba(255,255,255,0.3)`,
  };

  return (
    <View style={backgroundStyle}>
      <Animated.View style={gradientStyle} />
    </View>
  );
};

type SkeletonTextProps = {
  width?: number | string;
  lines?: number;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
};

const SkeletonText: React.FC<SkeletonTextProps> = ({
  width = tokenToNumber('100%'),
  lines = 1,
  margin,
}) => {
  const marginStyle = typeof margin === 'number' ? { margin } : margin ? { marginTop: margin.top, marginRight: margin.right, marginBottom: margin.bottom, marginLeft: margin.left } : {};
  return (
    <View style={marginStyle}>
      {[...Array(lines)].map((_, index) => (
        <Skeleton
          key={index}
          width={width}
          height={tokenToNumber('16px')}
          margin={{ bottom: index < lines - 1 ? tokenToNumber('4px') : 0 }}
        />
      ))}
    </View>
  );
};

type SkeletonAvatarProps = {
  size?: number | string;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
};

const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = tokenToNumber('40px'),
  margin,
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={tokenToNumber(borderRadiusTokens.full)}
      margin={margin}
    />
  );
};

type SkeletonImageProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
};

const SkeletonImage: React.FC<SkeletonImageProps> = ({
  width = tokenToNumber('100%'),
  height = tokenToNumber('200px'),
  borderRadius = tokenToNumber(borderRadiusTokens.md),
  margin,
}) => {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius={borderRadius}
      margin={margin}
    />
  );
};

type SkeletonButtonProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
};

const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  width = tokenToNumber('100%'),
  height = tokenToNumber('48px'),
  borderRadius = tokenToNumber(borderRadiusTokens.md),
  margin,
}) => {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius={borderRadius}
      margin={margin}
    />
  );
};

type SkeletonCardProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
};

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = tokenToNumber('100%'),
  height = tokenToNumber('200px'),
  borderRadius = tokenToNumber(borderRadiusTokens.md),
  margin,
}) => {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius={borderRadius}
      margin={margin}
    />
  );
};

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonButton,
  SkeletonCard,
};