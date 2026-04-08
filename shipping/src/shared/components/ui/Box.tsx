import React, { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';

interface BoxProps extends ViewProps {
  className?: string;
}

export const Box = forwardRef<View, BoxProps>(
  ({ className = '', style, ...props }, ref) => {
    return <View ref={ref} className={className} style={style} {...props} />;
  },
);

Box.displayName = 'Box';
