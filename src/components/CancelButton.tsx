import React, { RefObject } from 'react';

import { dynamicClassNames } from '../utils/dynamicClassNames';

type CancelButtonProps = {
  text: string;
  reference?: RefObject<HTMLButtonElement>;
  onPress: () => void;
  fullWidth?: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({ text, reference, onPress, fullWidth = true }) => {
  const onButtonClick = () => {
    onPress();
  }

  return (
    <div className={dynamicClassNames(
      fullWidth ? "" : "sm:w-auto",
      "w-full"
    )}>
      <button 
        className="w-full px-4 py-2 rounded-md shadow-sm bg-white hover:bg-gray-100 ring-1 ring-inset ring-gray-300 focus:ring-4 focus:ring-primary-300"
        onClick={onButtonClick}
        ref={reference}
      >
        <span className="text-sm font-semibold text-gray-700 pointer-events-none">{text}</span>
      </button>
    </div>
  )
}

export default CancelButton;
