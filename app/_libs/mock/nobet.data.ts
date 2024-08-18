import { GenerateUUID } from '@/libs/helpers/id-generator';
import { MonthConfig } from '@/models/MonthConfig';
import moment from 'moment/moment';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { AssistantModel } from '@/models/AssistantModel';
import { SectionModel } from '@/models/SectionModel';
import { DutyModel } from '@/models/DutyModel';

const DefaultSection: SectionModel = {
  id: GenerateUUID(),
  name: 'War Room',
  color: '#53a83e'
};

const DefaultAssistant: AssistantModel = {
  id: GenerateUUID(),
  name: 'Kel Mahmut',
  selectedDays: new Set<number>()
};

const DefaultDuty: DutyModel = {
  assistant: DefaultAssistant,
  area: DefaultSection,
  dayCount: 0
};

const DefaultSectionList: SectionModel[] = [DefaultSection];
const DefaultAssistantList: AssistantModel[] = [DefaultAssistant];
const DefaultDutyList: DutyModel[] = [DefaultDuty];

const DefaultMonthConfig: MonthConfig = {
  datesInMonth: moment(new Date()).daysInMonth(),
  weekendIndexes: getWeekendDayIndexes(new Date()),
  numberOfRestDays: 2
};

export { DefaultMonthConfig, DefaultSectionList, DefaultAssistantList, DefaultDutyList };