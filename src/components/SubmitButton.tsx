import React, { useState } from 'react';
import { dynamicClassNames } from '../utils/dynamicClassNames';

type Props = {
  text: string;
  available: boolean;
  onSubmit: () => Promise<void> | void;
}

const SubmitButton: React.FC<Props> = ({ text, available, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const onButtonClick = async () => {
    if (available) {
      setLoading(true);

      await onSubmit();

      setLoading(false);
    }
  }

  return (
    <button 
      className={dynamicClassNames(
        !available ? "SubmitButton--incomplete" : "",
        "SubmitButton bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300"
      )}
      onClick={onButtonClick}
    >
      {!loading ? 
        <span className="SubmitButton-Text">{text}</span>
        :
        <div className="theme-spinner"></div>
      }
    </button>
  )
}

export default SubmitButton;
