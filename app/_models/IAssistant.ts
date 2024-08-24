import { ISection } from '@/models/ISection';

export interface IAssistant {
  id: string;
  name: string;
  selectedDays: Record<number, ISection>;
  disabledDays: number[];
  selectedVersion?: string;
  disabledVersion?: string;
  sectionConfig: ISection[];
}