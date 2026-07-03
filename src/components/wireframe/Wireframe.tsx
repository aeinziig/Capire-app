import React from 'react';
import {
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { borderRadiusTokens, colorTokens, shadowTokens, spacingTokens } from '@/styles/design-tokens';
import { useApp } from '@/context/AppContext';

const px = (token: string) => Number.parseInt(token, 10);

const lightWireframeColors = {
  page: '#F4F8F4',
  surface: colorTokens.neutralWhite,
  header: colorTokens.primaryDark,
  headerAlt: '#24503C',
  accent: colorTokens.primarySage,
  accentSoft: '#E8F3EA',
  line: '#DCE7DE',
  text: '#183126',
  muted: '#667A70',
  placeholder: '#95A79D',
  warning: colorTokens.secondaryAmber,
  danger: colorTokens.statusDanger,
  dangerSoft: '#FFF3EF',
  inputBg: '#FAFCFA',
};

const darkWireframeColors = {
  page: '#09120E',
  surface: '#10201A',
  header: '#08110D',
  headerAlt: '#163126',
  accent: '#7BC999',
  accentSoft: '#173126',
  line: '#27463A',
  text: '#F2FBF4',
  muted: '#A8BDB2',
  placeholder: '#7E968B',
  warning: '#E2C25A',
  danger: '#F19783',
  dangerSoft: '#3A1D19',
  inputBg: '#142720',
};

export const wireframeColors = lightWireframeColors;

export const useWireframeTheme = () => {
  const { resolvedTheme } = useApp();
  return resolvedTheme === 'dark' ? darkWireframeColors : lightWireframeColors;
};

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  topNote?: string;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children, footer, topNote }) => {
  const colors = useWireframeTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <View
        style={{
          backgroundColor: colors.header,
          paddingHorizontal: px(spacingTokens['6']),
          paddingTop: px(spacingTokens['9']),
          paddingBottom: px(spacingTokens['12']),
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            borderWidth: 1.5,
            borderColor: '#9FD7B0',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: px(spacingTokens['4']),
          }}
        >
          <Text style={{ color: '#E8F3EA', fontWeight: '700', fontSize: 11 }}>SPCBA</Text>
        </View>
        <Text style={{ color: '#F5FBF6', fontSize: 30, fontWeight: '800', letterSpacing: 1 }}>CAPIRE</Text>
        <Text style={{ color: '#D1E7D8', fontSize: 15, marginTop: 10, lineHeight: 22 }}>{subtitle}</Text>
        {topNote ? (
          <Text style={{ color: '#8DD3A5', fontSize: 12, marginTop: 16, fontWeight: '600' }}>{topNote}</Text>
        ) : null}
      </View>
      <View
        style={{
          flex: 1,
          marginTop: -px(spacingTokens['10']),
          paddingHorizontal: px(spacingTokens['5']),
          paddingBottom: px(spacingTokens['5']),
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 28,
            padding: px(spacingTokens['5']),
            ...shadowTokens['2xl'],
          }}
        >
          <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: 8 }}>{title}</Text>
          {children}
          {footer ? <View style={{ marginTop: 24 }}>{footer}</View> : null}
        </View>
      </View>
    </View>
  );
};

type AppLayoutProps = {
  title: string;
  subtitle?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const AppLayout: React.FC<AppLayoutProps> = ({
  title,
  subtitle,
  headerLeft,
  headerRight,
  children,
  scroll = true,
  contentContainerStyle,
}) => {
  const colors = useWireframeTheme();

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingHorizontal: px(spacingTokens['5']),
          paddingBottom: px(spacingTokens['8']),
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: px(spacingTokens['5']),
          paddingBottom: px(spacingTokens['8']),
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <View
        style={{
          backgroundColor: colors.header,
          paddingHorizontal: px(spacingTokens['5']),
          paddingTop: px(spacingTokens['6']),
          paddingBottom: px(spacingTokens['8']),
          borderBottomLeftRadius: px(borderRadiusTokens['3xl']),
          borderBottomRightRadius: px(borderRadiusTokens['3xl']),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ minWidth: 44 }}>{headerLeft}</View>
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <Text style={{ color: '#F5FBF6', fontSize: 24, fontWeight: '800' }}>{title}</Text>
            {subtitle ? <Text style={{ color: '#C8DED0', fontSize: 13, marginTop: 4 }}>{subtitle}</Text> : null}
          </View>
          <View style={{ minWidth: 44, alignItems: 'flex-end' }}>{headerRight}</View>
        </View>
      </View>
      <View style={{ flex: 1, marginTop: -px(spacingTokens['4']) }}>{body}</View>
    </View>
  );
};

type WireframeInputProps = TextInputProps & {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  error?: string | null;
};

export const WireframeInput: React.FC<WireframeInputProps> = ({ label, icon, error, style, ...props }) => {
  const colors = useWireframeTheme();

  return (
    <View style={{ marginBottom: px(spacingTokens['4']) }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 8 }}>{label}</Text>
      <View
        style={{
          minHeight: 54,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.line,
          backgroundColor: colors.inputBg,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: px(spacingTokens['4']),
        }}
      >
        {icon ? <Feather name={icon} size={18} color={colors.muted} style={{ marginRight: 10 }} /> : null}
        <TextInput
          placeholderTextColor={colors.placeholder}
          style={[
            {
              flex: 1,
              color: colors.text,
              fontSize: 14,
              paddingVertical: 14,
            },
            style as StyleProp<TextStyle>,
          ]}
          {...props}
        />
      </View>
      {error ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: 8 }}>{error}</Text> : null}
    </View>
  );
};

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
};

export const WireframeButton: React.FC<ButtonProps> = ({ label, onPress, variant = 'primary', disabled, icon }) => {
  const colors = useWireframeTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={{
        minHeight: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: variant === 'primary' ? colors.accent : colors.inputBg,
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor: variant === 'secondary' ? colors.line : undefined,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon ? (
          <Feather
            name={icon}
            size={18}
            color={variant === 'primary' ? colorTokens.neutralWhite : colors.accent}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <Text
          style={{
            color: variant === 'primary' ? colorTokens.neutralWhite : colors.accent,
            fontSize: 15,
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const WireframeCard: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => {
  const colors = useWireframeTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: colors.line,
          padding: px(spacingTokens['4']),
          ...shadowTokens.base,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const WireframePill: React.FC<{
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ label, active, onPress, style }) => {
  const colors = useWireframeTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        {
          borderRadius: 999,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: active ? colors.accent : colors.line,
          backgroundColor: active ? colors.accent : colors.surface,
        },
        style,
      ]}
    >
      <Text style={{ color: active ? colorTokens.neutralWhite : colors.text, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );
};

export const HeaderIconButton: React.FC<{
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
}> = ({ icon, onPress }) => {
  const colors = useWireframeTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.headerAlt,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Feather name={icon} size={20} color={colorTokens.neutralWhite} />
    </TouchableOpacity>
  );
};
