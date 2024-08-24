import {Checkbox, Menu, MenuDropdown, MenuItem, Tooltip} from '@mantine/core';
import {FC, useContext, useMemo, useState} from 'react';
import {ISection} from '@/models/ISection';
import {NobetContext} from '@/components/ui/NobetScheduler';
import {IAssistant} from '@/models/IAssistant';
import {GenerateUUID} from '@/libs/helpers/id-generator';
import {getDisabledDays} from '@/libs/helpers/disabled-day-calculator';
import {useDidUpdate} from '@mantine/hooks';
import {newSelectedDayConfig} from '@/libs/helpers/model-generator';

interface IMonthCellProps {
  dayIndex: number;
  isWeekend: boolean;
  assistant: IAssistant;
}

export const MonthCellRenderer: FC<IMonthCellProps> = ({dayIndex, isWeekend, assistant}) => {
  const {
    monthConfig,
    sectionList,
    setAssistantList,
    selectedDayConfig,
    setSelectedDayConfig
  } = useContext(NobetContext);
  const [opened, setOpened] = useState(false);
  const getSelectedSection = () => {
    return sectionList.find(s => s.id === assistant.selectedDays[dayIndex]?.id);
  };
  const [selectedSection, setSelectedSection] = useState<ISection | null | undefined>(getSelectedSection());

  const filteredSectionList = useMemo(() => {
    return sectionList.filter(s => !selectedDayConfig[dayIndex]?.sectionIds.has(s.id) ?? true);
  }, [selectedDayConfig[dayIndex]?.version]);

  const isDisabled = useMemo(() => {
    const isDisabledDay = assistant.disabledDays.includes(dayIndex);
    const isAllSectionsAreFull = filteredSectionList.length === 0 && selectedSection == undefined;
    return isDisabledDay || isAllSectionsAreFull;
  }, [assistant.disabledVersion, filteredSectionList]);

  useDidUpdate(() => {
    const updatedAssistant = {...assistant};
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
      selectSection(undefined);
    }
  };

  const selectSection = (section?: ISection) => {
    const dayConfig = {...selectedDayConfig};
    if (section) {
      dayConfig[dayIndex] ??= newSelectedDayConfig();
      dayConfig[dayIndex].sectionIds.add(section.id);
    } else {
      dayConfig[dayIndex].sectionIds.delete(selectedSection?.id ?? '');
      dayConfig[dayIndex].version = GenerateUUID();
    }
    setSelectedDayConfig(dayConfig);
    setSelectedSection(section);
  };

  const menuTarget = (
    <Menu.Target>
      <Tooltip disabled={!selectedSection} label={selectedSection?.name}
               transitionProps={{transition: 'pop-bottom-right', duration: 300}}>
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
        filteredSectionList.map((section: ISection) => (
          <MenuItem key={section.id} onClick={() => selectSection(section)}>
            {section.name}
          </MenuItem>
        ))
      }
    </MenuDropdown>
  );

  return (
    <div className={`flex flex-col items-center`}>
      <Menu shadow="md" opened={opened} onChange={setOpened}>
        {menuTarget}
        {menuDropdown}
      </Menu>
    </div>
  );
};