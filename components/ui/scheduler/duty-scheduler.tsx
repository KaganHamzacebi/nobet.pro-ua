'use client';

import { AssistantNameRenderer } from '@/components/ui/table-renderers/assistant-name-renderer';
import { MonthCellRenderer } from '@/components/ui/table-renderers/month-cell-renderer';
import { SectionCellRenderer } from '@/components/ui/table-renderers/section-cell-renderer';
import { SectionHeaderRenderer } from '@/components/ui/table-renderers/section-header-renderer';
import { ScreenMode } from '@/libs/enums/screen-mode';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { newAssistant, newSection } from '@/libs/helpers/model-generator';
import {
  DefaultAssistantList,
  DefaultMonthConfig,
  DefaultSectionList
} from '@/libs/mock/nobet.data';
import { IAssistant } from '@/libs/models/IAssistant';
import { ISection } from '@/libs/models/ISection';
import { MonthConfig } from '@/libs/models/MonthConfig';
import {
  DefaultNobetContext,
  INobetContext,
  SelectedDayConfig
} from '@/libs/models/NobetContext';
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
import { SchedulerBottomBar } from './scheduler-bottom-bar';
import { SchedulerTopBar } from './scheduler-top-bar';

export const NobetContext = createContext<INobetContext>(DefaultNobetContext);

export function DutyScheduler() {
  const [isPending, startTransition] = useTransition();
  const [rerenderColumns, setRerenderColumns] = useState(false);
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
  const [unwantedDays, setUnwantedDays] = useState<Record<string, boolean>>({});

  const contextValue = useMemo(
    () => ({
      screenMode,
      monthConfig,
      assistantList,
      setAssistantList,
      sectionList,
      setSectionList,
      selectedDayConfig,
      setSelectedDayConfig
    }),
    [screenMode, monthConfig, assistantList, sectionList, selectedDayConfig]
  );

  const handleScreenModeChange = useCallback((mode: ScreenMode) => {
    startTransition(() => {
      setScreenMode(mode);
      setRerenderColumns(prev => !prev);
    });
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
    setRerenderColumns(prev => !prev);
  }, [sectionList.length]);

  const removeSection = useCallback((sectionId: ISection['id']) => {
    setSectionList(prevState => prevState.filter(i => i.id !== sectionId));
    setRerenderColumns(prev => !prev);
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
    setRerenderColumns(prev => !prev);
  };

  const onDateChange = useCallback(
    (date: Date | null) => {
      if (date == null) return;
      setMonthConfig({
        datesInMonth: dayjs(date).daysInMonth(),
        weekendIndexes: getWeekendDayIndexes(date),
        numberOfRestDays: monthConfig.numberOfRestDays
      });
      setRerenderColumns(prev => !prev);
    },
    [monthConfig]
  );

  const isRestDayDisabled = useMemo(() => {
    return assistantList.some(a => Object.keys(a.selectedDays.days).length > 0);
  }, [assistantList]);

  const setNumberOfRestDays = useCallback(
    (numberOfRestDays: string | number) => {
      setMonthConfig({
        ...monthConfig,
        numberOfRestDays: Number(numberOfRestDays)
      });
    },
    [monthConfig]
  );

  const toggleUnwantedDay = (assistantId: string, index: number) => {
    if (screenMode !== ScreenMode.UnwantedDayPicker) return;
    setUnwantedDays(prev => {
      const id = assistantId + '-' + index;
      const updatedMap = { ...prev };
      if (updatedMap[id] != undefined) delete updatedMap[id];
      else updatedMap[id] = true;

      return updatedMap;
    });
    setRerenderColumns(prev => !prev);
  };

  const mantineTableBodyCellClasses = (index: number, asssitantId: string) => {
    const classes: string[] = [];

    const isWeekend = monthConfig.weekendIndexes.includes(index + 1);
    const isUnwanted = unwantedDays[`${asssitantId}-${index}`];
    const isUnwantedMode = screenMode === ScreenMode.UnwantedDayPicker;

    if (isWeekend && isUnwanted) classes.push('bg-attention-700');
    else if (isWeekend) classes.push('bg-onyx');
    else if (isUnwanted) classes.push('bg-attention');
    if (isUnwantedMode) classes.push('cursor-pointer');

    return classes.join(' ');
  };

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
      ...(screenMode === ScreenMode.MonthPicker ||
      screenMode === ScreenMode.UnwantedDayPicker
        ? Array.from({ length: monthConfig.datesInMonth }).map(
            (_, index) =>
              ({
                id: String(index + 1),
                header: 'Month',
                size: 30,
                mantineTableHeadCellProps: _ => ({
                  className: `${monthConfig.weekendIndexes.includes(index + 1) ? 'bg-onyx' : undefined}`,
                  children: (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span>{String(index + 1)}</span>
                    </div>
                  )
                }),
                mantineTableBodyCellProps: ({ row }) => ({
                  className: mantineTableBodyCellClasses(
                    index,
                    row.original.id
                  ),
                  onClick: () => toggleUnwantedDay(row.original.id, index)
                }),
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
    [rerenderColumns]
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
      density: 'xs'
    },
    mantineTableProps: {
      withColumnBorders: true,
      highlightOnHover: false
    },
    state: { isLoading: isPending },
    getRowId: row => row.id
  });

  return (
    <NobetContext.Provider value={contextValue}>
      <div className="h-full w-full">
        <SchedulerTopBar
          onDateChange={onDateChange}
          setNumberOfRestDays={setNumberOfRestDays}
          isRestDayDisabled={isRestDayDisabled}
          handleScreenModeChange={handleScreenModeChange}
        />
        <div className="mt-2">
          <MantineReactTable<IAssistant> table={table} />
        </div>
        <SchedulerBottomBar
          addAssistant={addAssistant}
          addSection={addSection}
          handleClearSelections={handleClearSelections}
        />
      </div>
    </NobetContext.Provider>
  );
}
