'use client';

import {createContext, useCallback, useEffect, useMemo, useState, useTransition} from 'react';
import {IAssistant} from '@/models/IAssistant';
import {MonthPickerInput} from '@mantine/dates';
import {MonthConfig} from '@/models/MonthConfig';
import {getWeekendDayIndexes} from '@/libs/helpers/get-weekend-indexes';
import CalendarIcon from '@/components/icons/Calendar';
import {Button, NumberInput, SegmentedControl} from '@mantine/core';
import {ISection} from '@/models/ISection';
import {DefaultAssistantList, DefaultMonthConfig, DefaultSectionList} from '@/libs/mock/nobet.data';
import {AddButton} from '@/components/ui/AddButton';
import {TrashSolidIcon} from '@/components/icons/TrashSolid';
import {DefaultNobetContext, INobetContext, SelectedDayConfig} from '@/models/NobetContext';
import {MantineReactTable, MRT_ColumnDef, MRT_Row, useMantineReactTable} from 'mantine-react-table';
import {newAssistant, newSection} from '@/libs/helpers/model-generator';
import {AssistantNameRenderer} from '@/components/ui/AssistantNameRenderer';
import {MonthCellRenderer} from '@/components/ui/MonthCellRenderer';
import {SectionCellRenderer} from '@/components/ui/SectionCellRenderer';
import {SectionHeaderRenderer} from '@/components/ui/SectionHeaderRenderer';
import dayjs from 'dayjs';
import {GenerateUUID} from '@/libs/helpers/id-generator';

enum ScreenMode {
  MonthPicker = 'MonthPicker',
  SectionEditor = 'SectionEditor',
}

export const NobetContext = createContext<INobetContext>(DefaultNobetContext);

