import { useLocation } from "react-router-dom";
import { Notification } from "../types/Notification";

export const useNotifications = () => {
  const { state } = useLocation();

  const notification = ((): Notification | null => {
    if (!state || !state.notification) return null;
    const item = state.notification as Notification;

    window.history.replaceState({}, "");

    return item;
  })();

  return { notification };
};
