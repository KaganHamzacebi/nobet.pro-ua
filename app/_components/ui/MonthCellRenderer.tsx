import { Checkbox, Menu, MenuDropdown, MenuItem, Tooltip } from '@mantine/core';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { ISection } from '@/models/ISection';
import { NobetContext } from '@/components/ui/NobetScheduler';
import { IAssistant } from '@/models/IAssistant';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { getDisabledDays } from '@/libs/helpers/disabled-day-calculator';
import { useDidUpdate } from '@mantine/hooks';

interface IMonthCellProps {
  dayIndex: number;
  isWeekend: boolean;
  assistant: IAssistant;
}

export const MonthCellRenderer: FC<IMonthCellProps> = ({ dayIndex, isWeekend, assistant }) => {
  const { monthConfig, sectionList, setAssistantList, selectedDayConfig } = useContext(NobetContext);
  const [opened, setOpened] = useState(false);
  const getSelectedSection = () => {
    return sectionList.find(s => s.id === assistant.selectedDays[dayIndex]?.id);
  };
  const [selectedSection, setSelectedSection] = useState<ISection | null | undefined>(getSelectedSection());

  useEffect(() => {
    console.log(selectedDayConfig);
  }, [selectedDayConfig]);

  const isDisabled = useMemo(() => {
    return assistant.disabledDays.includes(dayIndex);
  }, [assistant.disabledVersion]);

  useDidUpdate(() => {
    const updatedAssistant = { ...assistant };
    if (selectedSection) updatedAssistant.selectedDays[dayIndex] = selectedSection;
    else delete updatedAssistant.selectedDays[dayIndex];
    updatedAssistant.selectedVersion = GenerateUUID();
    const selectedDayIndexes = Object.keys(updatedAssistant.selectedDays).map(i => Number(i));
    updatedAssistant.disabledDays = getDisabledDays(
      selectedDayIndexes,
      monthConfig.numberOfRestDays
    );
    updatedAssistant.disabledVersion = GenerateUUID();
    setAssistantList((prevState) =>
      prevState.map(oldAssistant => oldAssistant.id === assistant.id ? updatedAssistant : oldAssistant)
    );
  }, [selectedSection?.id, monthConfig.numberOfRestDays]);

  const onCheckboxChangeHandler = (isChecked: boolean) => {
    setOpened(isChecked);
    if (!isChecked) {
      setSelectedSection(null);
    }
  };

  const selectSection = (section: ISection) => {
    setSelectedSection(section);

  };

  const menuTarget = (
    <Menu.Target>
      <Tooltip disabled={!selectedSection} label={selectedSection?.name}
               transitionProps={{ transition: 'pop-bottom-right', duration: 300 }}>
        <Checkbox
          checked={!!selectedSection}
          disabled={isDisabled}
          indeterminate={isDisabled}
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