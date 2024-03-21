import React, { RefObject } from 'react';

type CancelButtonProps = {
  text: string;
  reference?: RefObject<HTMLButtonElement>;
  onPress: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ text, reference, onPress }) => {
  const onButtonClick = () => {
    onPress();
  }

  return (
    <button 
      className="CustomButton bg-white hover:bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300"
      onClick={onButtonClick}
      ref={reference}
    >
      <span className="CustomButton-Text text-gray-700">{text}</span>
    </button>
  )
}

export default CancelButton;
