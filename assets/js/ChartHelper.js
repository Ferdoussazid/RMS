const { format, isBefore, add, sub, isSameMonth, startOfMonth } = require('date-fns')

const getFormatString = zoom => (zoom === 'hour' ? `h:mm aa` : 'd MMM')

export const getXAxisDateLabels = (series, zoom) => {
  const formatString = zoom === 'hour' ? `h:mm aa` : 'd MMM'
  return series.map(item => format(new Date(item.datetime), formatString))
}

export const getXAxisDateLabel = (timestamp, zoom = 'day') => {
  const date = new Date(timestamp)
  return format(date, getFormatString(zoom))
}

export const getMonthlyYAxisValues = (records, fromDate, untilDate) => {
  try {
    let dateStart = new Date(fromDate)
    const dateUntil = new Date(untilDate)

    const res = []
    while (isBefore(dateStart, dateUntil)) {
      const totalValue = records
        .filter(v => isSameMonth(new Date(v.timestamp), dateStart))
        .reduce((sum, record) => sum + record.seconds, 0)
      res.push(totalValue)
      dateStart = add(dateStart, { months: 1 })
    }

    return res
  } catch (error) {
    return []
  }
}

export const getDefaultMonthRangeFilter = () => {
  let untilDate = startOfMonth(new Date())
  untilDate = add(untilDate, { months: 1 })

  const fromDate = sub(untilDate, { months: 5 })

  return { fromDate, untilDate, zoom: 'month' }
}

export const getDefaultDayRangeFilter = (date = null) => {
  const fromDate = date === null ? startOfMonth(new Date()) : startOfMonth(date)
  fromDate.setHours(0, 0, 0, 0)

  return { fromDate, untilDate: add(fromDate, { months: 1 }), zoom: 'day' }
}

export const oneMonthRange = (date = null) => {
  const fromDate = date === null ? startOfMonth(new Date()) : startOfMonth(date)
  fromDate.setHours(0, 0, 0, 0)

  return {
    from_time: fromDate,
    until_time: add(fromDate, { months: 1 }),
    resolution: 1440, // 1 day
  }
}
