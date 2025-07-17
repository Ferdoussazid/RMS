export default function ({ store, redirect }) {
  if (!store.state.ticket.tickets.total) {
    return redirect('/ticket')
  }
}
