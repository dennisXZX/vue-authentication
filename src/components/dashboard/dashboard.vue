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
  import axios from 'axios'

  export default {
    data() {
      return {
        users: []
      }
    },
    created() {
      // retrieve data from firebase
      axios.get('/users.json')
        .then(res => {
          console.log(res)
          const data = res.data
          const users = []

          // convert the data object into an array
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }

          console.log(users)
          this.users = users
        })
        .catch(error => console.log(error))
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