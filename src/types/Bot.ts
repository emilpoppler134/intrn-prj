import { Configuration } from "./Configuration";
import { Language } from "./Language";
import { Model } from "./Model";
import { Prompt } from "./Prompt";

export type Bot = {
  id: string;
  name: string;
  photo: string | null;
  language: Language;
  prompts: Array<PromptItem>;
  model: Model;
  configuration: Configuration;
  maxTokens: number | null;
  temperature: number | null;
  topP: number | null;
  timestamp: number;
};

export type PromptItem = {
  option: Prompt;
  value: string;
};
