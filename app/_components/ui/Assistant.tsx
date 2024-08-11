import { TextInput } from '@mantine/core';
import { FC } from 'react';
import { AssistantModel } from '@/models/AssistantModel';

export interface IAssistantProps {
  assistant: AssistantModel;
  updateAssistant: (assistant: AssistantModel) => void;
}

export const Assistant: FC<IAssistantProps> = ({ assistant, updateAssistant }) => {

  const onAssistantNameChange = (name: string) => {
    updateAssistant({
      ...assistant,
      name: name
    });
  };

  return (
    <div>
      <TextInput className="w-fit"
                 value={assistant.name}
                 onChange={(event) => onAssistantNameChange(event.currentTarget.value)}
      />
    </div>
  );
};