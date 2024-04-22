import { ErrorWarning, useWarnings } from "../../hooks/useWarnings";
import { Breadcrumb } from "../../types/Breadcrumb";
import Warnings from "../Warnings";
import Layout from "./Layout";

type ErrorLayoutProps = {
  breadcrumb?: Breadcrumb;
  error: Error;
};

const ErrorLayout: React.FC<ErrorLayoutProps> = ({ breadcrumb, error }) => {
  const defaultError = new ErrorWarning(
    error.message,
    { title: "Try again", to: ".", reload: true },
    false,
  );

  const { warnings } = useWarnings(defaultError);

  return (
    <Layout breadcrumb={breadcrumb}>
      <Warnings list={warnings} />
    </Layout>
  );
};

export default ErrorLayout;
