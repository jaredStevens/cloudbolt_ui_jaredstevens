<template>
  <v-app style="background: #E3E3EE">
    <v-navigation-drawer app temporary absolute v-model="sideNav">
      <v-app-bar color="secondary" dark flat>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">InstaSnapBook</h1>
        </router-link>
      </v-app-bar>
      <v-divider />

      <!-- Side NavBar Links -->
      <v-list>
        <v-list-item ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-item-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{item.title}}</v-list-item-content>
        </v-list-item>

        <!-- Signout Button -->
        <v-list-item v-if="user" @click="handleSignoutUser">
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Signout</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app color="primary" dark>
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">InstaSnapBook</router-link>
      </v-toolbar-title>
      <v-spacer />

      <!--Search Input -->
      <v-text-field
        v-model="searchTerm"
        @input="handleSearchPosts"
        flex
        prepend-icon="mdi-magnify"
        placeholder="Search Posts"
        color="accent"
        single-line
        hide-details
      >Search Posts</v-text-field>
      <v-spacer />

      <!--Search Results Card -->
      <v-card dark v-if="searchResults.length" id="search__card">
        <v-list-item
          v-for="result in searchResults"
          :key="result._id"
          @click="goToSearchResult(result._id)"
        >
          <v-list-item-title>
            {{result.title}} -
            <span
              class="font-weight-thin"
            >{{formatDescription(result.description)}}</span>
          </v-list-item-title>
          <!-- Show Icon if result is favorited by the user -->
          <v-list-item-action v-if="checkIfUserFavorite(result._id)">
            <v-icon>favorite</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-card>

      <!--Horizontal Navbar Links-->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn text v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon left class="hidden-sm-only">{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <!-- Profile Button -->
        <v-btn text to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2" :class="{ 'bounce': badgeAnimated }">
            <span slot="badge" v-if="userFavorites.length">{{ userFavorites.length }}</span>
            Profile
          </v-badge>
        </v-btn>

        <!-- Signout Button -->
        <v-btn text v-if="user" @click="handleSignoutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>Signout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <main>
      <v-container style="margin-top: 50px">
        <transition name="fade">
          <router-view />
        </transition>

        <!--Auth Snackbar -->
        <v-snackbar v-model="authSnackbar" color="success" :timeout="5000" bottom left>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn text dark @click="authSnackbar = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-snackbar>

        <!--Auth Error Snackbar -->
        <v-snackbar
          v-if="authError"
          v-model="authErrorSnackbar"
          color="warning"
          :timeout="5000"
          bottom
          left
        >
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{ authError.message }}</h3>
          <v-btn text dark to="/signin">Signin</v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import Home from "./components/Home";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    Home
  },
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false,
      searchTerm: ""
    };
  },
  methods: {
    checkIfUserFavorite(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === resultId)
      );
    },
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    goToSearchResult(resultId) {
      //clear search term
      this.searchTerm = "";
      //Go to  desired result
      this.$router.push(`/posts/${resultId}`);
      this.$store.commit("clearSearchResults");
    },
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    }
  },
  watch: {
    user(newValue, oldValue) {
      //if we have no value for user before, show snackbar
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      //if auth error is not null, show auth error snackbar
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      //if user favorites value changes at all
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["authError", "user", "userFavorites", "searchResults"]),
    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [{ icon: "chat", title: "Posts", link: "/posts" }];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "star", title: "Create Post", link: "/post/add" },
          { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    }
  }
};
</script>

<style scoped>
h1 {
  font-weight: 400;
  font-size: 2.5rem;
}

h2 {
  font-weight: 400;
  font-size: 2rem;
}

/* USer Favorite Animation*/
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
/*Search Results Card*/
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 1;
  top: 100%;
  left: 0;
}
</style>
