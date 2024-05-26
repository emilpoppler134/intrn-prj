import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompletion } from "ai/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useParams } from "react-router-dom";
import * as yup from "yup";
import Loading from "../components/Loading";
import Message from "../components/Message";
import Metrics from "../components/Metrics";
import QueuedSpinner from "../components/QueuedSpinner";
import TextField from "../components/TextField";
import Warnings from "../components/Warnings";
import ChatLayout from "../components/layouts/ChatLayout";
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { API_ADDRESS } from "../config";
import { useChat } from "../hooks/useChat";
import { ErrorWarning, useWarnings } from "../hooks/useWarnings";
import { useAuth } from "../provider/authProvider";
import { PromptItem } from "../types/Bot";
import { callAPI } from "../utils/apiService";
import { Llama3Template, LlamaTemplate } from "../utils/prompt_template";
import { countTokens } from "../utils/tokenizer";

const schema = yup.object().shape({
  prompt: yup.string().trim().required("You cant send an empty message."),
});

type FormFields = yup.InferType<typeof schema>;

enum MetricActionType {
  START,
  FIRST_MESSAGE,
  COMPLETE,
}

type MetricAction = {
  type: MetricActionType;
};

type MetricState = {
  startedAt: Date | null;
  firstMessageAt: Date | null;
  completedAt: Date | null;
};

type MessageItem = {
  isUser: boolean;
  text: string;
};

type ChatItem = {
  role: string;
  content: string;
};

type CreateChatResponse = {
  id: string;
};

const llamaTemplate = LlamaTemplate();
const llama3Template = Llama3Template();

const convertPromptsToString = (
  prompts: Array<PromptItem>,
  language: string,
): string => {
  const system_prompt = prompts
    .map((item) => item.option.subject + " " + item.value + ".")
    .join(". ");
  return `You speak the language: ${language}. This is some information about you: ${system_prompt}`;
};

const generatePrompt = (
  template: (chat: Array<ChatItem>) => string,
  systemPrompt: string,
  messages: Array<MessageItem>,
) => {
  const chat = messages.map((message) => ({
    role: message.isUser ? "user" : "assistant",
    content: message.text,
  }));

  return template([
    {
      role: "system",
      content: systemPrompt,
    },
    ...chat,
  ]);
};

