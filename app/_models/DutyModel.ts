import { AssistantModel } from '@/models/AssistantModel';
import { SectionModel } from '@/models/SectionModel';

export interface DutyModel {
  assistant: AssistantModel;
  area: SectionModel;
  dayCount: number;
}