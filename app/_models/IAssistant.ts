import { ISection } from '@/models/ISection';

export interface IAssistant {
  id: string;
  name: string;
  selectedDays: ISection[];
  disabledDays: Set<number>;
  selectedVersion?: string;
  disabledVersion?: string;
  sectionConfig: ISection[];
}