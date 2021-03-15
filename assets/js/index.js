// 入口函数
$(function () {
  // 1.获取用户信息
  getUserInof();

  // 退出登录
  let layer = layui.layer;
  $('#btnLogout').on('click', function () {
    // 框架提供的询问框
    layer.confirm('是否确定退出', { icon: 3, title: '提示' }, function (index) {
      //do something   
      //1.清空本地token
      localStorage.removeItem('mytoken');
      // 页面跳转
      location.href = '/login.html';
      // 关闭询问框
      layer.close(index);
    });
  })
});

// 获取用户信息(封装到入口函数的外面)
// 原因: 后面其他的页面要调用
function getUserInof() {
  // 发送ajax
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    // 配置头信息,设置mytoken,身份识别认证
    // headers: {
    //   // 重新登录:因为mytoken过期事件12小时
    //   Authorization: localStorage.getItem('mytoken') || ''
    // },
    dataType: 'json',
    success: (res) => {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg(res.message, { icon: 5 });
      }
      // 请求成功,渲染头像
      renderAvatar(res.data);
    },

    // // 拦截所有响应,判断身份认证信息
    // complete: function (res) {
    //   let obj = res.responseJSON;
    //   if (obj.status == 1 && obj.message == '身份认证失败！') {
    //     // 清空本地mytoken
    //     localStorage.removeItem('mytoken');
    //     // 页面跳转
    //     location.href = '/login.html';
    //   }
    // }
  });
}

// 头像和文字渲染封装
function renderAvatar(user) {
  // console.log(user);
  // console.log(user.nickname);
  // 1.渲染用户名,如果有昵称以昵称为准
  let name = user.nickname || user.username;
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  // 2.渲染头像,渲染文字头像
  if (user.user_pic == null) {
    // 隐藏图片头像,渲染文字头像
    $('.layui-nav-img').hide();
    $('.text-avatar').show().html(name[0].toUpperCase());
  } else {
    // 渲染图片头像,隐藏文字头像
    $('.layui-nav-img').show().attr('src', user.user_pic);
    $('.text-avatar').hide();
  }
}