const oauth = {
  domain: 'xxx.auth.xx-xxx-x.amazoncognito.com',
  scope: ['profile', 'email', 'openid', 'aws.cognito.signin.user.admin'],
  redirectSignIn: 'https://example.com/',
  redirectSignOut: 'https://example.com/login',
  responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
}

export default oauth