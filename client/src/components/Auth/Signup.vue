<template>
  <v-container  pt-5 mt-5 style="text-align: center;">

    <!--Signup Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-3>
        <h1>Get Started Here</h1>
      </v-flex>
    </v-layout>

    <!-- Error Alert -->
    <v-layout row wrap v-if="error">
      <v-flex xs12 sm6 offset-3>
        <FormAlert class="pa-2 ma-2" :message="error.message"/>
      </v-flex>
    </v-layout>

    <!--Signup Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-3>
        <v-card class="pa-2 ma-2" color="accent" dark>
          <v-container>
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSignupUser">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="mdi-account-circle" label="User Name" type="text" required autocomplete="off">
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="emailRules" v-model="email" prepend-icon="mdi-email-lock" label="Email" type="email" required autocomplete="off">
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="mdi-lock" label="Password" type="password" required autocomplete="off">
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="mdi-alert-octagon" label="Confirm Password" type="password" required autocomplete="off">
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn :disabled="!isFormValid || loading" :loading="loading" color="info" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Signup</v-btn>
                  <h3>Already Have an Account?
                  <router-link to="/signin">Signin</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Signup',
  data(){
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        username => !!username || 'Username is required',
        username => username.length < 10 || 'Username cannot be more than 10 characters'
      ],
      emailRules: [
        email => !!email || 'Email is required',
        email => /.@+./.test(email) || 'Email must be valid'
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 4 || 'Password must be at least 4 characters',
        confirmation => confirmation === this.password || 'Passwords must match'
      ]
    }
  },
  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },
  watch: {
    user(value) {
      //if user value changes, redirect to home page
      if(value) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    handleSignupUser() {
      if(this.$refs.form.validate()) {
        this.$store.dispatch('signupUser', {
          username: this.username,
          email: this.email,
          password: this.password
        })
      }
      //signup user action
    }
  }
}
</script>
