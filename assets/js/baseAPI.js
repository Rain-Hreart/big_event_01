// 1.开发环境服务器地址:
let baseURL = "http://api-breakingnews-web.itheima.net";
// 2.测试环境服务器地址:
// let baseURL = "http://api-breakingnews-web.itheima.net";
// 1.生产环境服务器地址:
// let baseURL = "http://api-breakingnews-web.itheima.net";

// 拦截所有ajax请求: $.get()/$.post()/$.ajax();
// 处理参数
$.ajaxPrefilter(function (options) {
  //如果是index.html页面,不需要添加前缀
  if (options.url === 'http://127.0.0.1:5500/index.html') {
    return;
  }
  // console.log(options);
  // 拼接对应环境的服务器地址
  options.url = baseURL + options.url;

  // 身份认证
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('mytoken') || ''
    }
  }

  //拦截所有响应,判断身份认证信息
  options.complete = function (res) {
    // console.log(res);
    // console.log(res.responseJSON);
    let obj = res.responseJSON;
    if (obj.status == 1 && obj.message == '身份认证失败！') {
      // 清空本地mytoken
      localStorage.removeItem('mytoken');
      // 页面跳转
      location.href = '/login.html';
    }
  }
})