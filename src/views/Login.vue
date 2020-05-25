<template>
  <div class="login">
    <p v-if="signined">ログインしました。</p>
    <p v-else>ログインしています...</p>
  </div>
</template>

<script>
import router from '../router.js'
import Amplify, { Auth, Hub } from 'aws-amplify'
import awsconfig from '../aws-exports'
Amplify.configure(awsconfig)
import oauth from '../aws-oauth-config'
Auth.configure({ oauth })

export default {
  name: 'login',
  data () {
    return {
      signined: false,
      loading: false,
      username: ''
    }
  },
  created: function () {
    this.initializeLiff();
    this.signIn()
    Hub.listen('auth', (data) => {
      this.loading = false
      switch (data.payload.event) {
        case 'signIn':
          this.signined = true
          router.push({path: '/'})
          break
        case 'signIn_failure':
          break
        default:
          break
      }
    })  
  },
  methods: {
    signIn: async function() {
      this.loading = true
      let res = await Auth.federatedSignIn({provider: 'LINE'})

    },
    initializeLiff: function () {
      liff.init(
        {
          liffId: process.env.VUE_APP_LIFF_ID
        },
        data => {
          if (!liff.isLoggedIn()) {
            liff.login()
          }
        },
        err => {
          console.log('LIFF initialization failed', err)
        }
      )
    }
  }
}
</script>