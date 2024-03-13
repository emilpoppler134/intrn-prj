import React, { useState } from 'react';

type Props = {
  text: string;
  available: boolean;
  onSubmit: () => void;
  error?: string | null;
}

const SubmitButton: React.FC<Props> = ({ text, available, onSubmit, error }) => {
  const [loading, setLoading] = useState(false);

  const onButtonClick = () => {
    if (available) {
      setLoading(true);
      onSubmit();
    }
  }

  if (error && loading) {
    setLoading(false);
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
