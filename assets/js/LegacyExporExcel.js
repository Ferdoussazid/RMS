import { Workbook } from 'exceljs'
import { LEGACY_PAGES } from './Constant'
import { getTenantLabel } from './Helper'
const downloadFile = require('js-file-download')
export class LegacyExportAction {
  names = new Map()
  operatorIds = new Map()
  address = new Map()
  columns = [
    { header: 'Site ID', key: 'site_name', width: 20 },
    { header: 'Towerco ID', key: 'towerco_id', width: 20 },
    //{ header: 'Operator ID', key: 'operator_id', width: 20 },
    { header: 'Zone', key: 'zone', width: 20 },
    { header: 'Cluster', key: 'cluster', width: 20 },
  ]
  data = []
  rawData = []
  type

  // params is object {data, type}
  constructor(params) {
    this.rawData = params.data
    this.type = params.type
  }

  addColumn(column = []) {
    this.columns.push(...column)
  }

  async execute() {
    switch (this.type) {
      case LEGACY_PAGES.DC_ENERGY_METER:
        await this.formatEnergy()
        break

      case LEGACY_PAGES.CLIMATE:
        await this.formatClimate()
        break

      case LEGACY_PAGES.RECTIFIER:
        await this.formatVoltage()
        break
      case LEGACY_PAGES.ALARM:
        await this.formatAlarm()
        break
    }
    return await this.generateExcelFile()
  }

  async formatVoltage() {
    this.addColumn([
      { header: 'Tenant', key: 'tenant', width: 20 },
      { header: 'Voltage', key: 'voltage', width: 20 },
    ])

    this.data = this.rawData.map(snap => ({
      site_name: snap.name || '',
      towerco_id: snap.towerco_id || '',
      //operator_id: snap.operator_id || '',
      zone: snap.zone || '',
      cluster: snap.cluster || '',
      tenant: getTenantLabel(snap.tenant, false) || '',
      voltage: +snap.voltage,
    }))
  }

  async formatClimate() {
    this.addColumn([
      { header: 'Temperature', key: 'temperature', width: 20 },
      { header: 'Humidity', key: 'humidity', width: 20 },
    ])

    this.data = this.rawData.map(snap => {
      return {
        site_name: snap.name || '',
        towerco_id: snap.towerco_id || '',
        //operator_id: snap.operator_id || '',
        zone: snap.zone || '',
        cluster: snap.cluster || '',
        temperature: snap.temparature ? +snap.temparature : '',
        humidity: snap.humidity ? +snap.humidity : '',
      }
    })
  }

  async formatEnergy() {
    this.addColumn([
      { header: 'Tenant', key: 'tenant', width: 20 },
      { header: 'Load (W)', key: 'load', width: 20 },
      { header: 'Current (A)', key: 'current', width: 20 },
    ])

    this.data = this.rawData.map(snap => {
      return {
        site_name: snap.name || '',
        towerco_id: snap.towerco_id || '',
        //operator_id: snap.operator_id || '',
        zone: snap.zone || '',
        cluster: snap.cluster || '',
        tenant: getTenantLabel(snap.tenant, false),
        load: snap.load ? +snap.load : '',
        current: snap.current ? +snap.current : '',
      }
    })
  }
  async formatAlarm() {
    this.addColumn([
      { header: 'Name', key: 'event_name', width: 20 },
      { header: 'Tenant', key: 'tenant', width: 20 },
      { header: 'Duration', key: 'duration', width: 20 },
      { header: 'Time', key: 'time', width: 20 },
    ])

    this.data = this.rawData.map(snap => {
      console.log(this.rawData)
      return {
        site_name: snap.name || '',
        towerco_id: snap.towerco_id || '',
        //operator_id: snap.operator_id || '',
        zone: snap.zone || '',
        cluster: snap.cluster || '',
        tenant: getTenantLabel(snap.tenant, false),
        event_name: snap.event_name ? snap.event_name : '',
        duration: snap.duration ? snap.duration : '',
        time: snap.time ? snap.time : '',
      }
    })
  }

  async generateExcelFile() {
    const workBook = new Workbook()

    const worksheet = workBook.addWorksheet(this.getSheetName())
    worksheet.columns = this.columns

    this.data.forEach(row => worksheet.addRow(row))
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true }
    })

    const fileName = this.getFileName()
    const buffer = await workBook.xlsx.writeBuffer()
    downloadFile(buffer, fileName)

    // await workBook.xlsx.writeFile(path)
  }

  getFileName() {
    const time = new Date().getTime()
    return `${this.getSheetName()}_Export_${time}.xlsx`
  }

  getSheetName() {
    switch (this.type) {
      case LEGACY_PAGES.CLIMATE:
        return 'Climate'
      case LEGACY_PAGES.DC_ENERGY_METER:
        return 'DC Energy'
      case LEGACY_PAGES.RECTIFIER:
        return 'Rectifier'
      case LEGACY_PAGES.ALARM:
        return 'Alarm'
    }
  }
}
