$(function () {
  // 1.文章类别列表展示
  initArtCateList();
  // 封装函数
  function initArtCateList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      data: {},
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        let htmlStr = template('tpl-art-cate', { data: res.data });
        $('tbody').html(htmlStr);
      }
    })
  };

  // 2.显示添加文章分类列表
  let layer = layui.layer;
  $('#btnAdd').click(function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '在线调试',
      content: $('#dialog-add').html(),
    });
  });

  // 3.提交文章分类添加(事件委托)
  let idexAdd = null;
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    // alert($(this).serialize())
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 添加成功后,重新渲染页面中的数据
        initArtCateList();
        layer.msg('恭喜您,文章添加成功')
        layer.close(indexAdd);
      }
    })
  });

  // 4.修改文章分类
  let indexEdit = null;
  let form = layui.form;
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    });
    // 4.2获取Id,发送ajax获取数据,渲染到页面
    let Id = $(this).attr('data-id');
    console.log(Id);
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + Id,
      data: {},
      dataType: 'json',
      success: (res) => {
        console.log(res);
        form.val('form-edit', res.data);
      }
    })
  });

  // 5.修改 - 提交
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    // alert($(this).serialize())
    $.ajax({
      type: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 添加成功后,重新渲染页面中的数据
        initArtCateList();
        layer.msg('恭喜您,文章类别更新成功')
        layer.close(indexEdit);
      }
    })
  });

  // 6.删除
  $('tbody').on('click', '.btn-delete', function () {
    // 4.2获取Id,发送ajax获取数据,渲染到页面
    let Id = $(this).attr('data-id');
    // 显示对话框
    layer.confirm('是否确认删除?', { icon: 3, title: '提示' },
      function (index) {
        $.ajax({
          type: 'GET',
          url: '/my/article/deletecate/' + Id,
          data: {},
          dataType: 'json',
          success: (res) => {
            // console.log(res);
            if (res.status !== 0) {
              return layer.msg(res.message)
            }
            // 添加成功后,重新渲染页面中的数据
            initArtCateList();
            layer.msg('恭喜您,文章类别删除成功!')
            layer.close(index);
          }
        })
      })
  });
})