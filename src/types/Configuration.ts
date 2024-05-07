export type Configuration = {
  _id: string;
  name: string;
  title: string;
  description: string;
  data: DataConfig | null;
};

type DataConfig = {
  maxTokens: number;
  temperature: number;
  topP: number;
};
