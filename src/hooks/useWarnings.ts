import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Warning, WarningLink, WarningType } from "../types/Warning";

export const useWarnings = (defaultWarning?: Warning) => {
  const { state } = useLocation();

  const defaults: Array<Warning> = defaultWarning ? [defaultWarning] : [];

  if (state && state.error) {
    defaults.push(state.error as Warning);
    window.history.replaceState({}, "");
  }

  const [warnings, setWarnings] = useState<Array<Warning>>(defaults);

  const pushWarning = (item: Warning) => {
    setWarnings((prev) => [...prev, item]);
  };

  const removeWarning = (item: Warning) => {
    setWarnings((prev) => prev.filter((warn) => warn !== item));
  };

  const clearWarnings = (type?: WarningType) => {
    if (type !== undefined) {
      return setWarnings((prev) => prev.filter((warn) => warn.type !== type));
    }

    setWarnings([]);
  };

  return {
    warnings,
    pushWarning,
    removeWarning,
    clearWarnings,
  };
};

class Alert {
  id: string;
  type: WarningType;
  message: string;
  link?: WarningLink;
  closeable: boolean;

  constructor(
    type: WarningType,
    message: string,
    link?: WarningLink,
    closeable: boolean = true,
  ) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.message = message;
    this.link = link;
    this.closeable = closeable;
  }
}

export class DefaultWarning extends Alert {
  constructor(message: string, link?: WarningLink, closeable?: boolean) {
    super(WarningType.Default, message, link, closeable);
  }
}

export class ErrorWarning extends Alert {
  constructor(message: string, link?: WarningLink, closeable?: boolean) {
    super(WarningType.Error, message, link, closeable);
  }
}
