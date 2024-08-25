import {
  DefaultAssistantList,
  DefaultMonthConfig,
  DefaultSectionList,
} from '@/libs/mock/nobet.data';
import { IAssistant } from '@/models/IAssistant';
import { ISection } from '@/models/ISection';
import { MonthConfig } from '@/models/MonthConfig';
import { Dispatch, SetStateAction } from 'react';

// Stores data by DayIndex
export type SelectedDayConfig = Record<
  number,
  {
    sectionIds: Set<string>;
    version: string;
  }
>;

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
  setSectionList: () => {},
  assistantList: DefaultAssistantList,
  setAssistantList: () => {},
  selectedDayConfig: {},
  setSelectedDayConfig: () => {},
};
