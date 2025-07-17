export default async function ({ store, route }) {
  if (!store.state.site.fetchingSites && store.state.site.sites.length === 0 && !store.state.user.tokenExpired) {
    await store.dispatch('site/setupSites')
  }
}
