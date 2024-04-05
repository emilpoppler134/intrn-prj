import React from "react";
import { Breadcrumb } from "../types/Breadcrumb";
import Layout from "./layouts/Layout";

const Loading: React.FC = () => {
  const breadcrumb: Breadcrumb = [{ title: "Loading..." }];

  return (
    <Layout breadcrumb={breadcrumb} error={null}>
      <div className="theme-spinner"></div>
    </Layout>
  );
};

export default Loading;
