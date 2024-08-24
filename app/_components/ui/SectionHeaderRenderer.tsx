import { ActionIcon, ColorPicker, ColorSwatch, Group, Menu, TextInput } from "@mantine/core";
import { ISection } from "@/models/ISection";
import { FC, useState } from "react";
import { TrashSolidIcon } from "@/components/icons/TrashSolid";
import { useDebouncedCallback, useDidUpdate } from "@mantine/hooks";
import { swatches } from "@/libs/helpers/color-generator";

interface ISectionHeaderRenderer {
  section: ISection;
  setSectionColor: (sectionId: string, newColor: string) => void;
}

export const SectionHeaderRenderer: FC<ISectionHeaderRenderer> = ({ section, setSectionColor }) => {
  const [currentColor, setCurrentColor] = useState(section.color);
  const setDebouncedColor = useDebouncedCallback((newColor: string) => {
    setSectionColor(section.id, newColor);
  }, 500);

  useDidUpdate(() => {
    setDebouncedColor(currentColor);
  }, [currentColor])

  return (
      <Group className="w-full min-w-[200px]" gap={8} wrap="nowrap">
        <TextInput size="xs" value={section.name}/>
        <Menu>
          <Menu.Target>
            <ColorSwatch size={20} className="cursor-pointer" color={currentColor}/>
          </Menu.Target>
          <Menu.Dropdown>
            <ColorPicker onChange={setCurrentColor} swatches={swatches}/>
          </Menu.Dropdown>
        </Menu>
        <ActionIcon size="sm" variant="transparent">
          <TrashSolidIcon className="text-attention hover:text-attention-hover"/>
        </ActionIcon>
      </Group>
  )
}