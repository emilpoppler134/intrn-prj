import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/solid';

import { Bot } from '../types/Bot';

type BotProps = {
  bot: Bot;
}

const BotItem: React.FC<BotProps> = ({ bot }) => {
  return (
    <div>
      <div className="flex flex-col p-4 outline outline-2 outline-gray-300">
        <UserIcon className="block w-full h-auto fill-gray-700" aria-hidden="true" />
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