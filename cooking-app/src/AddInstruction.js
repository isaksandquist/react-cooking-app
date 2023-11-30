import { useState } from 'react';

export default function AddInstruction({ onAddInstruction }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add instruction"
        value={text}
        onChange={e => setText(e.target.value)}
      />&nbsp;
      <button onClick={() => {
        setText('');
        onAddInstruction(text);
      }}>Add</button>
    </>
  )
}