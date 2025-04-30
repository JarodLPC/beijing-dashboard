import axios from "axios";

//第一步创建axios实例（其它配置：基础路径，超时处理）
let request = axios.create({
    // baseURL: 'http://192.168.3.99/eitapi/business/v3/l/plants/1/lines/65',
    // baseURL: 'http://192.168.3.99/eitapi/business/v3/l/plants/1/lines/65/equipments/1405/formulas/Eit',
    baseURL: 'http://172.30.1.201/eitapi/business/v3/l/plants/1/lines/1',
    timeout: 60000,
    headers: { Authorization: 'Bearer ' + 'testtesttest' }
});

//第二步，request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
    //config配置对象，headers属性请求头，经常给服务器端携带公共参数
    //返回配置对象

    return config;
}
);


//第三步：响应拦截器
request.interceptors.response.use((response) => {
    //服务器响应数据回来后，拦截器可以检测到，做统一处理
    //简化数据
    return response.data;
}, (error) => {
    //失败回调：处理httpw网络错误
    //定义一个变量：存储网络错误信息
    let msg = '';
    switch (error.status) {
        case 400:
            msg = '请求参数错误';
            break;
        case 401:
            msg = '未授权访问,token过期';
            break;
        case 403:
            msg = '拒绝访问，无权访问';
            break;
        case 404:
            msg = '请求地址不存在';
            break;
        case 500:
            msg = '服务器端错误';
            break;
        default:
            msg = '网络错误';
            break;
    }
    // ElMessage({type:'error',message:msg})
    console.log('error:' + msg)
    return Promise.reject(error);
});
//对外暴漏
export default request;