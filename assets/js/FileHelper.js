import * as xlsx from 'xlsx'

export const getFileSizeAsText = file => {
  if (!file) return '0 MB'
  let size = file.size * 1.0
  if (size < 1024) {
    return parseInt(size) + ' B'
  }
  size /= 1024
  if (size < 1024) {
    return size.toFixed(1) + ' KB'
  }
  size /= 1024
  return size.toFixed(2) + ' MB'
}

export const fetchRowsFromFile = file => {
  return new Promise((resolve, reject) => {
    const xlsxTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!xlsxTypes.includes(file.type)) {
      return null
    }

    const reader = new FileReader()
    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const workbook = xlsx.read(data, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = xlsx.utils.sheet_to_json(firstSheet, { header: 1 })

      const processedRows = rows.slice(1).map(row => {
        return row.map((cell, index) => {
          if (index === 2 || index === 3) {
            return typeof cell === 'number'
              ? new Date(
                  xlsx.SSF.parse_date_code(cell).y,
                  xlsx.SSF.parse_date_code(cell).m - 1,
                  xlsx.SSF.parse_date_code(cell).d,
                  xlsx.SSF.parse_date_code(cell).H,
                  xlsx.SSF.parse_date_code(cell).M,
                  xlsx.SSF.parse_date_code(cell).S
                )
              : cell
          }
          return cell
        })
      })

      resolve(processedRows)
    }
    reader.onerror = error => {
      reject(error)
    }
    reader.readAsArrayBuffer(file)
  })
}
