import React, { FormEvent, ReactNode } from "react";

type FormProps = {
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">{children}</div>
    </form>
  );
};

export default Form;
