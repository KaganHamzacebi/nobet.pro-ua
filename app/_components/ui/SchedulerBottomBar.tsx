import { ScreenMode } from '@/app/_models/ScreenMode';
import { Button } from '@mantine/core';
import { FC, useContext } from 'react';
import { TrashSolidIcon } from '../icons/TrashSolid';
import { AddButton } from './AddButton';
import { NobetContext } from './NobetScheduler';

interface ISchedulerBottomBar {
  addAssistant: () => void;
  addSection: () => void;
  handleClearSelections: () => void;
}

export const SchedulerBottomBar: FC<ISchedulerBottomBar> = ({
  addAssistant,
  addSection,
  handleClearSelections
}) => {
  const { screenMode } = useContext(NobetContext);

  return (
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
  );
};
