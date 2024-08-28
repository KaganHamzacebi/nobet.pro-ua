import { TrashSolidIcon } from '@/components/icons/TrashSolid';
import { IAssistant } from '@/models/IAssistant';
import { ActionIcon, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { MRT_Row } from 'mantine-react-table';
import { FC, useState } from 'react';

interface IAssistantNameRendererProps {
  row: MRT_Row<IAssistant>;
  setAssistantProps: (id: string, props: Partial<IAssistant>) => void;
  removeAssistant: (id: IAssistant['id']) => void;
}

export const AssistantNameRenderer: FC<IAssistantNameRendererProps> = ({
  row,
  setAssistantProps,
  removeAssistant
}) => {
  const [name, setName] = useState<string>(row.original.name);

  const setDebouncedName = useDebouncedCallback((name: string) => {
    setAssistantProps(row.original.id, { name: name });
  }, 500);

  useDidUpdate(() => {
    setDebouncedName(name);
  }, [name]);

  return (
    <div className="flex flex-row items-center gap-x-2">
      <TextInput
        size="xs"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Tooltip label={`Remove ${name}`}>
        <ActionIcon
          size="sm"
          variant="transparent"
          onClick={() => removeAssistant(row.original.id)}>
          <TrashSolidIcon className="text-attention hover:text-attention-hover" />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};
