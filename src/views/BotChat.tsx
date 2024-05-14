import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
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
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { API_ADDRESS } from "../config";
import { ErrorWarning, useWarnings } from "../hooks/useWarnings";
import { useAuth } from "../provider/authProvider";
import { Bot, PromptItem } from "../types/Bot";
import { Breadcrumb } from "../types/Breadcrumb";
import { Model } from "../types/Model";
import { callAPI } from "../utils/apiService";
import { Llama3Template, LlamaTemplate } from "../utils/prompt_template";
import { countTokens } from "../utils/tokenizer";

const schema = yup.object().shape({
  prompt: yup.string().trim().required("You cant send an empty message."),
});

type FormFields = yup.InferType<typeof schema>;
type QueryResponse = { bot: Bot; models: Array<Model> };

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
  const { id } = useParams();
  const { token } = useAuth();

  const form = useForm<FormFields>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["botChat"],
    queryFn: () => callAPI<QueryResponse>("/bots/find", { id }),
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

  useEffect(() => {
    setInput(form.getValues("prompt"));
  }, [form.getValues("prompt")]);

  const { complete, completion, setInput } = useCompletion({
    api: `${API_ADDRESS}/bots/${id}/chat`,
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
  });

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
      data.bot.model.name.includes("Llama 3") ? llama3Template : llamaTemplate,
      convertPromptsToString(data.bot.prompts, data.bot.language.name),
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
        convertPromptsToString(data.bot.prompts, data.bot.language.name),
        messageHistory,
      )}\n`;
    }

    setMessages(messageHistory);
    dispatch({ type: MetricActionType.START });
    complete(prompt);
  };

  useEffect(() => {
    if (
      (messages?.length > 0 || completion?.length > 0) &&
      bottomRef &&
      bottomRef.current
    ) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, completion]);

  if (error !== null) return <ErrorLayout error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  const bot = data.bot;
  const breadcrumb: Breadcrumb = [{ title: bot.name }, { title: "Chat" }];

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="container max-w-3xl mx-auto pt-6">
        <div className="pb-24">
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
            message={completion}
            isUser={false}
            botName={bot.name}
            botPhoto={bot.photo}
          />

          {starting && <QueuedSpinner />}

          <div ref={bottomRef} />
        </div>

        <div className="z-10 fixed bottom-0 left-0 right-0 bg-slate-100 border-t-2">
          <div className="container max-w-2xl mx-auto px-5 py-7">
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
      </div>

      <Warnings list={warnings} onClose={(item) => removeWarning(item)} />
    </Layout>
  );
}
