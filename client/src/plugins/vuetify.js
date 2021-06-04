import Vue from 'vue';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi' ,
  },
  theme: {
    themes: {
      dark: {
        primary: "#3B125F",
        secondary: "#8B5FBF",
        accent: "#BF653F",
        error: "#722530",
        warning: "#A37513",
        info: "#396893",
        success: "#4CAF50"
      }
    }
  }
});
