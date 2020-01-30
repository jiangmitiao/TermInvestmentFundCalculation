<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
    <el-menu :default-active="$route.path" router mode="horizontal">
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/HuShen300">沪深300</el-menu-item>
      <el-menu-item index="/ShangZheng50">上证50</el-menu-item>
    </el-menu>
    <router-view v-wechat-title="$route.meta.title"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/*#app {*/
/*  font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  text-align: center;*/
/*  color: #2c3e50;*/
/*  margin-top: 60px;*/
/*}*/
</style>
