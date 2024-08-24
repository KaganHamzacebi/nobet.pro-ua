import { GenerateUUID } from '@/libs/helpers/id-generator';
import { MonthConfig } from '@/models/MonthConfig';
import moment from 'moment/moment';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { IAssistant } from '@/models/IAssistant';
import { ISection } from '@/models/ISection';
import { DutyModel } from '@/models/DutyModel';

const DefaultSection: ISection = {
  id: GenerateUUID(),
  name: 'War Room',
  color: '#53a83e'
};

const DefaultAssistant: IAssistant = {
  id: GenerateUUID(),
  name: 'Kel Mahmut',
  selectedDays: [],
  disabledDays: new Set<number>(),
  sectionConfig: []
};

const DefaultDuty: DutyModel = {
  assistant: DefaultAssistant,
  area: DefaultSection,
  dayCount: 0
};

const DefaultSectionList: ISection[] = [DefaultSection];
const DefaultAssistantList: IAssistant[] = [DefaultAssistant];
const DefaultDutyList: DutyModel[] = [DefaultDuty];

const DefaultMonthConfig: MonthConfig = {
  datesInMonth: moment(new Date()).daysInMonth(),
  weekendIndexes: getWeekendDayIndexes(new Date()),
  numberOfRestDays: 2
};

export { DefaultMonthConfig, DefaultSectionList, DefaultAssistantList, DefaultDutyList };