<template>
  <v-container pt-5 mt-5 style="text-align: center;">
    <!--Add Post Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-3>
        <h1 class="primary--text">Add Post</h1>
      </v-flex>
    </v-layout>

    <!--Add Post Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-3>
        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">
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
              <img :src="imageUrl" height="300px" />
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

          <v-layout row>
            <v-flex xs12>
              <v-btn
                :disabled="!isFormValid || loading"
                :loading="loading"
                color="info"
                type="submit"
              >
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
                Submit
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AddPost",
  computed: {
    ...mapGetters(["loading", "user"])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        //add post action
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
        this.$router.push("/");
      }
    }
  },
  data() {
    return {
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
  }
};
</script>
