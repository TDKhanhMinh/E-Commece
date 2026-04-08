import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { HistoryStackParamList } from '@features/history/navigators';

export type HomeStackParamList = {
  HomeMain: undefined;
  OrderDetail: { orderId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: { email: string };
  ResetPassword: { token: string };
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Orders: undefined;
  History: NavigatorScreenParams<HistoryStackParamList>;
  Earnings: undefined;
  Wallet: undefined;
  Settings: undefined;
};

export type ShipmentStackParamList = {
  ShipmentsList: undefined;
  ShipmentDetail: { id: string };
  TrackShipment: { trackingNumber: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  AddressList: undefined;
  AddressForm: { addressId?: string };
};

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ShipmentStack: NavigatorScreenParams<ShipmentStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type ShipmentStackScreenProps<T extends keyof ShipmentStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ShipmentStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
