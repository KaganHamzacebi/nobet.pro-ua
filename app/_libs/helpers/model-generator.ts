import { GenerateUUID } from '@/libs/helpers/id-generator';
import { IAssistant } from '@/models/IAssistant';

export const newAssistant = (): IAssistant => {
  return {
    id: GenerateUUID(),
    name: 'New Assistant',
    selectedDays: [],
    disabledDays: new Set<number>(),
    sectionConfig: []
  };
};