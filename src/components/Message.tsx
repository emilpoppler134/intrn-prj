import { UserCircleIcon } from "@heroicons/react/24/solid";

type MessageProps = {
  message: string;
  isUser: boolean;
  botName: string;
  botPhoto: string | null;
};

const Message: React.FC<MessageProps> = ({
  message,
  isUser,
  botName,
  botPhoto,
}) => {
  if (Array.isArray(message)) {
    message = message.join("");
  }

  if (!message || message === "") {
    return null;
  }

  return (
    <div className={`flex gap-x-4 rounded-md py-5 px-5 mb-12`}>
      <div className="flex-shrink-0">
        {isUser || botPhoto === null ? (
          <UserCircleIcon
            className="h-8 w-8 text-gray-300"
            aria-hidden="true"
          />
        ) : (
          <img src={botPhoto} alt="" className="h-8 w-8" />
        )}
      </div>

      <div className="flex flex-col text-sm sm:text-base flex-1 gap-y-1">
        <span className="text-sm text-gray-600">
          {isUser ? "You" : botName}
        </span>

        {message.split("\n").map(
          (text, index) =>
            text.length > 0 && (
              <span key={index} className="min-w-0">
                {text}
              </span>
            ),
        )}
      </div>
    </div>
  );
};

export default Message;
