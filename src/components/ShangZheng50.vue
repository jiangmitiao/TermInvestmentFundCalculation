<template>
  <SimpleFundComputer
    title="上证50历史定投模拟计算"
    :fundData="fundData">
  </SimpleFundComputer>
</template>

<script>

  import FundData from '../data/FundData';
  import SimpleFundComputer from './SimpleFundComputer';
    export default {
        name: "ShangZheng50",
      components: {SimpleFundComputer},
      data: function () {
        return {
          fundData: [],
        }
      },
      methods: {},
      beforeMount() {
        this.fundData = FundData.shangzheng50;
      }
    }
</script>

<style scoped>

</style>
