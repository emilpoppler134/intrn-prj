import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chat } from "../types/Chat";
import { callAPI } from "../utils/apiService";

type ChatParams = {
  params: { bot?: string; chat?: string };
  data: { chat: Chat; list: Array<Chat> } | undefined;
  isLoading: boolean;
  error: Error | null;
  changeChat: (to: string | undefined, callback?: () => void) => void;
};

export const useChat = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { bot: botParam, chat: chatParam } = useParams();
  const params = { bot: botParam, chat: chatParam };

  const defaultResponse: ChatParams = {
    params,
    data: undefined,
    isLoading: true,
    error: null,
    changeChat: () => {},
  };

  const {
    data: list,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => callAPI<Array<Chat>>(`/bots/${botParam}/chats`),
    staleTime: Infinity,
  });

  if (list !== undefined && list.length === 0) {
    return {
      ...defaultResponse,
      isLoading: false,
      error: new Error(
        "The bot doesn't have a chat. Try removing the bot and create a new.",
      ),
    };
  }

  const changeChat = (to: string | undefined, callback?: () => void) => {
    if (to === undefined || to === chatParam) return;
    navigate(`/bots/${botParam}/${to}`);
    queryClient.invalidateQueries({ queryKey: ["chats"] });
    callback?.();
  };

  const chat = list?.find((c) => c.id === chatParam) || list?.[0];
  const data = chat && list ? { chat, list } : undefined;

  const response: ChatParams = useMemo(
    () => ({
      params,
      data,
      isLoading,
      error,
      changeChat,
    }),
    [chatParam, list, isLoading, error],
  );

  useEffect(() => changeChat(chat?.id), [chat, chatParam]);

  return response;
};
