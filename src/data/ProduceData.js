var axios = require("axios");
var md5 = require('md5');
var fs = require('fs');

function t(e) {
  var t = new Date(e),
    a = "" + (t.getMonth() + 1),
    n = "" + t.getDate(),
    i = t.getFullYear();
  return a.length < 2 && (a = "0" + a),
  n.length < 2 && (n = "0" + n),
    [i, a, n].join("-")
}

function getDateStr(e, days) {
  let lastDate = new Date((new Date(e)).getTime() + 1000 * 60 * 60 * 24 * days);
  return t(lastDate);
}

let process = function (data) {
  let result = [];
  data.forEach(item => {
    result.push({
      date: getDateStr(item.date, 1),
      close: item.close
    });
  })
  return JSON.stringify(result);
};

function hushen300() {
  var r = md5(t(new Date));
  var url = "https://legulegu.com/stockdata/market-ttm-lyr/get-data?token=" + r + "&marketId=000300.XSHG";
  axios.get(url)
    .then(resp => {
      fs.writeFile('static/hushen300.json', process(resp.data), function (error) {
        if (error) {
          console.error('沪深300数据写入失败', error);
        } else {
          console.log('沪深300数据写入成功');
        }
      })
    })
    .catch(error => {
      console.error(error);
    })
}


function shangzheng50() {
  var r = md5(t(new Date));
  var url = "https://legulegu.com/stockdata/market-ttm-lyr/get-data?token=" + r + "&marketId=000016.XSHG";
  axios.get(url)
    .then(resp => {
      fs.writeFile('static/shangzheng50.json', process(resp.data), function (error) {
        if (error) {
          console.error('上证50数据写入失败', error);
        } else {
          console.log('上证50数据写入成功');
        }
      })
    })
    .catch(error => {
      console.error(error);
    })
}

shangzheng50();
hushen300();
