<template lang="html">
  <header>
    <nav class="nav">
      <div class="nav-left">
        <router-link :to="{ name: 'Index'}">
          <a class="nav-item">
            <img src="../assets/so-icon.png" alt="HacktivOverflow logo">&nbsp;Hacktiv Overflow
          </a>
        </router-link>
        <div class="nav-item is-hidden-mobile">
          <p class="control">
            <input class="input" type="text" placeholder="Search for questions">
          </p>
          <p class="control">
            <a class="button is-primary">Search</a>
          </p>
        </div>
      </div>
      <!-- This "nav-toggle" hamburger menu is only visible on mobile -->
      <!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
      <span class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <!-- This "nav-menu" is hidden on mobile -->
      <!-- Add the modifier "is-active" to display it on mobile -->

      <div class="nav-right nav-menu">
        <div class="nav-item">
          <button class="nav-item button is-danger is-outlined" v-show="!verified" @click="register_modal = true"><i class="material-icons">account_circle</i>&nbsp;Register</button>&nbsp;&nbsp;
          <button class="nav-item button is-primary is-outlined" v-show="!verified" @click="login_modal = true"><i class="material-icons">launch</i>&nbsp;Login</button>
          <button class="nav-item button is-primary is-outlined" v-show="verified" @click="confirm"><i class="material-icons">exit_to_app</i>&nbsp;Logout</button>
        </div>
      </div>
    </nav>

    <b-modal
      :active.sync="register_modal"
      :width="380">
      <div class="modal-card" v-show="register_modal">
        <form @submit="register">
          <header class="modal-card-head">
            <p class="modal-card-title">Register</p>
          </header>
          <section class="modal-card-body">
            <b-field label="Name">
              <b-input
                placeholder="Your name"
                v-model="name"
                required>
              </b-input>
            </b-field>

            <b-field label="Email">
              <b-input
                type="email"
                v-model="email"
                placeholder="Your email"
                required>
              </b-input>
            </b-field>

            <b-field label="Password">
              <b-input
                type="password"
                v-model="password"
                password-reveal
                placeholder="Your password"
                required>
              </b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="register_modal = false">Close</button>
            <button class="button is-primary">Register</button>
          </footer>
        </form>
      </div>
    </b-modal>

    <b-modal
      :active.sync="login_modal"
      :width="380">
      <div class="modal-card" v-show="login_modal">
        <form @submit="signin">
          <header class="modal-card-head">
            <p class="modal-card-title">Login</p>
          </header>
          <section class="modal-card-body">
            <b-field label="Email">
              <b-input
                type="email"
                v-model="email"
                placeholder="Your email"
                required>
              </b-input>
            </b-field>

            <b-field label="Password">
              <b-input
                type="password"
                v-model="password"
                password-reveal
                placeholder="Your password"
                required>
              </b-input>
            </b-field>

            <b-checkbox>Remember me</b-checkbox>
          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="login_modal = false">Close</button>
            <button class="button is-primary">Login</button>
          </footer>
        </form>
      </div>
    </b-modal>

    <sweet-modal icon="success" ref="alert_success">Success.<br>{{greet}}..</sweet-modal>
    <sweet-modal icon="warning" ref="alert_warning">
    	Are you sure?<br><br>
      <button class="button is-success" @click="signout">Yes</button>
      <button class="button is-danger" @click="close">No</button>
    </sweet-modal>
    <sweet-modal icon="error" ref="alert_user" title="Uh oh..">
    	Email not found!<br>
      Check your email..
    </sweet-modal>
    <sweet-modal icon="error" ref="wrong_pass" title="Uh oh..">
    	Wrong Password!<br>
      Check your password..
    </sweet-modal>
  </header>
</template>

<script>
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import axios from 'axios'

export default {
  name: 'navbar',
  props: ['name', 'email', 'password'],
  data () {
    return {
      verified: false,
      login_modal: false,
      register_modal: false,
      greet: '',
      token: localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id'),
      user_name: localStorage.getItem('user_name')
    }
  },
  mounted () {
    if (this.token !== null) {
      this.verified = true
    }
  },
  methods: {
    signin () {
      let self = this
      console.log(this.email)
      console.log(this.password)
      axios.post('http://localhost:3000/users/login', {email: this.email, password: this.password})
      .then((res) => {
        if (res.data === 'user not found') {
          self.$refs.alert_user.open()
        } else if (res.data === 'wrong password') {
          self.$refs.wrong_pass.open()
        } else {
          self.greet = 'You are login'
          self.login_modal = false
          self.$refs.alert_success.open()
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user_id', res.data.user_id)
          localStorage.setItem('user_id', res.data.user_name)
          console.log(res.data)
          self.verified = true
        }
      })
      .catch((err) => {
        console.log('failed')
        alert(err + 'login failed')
        self.login_modal = false
      })
    },
    signout () {
      this.greet = 'You are logout'
      localStorage.clear()
      this.$refs.alert_warning.close()
      this.$refs.alert_success.open()
      this.verified = false
      this.$router.push('/')
    },
    register () {
      let self = this
      axios.post('http://localhost:3000/users', {name: this.name, email: this.email, password: this.password})
      .then((res) => {
        console.log(res.data)
        this.greet = 'Thank you! Please login to continue..'
        self.register_modal = false
        self.$refs.alert_success.open()
        this.$router.push('/')
      })
      .catch((err) => {
        console.log('failed')
        alert(err + 'register failed')
        self.register_modal = false
      })
    },
    confirm () {
      this.$refs.alert_warning.open()
    },
    close () {
      this.$refs.alert_warning.close()
    }
  },
  components: {
    SweetModal,
    SweetModalTab
  }
}
</script>

<style scoped>
  .modal-card {
    margin: 0 auto;
    width: auto;
  }

  .nav {
    position: fixed !important; top: 0; left: 0; right: 0;
    width: 100%;
    height: 4.5em;
    padding: 1em;
    border: 0.1em solid #F48024;
    background-color: #FAFAFB;
  }
</style>
