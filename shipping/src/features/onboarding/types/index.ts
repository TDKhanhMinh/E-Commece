import { ImageSourcePropType } from 'react-native';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}
