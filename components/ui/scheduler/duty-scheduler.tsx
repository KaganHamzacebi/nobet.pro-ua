'use client';

import AssistantNameRenderer from '@/components/ui/table-renderers/assistant-name-renderer';
import MonthCellRenderer from '@/components/ui/table-renderers/month-cell-renderer';
import SectionCellRenderer from '@/components/ui/table-renderers/section-cell-renderer';
import SectionHeaderRenderer from '@/components/ui/table-renderers/section-header-renderer';
import { ScreenMode } from '@/libs/enums/screen-mode';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { mantineTableBodyCellClasses as monthCellCssClasses } from '@/libs/helpers/mantine-table-css-getters';
import { useAssistantList } from '@/libs/hooks/use-assistant-list';
import {
  DefaultAssistantList,
  DefaultMonthConfig,
  DefaultSectionList
} from '@/libs/mock/nobet.data';
import { IAssistant } from '@/libs/models/IAssistant';
import { ISection } from '@/libs/models/ISection';
import { MonthConfig } from '@/libs/models/MonthConfig';
import { DefaultNobetContext, INobetContext, SelectedDayConfig } from '@/libs/models/NobetContext';
import dayjs from 'dayjs';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  useMantineReactTable
} from 'mantine-react-table';
import { createContext, useCallback, useMemo, useState, useTransition } from 'react';
import SchedulerBottomBar from './scheduler-bottom-bar';
import SchedulerTopBar from './scheduler-top-bar';

export const NobetContext = createContext<INobetContext>(DefaultNobetContext);

export default function DutyScheduler() {
  const [isPending, startTransition] = useTransition();
  const [rerenderColumns, setRerenderColumns] = useState(false);
  const [monthConfig, setMonthConfig] = useState<MonthConfig>(DefaultMonthConfig);
  const [screenMode, setScreenMode] = useState<ScreenMode>(ScreenMode.MonthPicker);
  const [sectionList, setSectionList] = useState<ISection[]>(DefaultSectionList);
  const [selectedDayConfig, setSelectedDayConfig] = useState<SelectedDayConfig>({});
  const [unwantedDays, setUnwantedDays] = useState<Record<string, boolean>>({});

  const { assistantList, setAssistantList, addNewAssistant, removeAssistant, setAssistantProps } =
    useAssistantList(DefaultAssistantList, setSelectedDayConfig);

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

  const handleClearSelections = () => {
    setAssistantList(prevState =>
      prevState.map(assistant => ({
        ...assistant,
        selectedDays: {
          days: [],
          version: GenerateUUID()
        },
        disabledDays: {
          days: [],
          version: GenerateUUID()
        }
      }))
    );

    setSelectedDayConfig({});
    setRerenderColumns(prev => !prev);
  };

  const onDateChange = useCallback(
    (date: Date | null) => {
      if (!date) throw new Error('An undefined Date is set as month');

      const newDate = dayjs(date);
      const oldDate = dayjs(monthConfig.selectedDate);
      if (newDate.isSame(oldDate, 'month')) return;

      setMonthConfig(prevState => ({
        selectedDate: date,
        datesInMonth: newDate.daysInMonth(),
        weekendIndexes: getWeekendDayIndexes(date),
        numberOfRestDays: prevState.numberOfRestDays
      }));

      setRerenderColumns(prev => !prev);
    },
    [monthConfig.selectedDate]
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

  const toggleUnwantedDay = useCallback(
    (assistantId: string, index: number) => {
      if (screenMode !== ScreenMode.UnwantedDayPicker) return;
      setUnwantedDays(prev => {
        const id = assistantId + '-' + index;
        const updatedMap = { ...prev };
        if (updatedMap[id] != undefined) delete updatedMap[id];
        else updatedMap[id] = true;

        return updatedMap;
      });

      setRerenderColumns(prev => !prev);
    },
    [screenMode]
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
      ...(screenMode === ScreenMode.MonthPicker || screenMode === ScreenMode.UnwantedDayPicker
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
                  className: monthCellCssClasses(
                    index,
                    row.original.id,
                    monthConfig,
                    unwantedDays,
                    screenMode
                  ),
                  onClick: () => toggleUnwantedDay(row.original.id, index)
                }),
                Cell: ({ row }) => (
                  <MonthCellRenderer dayIndex={index + 1} assistant={row.original} />
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
          handleScreenModeChange={handleScreenModeChange}
        />
        <div className="mt-2">
          <MantineReactTable<IAssistant> table={table} />
        </div>
        <SchedulerBottomBar
          addAssistant={addNewAssistant}
          addSection={addSection}
          handleClearSelections={handleClearSelections}
        />
      </div>
    </NobetContext.Provider>
  );
}
