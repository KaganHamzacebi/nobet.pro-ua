import { MonthConfig } from '@/models/MonthConfig';
import { ISection } from '@/models/ISection';
import { IAssistant } from '@/models/IAssistant';
import { DutyModel } from '@/models/DutyModel';
import { DefaultAssistantList, DefaultMonthConfig, DefaultSectionList } from '@/libs/mock/nobet.data';

export interface INobetContext {
  monthConfig: MonthConfig;
  sectionList: ISection[];
  setSectionList: (sectionList: ISection[]) => void;
  assistantList: IAssistant[];
  setAssistantList: (assistantList: IAssistant[]) => void;
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