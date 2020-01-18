<template>
  <SimpleFundComputer
    title="沪深300历史定投模拟计算"
    :fundData="fundData">
  </SimpleFundComputer>
</template>

<script>

  import FundData from '../data/FundData';
  import SimpleFundComputer from './SimpleFundComputer';

  export default {
    name: "HuShen300",
    components: {SimpleFundComputer},
    data: function () {
      return {
        fundData: [],
      }
    },
    methods: {},
    beforeMount() {
      this.fundData = FundData.hushen300;
    }
  }
</script>

<style scoped>

</style>
