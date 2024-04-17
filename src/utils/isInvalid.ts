import { FieldValues, Path, UseFormReturn } from "react-hook-form";

const TextField = <T extends FieldValues>(
  form: UseFormReturn<T>,
  fields?: Array<Path<T>>,
): boolean => {
  if (fields === undefined) {
    return (
      form.watch() === undefined ||
      !form.formState.isDirty ||
      !form.formState.isValid
    );
  }

  return fields.some(
    (item) =>
      form.watch(item) === undefined ||
      !form.getFieldState(item).isDirty ||
      form.getFieldState(item).invalid,
  );
};

export default TextField;
