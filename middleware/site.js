export default function ({ store, redirect }) {
  if (!store.state.site.siteConfig) {
    return redirect('/site/list')
  }
}
