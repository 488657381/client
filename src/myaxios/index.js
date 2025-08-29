import axios from 'axios'
import router from '../router'

//固定url前缀
axios.defaults.baseURL = 'http://localhost:8080/baseProj/';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么

  if(response.data.code == 10050){
    router.push("/login")
  }

  //如果不是 10050  让请求继续处理
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});



const myPost = (url,params)=>{
    return axios({
        method: 'post',
        url: url,
        data: params
      });

} 

const myGet = (url,params)=>{
    return axios({
        method: 'post',
        url: url,
        params: params
      });
} 


export {myGet,myPost}