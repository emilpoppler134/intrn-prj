export type Warning = {
  id: string;
  type: WarningType;
  message: string;
  link?: WarningLink;
  closeable: boolean;
};

export type WarningLink = {
  title: string;
  to: string;
  reload?: boolean;
};

export enum WarningType {
  Default,
  Error,
}