export function NobetScheduler() {
  const [isPending, startTransition] = useTransition();
  const [monthConfig, setMonthConfig] = useState<MonthConfig>(DefaultMonthConfig);
  const [screenMode, setScreenMode] = useState<ScreenMode>(ScreenMode.MonthPicker);
  const [assistantList, setAssistantList] = useState<IAssistant[]>(DefaultAssistantList);
  const [sectionList, setSectionList] = useState<ISection[]>(DefaultSectionList);
  const [sectionRenderer, setSectionRenderer] = useState<boolean>(false);
  const [selectedDayConfig, setSelectedDayConfig] = useState<SelectedDayConfig>({});

  const contextValue = useMemo(
    () => ({
      monthConfig,
      assistantList,
      setAssistantList,
      sectionList,
      setSectionList,
      selectedDayConfig,
      setSelectedDayConfig,
    }),
    [monthConfig, assistantList, sectionList, selectedDayConfig],
  );

  useEffect(() => {
    onDateChange(new Date());
  }, []);

  const changeScreenMode = useCallback((screenMode: ScreenMode) => {
    startTransition(() => setScreenMode(screenMode));
  }, []);

  const addAssistant = useCallback(() => {
    setAssistantList(prevState => [...prevState, newAssistant()]);
  }, []);

  const removeAssistant = useCallback((assistantId: IAssistant['id']) => {
    setAssistantList(prevState => prevState.filter(assistant => assistant.id !== assistantId));
    const assistantSelectedDays = assistantList.find(assistant => assistant.id !== assistantId)
      ?.selectedDays.days;
    const updatedSelectedDayConfig = {...selectedDayConfig};
    if (assistantSelectedDays) {
      Object.entries(assistantSelectedDays).forEach(([dayIndex, section]) => {
        updatedSelectedDayConfig[Number(dayIndex)].sectionIds.delete(section.id);
        updatedSelectedDayConfig[Number(dayIndex)].version = GenerateUUID();
      });
      setSelectedDayConfig(updatedSelectedDayConfig);
    }
  }, []);

  const setAssistantProps = useCallback(
    (assistantId: IAssistant['id'], props: Partial<IAssistant>) => {
      setAssistantList(prevState =>
        prevState.map(assistant =>
          assistant.id === assistantId ? {...assistant, ...props} : assistant,
        ),
      );
    },
    [],
  );

  const addSection = useCallback(() => {
    setSectionList(prevState => [...prevState, newSection()]);
    setAssistantList(prevState =>
      prevState.map(assistant => ({
        ...assistant,
        sectionConfig: {
          ...assistant.sectionConfig,
          version: GenerateUUID(),
        },
      })),
    );
    setSectionRenderer(prev => !prev);
  }, []);

  const removeSection = useCallback((sectionId: ISection['id']) => {
    setSectionList(prevState => prevState.filter(i => i.id !== sectionId));
    setSectionRenderer(prev => !prev);
  }, []);

  const setSectionProps = useCallback((sectionId: ISection['id'], props: Partial<ISection>) => {
    setSectionList(prevState =>
      prevState.map(section => (section.id === sectionId ? {...section, ...props} : section)),
    );
  }, []);

  const onDateChange = useCallback((date: Date | null) => {
    if (date == null) return;
    setMonthConfig({
      datesInMonth: dayjs(date).daysInMonth(),
      weekendIndexes: getWeekendDayIndexes(date),
      numberOfRestDays: monthConfig.numberOfRestDays,
    });
  }, []);

  const setNumberOfRestDays = useCallback((numberOfRestDays: string | number) => {
    setMonthConfig({
      ...monthConfig,
      numberOfRestDays: Number(numberOfRestDays),
    });
  }, []);

  const columns = useMemo<MRT_ColumnDef<IAssistant>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Assistant',
        Cell: ({row}) => (
          <AssistantNameRenderer
            row={row}
            setAssistantProps={setAssistantProps}
            removeAssistant={removeAssistant}
          />
        ),
      },
      ...(screenMode === ScreenMode.MonthPicker
        ? Array.from({length: monthConfig.datesInMonth}).map(
            (_, index) =>
              ({
                size: 30,
                header: String(index + 1),
                mantineTableHeadCellProps: {
                  className: `${monthConfig.weekendIndexes.includes(index + 1) ? 'bg-onyx' : undefined}`,
                },
                mantineTableBodyCellProps: {
                  className: `${monthConfig.weekendIndexes.includes(index + 1) ? 'bg-onyx' : undefined}`,
                },
                Cell: ({row}) => (
                  <MonthCellRenderer dayIndex={index + 1} assistant={row.original} />
                ),
              }) as MRT_ColumnDef<IAssistant>,
          )
        : sectionList.map(section => ({
            id: section.id,
            header: 'Section',
            Header: () => (
              <SectionHeaderRenderer
                section={section}
                setSectionProps={setSectionProps}
                removeSection={removeSection}
              />
            ),
            Cell: ({row}: {row: MRT_Row<IAssistant>}) => (
              <SectionCellRenderer
                assistant={row.original}
                section={section}
                setAssistantProps={setAssistantProps}
              />
            ),
          }))),
    ],
    [monthConfig.datesInMonth, screenMode, sectionRenderer],
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
      columnPinning: {left: ['name']},
      density: 'xs',
    },
    mantineTableProps: {
      striped: 'even',
      withColumnBorders: true,
    },
    state: {isLoading: isPending},
    getRowId: row => row.id,
  });

  return (
    <NobetContext.Provider value={contextValue}>
      <div className="h-full w-full">
        <div className="flex flex-row gap-x-4">
          <MonthPickerInput
            minDate={dayjs().toDate()}
            maxLevel="year"
            allowDeselect={false}
            onChange={onDateChange}
            defaultValue={new Date()}
            label="Pick Month"
            leftSection={<CalendarIcon />}
            leftSectionPointerEvents="none"
            className="w-[10rem]"
          />
          <NumberInput
            className="w-fit"
            label="Number of Rest days"
            value={monthConfig.numberOfRestDays}
            onChange={setNumberOfRestDays}
            allowNegative={false}
            max={monthConfig.datesInMonth}
          />
          <div className="ml-auto mt-auto">
            <SegmentedControl
              value={screenMode}
              onChange={e => changeScreenMode(e as ScreenMode)}
              color="yellow"
              data={[
                {label: 'Month Picker', value: ScreenMode.MonthPicker},
                {label: 'Section Editor', value: ScreenMode.SectionEditor},
              ]}
            />
          </div>
        </div>
        <div className="mt-2">
          <MantineReactTable<IAssistant> table={table} />
        </div>
        <div className="mt-4 flex flex-row gap-x-4">
          <AddButton label="Add Assistant" onClick={addAssistant} />
          {screenMode === ScreenMode.SectionEditor && (
            <AddButton label="Add New Section" onClick={addSection} />
          )}
          {screenMode === ScreenMode.MonthPicker && (
            <Button
              leftSection={<TrashSolidIcon className="size-4" />}
              className="bg-attention hover:bg-attention-hover">
              Clear Selections
            </Button>
          )}
        </div>
      </div>
    </NobetContext.Provider>
  );
}
