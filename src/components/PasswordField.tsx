import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import TextField from "./TextField";

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  title: string;
  form: UseFormReturn<TFieldValues>;
  onEnterKeyPress?: () => void;
};

const PasswordField = <T extends FieldValues>({
  name,
  title,
  form,
  onEnterKeyPress,
}: PasswordFieldProps<T>): JSX.Element => {
  return (
    <TextField
      name={name}
      title={title}
      type="password"
      form={form}
      onEnterKeyPress={onEnterKeyPress}
    />
  );
};

export default PasswordField;
