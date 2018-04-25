<template>
    <div id="dashboard">
        <h1>That's the dashboard!</h1>
        <p>You should only get here if you're authenticated!</p>
        <ul class="user-list">
            <li v-for="user in users">
                {{ user.email }}
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    computed: {
      users() {
        return this.$store.getters.users
      }
    },
    created() {
      this.$store.dispatch('fetchUser')
    }
  }
</script>

<style scoped>
    h1, p {
        text-align: center;
    }

    p {
        color: red;
    }

    .user-list {
        text-align: center;
        list-style: none;
    }
</style>