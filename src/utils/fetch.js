import axios from "axios";
import vue from "vue";
// import router from '../router';

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 5000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    response => response,
    error => {
        console.log("err" + error);// for debug
        vue.prototype.$Message.error("网络异常");
        return Promise.reject(error);
    }
)

export default service;

export function post(url, param, callback) {
    service.post(url, param)
        .then(function (response) {
                console.log();
                if (response.status == 200) {
                    if (response.data.success) {
                        // vue.prototype.$Message.success(response.data.message);
                        callback(response.data);
                    } else {
                        vue.prototype.$Message.error(response.data.message);
                    }
                }
                else {
                    vue.prototype.$Message.error("请求失败");
                }
            }
        );
}

