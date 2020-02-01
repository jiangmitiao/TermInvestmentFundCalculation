<template>
  <SimpleFundComputer
    v-loading="loading"
    element-loading-text="加载数据中"
    title="沪深300指数基金模拟定投计算器"
    :fundData="fundData">
  </SimpleFundComputer>
</template>

<script>

  // import HuShen300 from '../data/HuShen300';
  import SimpleFundComputer from './SimpleFundComputer';
  import axios from 'axios';
  import DataProxy from "../data/DataProxy";

  export default {
    name: "HuShen300",
    components: {SimpleFundComputer},
    data: function () {
      return {
        fundData: [],
        loading: false,
      }
    },
    methods: {},
    mounted() {
      let context = this;
      context.loading = true;
      DataProxy.getHuShen300(data => {
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
