function formatDate(isoString, onlyTime = false) {
    if (!isoString) return ''
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    if (onlyTime) return `${hours}:${minutes}`;
    return `${day}-${month}-${year}  ${hours}:${minutes}`;
}

function getLastDayOfMonth(year, month) {
    const nextMonth = new Date(year, Number(month), 1);
    nextMonth.setDate(nextMonth.getDate() - 1);
    return nextMonth.getDate();
  }
export default { formatDate , getLastDayOfMonth}