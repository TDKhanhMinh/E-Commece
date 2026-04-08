import { useForm, UseFormProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType } from 'zod';

interface UseFormWithSchemaOptions<T extends FieldValues>
  extends Omit<UseFormProps<T>, 'resolver'> {
  schema: ZodType<T>;
}

export function useFormWithSchema<T extends FieldValues>({
  schema,
  ...formOptions
}: UseFormWithSchemaOptions<T>): UseFormReturn<T> {
  return useForm<T>({
    ...formOptions,
    resolver: zodResolver(schema),
  });
}