const metricsReducer = (
  state: MetricState,
  action: MetricAction,
): MetricState => {
  switch (action.type) {
    case MetricActionType.START:
      return { startedAt: new Date(), firstMessageAt: null, completedAt: null };
    case MetricActionType.FIRST_MESSAGE:
      return { ...state, firstMessageAt: new Date() };
    case MetricActionType.COMPLETE:
      return { ...state, completedAt: new Date() };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

export default function BotChat() {
  const params = useParams();
  const { data, isLoading, error, changeChat } = useChat();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<FormFields>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const MAX_TOKENS = 8192;
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<MessageItem>>([]);
  const { warnings, pushWarning, removeWarning, clearWarnings } = useWarnings();
  const [starting, setStarting] = useState(false);

  const [metrics, dispatch] = useReducer(metricsReducer, {
    startedAt: null,
    firstMessageAt: null,
    completedAt: null,
  });

  const { complete, stop, completion, setCompletion, setInput } = useCompletion(
    {
      api: `${API_ADDRESS}/bots/${params.bot}/${params.chat}/chat`,
      headers: { Authorization: "Bearer " + token },
      onError: (error: Error) => {
        pushWarning(new ErrorWarning(error.message));
      },
      onResponse: () => {
        setStarting(false);
        clearWarnings();
        dispatch({ type: MetricActionType.FIRST_MESSAGE });
      },
      onFinish: () => {
        dispatch({ type: MetricActionType.COMPLETE });
      },
    },
  );

  const createMutation = useMutation({
    mutationFn: () =>
      callAPI<CreateChatResponse>(`/bots/${params.bot}/chats/create`),
    onSuccess: (response: CreateChatResponse) => {
      queryClient
        .invalidateQueries({ queryKey: ["chats"] })
        .then(() => onChangeChat(response.id));
    },
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  const removeMutation = useMutation({
    mutationFn: (
      { id }: { id: string }, // TODO
    ) => callAPI(`/bots/${params.bot}/chats/remove`, { id }),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chats"] })
        .then(() => onChangeChat("")); // TODO
    },
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  useEffect(() => {
    setInput(form.getValues("prompt"));
  }, [form.getValues("prompt")]);

  useEffect(() => {
    if (
      (messages?.length > 0 || completion?.length > 0) &&
      bottomRef &&
      bottomRef.current
    ) {
      bottomRef.current.scrollIntoView();
    }
  }, [messages, completion]);

  useEffect(() => {
    if (data === undefined) return;

    setMessages(
      data.chat.messages.map((message) => ({
        text: message.message,
        isUser: message.sender === "user",
      })),
    );
  }, [data, params.chat]);

  const handleSubmit = async ({ prompt: userMessage }: FormFields) => {
    if (data === undefined) return;
    form.reset();

    setStarting(true);
    const SNIP = "<!-- snip -->";

    const messageHistory = [...messages];

    if (completion.length > 0) {
      messageHistory.push({
        text: completion,
        isUser: false,
      });
    }
    messageHistory.push({
      text: userMessage,
      isUser: true,
    });

    // Generate initial prompt and calculate tokens
    let prompt = `${generatePrompt(
      bot.model.name.includes("Llama 3") ? llama3Template : llamaTemplate,
      convertPromptsToString(bot.prompts, bot.language.name),
      messageHistory,
    )}\n`;

    // Check if we exceed max tokens and truncate the message history if so.
    while (countTokens(prompt) > MAX_TOKENS) {
      if (messageHistory.length < 3) {
        return pushWarning(
          new ErrorWarning(
            "Your message is too long. Please try again with a shorter message.",
          ),
        );
      }

      // Remove the third message from history, keeping the original exchange.
      messageHistory.splice(1, 2);

      // Recreate the prompt
      prompt = `${SNIP}\n${generatePrompt(
        llamaTemplate,
        convertPromptsToString(bot.prompts, bot.language.name),
        messageHistory,
      )}\n`;
    }

    setMessages(messageHistory);
    dispatch({ type: MetricActionType.START });
    complete(prompt, { body: { userMessage } });
  };

  const handleCreateChat = () => {
    clearWarnings();
    createMutation.mutate();
  };

  const handleRemoveChat = (id: string) => {
    clearWarnings();
    removeMutation.mutate({ id });
  };

  const onChangeChat = (to: string) => {
    changeChat(to, () => setCompletion(""));
  };

  if (error !== null) return <ErrorLayout error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  const bot = data.chat.bot;

  return (
    <Layout breadcrumb={null}>
      <ChatLayout
        data={data}
        onNavigate={onChangeChat}
        onCreate={handleCreateChat}
        onRemove={handleRemoveChat}
      >
        <div className="flex-1 overflow-y-auto py-8">
          <div className="container max-w-3xl mx-auto space-y-10">
            {messages.map((message, index) => (
              <Message
                key={`message-${index}`}
                message={message.text}
                isUser={message.isUser}
                botName={bot.name}
                botPhoto={bot.photo}
              />
            ))}

            <Message
              key="completion"
              message={completion}
              isUser={false}
              botName={bot.name}
              botPhoto={bot.photo}
            />

            {starting && <QueuedSpinner />}
          </div>

          <div ref={bottomRef} />
        </div>

        <div className="bg-slate-100 border-t-2">
          <div className="container max-w-3xl mx-auto py-7 px-5 lg:px-3">
            <Metrics
              startedAt={metrics.startedAt}
              firstMessageAt={metrics.firstMessageAt}
              completedAt={metrics.completedAt}
              completion={completion}
            />

            <div className="w-full">
              <Form onSubmit={form.handleSubmit(handleSubmit)}>
                <TextField
                  form={form}
                  name="prompt"
                  key="prompt"
                  title="Message"
                />
              </Form>
            </div>
          </div>
        </div>
      </ChatLayout>

      <Warnings list={warnings} onClose={(item) => removeWarning(item)} />
    </Layout>
  );
}
