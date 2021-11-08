$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
    }

    //定义补0的函数
    function padZero(n) {
        return  n > 9 ? n : '0' + n;
    }

    //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum:1,   //页码值，默认第一页
        pagesize:2,  //每页显示几条，默认两条
        cate_id:'',  //	文章分类的 Id
        state:''     //文章的状态，可选值有：已发布、草稿
    }

    initTable();
    initCate();

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                //使用模版引擎渲染页面的数据
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }


    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                //调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-cate',res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                //通知layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit',function (e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件重新渲染表格数据
        initTable();
    })


    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render方法来渲染分页的结构
        laypage.render({
            elem:'pageBox',  //分页容器的id
            count:total,     //总数据条数
            limit:q.pagesize,   //每页显示几条数据
            curr:q.pagenum,    //指定默认选中哪页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            //分页发生切换的时候，触发jump回调
            //触发jump回调的方式有两种：1.点击页码的时候触发   2.只要调用了laypage.render方法
            jump:function (obj,first) {
                //可以通过first的值来判断是通过哪种方式触发的jump回调  first为true证明是方式2触发的，反之是方式1
                console.log(first);
                console.log(obj.curr);
                //把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                //把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                //根据最新的q获取对应的数据列表并渲染表格，这样直接调用会发生死循环
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        })
    }


    //通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn-delete',function () {
        //1.获取删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(len);
        //获取文章的id
        var id = $(this).attr('data-id')
        // console.log('ok');
        //询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    //当数据删除完成后，需要判断当前这一夜中是否还有剩余的数据，如果没有剩余的数据了，就让页码值-1之后，再重新调用initTable方法
                    if (len === 1) {
                        //如果len等于1，证明删除完当前页面就没有数据了，就让页码值-1
                        //页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? q.pagenum - 1 : 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })
})