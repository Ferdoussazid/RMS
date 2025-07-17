import { INSTALLED_TENANTS, SCOMM_ROOT_USER_UID, SCOMM_TENANTS } from '~/assets/js/Constant'
import { getCompanyById } from '~/assets/js/Helper'

export const state = () => ({
  profile: {},
  tokenExpired: false,
  users: [],
  accessUsers: { total: 0, items: [] },
})

export const getters = {
  profile(state) {
    return state.profile
  },
  users(state) {
    return state.users
  },
  accessUsers(state) {
    return state.accessUsers
  },
  tokenExpired(state) {
    return state.tokenExpired
  },
  userUid(state, getters, rootState) {
    return rootState.auth.user.uid
  },
  rootUserUid(state, getters, rootState) {
    const user = rootState.auth.user
    return user.root_user_uid || user.uid
  },
  allowedTenants(state, getters, rootState) {
    const user = rootState.auth.user
    if (user.root_user_uid === SCOMM_ROOT_USER_UID) {
      return Object.keys(SCOMM_TENANTS)
    }
    return user.tenants || INSTALLED_TENANTS
  },
  companyName(state, getters, rootState) {
    const user = rootState.auth.user
    const companyId = user.company_id
    return getCompanyById(companyId)
  },
}

export const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile
  },
  SET_USER_LIST(state, list) {
    state.users = list
  },
  SET_ACCESS_USER_LIST(state, list) {
    state.accessUsers = list
  },
  SET_TOKEN_EXPIRATION_STATUS(state, status) {
    state.tokenExpired = status
  },
  UPDATE_USER_LIST(state, item) {
    const index = state.users.findIndex(user => user.uid === item.uid)
    if (index !== -1) {
      state.users.splice(index, 1, item)
    } else {
      state.users.push(item)
    }
  },
  DELETE_USER(state, userUid) {
    const index = state.users.findIndex(user => user.uid === userUid)
    if (index !== -1) {
      state.users.splice(index, 1)
    }
  },
  CLEAR_USER_LIST(state) {
    state.users = []
  },
}

export const actions = {
  async startSession({ commit, rootState }, siteUid) {
    await this.$axios.$post('/user/session/start', { site_uid: siteUid })
  },
  async updateProfile({ commit }, data) {
    const res = await this.$axios.$post('/user/profile/update', data)
    commit('SET_PROFILE', res)
  },
  async changePassword({ commit }, data) {
    const res = await this.$axios.$post('/user/profile/change-password', data)
    commit('SET_PROFILE', res)
  },
  async createUser({ commit }, data) {
    const res = await this.$axios.$post('/user/auth/signup', data)
    res.created_at = new Date()
    commit('UPDATE_USER_LIST', res)
  },
  async updateUser({ commit }, data) {
    await this.$axios.$post('/user/auth/update', data)
    commit('UPDATE_USER_LIST', data)
  },
  async deleteUser({ commit }, userUid) {
    await this.$axios.$post('/user/auth/delete', { uid: userUid })
    commit('DELETE_USER', userUid)
  },
  async getUserList({ commit }, query) {
    const res = await this.$axios.$get('/user/user/list', { params: query })
    commit('SET_USER_LIST', res)
  },
  async getAccessUserList({ commit }, query) {
    const res = await this.$axios.$get('/user/app/user-list', { params: query })
    commit('SET_ACCESS_USER_LIST', res)
  },
  async checkOTPExpirationStatus({ commit }, data) {
    const res = await this.$axios.$post('/user/auth/session-status', data)
    return res
  },
  async verifyOTP({ commit }, data) {
    const res = await this.$axios.$post('/user/auth/two-factor', data)
    return res
  },
}
