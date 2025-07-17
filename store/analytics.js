import { startOfMonth, sub, add } from 'date-fns'
const downloadFile = require('js-file-download')

export const state = () => ({
  dgReport: [],
  mainsReport: [],
  batteryReport: [],
  temperatureReport: [],
})

export const getters = {
  dgReport(state) {
    return state.dgReport
  },

  mainsReport(state) {
    return state.mainsReport
  },

  batteryReport(state) {
    return state.batteryReport
  },

  temperatureReport(state) {
    return state.temperatureReport
  }
}

export const mutations = {
  SET_DG_REPORT(state, list) {
    state.dgReport = list
  },

  SET_MAINS_REPORT(state, list) {
    state.mainsReport = list
  },

  SET_BATTERY_REPORT(state, list) {
    state.batteryReport = list
  },

  SET_TEMPERATURE_REPORT(state, list) {
    state.temperatureReport = list
  },
}

export const actions = {
  async getDGReport({ commit }, form) {
    const params = {
      daily_avg: +form.daily_avg,
      user_uid: form.user_uid,
      compare: form.compare.id,
    }
    params.until_time = startOfMonth(new Date())
    params.from_time = startOfMonth(sub(new Date(), { months: form.duration.value }))
    const res = await this.$axios.$get(`/analytics/dg-report`, { params })
    commit('SET_DG_REPORT', res)
  },

  async exportDGReport({ commit }, form) {
    const params = {
      daily_avg: +form.daily_avg,
      user_uid: form.user_uid,
      excel: 'yes',
    }
    params.until_time = startOfMonth(new Date())
    params.from_time = startOfMonth(sub(new Date(), { months: form.duration.value }))
    const res = await this.$axios.$get(`/analytics/dg-report`, {
      params,
      responseType: 'arraybuffer'
    })
    downloadFile(res, `${form.file_name}.xlsx`)
  },

  async getMainsReport({ commit }, form) {
    const params = {
      daily_avg: +form.daily_avg,
      user_uid: form.user_uid,
      compare: form.compare.id,
    }
    params.until_time = startOfMonth(new Date())
    params.from_time = startOfMonth(sub(new Date(), { months: form.duration.value }))
    const res = await this.$axios.$get(`/analytics/mains-report`, { params })
    commit('SET_MAINS_REPORT', res)
  },

  async exportMainsReport({ commit }, form) {
    const params = {
      daily_avg: +form.daily_avg,
      user_uid: form.user_uid,
      compare: form.compare.id,
      excel: 'yes',
    }
    params.until_time = startOfMonth(new Date())
    params.from_time = startOfMonth(sub(new Date(), { months: form.duration.value }))
    const res = await this.$axios.$get(`/analytics/mains-report`, {
      params,
      responseType: 'arraybuffer'
    })
    downloadFile(res, `${form.file_name}.xlsx`)
  },

  async getBatteryReport({ commit }, form) {
    const params = {
      min_backup_hour: +form.min_backup,
      user_uid: form.user_uid,
      compare: form.compare.id,
    }
    params.until_time = add(startOfMonth(new Date()), {years: 1}) // TODO: Remove addition of year
    params.from_time = startOfMonth(sub(new Date(), { months: form.duration.value }))
    const res = await this.$axios.$get(`/analytics/battery-report`, { params })
    commit('SET_BATTERY_REPORT', res)
  },

  async exportBatteryReport({ commit }, form) {
    const params = {
      min_backup_hour: +form.min_backup,
      user_uid: form.user_uid,
      compare: form.compare.id,
      excel: 'yes',
    }
    params.until_time = add(startOfMonth(new Date()), {years: 1}) // TODO: Remove addition of year
    params.from_time = startOfMonth(sub(new Date(), { months: form.duration.value }))
    const res = await this.$axios.$get(`/analytics/battery-report`, {
      params,
      responseType: 'arraybuffer'
    })
    downloadFile(res, `${form.file_name}.xlsx`)
  },

  async getTemperatureReport({ commit }, form) {
    const params = {
      monthly_frequency: +form.monthly_frequency,
      user_uid: form.user_uid,
    }
    params.until_time = startOfMonth(new Date())
    params.from_time = startOfMonth(sub(new Date(), { months: form.duration.value }))
    const res = await this.$axios.$get(`/analytics/temperature-report`, { params })
    commit('SET_TEMPERATURE_REPORT', res)
  },

  async exportTemperatureReport({ commit }, form) {
    const params = {
      monthly_frequency: +form.monthly_frequency,
      user_uid: form.user_uid,
      excel: 'yes',
    }
    params.until_time = startOfMonth(new Date())
    params.from_time = startOfMonth(sub(new Date(), { months: form.duration.value }))
    const res = await this.$axios.$get(`/analytics/temperature-report`, {
      params,
      responseType: 'arraybuffer'
    })
    downloadFile(res, `${form.file_name}.xlsx`)
  }
}