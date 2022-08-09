<template>
    <div style="height: 100%">
      	<hos-biz-button @click="logout()" size="small">注销</hos-biz-button>
    </div>
</template>

<script>
export default {
    data() {

    },
    methods: {
        logout() {
            this.$store.dispatch('Logout').then(data => {
                console.log(data)
            })
        }
    }
}
</script>
