import React from 'react';
import { Link } from 'react-router-dom';

import { Bot } from '../types/Bot';

type BotProps = {
  bot: Bot;
}

const BotItem: React.FC<BotProps> = ({ bot }) => {
  return (
    <div>
      <div className="flex flex-col p-4 outline outline-2 outline-gray-300">
        <div className="w-full text-gray-700">
          <svg className="h-full w-auto fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
          </svg>
        </div>
        <span className="mt-2 text-grey-700">{ bot.name }</span>
      </div>
      <div className="flex flex-col mt-2">
        <Link to={`/bots/${bot._id}`} className="text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
          <span>Chat</span>
        </Link>
        <Link to={`/bots/${bot._id}/config`} className="text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
          <span>Config</span>
        </Link>
      </div>
    </div>

    
  )
}

export default BotItem;