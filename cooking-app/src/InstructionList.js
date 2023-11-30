import { useState } from 'react';

export default function InstructionList({
  instructions,
  onChangeInstruction,
  onDeleteInstruction
}) {
  return (
    <ul className="instructions-list">
      {instructions.map(instruction => (
        <li key={instruction.id}>
          <Instruction
            instruction={instruction}
            onChange={onChangeInstruction}
            onDelete={onDeleteInstruction}
          />
        </li>
      ))}
    </ul>
  );
}

function Instruction({ instruction, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let instructionContent;
  if (isEditing) {
    instructionContent = (
      <>
        <input
          value={instruction.text}
          onChange={e => {
            onChange({
              ...instruction,
              text: e.target.value
            });
          }} />&nbsp;
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>&nbsp;
      </>
    );
  } else {
    instructionContent = (
      <>
        {instruction.text}&nbsp;
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>&nbsp;
      </>
    );
  }
  return (
    <label>
      {instructionContent}
      <button onClick={() => onDelete(instruction.id)}>
        Delete
      </button>
    </label>
  );
}
