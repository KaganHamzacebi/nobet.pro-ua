import { ScreenMode } from '@/libs/enums/screen-mode';
import { Button } from '@mantine/core';
import { useContext } from 'react';
import { TrashSolidIcon } from '../../icons/TrashSolid';
import AddButton from '../add-button';
import { NobetContext } from './duty-scheduler';

interface ISchedulerBottomBar {
  addAssistant: () => void;
  addSection: () => void;
  handleClearSelections: () => void;
}

export default function SchedulerBottomBar({
  addAssistant,
  addSection,
  handleClearSelections
}: Readonly<ISchedulerBottomBar>) {
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
}
