import { MonthConfig } from '@/models/MonthConfig';
import { SectionModel } from '@/models/SectionModel';
import { AssistantModel } from '@/models/AssistantModel';
import { DutyModel } from '@/models/DutyModel';
import { DefaultAssistantList, DefaultMonthConfig, DefaultSectionList } from '@/libs/mock/nobet.data';

export interface INobetContext {
  monthConfig: MonthConfig;
  sectionList: SectionModel[];
  setSectionList: (sectionList: SectionModel[]) => void;
  assistantList: AssistantModel[];
  setAssistantList: (assistantList: AssistantModel[]) => void;
  dutyList: DutyModel[];
  setDutyList: (dutyList: DutyModel[]) => void;
}

export const DefaultNobetContext: INobetContext = {
  monthConfig: DefaultMonthConfig,
  sectionList: DefaultSectionList,
  setSectionList: () => {},
  assistantList: DefaultAssistantList,
  setAssistantList: () => {},
  dutyList: [],
  setDutyList: () => {}
};