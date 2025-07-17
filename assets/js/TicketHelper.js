import fuzzysearch from 'fuzzysearch'

export const filterTicketListByTextSearch = (items, search) => {
  const searchQuery = search.trim().toLowerCase()
  return items.filter(s => {
    const nameMatched = fuzzysearch(searchQuery, s.title.toLowerCase())
    const idMatched = fuzzysearch(searchQuery, s.id.toString())

    return nameMatched || idMatched
  })
}

export const getStatusLabel = status => {
  const statusLabel = {
    open: 'Open',
    wfi: 'Waiting-for-Info',
    resolved: 'Resolved',
    closed: 'Closed',
    reopen: 'Reopen',
    investigating: 'Investigating',
    others: 'Others',
  }
  return statusLabel[status] || 'N/A'
}
export const getStatusTheme = status => {
  const statusTheme = {
    open: 'border-red-500 bg-red-200 bg-opacity-25  text-red-400',
    wfi: ' border-orange-500 bg-orange-200 bg-opacity-25  text-orange-400',
    resolved: ' border-indigo-500 bg-indigo-200 bg-opacity-25 text-indigo-400',
    closed: ' border-green-500 bg-green-200 bg-opacity-25 text-green-400',
    reopen: ' border-rose-500 bg-rose-200 bg-opacity-25 text-rose-400',
    investigating: ' border-blue-500 bg-blue-200 bg-opacity-25 text-blue-400',
  }
  return statusTheme[status] || 'border-grey-500 bg-grey-200 bg-opacity-25 text-grey-400'
}
