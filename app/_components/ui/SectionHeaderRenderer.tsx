import { TrashSolidIcon } from '@/components/icons/TrashSolid';
import { swatches } from '@/libs/helpers/color-generator';
import { ISection } from '@/models/ISection';
import {
  ActionIcon,
  ColorPicker,
  ColorSwatch,
  Group,
  Menu,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { ChangeEvent, FC, useCallback, useState } from 'react';

interface ISectionHeaderRenderer {
  section: ISection;
  setSectionProps: (sectionId: ISection['id'], props: Partial<ISection>) => void;
  removeSection: (sectionId: ISection['id']) => void;
}

export const SectionHeaderRenderer: FC<ISectionHeaderRenderer> = ({
  section,
  setSectionProps,
  removeSection,
}) => {
  const [fields, setFields] = useState({ color: section.color, name: section.name });

  const setDebouncedFields = useDebouncedCallback((props: Partial<ISection>) => {
    setSectionProps(section.id, props);
  }, 500);

  useDidUpdate(() => {
    setDebouncedFields({ color: fields.color });
  }, [fields.color]);

  useDidUpdate(() => {
    setDebouncedFields({ name: fields.name });
  }, [fields.name]);

  const handleColorChange = useCallback((color: string) => {
    setFields(prev => ({ ...prev, color }));
  }, []);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFields(prev => ({ ...prev, name: event.target.value }));
  }, []);

  return (
    <Group className="w-full min-w-[200px]" gap={8} wrap="nowrap">
      <TextInput size="xs" value={fields.name} onChange={handleNameChange} />
      <Menu>
        <Menu.Target>
          <ColorSwatch size={20} className="cursor-pointer" color={fields.color} />
        </Menu.Target>
        <Menu.Dropdown>
          <ColorPicker onChange={handleColorChange} swatches={swatches} />
        </Menu.Dropdown>
      </Menu>
      <Tooltip label={`Remove ${section.name}`}>
        <ActionIcon size="sm" variant="transparent" onClick={() => removeSection(section.id)}>
          <TrashSolidIcon className="text-attention hover:text-attention-hover" />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
