$(function () {
  // 点击去注册账号,隐藏登录模块,显示注册模块
  $('#link_reg').click(function () {
    // 登录模块隐藏
    $('.login-box').hide();
    // 注册模块显示
    $('.reg-box').show();
  });
  // 点击去登录,隐藏注册模块,显示登录模块
  $('#link_login').click(function () {
    // 注册模块隐藏
    $('.reg-box').hide();
    // 登录模块显示
    $('.login-box').show();
  });

  // 自定义验证规则
  // 导入form表单
  // console.log(layui);//form: u {config: {…}}
  let form = layui.form;
  // verify()的参数是一个对象
  form.verify({
    // 属性是效验规则名称,值是函数或者数组
    // 密码规则
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    // 确认密码规则
    repwd: function (value) {
      // console.log(value);
      // 选择器必须带空格,选择的是后代中的input ,name属性值为password的那一个标签
      let pwd = $('.reg-box input[name=password]').val();
      // console.log(pwd);
      //比较
      if (value !== pwd) {
        return "两次密码输入不一样!";
      }
    }
  });

  // 需求3: 注册功能
  let layer = layui.layer;
  console.log(layer);
  $('#form_reg').on('submit', function (e) {
    // 阻止表单默认提交
    e.preventDefault();
    // 发送ajax
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: {
        username: $('.reg-box input[name=username]').val(),
        password: $('.reg-box input[name=password]').val(),
      },
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        // 注册失败提示
        if (res.status !== 0) {
          // return alert(res.message);
          return layer.msg(res.message, { icon: 5 });
        }
        // 注册成功提示
        // alert('恭喜你,用户名注册成功');
        layer.msg('恭喜你,用户名注册成功', { icon: 6 });
        // 切换会登陆模块
        $('#link_login').click();
        // 表单清空
        $('#form_reg')[0].reset();
      }
    });
  });

  // 需求4: 登录功能 (给form标签绑定事件,button按钮触发提交事件)
  $('#form_login').submit(function (e) {
    // 阻止表单默认提交
    e.preventDefault();
    // 发送ajax
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        console.log(res);
        // 校验返回状态
        if (res.status !== 0) {
          // return alert(res.message);
          return layer.msg(res.message, { icon: 5 });
        }
        // 提示信息,保存token,跳转页面
        layer.msg('登录成功', { icon: 6 });
        // 跳转页面
        location.href = "/index.html";
        // 保存token,未来的接口要使用token.
        localStorage.setItem('mytoken', res.token);
      }
    });
  });
});