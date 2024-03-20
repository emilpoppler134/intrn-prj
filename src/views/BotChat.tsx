import { useParams } from "react-router-dom";

import Layout from "../components/Layout";

export default function BotChat() {
  const { id } = useParams();

  return (
    <Layout title="Interact">
      <span>{ id }</span>
    </Layout>
  )
}