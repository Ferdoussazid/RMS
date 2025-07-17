import { get } from 'lodash'
import { RMS_SERVICE } from '~/assets/js/Constant'

export const state = () => ({
  pin: null,
  isServiceAvailable: false,
})

export const getters = {
  pin(state) {
    return state.pin
  },
  isServiceAvailable(state) {
    return state.isServiceAvailable
  }
}

export const mutations = {
  SET_PIN(state, pin) {
    if (pin) {
      state.pin = { ...pin, value: 0 }
    }
    state.isServiceAvailable = !!pin
  },

  SET_PIN_VALUE(state, { comId, pinName, value }) {
    if (state.isServiceAvailable) {
      state.pin = { ...state.pin, value }
    }
  }
}

export const actions = {
  initPin({ commit }, siteConfig) {
    const pin = siteConfig.pinConfig.find(pn => pn.type === RMS_SERVICE.DG_FUEL)
    commit('SET_PIN', pin)
  },

  publishValue({ commit, rootGetters }, { comId, pinName, status }) {
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      commit('SET_PIN_VALUE', { comId, pinName, status })
    }
  },
}