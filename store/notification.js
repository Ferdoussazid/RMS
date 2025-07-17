export const state = () => ({
  unseenCount: 0,
  unseenNotifications: [],
})

export const getters = {
  unseenCount(state) {
    return state.unseenCount
  },
  unseenNotifications(state) {
    return state.unseenNotifications
  }
}

export const mutations = {}

export const actions = {
  fetch() { }
}