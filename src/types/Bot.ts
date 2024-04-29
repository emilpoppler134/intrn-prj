import { Model } from "./Model";

export type Bot = {
  id: string;
  name: string;
  photo: string;
  system_prompt: string;
  model: Model;
  maxTokens: number;
  temp: number;
  topP: number;
  timestamp: number;
};
