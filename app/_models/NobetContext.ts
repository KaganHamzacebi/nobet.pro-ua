import { MonthConfig } from '@/models/MonthConfig';
import { ISection } from '@/models/ISection';
import { IAssistant } from '@/models/IAssistant';
import { DefaultAssistantList, DefaultMonthConfig, DefaultSectionList } from '@/libs/mock/nobet.data';
import { Dispatch, SetStateAction } from 'react';

export type SelectedDayConfig = Record<number, ISection>;

export interface INobetContext {
  monthConfig: MonthConfig;
  sectionList: ISection[];
  setSectionList: (sectionList: ISection[]) => void;
  assistantList: IAssistant[];
  setAssistantList: Dispatch<SetStateAction<IAssistant[]>>;
  selectedDayConfig: SelectedDayConfig;
  setSelectedDayConfig: (selectedDayConfig: SelectedDayConfig) => void;
}

export const DefaultNobetContext: INobetContext = {
  monthConfig: DefaultMonthConfig,
  sectionList: DefaultSectionList,
  setSectionList: () => {
  },
  assistantList: DefaultAssistantList,
  setAssistantList: () => {
  },
  selectedDayConfig: {},
  setSelectedDayConfig: () => {
  },
};