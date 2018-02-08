

exports.init = function () {
    var a = require('../../widget/designbar/designbar');
    var node=require('./components-design');
    //需要预先加载的元素
    //先加载工作区
    //0.1 工作区
    a.workspace();
    a.image_iframe();//设置下一个响应式图片框架的iframe的属性
    a.react();//设计动作反射区
    a.media_size(0);//内容加载完毕后，可以加载尺寸设置

    a.mouse_event();//加载鼠标事件
    
    a.hide_topbar();//隐藏顶部工具栏
    a.menuIconMouseEnterTip();//鼠标悬停在菜单图标上，提示信息
    a.iframeclick();//点击框架，隐藏bar工具栏

    a.resize_workspace();//调整工作区的宽度
    a.media_toggle();//媒体类型切换,宽度初始化
    a.leftmenu_click();

    a.mouse_scroll_resizehint();//鼠标滚动页面
    a.node_outline_icon_mouse();//辅助元素的点击操作
    


    
    a.iframe_active();//激活框架的鼠标事件的辅助工具，需要最后加载
    a.bottom_breadcrumb_mouse();//底部元素节点的鼠标效果
    //加载完毕后，可以加载左侧菜单的draggable操作
    //a.leftbar_ele_draggable();
}


//滚动条
exports.scrollbar = function () {
    $('.scrollbody,.scrollbody2').livequery(function(){
        $(this).mCustomScrollbar();
    });
}




exports.scrollbar();


//初始化内容
var ELianDesigner=function(){
    "use strict";
    var a = {},
        b = $(), 
        c = $(),
        d = $(), 
        e = $(),
        f = $(),
        g = $();
    
    return a.initialize=function(){
        b = $(window),
        c = $("html"),
        d = $("body"),
        e = $("#workspace"),
        f = $("#site-iframe-next"),
        g = $("#responsive-images-iframe"),
        c.addClass("wf-doc wf-active avoid-right-sidebar avoid-left-sidebar avoid-top-bar avoid-bottom-bar");
        d.addClass('wf-control');
        exports.init();
    },a
}();

//jquery 初始化
$(function(){
   "use strict";
    ELianDesigner.initialize();
})