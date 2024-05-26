import { Bot } from "./Bot";

export type Chat = {
  id: string;
  name: string;
  bot: Omit<
    Bot,
    "configuration" | "maxTokens" | "temperature" | "topP" | "files" | "chats"
  >;
  messages: Array<MessageItem>;
  timestamp: number;
};

type MessageItem = {
  sender: "user" | "bot";
  message: string;
  timestamp: number;
};
