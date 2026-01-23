interface FormHelperTextProps {
    error?: { message?: string };
}

export function FormHelperText({ error }: FormHelperTextProps) {
    if (!error || !error.message) return null;

    return (
        <p className="mt-1.5 ml-1 text-[0.8rem] font-medium text-red-500">
            {error.message}
        </p>
    );
}
