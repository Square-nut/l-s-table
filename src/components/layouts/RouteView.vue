<template>
  <div class="main" style="height: 100%;">
    <keep-alive :include="includedComponents">
      <router-view v-if="keepAlive" />
    </keep-alive>
    <router-view v-if="!keepAlive" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import { CACHE_INCLUDED_ROUTES } from "@sys/store/mutation-types"

  export default {
    name: "RouteView",
    computed: {
      //update-begin--Author:scott  Date:20201015 for：路由缓存问题，关闭了tab页时再打开就不刷新 #842
      includedComponents() {
        const includedRouters = Vue.ls.get(CACHE_INCLUDED_ROUTES)
        //如果是缓存路由，则加入到 cache_included_routes
        if (this.$route.meta.keepAlive && this.$route.name) {
          let cacheRouterArray = Vue.ls.get(CACHE_INCLUDED_ROUTES) || []
          if(!cacheRouterArray.includes(this.$route.name)){
            cacheRouterArray.push(this.$route.name)
            Vue.ls.set(CACHE_INCLUDED_ROUTES, cacheRouterArray)
            return cacheRouterArray;
          }
        }
        return includedRouters;
      },
      //update-end--Author:scott  Date:20201015 for：路由缓存问题，关闭了tab页时再打开就不刷新 #842
      keepAlive () {
        return this.$route.meta.keepAlive
      }
    },
    created() {
    }
  }
</script>
