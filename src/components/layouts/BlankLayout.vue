<template>
  <div>
  </div>
</template>

<script>
  export default {
    name: "BlankLayout",
    inject:['closeCurrent'],
    created () {
      this.goUrl()
    },
    methods: {
      goUrl () {
        this.closeCurrent();
        window.open(this.$route.meta.url,'_blank',this.$route.meta.pageProperties);
      }
    }
  }
</script>

<style scoped>

</style>
