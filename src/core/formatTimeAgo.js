const formatTimeAgo = (isoString) => {
  const date = new Date(isoString)
  const now = Date.now()
  const diffSeconds = Math.floor((now - date.getTime()) / 1000)

  // Define time intervals in seconds
  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30.436875 // Average days in a month (365.2425 / 12)
  const year = day * 365.2425 // Average days in a year

  if (diffSeconds < minute) {
    return 'baru saja'
  } else if (diffSeconds < hour) {
    return `${Math.floor(diffSeconds / minute)} menit yang lalu`
  } else if (diffSeconds < day) {
    return `${Math.floor(diffSeconds / hour)} jam yang lalu`
  } else if (diffSeconds < week) {
    return `${Math.floor(diffSeconds / day)} hari yang lalu`
  } else if (diffSeconds < month) {
    // For durations less than a month but more than a week, still show days.
    // You could introduce 'minggu yang lalu' here if preferred, but it's less common
    // for general "time ago" formatting than days, months, or years.
    return `${Math.floor(diffSeconds / day)} hari yang lalu`
  } else if (diffSeconds < year) {
    const diffMonths = Math.floor(diffSeconds / month)
    return `${diffMonths} bulan yang lalu`
  } else {
    const diffYears = Math.floor(diffSeconds / year)
    return `${diffYears} tahun yang lalu`
  }
}

export default formatTimeAgo
