import moment from 'moment';

export const getWeekendDayIndexes = (date: Date) => {
  const weekends = [];
  const [year, month] = [date.getFullYear(), date.getMonth() + 1];
  const startOfMonth = moment([year, month - 1]);
  const endOfMonth = startOfMonth.clone().endOf('month');

  const day = startOfMonth;

  while (day <= endOfMonth) {
    if (day.day() === 6 || day.day() === 0) { // 6 is Saturday, 0 is Sunday
      weekends.push(day.date());
    }
    day.add(1, 'day');
  }

  return weekends;
};