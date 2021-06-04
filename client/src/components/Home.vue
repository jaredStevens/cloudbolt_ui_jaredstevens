<template>
  <v-container>
    <!-- Loading Spinner -->
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- Explore Posts Button -->
    <v-layout row wrap v-if="!loading && posts.length" class="mt-2 mb-3 text-center">
      <v-flex xs12>
        <v-btn class="secondary" to="/posts" large dark>Explore Posts</v-btn>
      </v-flex>
    </v-layout>
    <!-- Condition to not show Explore Post button if posts don't exist -->
    <v-layout row wrap v-if="!loading && !posts.length" class="mt-2 mb-3 text-center">
      <v-flex xs12>
        <h2>Start the party, and create your own posts now.</h2>,
        <v-spacer/>
        <v-spacer/>
        <v-btn class="primary" to="/post/add" large dark>Create Post</v-btn>
      </v-flex>
    </v-layout>

    <!--Post Carousel -->
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{'cycle': true}" interval="3000">
        <v-carousel-item
          v-for="post in posts"
          :key="post._id"
          :src="post.imageUrl"
          @click.native="goToPost(post._id)"
        >
          <h1 id="carousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  created() {
    this.handleGetCarouselPosts();
  },
  computed: {
    ...mapGetters(["loading", "posts"])
  },
  methods: {
    handleGetCarouselPosts() {
      //reach out to Vuex store, fire action that gets posts for carousel
      this.$store.dispatch("getPosts");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
};
</script>

<style lang="stylus" scoped>
#carousel__title {
  position: absolute;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
