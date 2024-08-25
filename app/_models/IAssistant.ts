import {ISection} from '@/models/ISection';

export interface IAssistant {
  id: string;
  name: string;
  selectedDays: {
    // dayIndex - section
    days: Record<number, ISection>;
    version?: string;
  };
  disabledDays: {
    days: number[];
    version?: string;
  };
  sectionConfig: {
    // sectionId - count
    counts: Record<string, number>;
    version?: string;
  };
}
