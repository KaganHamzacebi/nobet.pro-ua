import { ActionIcon, TextInput } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { TrashSolidIcon } from '@/components/icons/TrashSolid';
import { IAssistant } from '@/models/IAssistant';
import { MRT_Row } from 'mantine-react-table';
import { useDebouncedCallback } from '@mantine/hooks';

interface IAssistantNameRendererProps {
  row: MRT_Row<IAssistant>;
  setAssistantName: (id: string, name: string) => void;
  removeAssistant: (id: IAssistant['id']) => void;
}

export const AssistantNameRenderer: FC<IAssistantNameRendererProps> =
  ({ row, setAssistantName, removeAssistant }) => {
    const [name, setName] = useState<string>(row.original.name);
    const setDebouncedName = useDebouncedCallback((name: string) => {
      setAssistantName(row.original.id, name);
    }, 500);

    useEffect(() => {
      setDebouncedName(name);
    }, [name]);

    return (
      <div className="flex flex-row gap-x-2 items-center">
        <TextInput size="xs"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
        />
        <ActionIcon size="sm" variant="transparent" onClick={() => removeAssistant(row.original.id)}>
          <TrashSolidIcon className="text-attention hover:text-attention-hover" />
        </ActionIcon>
      </div>
    );
  };