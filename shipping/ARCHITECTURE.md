# Feature-based Architecture / Domain-driven Design

## Overview

Dự án này được tổ chức theo kiến trúc **Feature-based** (hay còn gọi là Domain-driven), nơi code được phân chia theo các tính năng/domain thay vì theo loại file (components, services, hooks...).

## Cấu trúc thư mục

```
src/
├── app/                      # Entry point và App configuration
│   ├── App.tsx
│   └── index.ts
│
├── core/                     # Core infrastructure (cross-cutting concerns)
│   ├── api/                  # HTTP client, API configuration
│   ├── navigation/           # Navigation setup (React Navigation)
│   ├── store/               # Global state management (Redux/Zustand)
│   └── providers/           # App-wide providers (Theme, Auth, etc.)
│
├── features/                 # Feature modules - tổ chức theo domain
│   ├── auth/                # Authentication feature
│   │   ├── components/      # Feature-specific components
│   │   ├── screens/         # Feature screens
│   │   ├── hooks/           # Feature-specific hooks
│   │   ├── services/        # API calls, business logic
│   │   ├── store/           # Feature state (nếu cần)
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Barrel export
│   │
│   ├── home/                # Home/Dashboard feature
│   │   └── ...
│   │
│   └── shipping/            # Shipping management feature
│       └── ...
│
└── shared/                   # Shared/Common modules
    ├── components/          # Reusable UI components
    ├── hooks/               # Common hooks
    ├── utils/               # Utility functions
    ├── services/            # Shared services
    ├── types/               # Common TypeScript types
    ├── constants/           # App constants
    ├── config/              # App configuration
    ├── assets/              # Images, fonts, etc.
    └── styles/              # Theme, colors, typography
```

## Nguyên tắc kiến trúc

### 1. Encapsulation (Đóng gói)

Mỗi feature là một module độc lập với tất cả những gì cần thiết:

```typescript
// features/auth/index.ts
export * from './types';
export * from './services';
export * from './hooks';
export * from './screens';
```

### 2. Single Responsibility

Mỗi feature chỉ chịu trách nhiệm cho một domain cụ thể:
- `auth/` - Xử lý authentication, authorization
- `shipping/` - Quản lý shipments
- `home/` - Dashboard và overview

### 3. Dependency Direction

```
features/ → shared/ → core/
    ↓          ↓
  (uses)    (uses)
```

- Features có thể import từ `shared/` và `core/`
- Features KHÔNG được import lẫn nhau trực tiếp
- `shared/` chỉ import từ `core/` hoặc external libraries
- `core/` không import từ `features/` hay `shared/`

### 4. Path Aliases

Sử dụng path aliases để import gọn gàng:

```typescript
// Thay vì
import { Button } from '../../../shared/components/Button';

// Sử dụng
import { Button } from '@components/Button';
```

Các aliases có sẵn:
- `@/*` - src/*
- `@features/*` - src/features/*
- `@shared/*` - src/shared/*
- `@core/*` - src/core/*
- `@components/*` - src/shared/components/*
- `@hooks/*` - src/shared/hooks/*
- `@utils/*` - src/shared/utils/*
- `@services/*` - src/shared/services/*
- `@types/*` - src/shared/types/*
- `@constants/*` - src/shared/constants/*
- `@styles/*` - src/shared/styles/*
- `@api/*` - src/core/api/*
- `@providers/*` - src/core/providers/*
- `@navigation/*` - src/core/navigation/*
- `@store/*` - src/core/store/*

## Cấu trúc Feature Module

Mỗi feature nên tuân theo cấu trúc:

```
feature-name/
├── components/              # Feature-specific components
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   └── index.ts
│   └── index.ts
│
├── screens/                 # Feature screens
│   ├── ScreenName.tsx
│   └── index.ts
│
├── hooks/                   # Feature-specific hooks
│   ├── useFeatureHook.ts
│   └── index.ts
│
├── services/                # API calls, business logic
│   ├── feature.service.ts
│   └── index.ts
│
├── store/                   # Feature state (optional)
│   └── index.ts
│
├── types/                   # TypeScript types
│   ├── feature.types.ts
│   └── index.ts
│
└── index.ts                 # Barrel export
```

## Best Practices

### 1. Barrel Exports

Luôn tạo `index.ts` để export public API của module:

```typescript
// features/auth/index.ts
export * from './types';
export * from './services';
export * from './hooks';
export * from './screens';
// Không export internal components/helpers
```

### 2. Colocation

Đặt code gần với nơi sử dụng nó:
- Component chỉ dùng trong 1 feature → để trong feature đó
- Component dùng ở nhiều features → chuyển vào `shared/`

### 3. Type Safety

Định nghĩa types riêng cho mỗi feature:

```typescript
// features/shipping/types/shipping.types.ts
export interface Shipment {
  id: string;
  status: ShipmentStatus;
  // ...
}
```

### 4. Service Layer

Tách biệt API calls vào service:

```typescript
// features/auth/services/auth.service.ts
class AuthService {
  async login(credentials: LoginCredentials) {
    return httpClient.post('/auth/login', credentials);
  }
}

export const authService = new AuthService();
```

### 5. Custom Hooks

Encapsulate logic trong hooks:

```typescript
// features/auth/hooks/useAuth.ts
export function useAuth() {
  // State, effects, handlers...
  return { user, login, logout, isLoading };
}
```

## Khi nào thêm Feature mới?

1. Tạo folder trong `src/features/`
2. Tạo các subfolder cần thiết (types, services, hooks, screens, components)
3. Tạo `index.ts` để export public API
4. Update `src/features/index.ts` nếu cần

## File Structure Guidelines

| Loại file | Naming Convention | Ví dụ |
|-----------|------------------|-------|
| Components | PascalCase | `Button.tsx`, `ShipmentCard.tsx` |
| Screens | PascalCase + Screen | `LoginScreen.tsx`, `HomeScreen.tsx` |
| Hooks | camelCase + use prefix | `useAuth.ts`, `useShipments.ts` |
| Services | camelCase + .service | `auth.service.ts` |
| Types | camelCase + .types | `auth.types.ts` |
| Utils | camelCase | `helpers.ts`, `storage.ts` |
| Constants | camelCase + .constants | `app.constants.ts` |
