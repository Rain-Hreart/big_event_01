// window.onload 外部的文件和图片音频视频...全部加载完毕在执行
$(window).on('load', function () {
  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $('#image')
  // 1.2 配置选项
  let options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 2.选择上传文件
  $('#btnChooseImage').on('click', function () {
    $('#file').click();
  });
  // 3.选择图片后,修改裁剪区域  为文件选择框绑定 change 事件 
  let layer = layui.layer;
  $('#file').on('change', function (e) {
    // // 获取用户选择的文件
    // var filelist = e.target.files;
    // if (filelist.length === 0) {
    //   return layer.msg('请选择照片！')
    // }

    // 1. 拿到用户选择的文件
    // e.target 如果此事件为冒泡执行,e.target 
    var file = e.target.files[0]

    // 前端非空校验
    if (file === undefined) {
      return layer.msg('请选择照片！')
    }
    // 2. 将文件，转化为路径
    // 根据文件产生一个内存模拟地址
    var imgURL = URL.createObjectURL(file)
    // 3. 重新初始化裁剪区域
    // 小会员有图片,设置新路径,重新渲染
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  });

  // 4.上传头像
  $('#btnUpload').on('click', function () {
    // 获取 base64 类型的头像(字符串)
    var dataURL = $image
      .cropper('getCroppedCanvas', { //创建一个Canvas
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')  //将 Canvas 画布上的内容 转换为base64 类型string(字符串)
    // console.log(dataURL);
    // console.log(typeof dataURL);  //string 字符串
    // 发送ajax
    $.ajax({
      type: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      dataType: 'json',
      success: (res) => {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('恭喜您,更换头像成功!');
        window.parent.getUserInof();
      }
    })
  })
});
// document.onDOMContentLoaded: 只要DOM树加载完毕就可以了,不一定要选用染到页面
// $(function () {

// })