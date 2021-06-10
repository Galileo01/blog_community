import moment from 'moment';
export function formatTime(dateStr: string) {
  const time = moment(dateStr);
  return time.format('YYYY/MM/DD hh:mm:ss');
}