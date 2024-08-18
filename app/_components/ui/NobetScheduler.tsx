'use client';

import { createContext, useEffect, useState } from 'react';
import { AssistantModel } from '@/models/AssistantModel';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { MonthPickerInput } from '@mantine/dates';
import moment from 'moment';
import { MonthConfig } from '@/models/MonthConfig';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import CalendarIcon from '@/components/icons/Calendar';
import { ActionIcon, Box, Button, NumberInput, SegmentedControl, TextInput } from '@mantine/core';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { AreaEditor } from '@/components/ui/AreaEditor';
import { SectionModel } from '@/models/SectionModel';
import { DefaultAssistantList, DefaultDutyList, DefaultMonthConfig, DefaultSectionList } from '@/libs/mock/nobet.data';
import { AddButton } from '@/components/ui/AddButton';
import { getRandomColor } from '@/libs/helpers/color-generator';
import { TrashSolidIcon } from '@/components/icons/TrashSolid';
import { DutyModel } from '@/models/DutyModel';
import { DefaultNobetContext, INobetContext } from '@/models/NobetContext';

enum ScreenMode {
  MonthPicker = 'MonthPicker',
  AreaEdit = 'AreaEdit',
}

export const NobetContext = createContext<INobetContext>(DefaultNobetContext);

export function NobetScheduler() {
  const [monthConfig, setMonthConfig] = useState<MonthConfig>(DefaultMonthConfig);
  const [screenMode, setScreenMode] = useState<ScreenMode>(ScreenMode.MonthPicker);
  const [assistantList, setAssistantList] = useState<AssistantModel[]>(DefaultAssistantList);
  const [sectionList, setSectionList] = useState<SectionModel[]>(DefaultSectionList);
  const [dutyList, setDutyList] = useState<DutyModel[]>(DefaultDutyList);

  useEffect(() => {
    onDateChange(new Date());
  }, []);

  const addAssistant = () => {
    const newAssistant: AssistantModel = {
      id: GenerateUUID(),
      name: '',
      selectedDays: new Set<number>()
    };
    setAssistantList([...assistantList, newAssistant]);

    const newDuties = sectionList.map(section => ({
      assistant: newAssistant,
      area: section,
      dayCount: 0
    }) as DutyModel);
    setDutyList([...dutyList, ...newDuties]);
  };

  const removeAssistant = (assistant: AssistantModel) => {
    setAssistantList(
      assistantList.filter(a => a.id !== assistant.id)
    );

    setDutyList(
      dutyList.filter(duty => duty.assistant.id !== assistant.id)
    );
  };

  const addArea = () => {
    const newSection: SectionModel = {
      id: GenerateUUID(),
      name: `New Section - ${sectionList.length + 1}`,
      color: getRandomColor()
    };
    setSectionList([...sectionList, newSection]);

    const newDuties = assistantList.map(assistant => ({
      assistant: assistant,
      area: newSection,
      dayCount: 0
    }) as DutyModel);
    setDutyList([...dutyList, ...newDuties]);
  };

  const clearSelections = () => {
    setAssistantList(
      assistantList.map(assistant => ({
        ...assistant,
        selectedDays: new Set<number>()
      }))
    );
  };

  const onDateChange = (date: Date | null) => {
    if (date == null) return;
    setMonthConfig({
      datesInMonth: moment(date).daysInMonth(),
      weekendIndexes: getWeekendDayIndexes(date),
      numberOfRestDays: monthConfig.numberOfRestDays
    });
  };

  const setNumberOfRestDays = (numberOfRestDays: number) => {
    setMonthConfig({
      ...monthConfig,
      numberOfRestDays: numberOfRestDays
    });
  };

  return (
    <NobetContext.Provider
      value={{ monthConfig, assistantList, setAssistantList, sectionList, setSectionList, dutyList, setDutyList }}>
      <div className="w-full h-full">
        <div className="flex flex-row gap-x-4">
          <MonthPickerInput minDate={moment().toDate()}
                            maxLevel="year"
                            allowDeselect={false}
                            onChange={onDateChange}
                            defaultValue={new Date()}
                            label="Pick Month"
                            leftSection={<CalendarIcon />}
                            leftSectionPointerEvents="none"
                            className="w-[10rem]"
          />
          <NumberInput className="w-fit"
                       label="Number of Rest days"
                       value={monthConfig.numberOfRestDays}
                       onChange={(e) => setNumberOfRestDays(Number(e))}
                       allowNegative={false}
                       max={monthConfig.datesInMonth}
          />
          <div className="mt-auto ml-auto">
            <SegmentedControl value={screenMode}
                              onChange={(e) => setScreenMode(e as ScreenMode)}
                              color="yellow"
                              data={[
                                { label: 'Month Picker', value: ScreenMode.MonthPicker },
                                { label: 'Area Editor', value: ScreenMode.AreaEdit }
                              ]}
            />
          </div>
        </div>
        <div className="w-full max-w-full flex flex-row bg-silver dark:bg-blackRock rounded p-4 mt-4">
          <div className="min-w-fit flex flex-col gap-y-2">
            <Box className="bg-onyx py-1 px-2 rounded shadow-lg font-semibold">
              <span>Assistants / {screenMode === ScreenMode.MonthPicker ? 'Days' : 'Areas'}</span>
            </Box>
            {
              assistantList.map((assistant) =>
                <div key={assistant.id} className="flex flex-row gap-x-2 items-center">
                  <TextInput className="w-[120px] h-[38px]"
                             defaultValue={assistant.name}
                  />
                  {
                    assistantList.length > 1 &&
                    <ActionIcon size="sm" variant="transparent"
                                onClick={() => removeAssistant(assistant)}>
                      <TrashSolidIcon className="text-attention" />
                    </ActionIcon>
                  }
                </div>
              )
            }
          </div>
          <div className="max-w-full overflow-x-auto ml-4 flex flex-col gap-y-4 outline-0">
            <div className={`${screenMode === ScreenMode.MonthPicker ? 'visible' : 'hidden'}`}>
              <MonthPicker assistantList={assistantList} />
            </div>
            <div className={`${screenMode === ScreenMode.AreaEdit ? 'visible' : 'hidden'}`}>
              <AreaEditor />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-row gap-x-4">
          <AddButton label="Add Assistant" onClick={addAssistant} />
          {screenMode === ScreenMode.AreaEdit && <AddButton label="Add Area" onClick={addArea} />}
          {
            screenMode === ScreenMode.MonthPicker &&
            <Button leftSection={<TrashSolidIcon className="size-4" />}
                    className="bg-attention hover:bg-attention-hover"
                    onClick={clearSelections}>
              Clear Selections
            </Button>
          }
        </div>
      </div>
    </NobetContext.Provider>
  );
}