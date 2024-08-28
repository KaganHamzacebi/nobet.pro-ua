'use client';

import CalendarIcon from '@/components/icons/Calendar';
import {TrashSolidIcon } from '@/components/icons/TrashSolid';
import {AddButton } from '@/components/ui/AddButton';
import { AssistantNameRenderer } from '@/components/ui/AssistantNameRenderer';
import { MonthCellRenderer } from '@/components/ui/MonthCellRenderer';
import { SectionCellRenderer } from '@/components/ui/SectionCellRenderer';
import { SectionHeaderRenderer } from '@/components/ui/SectionHeaderRenderer';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { newAssistant, newSection } from '@/libs/helpers/model-generator';
import {
  DefaultAssistantList,
  DefaultMonthConfig,
  DefaultSectionList
} from '@/libs/mock/nobet.data';
import { IAssistant } from '@/models/IAssistant';
import { ISection } from '@/models/ISection';
import { MonthConfig } from '@/models/MonthConfig';
import {
  DefaultNobetContext,
  INobetContext,
  SelectedDayConfig
} from '@/models/NobetContext';
import { Button, NumberInput, SegmentedControl } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  useMantineReactTable
} from 'mantine-react-table';
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  useTransition
} from 'react';

enum ScreenMode {
  MonthPicker = 'MonthPicker',
  SectionEditor = 'SectionEditor'
}

export const NobetContext = createContext<INobetContext>(DefaultNobetContext);

