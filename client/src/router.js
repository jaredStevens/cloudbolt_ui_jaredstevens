import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/home.vue'
import AddPost from './components/posts/add-post.vue'
import Posts from './components/posts/posts.vue'
import Post from './components/posts/post.vue'

import Profile from './components/auth/profile.vue'
import Signin from './components/auth/sign-in.vue'
import Signup from './components/auth/sign-up.vue'

import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/posts/:postId',
      name: 'Post',
      component: Post,
      props: true
    },
    {
      path: '/post/add',
      name: 'AddPost',
      component: AddPost,
      beforeEnter: AuthGuard
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
  ]
})
