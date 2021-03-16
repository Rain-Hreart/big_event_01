//入口函数
$(function () {
  // 0.设置表单信息
  // 用的呢刚好切割,然后使用后面的值
  // alert(location.search.split('=')[1]);
  function initForm() {
    let id = location.search.split('=')[1];
    $.ajax({
      type: 'GET',
      url: '/my/article/' + id,
      data: {},
      dataType: 'json',
      success: (res) => {
        //失败判断
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        //渲染到form表单中
        form.val('form-edit', res.data);
        // ***.tinymce赋值(百度)
        tinyMCE.activeEditor.setContent(res.data.content);
        //***.图片
        if (!res.data.cover_img) {
          return layer.msg('用户未曾上传头像!');
        };
        let newImageURL = baseURL + res.data.cover_img;
        // 为裁剪区域重新设置图片
        $image.cropper('destroy') // 销毁旧的裁剪区域
          .attr('src', newImageURL) // 重新设置图片路径
          .cropper(options) // 重新初始化裁剪区域
      }
    })
  }

  // 1.初始化分类
  let layer = layui.layer;
  let form = layui.form;
  initCate();
  // 封装函数
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        // 校验
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 赋值,渲染
        let htmlStr = template('tpl-cate', { list: res.data });
        $('[name="cate_id"]').html(htmlStr);
        // 特殊的需要重新渲染
        form.render();
        // 文章分类渲染完毕在调用,初始化form的方法
        initForm();
      }
    })
  }
  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 4.点击按钮,选择图片
  $("#btnChooseImage").on('click', function () {
    $('#coverFile').click();
  });

  // 5.设置图片
  $('#coverFile').change(function (e) {
    //拿到用户选择的文件
    let file = e.target.files[0];
    // 非空校验 URL.createObjectURL()  参数undefined
    if (file == undefined) {
      return;
    }
    // 根据选择的文件,创建一个对应的URL 地址
    let newImageURL = URL.createObjectURL(file);
    // 为裁剪区域重新设置图片
    $image.cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImageURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  });

  // 6.设置状态
  let state = "已发布";
  // $('#btnSave1').on('click', function () {
  //   state = "已发布";
  // })
  $('#btnSave2').on('click', function () {
    state = "草稿";
  });

  // 7.添加文章
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    // 创建FormData对象,收集数据
    let fd = new FormData(this);
    // 放入状态
    fd.append('state', state);
    // 放入图片
    $image.cropper('getCroppedCanvas', {  //创建一个画布
      with: 400,
      height: 280
    })
      // 将Canvas 画布上的内容,转化为文件对象
      .toBlob(function (blob) {
        // 得到文件对象后,进行后续的操作
        fd.append('cover_img', blob);
        // 发送 ajax,要在toBlob()函数里面
        publishArticle(fd);
        console.log(...fd);
        // fd.forEach(function(value,key){
        // console.log(key, vakue);
        // })
      })
  })

  // 封装,添加文章的方法
  function publishArticle(fd) {
    $.ajax({
      type: 'POST',
      url: '/my/article/edit',
      data: fd,
      // FormData类型数据ajax提交,需要设置两个false
      contentType: false,
      processData: false,
      // dataType: 'json',
      success: (res) => {
        console.log(res);
        // 失败判断
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('恭喜您,修改文章成功!');
        // 跳转
        // location.href = "/article/art_list.html"
        setTimeout(function () {
          window.parent.document.getElementById('art_list').click();
        }, 1500)
      }
    })
  }
})