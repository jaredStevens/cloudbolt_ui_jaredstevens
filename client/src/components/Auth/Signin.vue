<template>
  <v-container  pt-5 mt-5 style="text-align: center;">
    <!--Signin Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-3>
        <h1>Welcome Back</h1>
      </v-flex>
    </v-layout>
    <!-- Error Alert -->
    <v-layout row wrap v-if="error">
      <v-flex xs12 sm6 offset-3>
        <FormAlert class="pa-2 ma-2" :message="error.message"/>
      </v-flex>
    </v-layout>
    <!--Signin Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-3>
        <v-card class="pa-2 ma-2" color="secondary" dark>
          <v-container>
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSigninUser">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="mdi-account-circle" label="User Name" type="text" required autocomplete="off">
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
                  <v-btn :disabled="!isFormValid || loading" :loading="loading" color="accent" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Signin</v-btn>
                  <h3>Don't have an account?
                  <router-link to="/signup">Signup</router-link>
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
import { mapGetters } from 'vuex'
export default {
  name: 'Signin',
  data() {
    return {
      isFormValid: true,
      username: "",
      password: "",
      usernameRules: [
        //check if username is in input
        v => !!v || 'Username is Required',
        //make sure username is less than 10 characters
        v => v.length < 10 || 'Username must be less than 10 characters'
      ],
      passwordRules: [
        v => !!v || 'Password is Required',
        // make sure password is at least 7 characters
        v => v.length >= 3 || 'Password must be at least 3 characters'
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
    handleSigninUser() {
      if(this.$refs.form.validate()) {
        this.$store.dispatch('signinUser', {
          username: this.username,
          password: this.password
        })
      }
    }
  }
}
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
