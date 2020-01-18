<template>
  <div>
    <el-row>
      <el-col :span="24">
        <h3>{{title}}</h3>
        <h3></h3>
        <span v-show="false">数据来源自乐咕乐股网</span>
        <span>{{ messages }}</span>
      </el-col>
    </el-row>

    <el-row>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">


        <el-form-item label="定投时间" prop="selectedDate">
          <el-date-picker
            v-model="form.selectedDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="定投间隔" prop="cycleDays">
          <el-slider
            v-model="form.cycleDays"
            :max="30"
            :min="1"
            show-input>
          </el-slider>
        </el-form-item>


        <el-form-item label="每期金额" prop="singleMoney">
          <el-input
            v-model="form.singleMoney"
            placeholder="请输入每期金额"
            type="number"
            :min="1.0"
          ></el-input>
        </el-form-item>

        <el-form-item label="周期强制">
          <el-switch v-model="form.forceCycle"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')" v-text="buttonName"></el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--    <el-row>-->
    <!--      <el-col :span="24">-->
    <!--        <p><span v-text="form.selectedDate"></span></p>-->
    <!--        <p><span v-text="form.cycleDays"></span></p>-->
    <!--        <p><span v-text="form.singleMoney"></span></p>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <el-row v-if="result != null">
      <el-col :span="24">
        <p>定投期数:<span v-text="result.count"></span></p>
        <p>每期金额:<span v-text="result.singleMoney"></span></p>
        <p>总投入:<span v-text="result.inputMoney"></span></p>
        <p>总回报:<span v-text="result.outputMoney"></span></p>
        <p>收益率:<span v-text="result.roi"></span>%</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  const moneyCheck = (rule, value, callback) => {
    if (value < 100 || value > 10000) {
      callback(new Error('金额在100-10000之间'));
    } else {
      callback();
    }
  };

  export default {
    name: "SimpleFundComputer",
    props: {
      title: "",
      fundData: {
        default: []
      },

    },
    watch: {
      'title': 'init',
      'fundData': 'init'
    },
    data: function () {
      return {

        pickerOptions: {
          shortcuts: []
        },


        form: {
          selectedDate: [],
          cycleDays: 7,
          singleMoney: 100.0,
          forceCycle: true
        },
        rules: {
          selectedDate: [
            {required: true, message: '请选择日期', trigger: 'blur'},
            {validator: (a, b, c) => this.checkDate(a, b, c), trigger: 'blur'},
          ],
          cycleDays: [
            {required: true, message: '请输入定投周期', trigger: 'blur'},
          ],
          singleMoney: [
            {required: true, message: '请输入每期金额', trigger: 'blur'},
            {validator: moneyCheck, trigger: 'blur'}
          ]
        },


        messages: "",

        result: null,

        buttonName: "去计算"

      }
    },
    methods: {

      compute(callback) {
        let startDate = new Date(this.form.selectedDate[0]);
        let endDate = new Date(this.form.selectedDate[1]);
        let cycleDays = this.form.cycleDays;
        let singleMoney = this.form.singleMoney;
        let forceCycle = this.form.forceCycle;

        let count = 0;
        let stock = 0.0;

        let currentDate = new Date(this.form.selectedDate[0]);
        let lastClose = 0;
        do {
          // 周期数增加
          count++;
          // 找到真正可以投放的时间和基点
          let trueDate = this.findDate(currentDate);
          let close = this.findItem(currentDate).close;
          // 买入
          stock += singleMoney / close;
          // 存储最后时间基点
          lastClose = close;

          // 强制按周期买入
          if (forceCycle) {
            currentDate = new Date(currentDate.getTime() + 3600 * 1000 * 24 * cycleDays);
          } else {
            currentDate = new Date(trueDate.getTime() + 3600 * 1000 * 24 * cycleDays);
          }


        } while (currentDate <= endDate);

        this.result = {
          // 期数
          count: count,
          // 每期投入
          singleMoney: singleMoney.toFixed(2),
          // 总投资
          inputMoney: (count * singleMoney).toFixed(2),
          // 最终收回
          outputMoney: (stock * lastClose).toFixed(2),
          // 收益率
          roi: (((stock * lastClose) / (count * singleMoney)) - 1).toFixed(4) * 100,
          lastClose: lastClose,

        };

        console.log(this.result);

        callback();


      },

      submitForm(formName) {
        let context = this;

        this.$refs[formName].validate((valid) => {
          if (valid) {
            context.buttonName = "计算中...";
            context.result = null;
            setTimeout(() => {
              context.compute(() => context.buttonName = "去计算");
            }, 10);

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      checkDate(rule, value, callback) {
        let context = this;
        if (!context.hasDate(new Date(value[0]))) {
          callback(new Error('开始时间不是开市时间'));
        } else if (!context.hasDate(new Date(value[1]))) {
          callback(new Error('结束时间不是开市时间'));
        } else {
          callback();
        }
      },

      hasDate(fuzzyDate) {
        let result = false;
        //console.log("入参日期", fuzzyDate);
        this.fundData.forEach(item => {
          let tmpDiff = Math.abs(new Date(item.date) - fuzzyDate);
          if (tmpDiff === 0) {
            // debugger;
            result = true;
          }
        });
        return result;
      },


      findDate(fuzzyDate) {
        let item = this.findItem(fuzzyDate);
        if (item != null) {
          return new Date(item.date);
        } else {
          return null;
        }
      },

      findItem(fuzzyDate) {
        let diff = Number.MAX_VALUE;
        let resultItem = null;
        this.fundData.forEach(item => {
          let tmpDiff = Math.abs(new Date(item.date) - fuzzyDate);
          if (tmpDiff <= diff) {
            diff = tmpDiff;
            resultItem = item;
          }
        });
        return resultItem;
      },

      init() {
        let context = this;

        let lastDate = new Date(this.fundData[this.fundData.length - 1].date);
        let y = lastDate.getFullYear();
        let m = lastDate.getMonth() + 1;
        let d = lastDate.getDate();
        this.messages = "数据截止" + y + "-" + m + "-" + d;

        this.form.selectedDate = [
          context.findDate(new Date(context.fundData[context.fundData.length - 1].date).getTime() - 3600 * 1000 * 24 * 365 * 3),
          new Date(context.fundData[context.fundData.length - 1].date)
        ];
        this.pickerOptions.shortcuts =
          [
            {
              text: '最近12个月',
              onClick(picker) {
                const end = new Date(context.fundData[context.fundData.length - 1].date);
                const start = new Date(end.getTime() - 3600 * 1000 * 24 * 365);
                start.setTime(context.findDate(start));
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近3年',
              onClick(picker) {
                const end = new Date(context.fundData[context.fundData.length - 1].date);
                const start = new Date(end.getTime() - 3600 * 1000 * 24 * 365 * 3);
                start.setTime(context.findDate(start));
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近5年',
              onClick(picker) {
                const end = new Date(context.fundData[context.fundData.length - 1].date);
                const start = new Date(end.getTime() - 3600 * 1000 * 24 * 365 * 5);
                start.setTime(context.findDate(start));
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '全部数据',
              onClick(picker) {
                const end = new Date(context.fundData[context.fundData.length - 1].date);
                const start = new Date(context.fundData[0].date);
                picker.$emit('pick', [start, end]);
              }
            },]

      }
    },
    created() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
