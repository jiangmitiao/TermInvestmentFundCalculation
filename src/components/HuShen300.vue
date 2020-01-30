<template>
  <SimpleFundComputer
    title="沪深300指数基金模拟定投计算器"
    :fundData="fundData">
  </SimpleFundComputer>
</template>

<script>

  import HuShen300 from '../data/HuShen300';
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
      this.fundData = HuShen300;
    }
  }
</script>

<style scoped>

</style>
