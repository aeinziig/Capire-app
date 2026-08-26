import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colorTokens, typographyTokens, spacingTokens, borderRadiusTokens } from '@/styles/design-tokens';

// Helper to convert token string (e.g., "16px") to number
const tokenToNumber = (token: string): number => {
  return parseInt(token);
};

type FeatherIconName = keyof typeof Feather.glyphMap;
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type IconName = FeatherIconName | MaterialIconName;

type EmptyStateProps = {
  title: string;
  subtitle?: string;
  iconName?: IconName;
  iconType?: 'Feather' | 'MaterialCommunityIcons';
  buttonText?: string;
  onPress?: () => void;
  showIndicator?: boolean;
  imageUrl?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  iconName,
  iconType = 'Feather',
  buttonText,
  onPress,
  showIndicator = false,
  imageUrl,
}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorTokens.neutralWhite,
      padding: tokenToNumber(spacingTokens['4'])
    }}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: tokenToNumber(spacingTokens['8']),
            height: tokenToNumber(spacingTokens['8']),
            borderRadius: tokenToNumber(borderRadiusTokens.md),
            marginBottom: tokenToNumber(spacingTokens['2'])
          }}
        />
      ) : iconName ? (
        <View
          style={{
            width: tokenToNumber(spacingTokens['8']),
            height: tokenToNumber(spacingTokens['8']),
            backgroundColor: colorTokens.primaryPale,
            borderRadius: tokenToNumber(borderRadiusTokens.md),
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: tokenToNumber(spacingTokens['2'])
          }}
        >
          {iconType === 'Feather' ? (
            <Feather name={iconName as FeatherIconName} size={tokenToNumber(spacingTokens['4'])} color={colorTokens.primarySage} />
          ) : (
            <MaterialCommunityIcons name={iconName as MaterialIconName} size={tokenToNumber(spacingTokens['4'])} color={colorTokens.primarySage} />
          )}
        </View>
      ) : null}

      <Text
        style={{
          fontSize: tokenToNumber(typographyTokens.sectionHeading.fontSize),
          fontWeight: typographyTokens.sectionHeading.fontWeight,
          color: colorTokens.neutralDarkGray,
          marginBottom: tokenToNumber(spacingTokens['1']),
          textAlign: 'center'
        }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          style={{
            fontSize: tokenToNumber(typographyTokens.bodyText.fontSize),
            fontWeight: typographyTokens.bodyText.fontWeight,
            color: colorTokens.neutralMediumGray,
            marginBottom: tokenToNumber(spacingTokens['2']),
            textAlign: 'center'
          }}
        >
          {subtitle}
        </Text>
      )}

      {showIndicator && (
        <ActivityIndicator
          size="small"
          color={colorTokens.primarySage}
          style={{ marginBottom: tokenToNumber(spacingTokens['2']) }}
        />
      )}

      {buttonText && onPress && (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          style={{
            backgroundColor: colorTokens.primarySage,
            borderRadius: tokenToNumber(borderRadiusTokens.md),
            paddingVertical: tokenToNumber(spacingTokens['2']),
            paddingHorizontal: tokenToNumber(spacingTokens['3'])
          }}
        >
          <Text
            style={{
              color: colorTokens.neutralWhite,
              fontWeight: '600'
            }}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;