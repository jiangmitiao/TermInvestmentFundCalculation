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
        <p>定投期数:<span v-text="result.cycleCount"></span></p>
        <p>每期金额:<span v-text="result.singleMoney"></span></p>
        <p>总投入:<span v-text="result.inputMoney"></span></p>
        <p>总回报:<span v-text="result.outputMoney"></span></p>
        <p>收益率:<span v-text="result.roi"></span>%</p>
      </el-col>

      <el-col :span="24">
        <v-chart :options="polar"/>
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
      // 名称
      title: "",
      // 指数数据
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
        // 时间选择器选项, 和指数数据有关
        pickerOptions: {
          shortcuts: []
        },
        // 用户选择的数据
        form: {
          // 日期范围选择
          selectedDate: [],
          // 定投周期
          cycleDays: 7,
          // 每期投入金额
          singleMoney: 100.0,
          // 强制按周期投放
          forceCycle: true
        },
        // 用户填充表单验证
        rules: {
          selectedDate: [
            {required: true, message: '请选择日期', trigger: 'blur'},
            {validator: this.checkDate, trigger: 'blur'},
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

        buttonName: "去计算",

        // 缓存
        fundDataMap: new Map(),
        // 折线图
        polar: {
          title: {
            text: '折线图堆叠',
            show: true
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          legend: {
            data: ['指数', '收益率'],
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: [
            {
              type: 'value',
              // y轴数据,根据数据的最大最小之进行计算
              scale: true
            },
            {
              type: 'value',
              // y轴数据,根据数据的最大最小之进行计算
              scale: true,
              axisLabel : {
                show : true,
                interval : 'auto',
                formatter : '{value} %'
              },
            }
          ],
          series: []
        }

      }
    },
    methods: {

      compute(callback) {
        let startDate = this.form.selectedDate[0];
        let endDate = this.form.selectedDate[1];
        let cycleDays = this.form.cycleDays;
        let singleMoney = this.form.singleMoney;
        let forceCycle = this.form.forceCycle;

        // 定投期数
        let cycleCount = 0;
        // 股票份额
        let stockShare = 0.0;

        // 理论投放日期, 从用户选择的日期开始算
        let runDate = this.form.selectedDate[0];
        // 理论投放日期的收盘价
        let lastClose = 0.0;
        // 实际投放日期列表
        let runDateList = [];
        // 实际投放收盘价
        let runCloseList = [];
        // 收益率
        let runRoiList = [];
        // 计算日志
        let calcLog = "";
        do {
          // 周期数增加
          cycleCount++;
          // 找到真正可以投放的时间和收盘价
          let trueRunDate = this.findItem(runDate).date;
          let close = this.findItem(trueRunDate).close;
          // 计算持有份额
          stockShare += singleMoney / close;
          // 存储最后收盘价
          lastClose = close;

          if (forceCycle) {
            // 强制按周期买入后，下一次投放日期按理论投放日期滚动
            runDate = this.getDateStr(new Date(runDate), cycleDays);
          } else {
            // 不强制的话，按照真实投放，这样周期数会减少
            runDate = this.getDateStr(new Date(trueRunDate), cycleDays);
          }

          // 记录投放日志
          calcLog +=
            "投放时间:" + trueRunDate
            + ", 指数值:" + close
            + ", 买入份数:" + (singleMoney / close).toFixed(2)
            + ", 总持有份数" + stockShare.toFixed(2)
            + "\n";
          // 记录投放天数
          runDateList.push(trueRunDate);
          runCloseList.push(lastClose);
          let input = cycleCount * singleMoney;
          let output = stockShare * lastClose;
          runRoiList.push(((output-input)*100/input).toFixed(2));

        } while (new Date(runDate).getTime() <= new Date(endDate).getTime());

        this.result = {
          // 期数
          cycleCount: cycleCount,
          // 每期投入
          singleMoney: singleMoney.toFixed(2),
          // 总投资
          inputMoney: (cycleCount * singleMoney).toFixed(2),
          // 最终收回
          outputMoney: (stockShare * lastClose).toFixed(2),
          lastClose: lastClose,
          runDateList: runDateList,
          calcLog: calcLog

        };
        // 收益率
        this.result.roi = ((this.result.outputMoney - this.result.inputMoney) * 100 / this.result.inputMoney).toFixed(2);
        this.polar.xAxis.data = runDateList;
        this.polar.series = [
          {
            yAxisIndex: 0,
            data: runCloseList,
            type: 'line',
            smooth: true,
            name: "指数"
          },
          {
            yAxisIndex: 1,
            data: runRoiList,
            type: 'line',
            smooth: true,
            name: "收益率",
          }
        ];
        //console.log(this.result);

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
        if (!context.hasDate(value[0])) {
          //debugger
          callback(new Error('开始时间不是开市时间'));
        } else if (!context.hasDate(value[1])) {
          callback(new Error('结束时间不是开市时间'));
        } else {
          callback();
        }
      },

      hasDate(fuzzyDate) {
        if (this.fundDataMap.has(fuzzyDate)) {
          //console.log("从缓存中找到", fuzzyDate);
          return true;
        } else {
          return false;
        }
      },


      findDate(fuzzyDate) {
        let item = this.findItem(fuzzyDate);
        if (item != null) {
          return item.date;
        } else {
          return null;
        }
      },

      findItem(fuzzyDate) {

        //debugger
        if (this.fundDataMap.has(fuzzyDate)) {
          //console.log("从缓存中找到", fuzzyDate);
          return this.fundDataMap.get(fuzzyDate);
        }

        let diff = Number.MAX_VALUE;
        let resultItem = null;
        this.fundData.forEach(item => {
          let tmpDiff = Math.abs(new Date(item.date) - new Date(fuzzyDate));
          if (tmpDiff <= diff) {
            diff = tmpDiff;
            resultItem = item;
          }
        });
        return resultItem;
      },

      getLastDateStr() {
        let lastDate = new Date(this.fundData[this.fundData.length - 1].date);
        return this.getDateStr(lastDate, 0)
      },

      getDateStr(date, days) {
        let lastDate = new Date((new Date(date)).getTime() + 1000 * 60 * 60 * 24 * days);
        let y = lastDate.getFullYear();
        let m = lastDate.getMonth() + 1;
        let d = lastDate.getDate();
        return y + "-" + m + "-" + d;
      },


      getOldFundDate(days) {
        if (this.fundData.length === 0) {
          return null;
        }
        let times = 3600 * 1000 * 24 * days;
        let oldDate = new Date(this.fundData[this.fundData.length - 1].date) - times;
        return this.findDate(oldDate);
      },

      init() {

        if (this.fundData.length === 0){
          return;
        }

        let context = this;
        context.fundDataMap = new Map();
        this.fundData.forEach(item => {
          context.fundDataMap.set(item.date, item);
        });
        this.messages = "数据截止" + this.getLastDateStr();

        this.form.selectedDate = [this.getOldFundDate(365 * 3), this.getOldFundDate(0)];
        this.pickerOptions.shortcuts =
          [
            {
              text: '最近12个月',
              onClick(picker) {
                picker.$emit('pick', [
                  context.getOldFundDate(365),
                  context.getOldFundDate(0)
                ]);
              }
            },
            {
              text: '最近3年',
              onClick(picker) {
                picker.$emit('pick', [
                  context.getOldFundDate(365 * 3),
                  context.getOldFundDate(0)
                ]);
              }
            },
            {
              text: '最近5年',
              onClick(picker) {
                picker.$emit('pick', [
                  context.getOldFundDate(365 * 5),
                  context.getOldFundDate(0)
                ]);
              }
            },
            {
              text: '全部数据',
              onClick(picker) {
                const end = context.getOldFundDate(0);
                const start = context.fundData[0].date;
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

<style>
  .echarts {
    width: 100% !important;
    height: 400px !important;
  }
</style>
