import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import TextField from "./TextField";

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  title: string;
  form: UseFormReturn<TFieldValues>;
};

const PasswordField = <T extends FieldValues>({
  name,
  title,
  form,
}: PasswordFieldProps<T>): JSX.Element => {
  return <TextField name={name} title={title} type="password" form={form} />;
};

export default PasswordField;
