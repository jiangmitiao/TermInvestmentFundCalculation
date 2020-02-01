import axios from "axios";

const DataProxy = {};

DataProxy.getHuShen300 = function (successCallback, errorCallback) {

  axios.get('../../static/hushen300.json')
    .then(function (response) {
      successCallback(response.data);
    })
    .catch(function (error) {
      console.error(error);
      errorCallback(error);
    });
};


DataProxy.getShangZheng50 = function (successCallback, errorCallback) {

  axios.get('../../static/shangzheng50.json')
    .then(function (response) {
      successCallback(response.data);
    })
    .catch(function (error) {
      console.error(error);
      errorCallback(error);
    });
};


export default DataProxy;
