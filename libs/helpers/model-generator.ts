import { getRandomColor } from '@/libs/helpers/color-generator';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { IAssistant } from '@/libs/models/IAssistant';
import { ISection } from '@/libs/models/ISection';
import { SelectedDayConfig } from '@/libs/models/NobetContext';

export const newAssistant = (name?: string): IAssistant => {
  return {
    id: GenerateUUID(),
    name: name ?? 'New Assistant',
    selectedDays: {
      days: []
    },
    disabledDays: {
      days: []
    },
    sectionConfig: {
      counts: {},
      version: GenerateUUID()
    }
  };
};

export const newSection = (sectionName?: string): ISection => {
  return {
    id: GenerateUUID(),
    name: sectionName ?? 'New Section',
    color: getRandomColor()
  };
};

export const newSelectedDayConfig = (
  sectionId: string
): SelectedDayConfig[number] => {
  return {
    sectionIds: new Set<string>([sectionId]),
    version: GenerateUUID()
  };
};
