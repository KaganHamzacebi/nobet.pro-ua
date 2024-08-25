import {NumberInput} from '@mantine/core';
import {FC, useState} from 'react';
import {IAssistant} from '@/models/IAssistant';
import {ISection} from '@/models/ISection';
import {useDebouncedCallback, useDidUpdate} from '@mantine/hooks';
import {GenerateUUID} from '@/libs/helpers/id-generator';

interface ISectionCellRendererProps {
  assistant: IAssistant;
  section: ISection;
  setAssistantProps: (assistantId: IAssistant['id'], props: Partial<IAssistant>) => void;
}

export const SectionCellRenderer: FC<ISectionCellRendererProps> = ({
  assistant,
  section,
  setAssistantProps,
}) => {
  const [count, setCount] = useState<number>(assistant.sectionConfig.counts[section.id] ?? 0);

  const setAssistantSectionConfig = useDebouncedCallback((count: number) => {
    setAssistantProps(assistant.id, {
      sectionConfig: {
        ...assistant.sectionConfig,
        counts: {
          ...assistant.sectionConfig.counts,
          [section.id]: count,
        },
        version: GenerateUUID(),
      },
    });
  }, 500);

  useDidUpdate(() => {
    setAssistantSectionConfig(count);
  }, [count]);

  return (
    <div className="w-full min-w-[200px]">
      <NumberInput
        value={count}
        onChange={e => setCount(Number(e))}
        size="xs"
        allowNegative={false}
      />
    </div>
  );
};
