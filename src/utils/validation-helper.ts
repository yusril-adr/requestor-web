import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function applyValidationErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: {
    property: string;
    messages: string[];
  }[],
) {
  errors.forEach((error) => {
    setError(error.property as Path<T>, {
      type: "server",
      message: error.messages[0],
    });
  });
}
