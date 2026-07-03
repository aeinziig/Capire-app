import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { colorTokens } from '@/styles/design-tokens';

// Helper to convert token string (e.g., "16px") to number
const tokenToNumber = (token: string): number => {
  return parseInt(token);
};

type PullToRefreshProps = {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
};

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  refreshing,
  onRefresh,
  children,
}) => {
  return (
    <View>
      {React.Children.map(children, child => {
        // If child is a ScrollView or FlatList, add refreshControl prop
        if (
          React.isValidElement(child) &&
          (child.type === ScrollView ||
           (typeof child.type === 'string' && child.type === 'ScrollView') ||
           child.type === FlatList ||
           (typeof child.type === 'string' && child.type === 'FlatList'))
        ) {
          return React.cloneElement(child as any, {
            refreshControl: (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colorTokens.primarySage]}
              />
            )
          });
        }
        return child;
      })}
    </View>
  );
};

export default PullToRefresh;