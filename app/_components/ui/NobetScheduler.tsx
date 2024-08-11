'use client';

import { useState } from 'react';
import { Assistant } from '@/components/ui/Assistant';
import AddIcon from '@/components/icons/Add';
import { AssistantModel } from '@/models/AssistantModel';
import { GenerateUUID } from '@/libs/id-generator';

export function NobetScheduler() {
  const [assistantList, setAssistantList] = useState<AssistantModel[]>([{ id: GenerateUUID(), name: 'Kel Mahmut' }]);

  const addAssistant = () => {
    setAssistantList(
      [...assistantList, { id: GenerateUUID(), name: '' }]
    );
  };

  const updateAssistant = (assistant: AssistantModel, index: number) => {
    const tmpAssistantList = [...assistantList];
    tmpAssistantList.splice(index, 1, assistant);
    setAssistantList(tmpAssistantList);
  };

  return (
    <div className="bg-gray-500 rounded p-4">
      <div className="flex flex-col gap-y-2">
        {
          assistantList.map((assistant, index) =>
            <Assistant assistant={assistant}
                       updateAssistant={(assistant) => updateAssistant(assistant, index)}
                       key={assistant.id}
            />
          )
        }
        <button onClick={addAssistant} className="w-fit bg-green-300 rounded text-black">
          <AddIcon />
        </button>
      </div>
    </div>
  );
}