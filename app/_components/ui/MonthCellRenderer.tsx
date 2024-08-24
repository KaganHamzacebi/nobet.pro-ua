import { Checkbox, Menu, MenuDropdown, MenuItem, Tooltip } from '@mantine/core';
import { FC, useContext, useState } from 'react';
import { ISection } from '@/models/ISection';
import { NobetContext } from '@/components/ui/NobetScheduler';
import { IAssistant } from '@/models/IAssistant';

interface IMonthCellProps {
  dayIndex: number;
  isWeekend: boolean;
  assistant: IAssistant;
}

export const MonthCellRenderer: FC<IMonthCellProps> = ({ dayIndex, isWeekend, assistant }) => {
  const { monthConfig, sectionList, dutyList, setAssistantList, assistantList } = useContext(NobetContext);
  const [opened, setOpened] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ISection | null>();

  const onCheckboxChangeHandler = (isChecked: boolean) => {
    setOpened(isChecked);
    if (!isChecked) {
      setSelectedSection(null);
      updateAssistantSelectedDays();
    }
  };

  const selectSection = (section: ISection) => {
    setSelectedSection(section);
    updateAssistantSelectedDays();
  };

  const updateAssistantSelectedDays = () => {

  };

  const menuTarget = (
    <Menu.Target>
      <Tooltip disabled={!selectedSection} label={selectedSection?.name}
               transitionProps={{ transition: 'pop-bottom-right', duration: 300 }}>
        <Checkbox
          checked={!!selectedSection}
          onChange={(e) => onCheckboxChangeHandler(e.currentTarget.checked)}
          color={selectedSection?.color}
        />
      </Tooltip>
    </Menu.Target>
  );

  const menuDropdown = (
    <MenuDropdown>
      {
        sectionList.map((section: ISection) => (
          <MenuItem key={section.id} onClick={() => selectSection(section)}>
            {section.name}
          </MenuItem>
        ))
      }
    </MenuDropdown>
  );

  return (
    <Menu shadow="md" opened={opened} onChange={setOpened}>
      {menuTarget}
      {menuDropdown}
    </Menu>
  );
};