<template>
  <SimpleFundComputer
    title="上证50指数基金模拟定投计算器"
    :fundData="fundData">
  </SimpleFundComputer>
</template>

<script>

  import ShangZheng50 from '../data/ShangZheng50';
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
        this.fundData = ShangZheng50;
      }
    }
</script>

<style scoped>

</style>
