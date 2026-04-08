import { useNavigation as useRNNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export function useAppNavigation() {
  return useRNNavigation<NativeStackNavigationProp<RootStackParamList>>();
}

export function useAppRoute<T extends keyof RootStackParamList>() {
  return useRoute<RouteProp<RootStackParamList, T>>();
}

export { useNavigation, useRoute } from '@react-navigation/native';
