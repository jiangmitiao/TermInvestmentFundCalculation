// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'

import ECharts from 'vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue

// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

Vue.component('v-chart', ECharts);


import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)


Vue.use(ElementUI);

Vue.config.productionTip = false;



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});


//CNZZ
var cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
document.write(unescape("%3Cspan id='cnzz_stat_icon_1278592518'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "v1.cnzz.com/z_stat.php%3Fid%3D1278592518%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));

document.getElementById("cnzz_stat_icon_1278592518").hidden = true;
