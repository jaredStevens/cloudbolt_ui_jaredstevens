<template>
  <v-container pt-5 mt-5 class="text-center">
    <!--User Card Details-->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5 mt-5>
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div class="text-center">
                <div class="headline">{{user.username}}</div>
                <div>Joined {{formatJoinDate(user.joinDate)}}</div>
                <div class="hidden-xs-only font-weight-thin">{{user.favorites.length}} Favorites</div>
                <div class="hidden-xs-only font-weight-thin">{{userPosts.length}} Posts Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- posts Favorited By the User -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You don't have any favorite posts currently. Go and add some.</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container mt-3 v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Favorited
          <span class="font-weight-regular">({{userFavorites.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img height="30vh" @click="goToPost(favorite._id)" :src="favorite.imageUrl"></v-img>
            <v-card-text>{{favorite.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- posts Created By the User -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You haven't added any Posts. Go Add Some!'</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container mt-3 v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Your Posts
          <span class="font-weight-regular">({{userPosts.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn @click="loadPost(post)" color="info" floating fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="handleDeleteUserPost(post)" color="error" floating fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>
            <v-img height="30vh" @click="goToPost(post._id)" :src="post.imageUrl"></v-img>
            <v-card-text>{{post.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit Post Dialog -->
    <v-dialog xs12 sm6 offset-sm3 v-model="editPostDialog" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <v-container>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleUpdateUserPost"
          >
            <!--Title Input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="titleRules"
                  v-model="title"
                  label="Post Title"
                  type="text"
                  required
                  autocomplete="off"
                  counter="20"
                  maxlength="20"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Url Input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="imageRules"
                  v-model="imageUrl"
                  label="Image URL"
                  type="text"
                  required
                  autocomplete="off"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Preview -->
            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px" :alt="title"/>
              </v-flex>
            </v-layout>

            <!-- Categories Select -->
            <v-layout row>
              <v-flex xs12>
                <v-select
                  :rules="categoriesRules"
                  required
                  v-model="categories"
                  :items="['Art', 'Education', 'Travel', 'Photography', 'Technology', 'Food', 'Furniture']"
                  multiple
                  label="Categories"
                ></v-select>
              </v-flex>
            </v-layout>

            <!-- Description Text Area -->
            <v-layout row>
              <v-flex xs12>
                <v-textarea
                  :rules="descRules"
                  v-model="description"
                  label="Description"
                  type="text"
                  required
                  autocomplete="off"
                  counter="200"
                  maxlength="200"
                ></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="!isFormValid" type="submit" class="success--text" text>Update</v-btn>
              <v-btn class="error--text" text @click="editPostDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title =>
          !!title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      descRules: [
        description => !!description || "Description is required",
        description =>
          !!description.length < 200 ||
          "Title must have less than 200 characters"
      ],
      categoriesRules: [
        categories =>
          !!categories.length >= 1 || "At least one category is required"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts"])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    goToPost(id) {
      this.$router.push(`/posts/${id}`);
    },
    formatJoinDate(date) {
      return moment(new Date(date)).format("ll");
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (deletePost) {
        this.$store.dispatch("deleteUserPost", {
          postId: this.postId
        });
      }
    },
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    handleUpdateUserPost() {
      // update user post
      if (this.$refs.form.validate()) {
        this.$store.dispatch("updateUserPost", {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        this.editPostDialog = false;
      }
    },
    loadPost(
      { _id, title, imageUrl, categories, description },
      editPostDialog = true
    ) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    }
  }
};
</script>

<style scoped>
</style>
