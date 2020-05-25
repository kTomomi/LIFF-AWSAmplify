<template>
    <div id="app">
      <div id="nav">
        <h2>ようこそ、{{name}} さん</h2>
      </div>
      <div class='top'>
        <div>今日行ったエクササイズの内容にチェックを入れて登録してください。<br>LINEの友だちにシェアすることもできます。</div>
        <br>
        <button variant='primary' v-on:click='postUserData'>登録</button>
        <button variant='primary' v-on:click='shareMessages'>シェア</button>
        <br>
        <br>
        <div>
          <table class="table" border="1">
            <thead>
              <tr>
                <th>メニュー</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td><input type="checkbox" :value="item.menu" :id="item.menu" v-model="checkedMenus">{{ item.menu }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>
        <hr>
        <br>
        <div>■過去に行ったエクササイズの内容</div>
        <br>
        <div>
          <table class="table" border="1">
            <thead>
              <tr>
                <th>実施日</th>
                <th>メニュー</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.zissidate }}</td>
                <td>{{ user.menu }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="amplify-sign-out">
        <!-- Amplify UIのSign Out用コンポーネントを追加 -->
        <amplify-sign-out/>
      </div>
    </div>
</template>

<script>

 import { API } from 'aws-amplify'
 import moment from "moment";

    window.LOG_LEVEL = 'VERBOSE';
    
    export default {
        name: 'top',
        data() {
            return {
                // API Gatewayの名称
                apiName: 'sampleapigatway',
                // API Gatewayの設定パス
                path: '/menus',
                userPath: '/users',
                items: [],
                users: [],
                checkedMenus: [],
                // LINE name
                name: '',
                // Cognito name
                username: '',
            }
        },
        async created(){
          this.username = this.$store.state.user.username;
          await this.getData()
          await this.getUserData()
          this.initializeLiff()
        },
        methods: {
          initializeLiff: async function () {
            liff.init(
              {
                liffId: process.env.VUE_APP_LIFF_ID
              },
              data => {
                if (!liff.isLoggedIn()) {
                  liff.login()
                }
                // プロフィール取得
                liff.getProfile()
                  .then(profile => {
                    this.name = profile.displayName
                  })
                  .catch((err) => {
                    console.log('error', err)
                  })
                },
              err => {
                console.log('LIFF initialization failed', err)
              }
            )
          },
          sendMessages: function () {
            liff.sendMessages([
              {
                "type": "text",
                "text": "今日行ったエクササイズ\n---------------\n" + this.checkedMenus
              }
            ])
            .then(() => {
              console.log('message sent');
            })
            .catch((err) => {
              console.log('error', err)
            })
          },
          shareMessages: function () {
            liff.shareTargetPicker([
              {
                "type": "text",
                "text": "私の今日行ったエクササイズ\n---------------\n" + this.checkedMenus
              }
            ])
            .then(() => {
              console.log('message sent');
            })
            .catch((err) => {
              console.log('error', err)
            })
          },
            getData: function () {
                // 検索ID指定
                const path = this.path;
                // オプション
                const myInit = {
                    headers: {},
                    response: true,
                };
                // データ取得
                API.get(this.apiName, path, myInit).then(response => {
                    // テーブル表示
                    this.items = response.data
                }).catch(error => {
                    // テーブルリセット
                    this.items = [];
                });
            },
            getUserData: function () {
                // 検索ID指定
                const path = this.userPath + "/" + this.username;
                // オプション
                const myInit = {
                    headers: {},
                    response: true,
                };
                // データ取得
                API.get(this.apiName, path, myInit).then(response => {
                    // テーブル表示
                    this.users = response.data
                    
                }).catch(error => {
                    alert(error)
                    // テーブルリセット
                    this.users = [];
                });
            },
            postUserData: function () {
                // オプション
                const myInit = {
                    headers: {},
                    response: true,
                    body: {
                        timestamp: Number(new Date().getTime()),
                        name: String(this.username),
                        menu: String(this.checkedMenus),
                        zissidate: String(moment(new Date()).format('YYYY/MM/DD HH:mm'))
                    }
                };
                // データ登録
                API.post(this.apiName, this.userPath, myInit).then(response => {
                    console.log(response);
                    this.getUserData()
                    this.sendMessages()
                }).catch(error => {
                    console.log(error)
                    alert(error)
                });
            }
        }
    }
</script>

<style src="../assets/style.css" />