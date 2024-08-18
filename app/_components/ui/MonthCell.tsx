import { Checkbox, Menu, MenuDropdown, MenuItem, Tooltip } from '@mantine/core';
import { FC, useContext, useEffect, useState } from 'react';
import { SectionModel } from '@/models/SectionModel';
import { NobetContext } from '@/components/ui/NobetScheduler';
import { AssistantModel } from '@/models/AssistantModel';
import { getDisabledDays } from '@/libs/helpers/disabled-day-calculator';

interface IMonthCellProps {
  dayIndex: number;
  isWeekend: boolean;
  assistant: AssistantModel;
}

export const MonthCell: FC<IMonthCellProps> = ({ dayIndex, isWeekend, assistant }) => {
  const { monthConfig, sectionList, dutyList, setAssistantList, assistantList } = useContext(NobetContext);
  const [opened, setOpened] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionModel | null>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    const restDays = monthConfig.numberOfRestDays;
    const assistantMaxLimit = dutyList
      .filter(i => i.assistant.id === assistant.id)
      .map(i => i.dayCount)
      .reduce((prev, acc) => prev + acc, 0);
    const disabledDays = getDisabledDays(assistant.selectedDays, restDays);

    setIsDisabled(
      assistant.selectedDays.size === assistantMaxLimit || disabledDays.includes(dayIndex)
    );
  }, [monthConfig.numberOfRestDays, dutyList, assistant.selectedDays]);

  const onCheckboxChangeHandler = (isChecked: boolean) => {
    setOpened(isChecked);
    if (!isChecked) {
      setSelectedSection(null);
      assistant.selectedDays.delete(dayIndex);
      updateAssistantSelectedDays();
    }
  };

  const selectSection = (section: SectionModel) => {
    setSelectedSection(section);
    assistant.selectedDays.add(dayIndex);
    updateAssistantSelectedDays();
  };

  const updateAssistantSelectedDays = () => {
    setAssistantList(
      assistantList.map(i =>
        i.id === assistant.id ? { ...i, selectedDays: new Set(assistant.selectedDays) } : i
      )
    );
  };

  const menuTarget = (
    <Menu.Target>
      <Tooltip disabled={!selectedSection} label={selectedSection?.name}
               transitionProps={{ transition: 'pop-bottom-right', duration: 300 }}>
        <Checkbox checked={assistant.selectedDays.has(dayIndex)}
                  disabled={isDisabled && !assistant.selectedDays.has(dayIndex)}
                  indeterminate={isDisabled && !assistant.selectedDays.has(dayIndex)}
                  onChange={(e) => onCheckboxChangeHandler(e.currentTarget.checked)}
                  color={selectedSection?.color}
        />
      </Tooltip>
    </Menu.Target>
  );

  const menuDropdown = (
    <MenuDropdown>
      {
        sectionList.map((section: SectionModel) => (
          <MenuItem key={section.id} onClick={() => selectSection(section)}>
            {section.name}
          </MenuItem>
        ))
      }
    </MenuDropdown>
  );

  return (
    <div
      className={`flex flex-row gap-x-1 items-center justify-center 
      p-2 border border-onyx-50 ${isWeekend ? 'bg-onyx' : 'bg-cinder'}`}>
      <Menu shadow="md" opened={opened} onChange={setOpened}>
        {menuTarget}
        {menuDropdown}
      </Menu>
    </div>
  );
};