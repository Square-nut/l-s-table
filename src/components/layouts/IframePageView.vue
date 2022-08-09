<template>
  <iframe
    :id="currentId"
    :src="currentUrl"
    frameborder="0"
    width="100%"
    height="900px"
    scrolling="auto"
  ></iframe>
</template>

<script>
import Vue from "vue";
import { ACCESS_TOKEN } from "@sys/store/mutation-types";

export default {
  name: "IframePageContent",
  props: ["url", "id"],
  data() {
    return {
      currentUrl: "",
      currentId: "",
    };
  },
  created() {
    this.goUrl();
  },
  updated() {
    this.goUrl();
  },
  watch: {
    $route(to, from) {
      this.goUrl();
    },
  },
  methods: {
    goUrl() {
      let url,
        id = "";
      if (this.url && this.id) {
        url = this.url;
        id = this.id;
      } else {
        url = this.$route.meta.url;
        id = this.$route.path;
      }
      this.currentId = id;
      if (url !== null && url !== undefined) {
        //url支持通过 ${token}方式传递当前登录TOKEN
        let tokenStr = "${token}";
        if (url.indexOf(tokenStr) != -1) {
          let token = Vue.ls.get(ACCESS_TOKEN);
          this.currentUrl = url.replace(tokenStr, token);
        } else {
          this.currentUrl = url;
        }
      }
    },
  },
};
</script>

<style>
</style>
