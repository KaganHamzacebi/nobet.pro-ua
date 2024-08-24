'use client';

import { createContext, useEffect, useMemo, useState, useTransition } from 'react';
import { IAssistant } from '@/models/IAssistant';
import { MonthPickerInput } from '@mantine/dates';
import moment from 'moment';
import { MonthConfig } from '@/models/MonthConfig';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import CalendarIcon from '@/components/icons/Calendar';
import { Button, NumberInput, SegmentedControl } from '@mantine/core';
import { ISection } from '@/models/ISection';
import { DefaultAssistantList, DefaultDutyList, DefaultMonthConfig, DefaultSectionList } from '@/libs/mock/nobet.data';
import { AddButton } from '@/components/ui/AddButton';
import { TrashSolidIcon } from '@/components/icons/TrashSolid';
import { DutyModel } from '@/models/DutyModel';
import { DefaultNobetContext, INobetContext } from '@/models/NobetContext';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { newAssistant, newSection } from '@/libs/helpers/model-generator';
import { AssistantNameRenderer } from '@/components/ui/AssistantNameRenderer';
import { MonthCellRenderer } from '@/components/ui/MonthCellRenderer';
import { AreaCellRenderer } from "@/components/ui/AreaCellRenderer";
import { AreaHeaderRenderer } from "@/components/ui/AreaHeaderRenderer";

enum ScreenMode {
  MonthPicker = 'MonthPicker',
  AreaEdit = 'AreaEdit',
}

export const NobetContext = createContext<INobetContext>(DefaultNobetContext);

export function NobetScheduler() {
  const [isPending, startTransition] = useTransition()
  const [monthConfig, setMonthConfig] = useState<MonthConfig>(DefaultMonthConfig);
  const [screenMode, setScreenMode] = useState<ScreenMode>(ScreenMode.MonthPicker);
  const [assistantList, setAssistantList] = useState<IAssistant[]>(DefaultAssistantList);
  const [sectionList, setSectionList] = useState<ISection[]>(DefaultSectionList);
  const [dutyList, setDutyList] = useState<DutyModel[]>(DefaultDutyList);
  const [sectionRenderer, setSectionRenderer] = useState<boolean>(false);

  useEffect(() => {
    onDateChange(new Date());
  }, []);

  const changeScreenMode = (screenMode: ScreenMode) => {
    startTransition(() => setScreenMode(screenMode));
  }

  const addAssistant = () => {
    setAssistantList((prevState) => [...prevState, newAssistant(`New Assistant - ${assistantList.length}`)]);
  };

  const removeAssistant = (assistantId: string) => {
    setAssistantList((prevState) => prevState.filter(i => i.id !== assistantId));
  };

  const setAssistantName = (assistantId: string, name: string) => {
    setAssistantList((prevState) =>
        prevState.map(assistant => assistant.id === assistantId ? { ...assistant, name } : assistant)
    );
  };

  const addSection = () => {
    setSectionList((prevState) => [...prevState, newSection(`New Section - ${sectionList.length}`)]);
    setSectionRenderer(prev => !prev);
  }

  const setSectionColor = (sectionId: string, color: string) => {
    setSectionList((prevState) =>
        prevState.map(section => section.id === sectionId ? { ...section, color } : section)
    );
  }

  const onDateChange = (date: Date | null) => {
    if (date == null) return;
    setMonthConfig({
      datesInMonth: moment(date).daysInMonth(),
      weekendIndexes: getWeekendDayIndexes(date),
      numberOfRestDays: monthConfig.numberOfRestDays
    });
  };

  const setNumberOfRestDays = (numberOfRestDays: string | number) => {
    setMonthConfig({
      ...monthConfig,
      numberOfRestDays: Number(numberOfRestDays)
    });
  };

  const columns = useMemo<MRT_ColumnDef<IAssistant>[]>(
      () => [
        {
          accessorKey: 'name',
          header: 'Assistant',
          Cell: (({ row }) => (
              <AssistantNameRenderer row={row}
                                     setAssistantName={setAssistantName}
                                     removeAssistant={removeAssistant}
              />
          ))
        },
        ...(screenMode === ScreenMode.MonthPicker ?
                Array.from({ length: monthConfig.datesInMonth }).map((_, index) => ({
                  size: 30,
                  header: String(index + 1),
                  Cell: (({ row }) =>
                          <MonthCellRenderer dayIndex={index + 1}
                                             isWeekend={monthConfig.weekendIndexes.includes(index + 1)}
                                             assistant={row.original}
                          />
                  )
                }) as MRT_ColumnDef<IAssistant>)
                :
                sectionList.map(section => (
                    {
                      id: section.id,
                      header: "Section",
                      Header: () => (
                          <AreaHeaderRenderer section={section}
                                              setSectionColor={setSectionColor}
                          />
                      ),
                      Cell: () => (
                          <AreaCellRenderer
                          />
                      )
                    }
                ))
        )
      ],
      [monthConfig.datesInMonth, screenMode, sectionRenderer]
  );


  const table = useMantineReactTable({
    columns: columns,
    data: assistantList,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnPinning: true,
    initialState: {
      columnPinning: { left: ['name'] },
      density: "xs"
    },
    mantineTableProps: {
      striped: "even",
      withColumnBorders: true
    },
    state: { isLoading: isPending }
  });

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
                              leftSection={<CalendarIcon/>}
                              leftSectionPointerEvents="none"
                              className="w-[10rem]"
            />
            <NumberInput className="w-fit"
                         label="Number of Rest days"
                         value={monthConfig.numberOfRestDays}
                         onChange={setNumberOfRestDays}
                         allowNegative={false}
                         max={monthConfig.datesInMonth}
            />
            <div className="mt-auto ml-auto">
              <SegmentedControl value={screenMode}
                                onChange={(e) => changeScreenMode(e as ScreenMode)}
                                color="yellow"
                                data={[
                                  { label: 'Month Picker', value: ScreenMode.MonthPicker },
                                  { label: 'Area Editor', value: ScreenMode.AreaEdit }
                                ]}
              />
            </div>
          </div>
          <div className="mt-2">
            <MantineReactTable<IAssistant> table={table}
            />
          </div>
          <div className="mt-4 flex flex-row gap-x-4">
            <AddButton label="Add Assistant" onClick={addAssistant}/>
            {screenMode === ScreenMode.AreaEdit && <AddButton label="Add Area" onClick={addSection}/>}
            {
                screenMode === ScreenMode.MonthPicker &&
                <Button leftSection={<TrashSolidIcon className="size-4"/>}
                        className="bg-attention hover:bg-attention-hover">
                    Clear Selections
                </Button>
            }
          </div>
        </div>
      </NobetContext.Provider>
  );
}