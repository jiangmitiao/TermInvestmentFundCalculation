<template>
  <SimpleFundComputer
    title="上证50指数基金模拟定投计算器"
    :fundData="fundData">
  </SimpleFundComputer>
</template>

<script>

  // import ShangZheng50 from '../data/ShangZheng50';
  import SimpleFundComputer from './SimpleFundComputer';
  import axios from "axios";

  import DataProxy from "../data/DataProxy";

  export default {
    name: "ShangZheng50",
    components: {SimpleFundComputer},
    data: function () {
      return {
        fundData: [],
      }
    },
    methods: {},
    mounted() {
      let context = this;
      context.loading = true;
      DataProxy.getShangZheng50(data => {
          context.fundData = data;
          context.loading = false;
        },
        error => {
          console.log(error);
          context.$alert('获取数据失败,请刷新页面', '错误提示', {
            confirmButtonText: '确定',
          });
        }
      );
    }
  }
</script>

<style scoped>

</style>
