import { GenerateUUID } from '@/libs/helpers/id-generator';
import { MonthConfig } from '@/models/MonthConfig';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { IAssistant } from '@/models/IAssistant';
import { ISection } from '@/models/ISection';
import { newAssistant } from '@/libs/helpers/model-generator';
import dayjs from 'dayjs';

const DefaultSection: ISection = {
  id: GenerateUUID(),
  name: 'War Room',
  color: '#53a83e'
};

const DefaultAssistant: IAssistant = newAssistant('Kel Mahmut');

const DefaultSectionList: ISection[] = [DefaultSection];
const DefaultAssistantList: IAssistant[] = [DefaultAssistant];

const DefaultMonthConfig: MonthConfig = {
  datesInMonth: dayjs(new Date()).daysInMonth(),
  weekendIndexes: getWeekendDayIndexes(new Date()),
  numberOfRestDays: 2
};

export { DefaultMonthConfig, DefaultSectionList, DefaultAssistantList };