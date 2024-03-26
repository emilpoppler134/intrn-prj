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
        className="CustomButton bg-white hover:bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300"
        onClick={onButtonClick}
        ref={reference}
      >
        <span className="CustomButton-Text text-gray-700">{text}</span>
      </button>
    </div>
  )
}

export default CancelButton;
