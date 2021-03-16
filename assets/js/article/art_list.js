// 入口函数
$(function () {
  // 为art-template 定义时间过滤器
  template.defaults.imports.dateFormat = function (dtStr) {
    // console.log(dtStr);
    let dt = new Date(dtStr);

    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());

    return `${y}-${m}-${d}-${hh}:${mm}:${ss}`

  }
  // 在个位数的左侧填充 0
  function padZero(n) {
    return n > 9 ? n : '0' + n

  }

  // 1.定义查询参数
  let q = {
    pagenum: 1,	  //是	int	    页码值
    pagesize: 2,	//是	int	    每页显示多少条数据
    cate_id: "", //否	string	文章分类的 Id
    state: "",	    //否	string	文章的状态，可选值有：已发布、草稿
  }

  // 初始化文章列表
  let layer = layui.layer;
  initTable();
  // 封装初始化文章列表函数
  function initTable() {
    // 发送ajax获取文章列表数据
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      dataType: 'json',
      success: (res) => {
        // console.log(res);
        // 判断是否成功返回数据
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败!')
        }
        // 获取成功,渲染数据
        let htmlStr = template("tp-table", { data: res.data });
        $('tbody').html(htmlStr);
        // 调用分页
        renderPage(res.total)
      }
    })
  }

  // 3.初始化分类
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
      }
    })
  }

  // 筛选功能
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取
    let state = $('[name="state"]').val();
    let cate_id = $('[name="cate_id"]').val();
    // 赋值
    q.state = state;
    q.cate_id = cate_id;
    // 初始化文章列表
    initTable();
  });

  // 分页
  var laypage = layui.laypage;
  function renderPage(total) {
    // alert(total);
    //执行一个laypage实例
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页几条
      curr: q.pagenum, //第几页
      // 自定义排版
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
      limits: [2, 3, 5, 10],
      // 页面切换触发这个方法
      jump: function (obj, first) {
        console.log(obj);
        console.log(first);
        if (!first) {
          q.pagenum = obj.curr;
          // 重新渲染页面
          initTable();
        }
      }
    });
  };

  // 删除
  $('tbody').on('click', '.btn-delete', function () {
    // 4.2获取Id,发送ajax获取数据,渲染到页面
    let Id = $(this).attr('data-id');
    // 显示对话框
    layer.confirm('是否确认删除?', { icon: 3, title: '提示' },
      function (index) {
        $.ajax({
          type: 'GET',
          url: '/my/article/delete/' + Id,
          data: {},
          dataType: 'json',
          success: (res) => {
            // console.log(res);
            if (res.status !== 0) {
              return layer.msg(res.message)
            }
            // 添加成功后,重新渲染页面中的数据
            initTable();
            layer.msg('恭喜您,文章删除成功!');
            // 页面汇总删除按钮个数等于1,页码大于1;
            if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
            // 因为我们更新成功,重新渲染
            initTable();
          }
        })
        layer.close(index);
      });
  })
})