/**
* Gets the current date and returns it as an array in the format [year, month, day].
* 
* This function creates a Date object to retrieve the current date information, including year, month, and day.
* It corrects the month value because the getMonth() method returns a zero-based month (i.e., 0 for January through 11 for December).
* The function demonstrates how to format the date as a string in "YYYY-MM-DD" format, although it ultimately returns the date as an array.
* 
* @returns {Array<number>} Returns an array containing the current year, month, and day in that order.
*/
export const getCurrentDate = () => {
  const date = new Date();
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1; // getMonth() returns 0-11, so we add 1 for the correct month number  
  const day: number = date.getDate();
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const seconds: number = date.getSeconds();
  // You can format the date as you wish. Below is an example of formatting it to "YYYY-MM-DD":  
  // return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;  

  return [year, month, day, hours, minutes, seconds]
};

// 判断是否为macro fault故障
export function isMacroFaule(time: string, macroTimeLimitiation: number): boolean {
  let timeInSeconds: number = 0;
  const timeArray = time.split(':');
  if (timeArray[0].includes('.')) {
    const dayHours = timeArray[0].split('.');
    timeInSeconds = (parseInt(dayHours[0]) * 24 + parseInt(dayHours[1])) * 3600 + parseInt(timeArray[1]) * 60 + parseFloat(timeArray[2]);

  } else {
    timeInSeconds = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseFloat(timeArray[2]);
  }
  return timeInSeconds > macroTimeLimitiation * 60;




}

// 获取YTD的时间段,从年初到今日
export const ytdFrom = () => {
  const currentDate = getCurrentDate();
  return currentDate[0].toString() + '0101000000000'
};
export const ytdTo = () => {
  const currentDate = getCurrentDate();
  return currentDate[0].toString() + currentDate[1].toString().padStart(2, '0') + currentDate[2].toString().padStart(2, '0') + '000000000';
};
// 获取last month的时间段
export const lastMonthFrom = () => {
  const currentDate = getCurrentDate();
  // getCurrentDate()[1] === 1 ? (getCurrentDate()[0] - 1).toString() + '1201000000000' : getCurrentDate()[0].toString() + (getCurrentDate()[1] - 1).toString() + '01000000000';
  return currentDate[1] === 1 ? (currentDate[0] - 1).toString() + '1201000000000' : currentDate[0].toString() + (currentDate[1] - 1).toString().padStart(2, '0') + '01000000000';
};
export const lastMonthTo = () => {
  const currentDate = getCurrentDate();
  return currentDate[0].toString() + currentDate[1].toString().padStart(2, '0') + '01000000000';
};

//把字符串的时间类型D.HH:MM:SS转成小时
export function faultDurationConvertToHours(time: string): number {
  const timeArray: string[] = time.split(':');
  if (timeArray[0].includes('.')) {
    const dayHours = timeArray[0].split('.');
    return ((parseInt(dayHours[0]) * 24 + parseInt(dayHours[1])) * 3600 + parseInt(timeArray[1]) * 60 + parseFloat(timeArray[2])) / 3600;
  } else {
    return (parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseFloat(timeArray[2])) / 3600;
  }
}
//把字符串的时间类型D.HH:MM:SS转成分钟
export function faultDurationConvertToMinutes(time: string): number {
  const timeArray: string[] = time.split(':');
  if (timeArray[0].includes('.')) {
    const dayHours = timeArray[0].split('.');
    return ((parseInt(dayHours[0]) * 24 + parseInt(dayHours[1])) * 3600 + parseInt(timeArray[1]) * 60 + parseFloat(timeArray[2])) / 60;
  } else {
    return (parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseFloat(timeArray[2])) / 60;
  }


}
