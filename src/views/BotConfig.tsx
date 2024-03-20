import { useParams } from "react-router-dom";

import Layout from "../components/Layout";

export default function BotConfig() {
  const { id } = useParams();

  return (
    <Layout title="Config">
      <span>{ id }</span>
    </Layout>
  )
}