import React, { useState } from 'react';

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
      className={`SubmitButton ${available ? null : "SubmitButton--incomplete"}`}
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
