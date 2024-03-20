import { Bot } from "../types/Bot";
import BotItem from "../components/BotItem";
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
        <div className="grid grid-cols-4 gap-12 mt-8">
          {botList.map(item => (
            <BotItem bot={item} />
          ))}
        </div>
      </div>
    </Layout>
  )
}