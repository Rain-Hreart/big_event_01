$(function () {
  // 自定义校验规则
  let form = layui.form;
  form.verify({
    nickname: function (value) {
      // console.log(value);
      if (value.length > 6) {
        return "昵称长度为1~6位之间!";
      }
    }
  });

  // 用户渲染
  initUserInfo();
  //导出layui
  let layer = layui.layer;
  // 封装函数
  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      data: {},
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 成功,后渲染
        form.val('formUserInfo', res.data);
      }
    })
  };

  // 重置
  // $('form').on('reset', function (e) {
  $('#btnReset').on('click', function (e) {
    e.preventDefault();
    //用上面的同用户渲染方法实现
    initUserInfo();
  })
  // })

  // 修改用户信息
  $('.layui-form').on('submit', function (e) {
    // 阻值浏览器默认行为,form表单的提交
    e.preventDefault();
    // 发送 ajax,修改用户信息
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('用户信息修改失败!')
        }
        layer.msg('恭喜您,用户信息修改成功!')
        // 调佣父页面中的更新用户信息和头像方法
        window.parent.getUserInof();
      }
    })
  })
})