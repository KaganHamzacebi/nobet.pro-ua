import { IAssistant } from '@/models/IAssistant';
import { ISection } from '@/models/ISection';

export interface DutyModel {
  assistant: IAssistant;
  area: ISection;
  dayCount: number;
}