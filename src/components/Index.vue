<template>
  <div>
    <el-button-group>
      <el-button @click="$router.push({path:'HuShen300'})">
        沪深300历史定投模拟计算
      </el-button>
      <el-button @click="$router.push({path:'ShangZheng50'})">
        上证50历史定投模拟计算
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
  export default {
    name: "Index",
    mounted() {
      // this.$router.push({
      //   path:"/HuShen300"
      // })
    }
  }
</script>

<style scoped>

</style>
