import { Bot } from "../types/Bot";
import BotListOverview from "../components/BotListOverview";
import Layout from "../components/Layout";

const botList: Array<Bot> = [
  { _id: "xxxxx-xxxxx-xxxxx-xxxx", name: "Bot 1"},
  { _id: "yyyyy-yyyyy-yyyyy-yyyy", name: "Bot 2"}
]

export default function Dashboard() {
  return (
    <Layout title="Overview">
      <div className="mx-auto max-w-2xl">
        <span className="px-p text-xl">Avaliable chatbots</span>
        <BotListOverview bots={botList} />
      </div>
    </Layout>
  )
}