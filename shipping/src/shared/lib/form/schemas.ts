import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format');

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .max(50, 'Password must be less than 50 characters');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/,
    'Invalid Vietnamese phone number format',
  );

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    fullName: nameSchema,
    phone: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const addressSchema = z.object({
  fullName: nameSchema,
  phone: phoneSchema,
  street: z.string().min(1, 'Street address is required'),
  ward: z.string().min(1, 'Ward is required'),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().default('Vietnam'),
  postalCode: z.string().optional(),
});

export const shipmentItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  weight: z.number().min(0.1, 'Weight must be at least 0.1 kg'),
  value: z.number().min(0, 'Value must be non-negative'),
  description: z.string().optional(),
  dimensions: z
    .object({
      length: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0),
    })
    .optional(),
});

export const createShipmentSchema = z.object({
  sender: addressSchema,
  receiver: addressSchema,
  items: z.array(shipmentItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
  insuranceRequired: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ShipmentItemFormData = z.infer<typeof shipmentItemSchema>;
export type CreateShipmentFormData = z.infer<typeof createShipmentSchema>;
