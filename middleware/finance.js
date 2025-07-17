import { USER_TYPE } from '~/assets/js/Constant'

export default function ({ $auth, redirect }) {
  const allowedUserTypes = [USER_TYPE.FINANCE, USER_TYPE.SUDO]
  if (!allowedUserTypes.includes($auth.user.type)) {
    return redirect('/')
  }
}
