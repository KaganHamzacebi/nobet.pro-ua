import { GenerateUUID } from '@/libs/helpers/id-generator';
import { IAssistant } from '@/models/IAssistant';
import { ISection } from '@/models/ISection';
import { getRandomColor } from '@/libs/helpers/color-generator';
import { SelectedDayConfig } from '@/models/NobetContext';

export const newAssistant = (name?: string): IAssistant => {
  return {
    id: GenerateUUID(),
    name: name ?? 'New Assistant',
    selectedDays: [],
    disabledDays: [],
    sectionConfig: []
  };
};

export const newSection = (sectionName?: string): ISection => {
  return {
    id: GenerateUUID(),
    name: sectionName ?? 'New Section',
    color: getRandomColor()
  };
};

export const newSelectedDayConfig = (): SelectedDayConfig[number] => {
  return {
    sectionIds: new Set<string>(),
    version: GenerateUUID()
  };
};