export function NobetScheduler() {
  const [isPending, startTransition] = useTransition();
  const [clearSelectionsTrigger, setClearSelectionsTrigger] =
    useState<boolean>(false);
  const [monthConfig, setMonthConfig] =
    useState<MonthConfig>(DefaultMonthConfig);
  const [screenMode, setScreenMode] = useState<ScreenMode>(
    ScreenMode.MonthPicker
  );
  const [assistantList, setAssistantList] =
    useState<IAssistant[]>(DefaultAssistantList);
  const [sectionList, setSectionList] =
    useState<ISection[]>(DefaultSectionList);
  const [selectedDayConfig, setSelectedDayConfig] = useState<SelectedDayConfig>(
    {}
  );

  const contextValue = useMemo(
    () => ({
      monthConfig,
      assistantList,
      setAssistantList,
      sectionList,
      setSectionList,
      selectedDayConfig,
      setSelectedDayConfig
    }),
    [monthConfig, assistantList, sectionList, selectedDayConfig]
  );

  const changeScreenMode = useCallback((screenMode: ScreenMode) => {
    startTransition(() => setScreenMode(screenMode));
  }, []);

  const addAssistant = useCallback(() => {
    setAssistantList(prevState => [
      ...prevState,
      newAssistant(`New Assistant - ${assistantList.length}`)
    ]);
  }, [assistantList.length]);

  const removeAssistant = useCallback(
    (assistantId: IAssistant['id']) => {
      setAssistantList(prevState =>
        prevState.filter(assistant => assistant.id !== assistantId)
      );
      const assistantSelectedDays = assistantList.find(
        assistant => assistant.id !== assistantId
      )?.selectedDays.days;
      const updatedSelectedDayConfig = { ...selectedDayConfig };
      if (assistantSelectedDays) {
        Object.entries(assistantSelectedDays).forEach(([dayIndex, section]) => {
          updatedSelectedDayConfig[Number(dayIndex)].sectionIds.delete(
            section.id
          );
          updatedSelectedDayConfig[Number(dayIndex)].version = GenerateUUID();
        });
        setSelectedDayConfig(updatedSelectedDayConfig);
      }
    },
    [assistantList, selectedDayConfig]
  );

  const setAssistantProps = useCallback(
    (assistantId: IAssistant['id'], props: Partial<IAssistant>) => {
      setAssistantList(prevState =>
        prevState.map(assistant =>
          assistant.id === assistantId ? { ...assistant, ...props } : assistant
        )
      );
    },
    []
  );

  const addSection = useCallback(() => {
    setSectionList(prevState => [
      ...prevState,
      newSection(`New Section - ${sectionList.length}`)
    ]);
    setAssistantList(prevState =>
      prevState.map(assistant => ({
        ...assistant,
        sectionConfig: {
          ...assistant.sectionConfig,
          version: GenerateUUID()
        }
      }))
    );
  }, [sectionList.length]);

  const removeSection = useCallback((sectionId: ISection['id']) => {
    setSectionList(prevState => prevState.filter(i => i.id !== sectionId));
  }, []);

  const setSectionProps = useCallback(
    (sectionId: ISection['id'], props: Partial<ISection>) => {
      setSectionList(prevState =>
        prevState.map(section =>
          section.id === sectionId ? { ...section, ...props } : section
        )
      );
    },
    []
  );

  const handleClearSelections = () => {
    setAssistantList(prevState =>
      prevState.map(assistant => ({
        ...assistant,
        selectedDays: {
          days: []
        },
        disabledDays: {
          days: []
        }
      }))
    );
    setSelectedDayConfig({});
    setClearSelectionsTrigger(prev => !prev);
  };

  const onDateChange = useCallback(
    (date: Date | null) => {
      if (date == null) return;
      setMonthConfig({
        datesInMonth: dayjs(date).daysInMonth(),
        weekendIndexes: getWeekendDayIndexes(date),
        numberOfRestDays: monthConfig.numberOfRestDays
      });
    },
    [monthConfig]
  );

  const setNumberOfRestDays = useCallback(
    (numberOfRestDays: string | number) => {
      setMonthConfig({
        ...monthConfig,
        numberOfRestDays: Number(numberOfRestDays)
      });
    },
    [monthConfig]
  );

  const columns = useMemo<MRT_ColumnDef<IAssistant>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Assistant',
        Cell: ({ row }) => (
          <AssistantNameRenderer
            row={row}
            setAssistantProps={setAssistantProps}
            removeAssistant={removeAssistant}
          />
        )
      },
      ...(screenMode === ScreenMode.MonthPicker
        ? Array.from({ length: monthConfig.datesInMonth }).map(
            (_, index) =>
              ({
                id: GenerateUUID(),
                size: 30,
                mantineTableHeadCellProps: _ => ({
                  className: `${monthConfig.weekendIndexes.includes(index + 1) ? 'bg-onyx' : undefined}`,
                  children: (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span>{String(index + 1)}</span>
                    </div>
                  )
                }),
                mantineTableBodyCellProps: {
                  className: `${monthConfig.weekendIndexes.includes(index + 1) ? 'bg-onyx' : undefined}`
                },
                Cell: ({ row }) => (
                  <MonthCellRenderer
                    dayIndex={index + 1}
                    assistant={row.original}
                    clearSelectionsTrigger={clearSelectionsTrigger}
                  />
                )
              }) as MRT_ColumnDef<IAssistant>
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
            Cell: ({ row }: { row: MRT_Row<IAssistant> }) => (
              <SectionCellRenderer
                assistant={row.original}
                section={section}
                setAssistantProps={setAssistantProps}
              />
            )
          })))
    ],
    [
      monthConfig.datesInMonth,
      monthConfig.weekendIndexes,
      removeAssistant,
      removeSection,
      screenMode,
      sectionList,
      setAssistantProps,
      setSectionProps
    ]
  );

  const table = useMantineReactTable({
    columns,
    data: assistantList,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnPinning: true,
    initialState: {
      columnPinning: { left: ['name'] },
      density: 'xs'
    },
    mantineTableProps: {
      withColumnBorders: true
    },
    state: { isLoading: isPending },
    getRowId: row => row.id
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
                { label: 'Month Picker', value: ScreenMode.MonthPicker },
                { label: 'Section Editor', value: ScreenMode.SectionEditor }
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
              onClick={handleClearSelections}
              className="bg-attention hover:bg-attention-hover">
              Clear Selections
            </Button>
          )}
        </div>
      </div>
    </NobetContext.Provider>
  );
}
