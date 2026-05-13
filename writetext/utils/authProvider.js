class AuthProvider {
authenticate = async () => {
  const AuthenticationService = require('../services/AuthenticationService').default
  return await AuthenticationService.getUser().then(u => {
    if (u == null) {
      AuthenticationService.login()
      return null
    } else {
      return u
    }
  })
}
}


let authenticationProvider = new AuthProvider();
Object.freeze(authenticationProvider);
export default authenticationProvider;