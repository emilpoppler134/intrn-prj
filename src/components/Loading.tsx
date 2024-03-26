import React from 'react';
import Layout from "./Layout"
import { Breadcrumb } from '../types/Breadcrumb';

const Loading: React.FC = () => {
  const breadcrumb: Breadcrumb = [
    { title: "Loading..." }
  ];

  return (
    <Layout breadcrumb={breadcrumb} error={null}>
      <div className="theme-spinner"></div>
    </Layout>
  )
}

export default Loading;
