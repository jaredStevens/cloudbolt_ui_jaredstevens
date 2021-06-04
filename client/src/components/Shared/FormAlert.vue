<template>
  <v-alert type="error" :value="true" transition="scale-transition" dismissible>
    <h3 class="white--text">{{message}}</h3>
  </v-alert>
</template>

<script>
export default {
  props: ['message'],
}
</script>
