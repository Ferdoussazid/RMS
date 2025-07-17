import { USER_TYPE } from '~/assets/js/Constant'

export default function ({ $auth, redirect }) {
  const adminTypes = [USER_TYPE.SUDO, USER_TYPE.SUPPORT]
  if (adminTypes.includes($auth.user.type)) {
    return redirect('/customer/sites')
  }
}
