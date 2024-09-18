import CalendarIcon from '@/components/icons/Calendar';
import { ExportModal } from '@/components/ui/export-modal';
import { NobetContext } from '@/components/ui/scheduler/duty-scheduler';
import { ScreenMode } from '@/libs/enums/screen-mode';
import { NumberInput, SegmentedControl } from '@mantine/core';
import { DateValue, MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { FC, useContext } from 'react';

interface ISchedulerTopBar {
  onDateChange: (newDate: DateValue) => void;
  setNumberOfRestDays: (restDays: string | number) => void;
  isRestDayDisabled: boolean;
  handleScreenModeChange: (screenMode: ScreenMode) => void;
}

export const SchedulerTopBar: FC<ISchedulerTopBar> = ({
  onDateChange,
  setNumberOfRestDays,
  isRestDayDisabled,
  handleScreenModeChange
}) => {
  const { monthConfig, assistantList, sectionList } = useContext(NobetContext);

  return (
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
        min={0}
        disabled={isRestDayDisabled}
        clampBehavior="strict"
        allowNegative={false}
        allowDecimal={false}
      />
      <div className="ml-auto mt-auto flex flex-row gap-x-4">
        <ExportModal assistantList={assistantList} sectionList={sectionList} />
        <SegmentedControl
          onChange={e => handleScreenModeChange(e as ScreenMode)}
          color="yellow"
          data={[
            { label: 'Month Picker', value: ScreenMode.MonthPicker },
            {
              label: 'Unwanted Day Picker',
              value: ScreenMode.UnwantedDayPicker
            },
            { label: 'Section Editor', value: ScreenMode.SectionEditor }
          ]}
        />
      </div>
    </div>
  );
};
