/**
 * workspace节点加载
 */
exports.workspace = function () {
    var t = require('designnode');
    t.tools();//工作区工具
    exports.create_iframe();
    exports.iframe_init(1, 1);//传入siteid,pageid
}

/**
 * 加载反射区的内容
 * 第一个是工具栏，第二个是鼠标事件的内容
 */
exports.react = function () {
    $('<div id="toolbox"></div>').appendTo($("#designer-app-react-mount"));
    $('<div id="reactbox"></div>').appendTo($("#designer-app-react-mount"));
    var t = require('designnode');
    var tb = $('#toolbox');
    tb.append(t.svg_icon());//第一个，svg集合，用途暂不明
    tb.append(t.topbar());//顶部工具栏
    $('.bem-TopBar_Body_Group-left').after(t.topbarMediaes());//顶部中间的媒体切换按钮
    exports.topbar_right_btn(1);//顶部工具栏右侧的按钮集合
    tb.append(exports.logo_node(1));//左侧最上面的logo节点
    exports.leftbar(1);//左侧工具栏
    exports.rightbar(1);//右侧工具栏
    tb.append('<div class="bem-LeftSidebarPanels visible"></div>');//为左侧二级页面预留
    exports.bottombar(1);//底部工具栏
    tb.append('<div class="bem-ConfirmWrapper"></div>');
    tb.append('<div class="bem-Fade"></div>');
    tb.append('<div class="bem-NotificationList bem-NotificationList-inWorkspace bem-NotificationList-scrollBarEnabled"></div>');

    //reactbox加载的内容
    var rb = $('#reactbox');
    rb.css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        zIndex: 9999,
        color: 'rgb(217, 217, 217)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        lineHeight: '16px',
        '-webkit-font-smoothing': 'antialiased',
    });
    //rb里面的默认节点是空div标签，暂不添加
}

/**
 * 鼠标事件
 */
exports.mouse_event = function () {
    exports.logo_click();//logo点击事件
    exports.eye_toggle();//预览和编辑的切换
}
/**
 * logo点击事件，鼠标离开事件
 */
exports.logo_click = function () {
    $('.bem-DesignerLogo').livequery(function () {
        $(this).click(function () {
            $(this).addClass('bem-DesignerLogo-isOpen');
            var t = require('designnode');
            $('#reactbox').append(t.logoMenu());
        });
    });
    //鼠标离开，销毁菜单
    $('.bem-PopoverMenu').livequery(function () {
        $(this).mouseleave(function () {
            $(this).animate({ width: 0, height: 0 }, 'slow', function () {
                $(this).parent().remove();
                $('.bem-DesignerLogo').removeClass('bem-DesignerLogo-isOpen');
            });
        })
    })
}


/**
 * 响应式图片框架
 */
exports.image_iframe = function () {
    $('#responsive-images-iframe').width(240);
    //框架里面的更多内容暂空..............
}

/**
 * 创建iframe框架，尺寸，在在加载完毕后最后根据浏览器宽度统一设置
 */
exports.create_iframe = function () {
    $('<iframe id="site-iframe-next"></iframe>').css({
        display: 'inline',
        minHeight: '100%',
        maxHeight: '100%',
        border: 0,
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        pointerEvents: 'auto'
    }).appendTo($('#site-iframe-next-container'));
}

//眼睛图标的点击操作，切换页面的预览方式
exports.eye_toggle = function () {
    $('.bem-TopBar_Body_PreviewButton').click(function () {
        if ($(this).is('.bem-TopBar_Body_PreviewButton-active')) {
            //进入编辑模式
            $(this).removeClass('bem-TopBar_Body_PreviewButton-active');
            exports.logo_node(1);//显示logo
            exports.topbar_right_btn(1);//显示顶部右侧的按钮组
            exports.media_size(0);//重新设置工作区宽度
            exports.leftbar(1);//加载左侧菜单
            exports.rightbar(1);//加载右侧的菜单
            exports.bottombar(1);//加载底部菜单
            exports.iframe_enable(1);//iframe添加class,iframe可以操作
            exports.topbar_autohide_btn(0);//删除自动按钮
            $('.bem-NotificationList').addClass('bem-NotificationList-inWorkspace');
        } else {
            ////激活眼睛图标,进入浏览模式,隐藏一切辅助工具
            $(this).addClass('bem-TopBar_Body_PreviewButton-active');
            exports.logo_node(0);//隐藏logo
            exports.topbar_right_btn(0);//隐藏顶部右侧的按钮组
            exports.leftbar(0);//删除左侧菜单
            exports.rightbar(0);//删除右侧的菜单
            exports.bottombar(0);//删除底部菜单
            exports.media_size(1);//激活状态的宽度
            exports.iframe_enable(0);//iframe移除class
            exports.topbar_autohide_btn(1);//显示自动按钮
            $('.bem-NotificationList').removeClass('bem-NotificationList-inWorkspace');
            //移除辅助线
            $('.bem-OutlineSelectedNode,.bem-OutlineHoveredNode').remove();
        }
    });
}

//预先加载隐藏顶部菜单的按钮,点击眼睛图标切换下面的内容
exports.topbar_autohide_btn = function (status) {
    if (status == 1) {
        $('.bem-TopBar_Body_Group-left').prepend('<div class="bem-TopBar_Body_Button bem-TopBar_Body_HidePreviewButton"><svg width="12" height="14" viewBox="0 0 12 14" class="bem-Svg bem-TopBar_Body_HidePreviewButton_Icon  bem-TopBar_Body_Button_Icon" style="transform: translate(0px, 0px);"><path fill="currentColor" d="M1 12.995h10V11H1v1.995zM5 9h2V6h4L6 1 1 6h4v3z"></path></svg></div>');
    } else {
        $('.bem-TopBar_Body_HidePreviewButton').remove();
    }
}
//眼睛图标激活状态，点击隐藏顶部菜单的按钮，顶部菜单处于隐藏状态
exports.hide_topbar = function () {
    //隐藏顶部工具栏
    $('.bem-TopBar_Body_HidePreviewButton').livequery(function () {
        $(this).click(function () {
            $('.bem-TopBar_Body').slideUp();
            $('html').removeClass('avoid-top-bar');
        });
    });
    //显示顶部工具栏
    $('.bem-TopBar_Ribbon').livequery(function () {
        $(this).click(function () {
            $('.bem-TopBar_Body').slideDown();
            $('html').addClass('avoid-top-bar');
        })
    })
}

//logo元素节点
exports.logo_node = function (status) {
    if (status == 1) {
        var t = require('designnode');
        $('.bem-TopBar').after(t.logoNode());
    } else {
        $('.bem-DesignerLogo').remove();
    }

}


//顶部右侧的三个按钮
exports.topbar_right_btn = function (status) {
    if (status == 1) {
        var t = require('designnode');
        $('.bem-TopBar_Body_Group-right').prepend(t.topbarRight());
    } else {
        $('.bem-TopBar_Body_UndoRedo').remove();//撤销和重做
        $('.bem-TopBar_Body_SyncStatus').remove();//页面改变状态
        $('.bem-TopBar_Body_ExportButton').remove();//代码输出
    }
}

/**
 * 左侧工具栏的默认样式
 * @param {*1为加载，0为删除} status 
 */
exports.leftbar = function (status) {
    if (status == 1) {
        //顺序加载在logo后面
        var t = require('designnode');
        $('#toolbox').append(t.leftsideBar());
        $('html').addClass('avoid-left-sidebar');//顶部html添加class
        $('.bem-LeftSidebarPanels').addClass('visible');
    } else {
        $('.left-sidebar').remove();//整个移除
        $('html').removeClass('avoid-left-sidebar');
        $('.bem-LeftSidebarPanels').removeClass('visible');
    }
}

/**
 * 右侧工具栏的初始代码
 * @param {*1为加载，0为删除} status 
 */
exports.rightbar = function (status) {
    if (status == 1) {
        //添加到左侧菜单的后面
        var t = require('designnode');
        $('#toolbox').append(t.rightsideBar());
        $('html').addClass('avoid-right-sidebar');
    } else {
        $('.right-sidebar').remove();
        $('html').removeClass('avoid-right-sidebar');
    }
}

//底部菜单节点
exports.bottombar = function (status) {
    if (status == 1) {
        var bottomNode = '<div class="bem-BottomBar"><div class="bem-BottomBar_Main"><div class="bem-BottomBar_Placeholder">没有选择元素</div><div class="bem-Breadcrumbs"><div class="bem-Breadcrumbs_Container"></div></div><div class="bem-BottomBar_RealtimeSiteViewers"><div class="bem-ProfilePictures" style="display: flex; padding-left: 6.6px; opacity: 0.1;"></div></div></div></div>';
        if (!$(".bem-BottomBar").length) {
            $('#toolbox').append(bottomNode);
            $('html').addClass('avoid-bottom-bar');
        }
    } else {
        $('.bem-BottomBar').remove();
        $('html').removeClass('avoid-bottom-bar');
    }
}

//销毁二级页面
exports.delete_submenu = function () {
    $('.bem-Panel').remove();
    $('.left-sidebar-links .top').removeClass('active');
    $('.left-sidebar-links .tutorials').removeClass('active');
    //用途暂不明
    var def = '<div><div style="position: absolute; pointer-events: none; overflow: hidden; left: 35px; top: 35px; width: 1645px; height: 208px;"></div></div><div><div style="position: absolute; pointer-events: none; overflow: hidden; left: 35px; top: 35px; width: 1645px; height: 208px;"></div></div>';
    $('#reactbox').append(def);
}

//创建二级栏目，根据点击的按钮类型传递不同的参数menutype
exports.create_submenu = function (menutype) {
    $('#reactbox').html('');
    var t = require('designnode');
    if (menutype == 'pages') {
        $('.chrome-pages').parent().addClass('active');
        var sub = t.leftsideBar_pages();
    } else if (menutype == 'add') {
        $('.chrome-add').parent().addClass('active');
        var sub = t.leftsideBar_add();
    } else if (menutype == 'imgs') {
        $('.icon-imgs').addClass('active');
        var sub = t.leftsideBar_imgs();
    }
    $('.bem-LeftSidebarPanels').append(sub);

    exports.scrollbar_height();//加载滚动条的高度
    //这个容器内的元素都是绝对定位，因此需要手动设置外部容器的高度
    var items = $('.bem-AssetGrid_Item').length;
    $('.bem-LazyGrid .mCSB_container').height(items / 3 * 118);
}

//需要滚动条的区域的高度，需要根据窗口高度，手动控制
exports.scrollbar_height = function () {
    var newheight = $(".bem-Panel").height();
    $(window).resize(function () {
        newheight = $(".bem-Panel").height();
    });
    $('.scrollbody').height(newheight - 84);
    $('#assets-tab,.scrollbody2').height(newheight - 200);
}
//左侧一级菜单的点击操作
exports.leftmenu_click = function () {
    $(document).click(function (e) {
        //眼睛左边的页面按钮，左侧菜单的页面图标toggle操作
        //页面列表
        if ($(e.target).parents('.bem-TopBar_Body_ContextLens').length || $(e.target).is('.bem-TopBar_Body_ContextLens') || $(e.target).is('.chrome-pages')) {
            //二级菜单存在的情况下
            if (!$('.bem-Panel').length) {
                //创建容器
                exports.create_submenu('pages');
            } else {
                //二级菜单存在时候，判断二级菜单类型，相同就删除，不相同就替换
                if ($('#sub-pages').length) {
                    exports.delete_submenu();
                } else {
                    exports.delete_submenu();
                    exports.create_submenu('pages');
                }

            }
        } else if ($(e.target).is('.chrome-add')) {
            if (!$('.bem-Panel').length) {
                exports.create_submenu('add');
            } else {
                if ($('#sub-add').length) {
                    exports.delete_submenu();
                } else {
                    exports.delete_submenu();
                    exports.create_submenu('add');
                }

            }
        } else if ($(e.target).parents('.icon-imgs').length) {
            //图片素材
            if (!$('.bem-Panel').length) {
                exports.create_submenu('imgs');
            } else {
                if ($('#sub-imgs').length) {
                    exports.delete_submenu();
                } else {
                    exports.delete_submenu();
                    exports.create_submenu('imgs');
                }

            }
        } else if (!$(e.target).parents('.bem-Panel').length || $(e.target).parent('.bem-Pane_Close').length) {
            //点击在容器外部点击，或者点击关闭的按钮
            if ($('.bem-Panel').length) {
                exports.delete_submenu();
            }
        }
    });
    exports.show_edges();//显示元素边缘
    exports.hide_empty();//隐藏空元素
    exports.show_grid();//显示网格背景
}

//菜单元素的tip提示信息
exports.menuIconMouseEnterTip = function () {
    layui.use('layer', function () {
        var layer = layui.layer;
        $('.chrome-add').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('添加元素', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.chrome-pages').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('页面管理', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.icon-imgs').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('图片素材', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.icon-setings').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('系统设置', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.chrome-show-empty').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('隐藏空元素', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.exclaim').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('视频教程', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.chrome-show-xray').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('X射线模式', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.chrome-show-edges').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('显示元素边缘', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.chrome-show-grid').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('网格覆盖效果', $(this), {
                    tips: [4, '#3879c3'],
                    time: 1000
                });
            });
        });
        //4种媒体
        $('.media-pc').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('PC端', $(this), {
                    tips: [3, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.media-tablet').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('pad端', $(this), {
                    tips: [3, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.media-phone').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('手机横屏', $(this), {
                    tips: [3, '#3879c3'],
                    time: 1000
                });
            });
        });
        $('.media-phone2').livequery(function () {
            $(this).mouseover(function () {
                var index = layer.tips('手机竖屏', $(this), {
                    tips: [3, '#3879c3'],
                    time: 1000
                });
            });
        });
    });
}

//点击框架，隐藏工具栏
exports.iframeclick = function () {
    var IframeOnClick = {
        resolution: 200,
        iframes: [],
        interval: null,
        Iframe: function () {
            this.element = arguments[0];
            this.cb = arguments[1];
            this.hasTracked = false;
        },
        track: function (element, cb) {
            this.iframes.push(new this.Iframe(element, cb));
            if (!this.interval) {
                var _this = this;
                this.interval = setInterval(function () { _this.checkClick(); }, this.resolution);
            }
        },
        checkClick: function () {
            if (document.activeElement) {
                var activeElement = document.activeElement;
                for (var i in this.iframes) {
                    if (activeElement === this.iframes[i].element) { // user is in this Iframe  
                        if (this.iframes[i].hasTracked == false) {
                            this.iframes[i].cb.apply(window, []);
                            this.iframes[i].hasTracked = true;
                        }
                    } else {
                        this.iframes[i].hasTracked = false;
                    }
                }
            }
        }
    };
    IframeOnClick.track(document.getElementById("site-iframe-next"), function () {
        exports.delete_submenu();
    });
}

//显示元素边框
exports.show_edges = function () {
    $('.chrome-show-edges').livequery(function () {
        $(this).click(function () {
            $(this).parent().toggleClass('active');
        })
    })
}

//隐藏空元素，
//如果是激活状态，创建新元素时，执行此方法，即新的空元素是看不到的，只显示一个辅助工具
exports.hide_empty = function () {
    var son = $('#site-iframe-next').contents();
    $('.chrome-show-empty').livequery(function () {
        $(this).parent().click(function (e) {
            //为了避免隐藏空元素后，selected对齐不一致，此处删除selected辅助，删除clickmark标记
            $('.selected-outline').remove();
            son.find('.clickmark').removeClass('clickmark');
            
            //先判断，如果有，点击后去掉active,去掉wf-empty
            if ($(this).is('.active')) {
                $(this).removeClass('active');
                son.find('[data-w-id]').each(function () {
                    $(this).removeClass('wf-empty');
                    $(this).removeClass('wf-empty-block');
                });
            } else {
                $(this).addClass('active');
                var arr=['img','input'];
                //显示空元素，也是默认状态
                son.find('[data-w-id]').each(function () {
                    var ele=$(this).prop('tagName').toLowerCase();
                    if (($(this).html() == '') && ($.inArray(ele,arr)==-1)) {
                        $(this).addClass('wf-empty');
                    }
                    if(ele=='li'){
                        //除了li应该还有其他元素
                        $(this).addClass('wf-empty-block');
                    }
                });
            }
        });
    })
}

//显示工作区的背景网格
//2种类型的网格，根据class切换
exports.show_grid = function () {
    $('.chrome-show-grid').livequery(function () {
        $(this).click(function () {
            var t = require('designnode');
            var $parentNode = $(this).parent();
            if ($parentNode.is('.none')) {
                $parentNode.removeClass('none').addClass('basic');
                $('#toolA').append(t.grid1());
            } else if ($parentNode.is('.basic')) {
                $parentNode.removeClass('basic').addClass('filled');
                $('.grid-style1').remove();
                $('#toolA').append(t.grid2());
            } else if ($parentNode.is('.filled')) {
                $parentNode.removeClass('filled').addClass('none');
                $('.grid-style2').remove();
            }
        });
    })
}
//设置工作区的宽度极限
exports.check_workspace = function () {
    var s = $('.site-canvas');
    var max = parseInt(s.css('maxWidth'));
    var min = parseInt(s.css('minWidth'));
    var w = parseInt(s[0].style.width);
    //更新style里面的width的值
    if (w > max) {
        s[0].style.width = max + 'px';
    } else if (w < min) {
        s[0].style.width = min + 'px';
    }
}
exports.set_ruler = function (status) {
    var bb = $('.bem-BottomBar');
    var def = '<div class="bem-BottomBar_Main"><div class="bem-BottomBar_Placeholder">没有选择元素</div><div class="bem-Breadcrumbs"><div class="bem-Breadcrumbs_Container"></div></div><div class="bem-BottomBar_RealtimeSiteViewers"><div class="bem-ProfilePictures" style="display: flex; padding-left: 6.6px; opacity: 0.1;"></div></div></div>';

    if (status == 1) {
        $('.bem-BottomBar_Main').remove();
        bb.append('<div class="rulerbox" id="rulerbox" onselectstart="return false;"><div id="ruleh" class="pageruler"></div></div>');
        bb.addClass('ruler-bar-visible');
        for (var i = 0; i < $(window).width(); i += 1) {
            if (i % 50 === 0) {
                $('<span class="n">' + i + '</span>').css("left", i + 2).appendTo($('#ruleh'));
            }
        }
        //弹出px提示
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.tips('<span>' + $('.site-canvas').width() + 'px</span>', $('.bem-BottomBar'), {
                tips: 1,
                skin: 'rulermsg',
                time: 50000
            });
        });
        //弹出layer的位置
        $('.rulermsg').css('left', (parseInt($('.site-canvas').offset().left) + $('.site-canvas').width() - 19));
    } else if (status == 0) {
        //主要用在鼠标弹起时，关闭标尺等内容
        bb.removeClass('ruler-bar-visible');
        $('#rulerbox').remove();
        bb.append(def);
        layer.close(layer.index);
    }
    //预览状态下的位置不一样
    if ($('.bem-TopBar_Body_PreviewButton-active').length) {
        //预览模式下的PC模式没有标尺
        $('#ruleh').css('left', $('.site-canvas').offset().left);
    } else {
        $('#ruleh').css('left', $('.site-canvas').offset().left - 35);
    }

}
exports.show_medias = function (status) {
    var site = $('.site-canvas').width();
    $('.showmedialist').remove();
    var node = $('.bem-BottomBar');
    if (status == 1) {
        if (site == 768 || site == 767) {
            node.append('<div class="showmedialist">' +
                '<span>Apple iPad mini 2,3</span>' +
                '<span>Apple iPad 1,2</span>' +
                '<span>Apple iPad 3,4,Air</span>' +
                '<span>Microsoft Surface</span>' +
                '<span>Apple iPad mini</span>' +
                '<span>HTC Nexus 9</span>' +
                '</div>');
        } else if (site == 800) {
            node.append('<div class="showmedialist">' +
                '<span>Amazon Kindle Fire HD 8.9</span>' +
                '<span>SumSung Nexus 10 1600</span>' +
                '<span>SumSung Galaxy Tab (8.9*)</span>' +
                '<span>SumSung Galaxy Tab 2 10*</span>' +
                '<span>SumSung Galaxy Tab 3 10*</span>' +
                '</div>');
        } else if (site == 480) {
            node.append('<div class="showmedialist">' +
                '<span>Amazon Kindle Fire HD 7</span>' +
                '</div>');
        } else if (site == 504) {
            node.append('<div class="showmedialist">' +
                '<span>Blackberry Passport</span>' +
                '</div>');
        } else if (site == 600) {
            node.append('<div class="showmedialist">' +
                '<span>Blackberry Playbook</span>' +
                '<span>SumSung Galaxy Tab 2 7*</span>' +
                '<span>Amazon Kindle Fire</span>' +
                '<span>Asus Nexus 7 (v2)</span>' +
                '<span>LG G Pad 8.3</span>' +
                '</div>');
        } else if (site == 720) {
            node.append('<div class="showmedialist">' +
                '<span>Microsoft Surface Pro</span>' +
                '</div>');
        } else if (site == 240) {
            node.append('<div class="showmedialist">' +
                '<span>Various Android Old phones</span>' +
                '</div>');
        } else if (site == 346) {
            node.append('<div class="showmedialist">' +
                '<span>Blackberry Q10</span>' +
                '</div>');
        } else if (site == 375) {
            node.append('<div class="showmedialist">' +
                '<span>iPhone 6</span>' +
                '</div>');
        } else if (site == 384) {
            node.append('<div class="showmedialist">' +
                '<span>Blackberry Z10</span>' +
                '<span>LG Nexus 4</span>' +
                '<span>LG Optimus G</span>' +
                '</div>');
        } else if (site == 390) {
            node.append('<div class="showmedialist">' +
                '<span>Blackberry Classic</span>' +
                '</div>');
        } else if (site == 400) {
            node.append('<div class="showmedialist">' +
                '<span>SumSung Galaxy Note</span>' +
                '</div>');
        } else if (site == 414) {
            node.append('<div class="showmedialist">' +
                '<span>iPhone 6 Plus</span>' +
                '</div>');
        } else if (site == 320) {
            node.append('<div class="showmedialist">' +
                '<span>Microsoft Lumia 1520</span>' +
                '<span>Microsoft Lumia 1020</span>' +
                '<span>Microsoft Lumia 830</span>' +
                '<span>Microsoft Lumia 900</span>' +
                '<span>Microsoft Lumia 920</span>' +
                '<span>Microsoft Lumia 925</span>' +
                '<span>Apple iPhone 5</span>' +
                '<span>Apple iPhone 4</span>' +
                '<span>Apple iPhone 3</span>' +
                '<span>ZTE Open</span>' +
                '<span>SumSung Galaxy S</span>' +
                '<span>SumSung Galaxy S2</span>' +
                '<span>SumSung Galaxy S3</span>' +
                '<span>SumSung Galaxy S3 mini</span>' +
                '<span>HTC 8X</span>' +
                '<span>Apple iPad Touch</span>' +
                '<span>Microsoft Lumia 620</span>' +
                '</div>');
        } else if (site == 360) {
            node.append('<div class="showmedialist">' +
                '<span>HTC One 1080</span>' +
                '<span>Blackberry Z30</span>' +
                '<span>SumSung Galaxy S4</span>' +
                '<span>SumSung Galaxy S5</span>' +
                '<span>Blackberry Torch 9800</span>' +
                '<span>Sony Xperia S</span>' +
                '<span>Sony Xperia P</span>' +
                '<span>Sony Xperia Z</span>' +
                '<span>Sony Xperia Z3</span>' +
                '<span>HTC Evo 3D</span>' +
                '<span>LG G3</span>' +
                '<span>SumSung Galaxy Note2</span>' +
                '<span>SumSung Galaxy Note2</span>' +
                '<span>LG Nexus 5</span>' +
                '<span>SumSung Galaxy Nexus</span>' +
                '<span>SumSung Galaxy S3</span>' +
                '<span>SumSung Galaxy S4 mini</span>' +
                '</div>');
        }
        if ($('.bem-TopBar_Body_PreviewButton-active').length) {
            $('.showmedialist').css('left', (parseInt($('.site-canvas').offset().left) + $('.site-canvas').width() + 35));
        } else {
            $('.showmedialist').css('left', (parseInt($('.site-canvas').offset().left) + $('.site-canvas').width()));
        }
    }
    if (status == 0) {
        $('.showmedialist').remove();
    }
}
/**
 * 合并操作，拖拽结束后
 */
exports.handle_dragstop = function () {
    //判断眼睛，预览模式，删除工具栏，编辑模式，恢复默认底部
    exports.set_ruler(0);//显示标尺
    exports.show_medias(0);
    //预览模式直接删除，编辑模式，返回正常的底部
    if ($('.bem-TopBar_Body_PreviewButton-active').length) {
        exports.bottombar(0);
    } else {
        exports.bottombar(1);
    }
}

//拖动容器两边，调整容器的宽度
exports.resize_workspace = function () {
    $('.canvas-resize-handle .handle').livequery(function () {
        //鼠标按下
        $(this).mousedown(function () {
            console.log($('.site-canvas').offset().left);
            exports.show_medias(1);//显示手机型号
            exports.bottombar(1);//加载底部工具栏
            exports.set_ruler(1);//显示标尺
        });
        //鼠标弹起
        $(this).mouseup(function () {
            exports.handle_dragstop();
        })
    });

    $('.left-handle').draggable({
        revert: true,
        iframeFix: true,
        axis: 'x',
        opacity: 0,
        start: function () {
            $('body,.canvas-resize-handle').addClass('wf-resizing wf-canvas-resizing');
            $('body').append('<div class="wf-resizing-overlay"></div>');
        },
        drag: function (event, ui) {
            var s = $('.site-canvas');
            var sl = s.offset().left;
            var ifm = $('#site-iframe-next');
            s.width(s.attr('_width') - ui.position.left * 2);//更新画布的宽度
            ifm.width(s.width());//更新框架的宽度
            //预览模式，标尺位置直接和画布位置一样
            if ($('.bem-TopBar_Body_PreviewButton-active').length) {
                $('#ruleh').css('left', sl);
            } else {
                $('#ruleh').css('left', sl - 35);//更新尺子的宽度
            }
            //弹窗位置
            $('.rulermsg').css('left', (parseInt(sl) + $('.site-canvas').width() - 19));
            $('.rulermsg .layui-layer-content span').text(s.width() + 'px');//实时尺寸显示
            exports.show_medias(1);//显示手机型号
            //调整框架的宽度
        },
        stop: function (event, ui) {
            exports.check_workspace();
            $('.site-canvas').attr('_width', $('.site-canvas').width());//更新隐藏属性_width
            $('body,.canvas-resize-handle').removeClass('wf-resizing wf-canvas-resizing');
            $(event.target).removeAttr('style');
            $('.wf-resizing-overlay').remove();
            exports.handle_dragstop();

        }
    });
    $('.right-handle').draggable({
        axis: 'x',
        revert: true,
        iframeFix: true,
        opacity: 0,
        handle: '.gutter-handle',
        start: function (event, ui) {
            $('body,.canvas-resize-handle').addClass('wf-resizing wf-canvas-resizing');
            $('body').append('<div class="wf-resizing-overlay"></div>');
        },
        drag: function (event, ui) {
            var s = $('.site-canvas');
            var sl = s.offset().left;
            var wd = parseInt(s.attr('_width')) + (ui.position.left - parseInt(s.attr('_width'))) * 2;
            s.width(wd);//设置工作台的宽度

            $('#site-iframe-next').width(s.width());//更新框架的宽度

            if ($('.bem-TopBar_Body_PreviewButton-active').length) {
                $('#ruleh').css('left', sl);
            } else {
                $('#ruleh').css('left', sl - 35);//更新尺子的宽度
            }

            $('.rulermsg').css('left', (parseInt(sl) + $('.site-canvas').width() - 19));
            $('.rulermsg .layui-layer-content span').text(s.width() + 'px');
            exports.show_medias(1);
        },
        stop: function (event, ui) {
            exports.check_workspace();
            $('body,.canvas-resize-handle').removeClass('wf-resizing wf-canvas-resizing');
            $(event.target).attr('style', 'right: -24px');
            $('.site-canvas').attr('_width', $('.site-canvas').width());//更新隐藏属性_width
            $('.wf-resizing-overlay').remove();
            exports.handle_dragstop();
        }
    });

}

//媒体监测，根据宽度匹配
exports.media_size = function (eye) {
    var media = $('.bem-TopBar_Body_MediaQueryButton-active');//当前激活的按钮，默认为PC
    var winx = $(window).width(),
        winy = $(window).height(),
        val,
        min,
        max;

    if (media.is('.media-pc')) {
        if (eye == 1) {
            //预览模式
            val = winx - 20;
            min = 992;
            max = val;
            $('.canvas-resize-handle').addClass('hidden');//关闭拖拽辅助线
        } else {
            //编辑模式
            val = winx - 296;
            min = 992;
            max = val;
            $('.canvas-resize-handle').removeClass('hidden');//开启拖拽辅助线
        }
    } else {
        //其他媒体一律打开拖拽操作
        $('.canvas-resize-handle').removeClass('hidden');//开启拖拽辅助线
        if (media.is('.media-tablet')) {
            val = 768;
            min = 768;
            max = 991;
        }
        if (media.is('.media-phone')) {
            val = 568;
            min = 480;
            max = 767;
        }
        if (media.is('.media-phone2')) {
            val = 320;
            min = 240;
            max = 479;
        }
    }
    //根据值设置画布和iframe尺寸
    $('.site-canvas').css({
        width: val + 'px',
        maxWidth: max + 'px',
        minWidth: min + 'px',
    }).attr('_width', val);

    //iframe工作区的宽度及样式
    $('#site-iframe-next').css({
        width: val + 'px',
        //height: wh + 'px',
        minWidth: min + 'px',
        maxWidth: max + 'px',
        display: 'inline',
        minHeight: '100%',
        maxHeight: '100%',
        border: 0,
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        pointerEvents: 'auto',
    });
}


//媒体按钮点击，改变工作区的宽度，4种类型
exports.media_toggle = function () {
    var s = $('.site-canvas');
    //点击事件
    $('.bem-TopBar_Body_MediaQueryButton').livequery(function () {
        var ifm = $('#site-iframe-next');
        var workspaceh = $(window).height() - 35 - 29;
        $(this).click(function () {
            //如果是预览模式，删除底部工具栏，在点击两侧的拖动线才显示
            if ($('.bem-TopBar_Body_PreviewButton-active').length) {
                $('.bem-BottomBar').remove();
            }
            $(this).addClass('bem-TopBar_Body_MediaQueryButton-active').siblings().removeClass('bem-TopBar_Body_MediaQueryButton-active');
            if ($(this).is('.media-pc')) {
                $('.canvas-resize-handle').addClass('hidden');//关闭拖拽辅助线
                if ($('.bem-TopBar_Body_PreviewButton-active').length) {
                    //浏览模式
                    var wpw = $(window).width() - 20;
                } else {
                    //编辑模式
                    var wpw = $(window).width() - 296;
                }
                s.css({
                    width: wpw + 'px',
                    minWidth: '992px',
                    maxWidth: wpw + 'px'
                });
                ifm.css({
                    width: wpw + 'px',
                    //height: workspaceh,
                    minWidth: '992px',
                    maxWidth: wpw + 'px'
                });
                $('#workspace').attr('class', 'workspace loaded media-main');
                s.attr('_width', wpw);
                //节点提示工具的宽度body
                //translate值x,y
                //宽度，和当前工作区的宽度保持一致，同步拖拽操作
                //高度，等于文档高度
            } else if ($(this).is('.media-tablet')) {
                $('.canvas-resize-handle').removeClass('hidden');//关闭拖拽辅助线
                s.css({
                    width: '768px',
                    minWidth: '768px',
                    maxWidth: '991px'
                });
                ifm.css({
                    width: '768px',
                    //height: workspaceh,
                    minWidth: '768px',
                    maxWidth: '991px'
                });
                $('#workspace').attr('class', 'workspace loaded media-medium');
                s.attr('_width', 768);
            } else if ($(this).is('.media-phone')) {
                $('.canvas-resize-handle').removeClass('hidden');//关闭拖拽辅助线
                s.css({
                    width: '568px',
                    //height: workspaceh,
                    minWidth: '480px',
                    maxWidth: '767px'
                });
                ifm.css({
                    width: '568px',
                    //height: workspaceh,
                    minWidth: '480px',
                    maxWidth: '767px'
                });
                $('#workspace').attr('class', 'workspace loaded media-small');
                s.attr('_width', 568);
            } else if ($(this).is('.media-phone2')) {
                $('.canvas-resize-handle').removeClass('hidden');//关闭拖拽辅助线
                s.css({
                    width: '320px',
                    minWidth: '240px',
                    maxWidth: '479px'
                });
                ifm.css({
                    width: '320px',
                    //height: workspaceh,
                    minWidth: '240px',
                    maxWidth: '479px'
                });
                $('#workspace').attr('class', 'workspace loaded media-tiny');
                s.attr('_width', 320);
            }
        })

    })
}

//----------网页内容区操作-----------------------------------//
//----------网页内容区操作-----------------------------------//
//----------网页内容区操作-----------------------------------//
//----------网页内容区操作-----------------------------------//
/**
 * 初始化的时候，加载所有节点，以及head里面的内容，从数据库加载
 * @param {*页面内容初始化，传入网站ID} siteid 
 */
exports.iframe_init = function (siteid, pageid) {
    $('#site-iframe-next').livequery(function () {
        var CD = $(this).contents();
        CD.find('html').addClass('site-scrollbar allow-drag-cursor wf-design-mode')
            .attr({
                'lang': 'zh-CN',
                'spellcheck': true,
                'data-wf-site': siteid,
                'data-wf-page': pageid,
            });
        //head
        CD.find('head')
            .append('<meta charset="utf-8">')
            .append('<title>页面设计</title>')
            .append('<meta name="viewport" content="width=device-width, initial-scale=1">')
            .append('<link rel="stylesheet" href="static/normalize.css">')
            .append('<link rel="stylesheet" href="static/site-designer.css">')
            .append('<script src="../../static/js/jquery.min.js"></script>')
            .append('<style>.body{text-align:center;}</style>');
        var body = CD.find('body');
        body.addClass('body');
        //测试数据
        body.attr('data-w-id', '1111');
        body.append('<div data-autoplay="true" data-loop="true" data-wf-ignore="true" data-w-id="ec863bde-a3e2-6ae0-1145-438dbafe9bb0" class="w-background-video w-background-video-atom"><video loop="loop" data-wf-ignore=""></video></div><h1 data-w-id="7040471b-701f-5e44-48c0-d9c6e9088fbb">Heading</h1><div data-w-id="c77a54e8-badb-cf03-dd15-cbb9b97db3d1" class="w-row"><div data-w-id="45aea8b5-5143-cd4d-f767-aa70479a73fa" class="wf-empty w-col w-col-4"></div><div data-w-id="d33523ef-a812-58f6-9b07-81390db2ebf3" class="wf-empty w-col w-col-4"></div><div data-w-id="5724dff5-b28d-835e-df8a-24eb85c11005" class="wf-empty w-col w-col-4"></div></div><ul data-w-id="ba920b62-4eed-104e-ba40-62ea4763d3ac"><li data-w-id="3d71b16a-e23b-b5e3-6727-cc2c9a9a432e" class="wf-empty-block"></li><li data-w-id="74d589c4-9cc0-44ee-b76c-be1f3875efd5" class="wf-empty-block"></li><li data-w-id="3a78fda3-2c6d-a926-0f72-e6d2124a9e8f" class="wf-empty-block"></li></ul><div data-w-id="9597dd38-aa5a-43d9-f5cd-a0ec287d8e03" class="w-form"><form id="email-form" name="email-form" data-name="Email Form" data-w-id="ab587708-8a70-aae6-6d97-2b7bf36f79e8"><label data-w-id="443097ed-0fc6-c0d8-29db-596092e12da2">Name:</label><select id="field" name="field" data-w-id="5af9fa56-ffba-440f-8dda-ae3a08aae08e" class="w-select"><option value="">Select one...</option><option value="First">First Choice</option><option value="Second">Second Choice</option><option value="Third">Third Choice</option></select><input type="text" class="w-input" name="name" data-name="Name" placeholder="Enter your name" data-w-id="c01ea8da-a046-ce3d-eff8-886e37d3768c" id="name"><label data-w-id="c9946178-0f16-0b2a-33e6-623bda376e58">Email Address:</label><input type="text" class="w-input" name="email" data-name="Email" placeholder="Enter your email" data-w-id="51ec8d17-300a-4891-0515-f16cc721277a" id="email" required=""><input type="submit" value="Submit" data-wait="Please wait..." data-w-id="1eec79e2-7247-e1ad-3d42-23f39ae0132d" class="w-button"></form><div data-w-id="5c23572b-62f6-1d4b-a857-c3052f5426db" class="w-form-done"><div data-w-id="d67d4eaf-32ef-4b6a-2170-957778f92fdb">Thank you! Your submission has been received!</div></div><div data-w-id="04f27715-1cdc-6cfb-62d2-3a40a0546f7f" class="w-form-fail"><div data-w-id="907927c7-10c6-3baa-ea7d-456357df716b">Oops! Something went wrong while submitting the form.</div></div></div><a href="#" data-w-id="40eabadc-7bb9-230a-27fa-bfc5e887b3ec" class="w-button">Button Text</a><a href="#" data-w-id="40ba6152-def1-4122-fdde-9869b2b04f51" class="w-inline-block wf-empty"></a><div id="lightbox-mountpoint"></div>');
    });
}


//激活状态下，通过添加class,所有工具都可以使用
exports.iframe_enable = function (status) {
    if (status == 1) {
        $('#site-iframe-next').contents().find('html').addClass('allow-drag-cursor wf-design-mode');
    } else {
        $('#site-iframe-next').contents().find('html').removeClass('allow-drag-cursor wf-design-mode');
    }
}


/**
 * 在iframe_enable条件下的鼠标事件
 * 眼睛关闭状态下，以下的操作才有效，眼睛开启状态，鼠标事件取消
 * 激活节点的时候，1.网站底部显示当前节点的面包屑导航2.右侧工具栏
 */
exports.iframe_active = function () {
    var globalMousetype;
    $('#site-iframe-next').livequery(function () {
        $(this).mouseleave(function () {
            //鼠标离开框架，删除hover产生的辅助线
            $('.hovered-outline').remove();
        });
    });
    var son = $('#site-iframe-next').contents();
    //遍历节点
    son.find('[data-w-id]').each(function () {
        var id = $(this).attr('data-w-id');
        //-------------------------------------事件-------------------------
        //进入事件
        $(this).mouseenter(function (e) {
            if (globalMousetype == 'mouseup') {
                $('.hovered-outline').remove();
                globalMousetype = e.type;
                return false;
                //有一个小小的问题，当前元素，无法执行mouseenter函数
            }
            exports.node_enter_outline(e);
        });
        $(this).mousemove(function (e) {
            //在上面mouseup的时候禁止的mouseenter的一种补偿操作
            if ($('.hovered-outline').length) {
                return false;
            } else {
                exports.node_enter_outline(e);
            }
        });
        //离开事件
        $(this).mouseleave(function (e) {
            //鼠标离开iframe进入了主框架
            if ($(e.target).is('.body')) {
                $('.hovered-outline').remove();
                return false;
            }
            exports.node_enter_outline(e);
        });

        //点击事件
        $(this).click(function (e) {
            if (son.find('.wf-design-mode').length) {
                exports.node_click_outline(e);
                return false;//阻止鼠标点击链接跳转的默认事件
            }

        });
    });
    //非节点元素的处理
    son.find('.crumb').livequery(function () {
        $(this).mouseup(function (e) {
            globalMousetype = e.type;
        });
    });
}

/**
 * 进入节点
 * @param {*鼠标事件} e 
 */
exports.node_enter_outline = function (e) {
    var $e = $(e.target);
    if (e.type == 'mouseleave') { $e = $e.parent() }//leave和enter 唯一不同的一句
    if ($e.is('.clickmark')) { $('.bem-OutlineHoveredNode').remove(); return false; }
    if (!$('#site-iframe-next').contents().find('.wf-design-mode').length) {
        return false;
    }
    exports.node_outline_init(e);//初始化

    if (!$e.is('.body')) {
        if ($e.offset().top < 50) {
            $('.hovered-outline').addClass('hang-down');
        }
    } else {
        $('.hovered-outline').addClass('inside');
    }
}
/**
 * 节点click事件
 * @param {*节点对象} e 
 */
exports.node_click_outline = function (e) {
    e.stopPropagation();//阻止冒泡

    //如果已经标记，再次点击不发生变化
    if ($(e.target).is('.clickmark')) {
        return false;
    } else {
        $('#site-iframe-next').contents().find('[data-w-id]').removeClass('clickmark');
        var $e = $(e.target);
        $e.addClass('clickmark');
    }
    //创建辅助
    exports.node_outline_init(e);//初始化
    exports.get_bottom_breadcrumb($e);//面包屑导航实时变化
}
/**
 * 节点尺寸，为辅助工具提供
 * @param {*点击或mouseenter,mouseleave对象的尺寸} e 直接为对象$(e.target);
 */
exports.node_size = function (e, size) {
    var a;
    if (size == 'x') {
        a = e.offset().left;
    }
    if (size == 'y') {
        a = e.offset().top;
    }
    if (size == 'w') {
        a = e.width() + parseInt(e.css('padding-left')) + parseInt(e.css('padding-right'));
    }
    if (size == 'h') {
        a = e.height() + parseInt(e.css('padding-top')) + parseInt(e.css('padding-bottom'));
    }
    return a;
}
/**
 * 创建选择产生的内容
 * @param {*点击目标节点} e为事件元素的对象，即 e=$(e.target);
 */
exports.create_click_selected = function (e) {
    $('.selected-outline').remove();//先移除其他的，然后重新创建
    var selected = '<div class="bem-OutlineSelectedNode selected-outline wf-outline active" style="top: 0px; left: 0px; transform: translate(' + exports.node_size(e, 'x') + 'px, ' + exports.node_size(e, 'y') + 'px); width: ' + exports.node_size(e, 'w') + 'px; height: ' + exports.node_size(e, 'h') + 'px;"><div class="breadcrumbs"><div class="inner"><div class="crumbs clearfix" title="Show More"><div class="crumb current"><div class="inner"><span class="icon"><i class="el-icon"></i></span><span class="label"></span></div></div></div></div></div></div>';
    
    //如果节点有上级节点，把上级节点添加到列表中，最多允许三级
    $('.resize-hint').after(selected);

     //添加辅助功能，通过点击设置按钮，可以根据不同的节点类型，弹出不同的layer
     var inarr=['img','a','ul','h1','h2','h3','h4','h5','h6','form','input','textarea','select'];
     var nodetype=e.prop('tagName').toLowerCase();
     if(e.is('.w-background-video')||e.is('.w-video')||e.is('.w-col') ||e.is('.w-row') || e.is('.w-button') || e.is('.w-inline-block') || $.inArray(nodetype,inarr)!=-1){
        var sons= $('.selected-outline .current .inner');
        sons.addClass('has-mini-settings').append('<span class="icon open-mini-settings" title="显示设置"><i class="icon-main"></i></span>');
    }


    //添加显示方向
    if (!e.is('.body')) {
        if (e.offset().top < 50) {
            $('.selected-outline').addClass('hang-down');
        }
    } else {
        $('.selected-outline').addClass('inside');
        //body独有的，屏幕右上角的一个绿色小图标
        $('.selected-outline').append('<div style="background-color: rgb(42, 217, 134); border-radius: 40px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; position: absolute; right: -8px; top: -8px;"><svg width="8" height="11" viewBox="0 0 8 11" class="bem-Svg " style="display: block; transform: translate(0px, 0px); color: white; margin-top: -1px;"><title>interactions-mini</title><path d="M4,0,0,7H4v4L8,4H4Z" fill="currentColor"></path></svg></div>');
    }
    if (typeof (e.parent().attr('data-w-id')) != 'undefined') {
        $(".selected-outline .crumbs").prepend('<div class="crumb"><div class="inner"><span class="icon"><i class="el-icon"></i></span><span class="label"></span></div></div>');
    }
    if (typeof (e.parent().parent().attr('data-w-id')) != 'undefined') {
        $(".selected-outline .crumbs").prepend('<div class="crumb"><div class="inner"><span class="icon"><i class="el-icon"></i></span><span class="label"></span></div></div>');
    }

}
/**
 * 辅助工具初始化
 * @param {*鼠标事件} e 
 */
exports.node_outline_init = function (e) {
    //1.mouseenter,mouseleave事件统一操作，删除后重建
    $('.bem-OutlineHoveredNode').remove();

    //2.节点尺寸定义
    var $e = $(e.target);
    if (e.type == 'mouseleave') { $e = $e.parent(); }

    //3.节点辅助线加载初始样式
    var hovered = '<div class="bem-OutlineHoveredNode hovered-outline wf-outline active" style="top: 0px; left: 0px; transform: translate(' + exports.node_size($e, 'x') + 'px, ' + exports.node_size($e, 'y') + 'px); width: ' + exports.node_size($e, 'w') + 'px; height: ' + exports.node_size($e, 'h') + 'px;"><div class="breadcrumbs"><div class="inner"><div class="crumbs clearfix" title="Show More"><div class="crumb current"><div class="inner"><span class="icon"><i class="el-icon"></i></span><span class="label"></span></div></div></div></div></div></div>';
    //根据事件类型，执行不同的函数
    if (e.type == 'mouseenter' || e.type == 'mousemove') {
        $('.resize-hint').after(hovered);
        exports.node_outline_icon_set($e, 1);
    } else if (e.type == 'mouseleave') {
        $('.resize-hint').after(hovered);
        exports.node_outline_icon_set($e, 2);
    } else if (e.type == 'click') {
        exports.create_click_selected($e);
        exports.node_outline_icon_set($e, 3);//e是点击的节点事件，修正节点图片
    }
}

/**
 * 根据鼠标事件对象e,和鼠标事件类型区分1为enter,2为leave,3为click
 */
exports.node_outline_icon_set = function (e, mousetype) {
    var $e = e;
    var a = $('.hovered-outline'),
        b = $('.selected-outline'),
        c, d, f;
    //mouseenter事件
    if (mousetype == 1) {
        c = a.find('.el-icon');
        d = a.find('.label');
        checknode($e, c, d);
    }
    //mouseleave事件
    if (mousetype == 2) {
        c = a.find('.el-icon');
        d = a.find('.label');
        checknode($e, c, d);
    }
    //click事件，需要加载三层图标
    if (mousetype == 3) {
        //循环执行节点识别函数
        var lg = b.find('.crumb').length;
        for (var i = 0; i < lg; i++) {
            if (i == 0) { $e = $e; }
            if (i == 1) { $e = $e.parent(); }
            if (i == 2) { $e = $e.parent(); }
            c = b.find('.crumb').eq(lg - i - 1).find('.el-icon');
            d = b.find('.crumb').eq(lg - i - 1).find('.label');
            checknode($e, c, d);
        }
    }
    //具体节点
    function checknode($e, c, d) {
        c.addClass(exports.getNodeIco($e, 'ico'));
        d.text(exports.getNodeIco($e, 'txt'));
    }
}

exports.getNodeIco = function (e, info) {
    var res = '';
    if (e.is('.body')) {
        res = (info == 'ico') ? 'n-body' : 'Body';
    }
    if (e.is('.w-container')) {
        res = (info == 'ico') ? 'n-container' : '容器';
    }
    if (e.is('.w-section')) {
        res = (info == 'ico') ? 'n-div' : '横向容器';
    }
    if (e.is('.w-col')) {
        res = (info == 'ico') ? 'n-column' : '列元素';
    }
    if (e.is('.w-row')) {
        res = (info == 'ico') ? 'n-column' : '多列容器';
    }
    if (e.attr('class') == 'wf-empty' || e.attr('class') == 'wf-empty clickmark') {
        res = (info == 'ico') ? 'n-div' : '块元素';
    }
    if (e.is('.w-inline-block')) {
        res = (info == 'ico') ? 'n-a' : '链接模块';
    }
    if (e.is('.w-button')) {
        res = (info == 'ico') ? 'n-a' : '链接';
    }
    if (e.prop('tagName').toLowerCase() == 'ul') {
        res = (info == 'ico') ? 'n-ul' : '无序列表';
    }
    if (e.prop('tagName').toLowerCase() == 'li') {
        res = (info == 'ico') ? 'n-li' : '列表元素';
    }
    if (e.prop('tagName').toLowerCase() == 'h1') {
        res = (info == 'ico') ? 'n-h1' : '一级标题';
    }
    if (e.prop('tagName').toLowerCase() == 'h2') {
        res = (info == 'ico') ? 'n-h2' : '二级标题';
    }
    if (e.prop('tagName').toLowerCase() == 'h3') {
        res = (info == 'ico') ? 'n-h3' : '三级标题';
    }
    if (e.prop('tagName').toLowerCase() == 'h4') {
        res = (info == 'ico') ? 'n-h4' : '四级标题';
    }
    if (e.prop('tagName').toLowerCase() == 'h5') {
        res = (info == 'ico') ? 'n-h5' : '五级标题';
    }
    if (e.prop('tagName').toLowerCase() == 'h6') {
        res = (info == 'ico') ? 'n-h6' : '六级标题';
    }
    if (e.prop('tagName').toLowerCase() == 'p') {
        res = (info == 'ico') ? 'n-p' : '段落';
    }
    if (e.prop('tagName').toLowerCase() == 'a') {
        res = (info == 'ico') ? 'n-a' : '文本链接';
    }
    if (e.prop('tagName').toLowerCase() == 'div' && (((typeof e.attr('class') == 'undefined') || e.attr('class') == 'clickmark') || e.attr('class') == '')) {
        res = (info == 'ico') ? 'n-textdiv' : '文本块';
    }
    if (e.prop('tagName').toLowerCase() == 'blockquote') {
        res = (info == 'ico') ? 'n-blockquote' : '引用';
    }
    if (e.is('.w-richtext')) {
        res = (info == 'ico') ? 'n-richdiv' : '富文本';
    }
    if (e.prop('tagName').toLowerCase() == 'img') {
        res = (info == 'ico') ? 'n-img' : '图片';
    }
    if (e.is('.w-video')) {
        res = (info == 'ico') ? 'n-video' : '视频';
    }
    if (e.is('.w-background-video')) {
        res = (info == 'ico') ? 'n-backgroundvideo' : '背景视频';
    }
    if (e.is('.w-form')) {
        res = (info == 'ico') ? 'n-div' : '表单容器';
    }
    //表单
    if (e.prop('tagName').toLowerCase() == 'form') {
        res = (info == 'ico') ? 'n-form' : '表单';
    }
    if (e.prop('tagName').toLowerCase() == 'input' && e.attr('type') == 'text') {
        res = (info == 'ico') ? 'n-input' : '单行文本';
    }
    if (e.prop('tagName').toLowerCase() == 'label') {
        res = (info == 'ico') ? 'n-span' : '字段标签';
    }
    if (e.prop('tagName').toLowerCase() == 'textarea') {
        res = (info == 'ico') ? 'n-textarea' : '多行文本';
    }
    if (e.is('.w-checkbox')) {
        res = (info == 'ico') ? 'n-div' : '复选框';
    }
    if (e.is('.w-checkbox-input')) {
        res = (info == 'ico') ? 'n-checkbox' : '复选框选项';
    }
    if (e.is('.w-radio')) {
        res = (info == 'ico') ? 'n-div' : '单选框';
    }
    if (e.is('.w-radio-input')) {
        res = (info == 'ico') ? 'n-radio' : '单选框选项';
    }
    if (e.prop('tagName').toLowerCase() == 'select') {
        res = (info == 'ico') ? 'n-select' : '选择列表';
    }
    if (e.attr('type') == 'submit' && e.attr('value') == 'submit') {
        res = (info == 'ico') ? 'n-button' : '提交按钮';
    }
    //组件
    if (e.prop('tagName').toLowerCase() == 'input' && $.attr('type') == 'search') {
        res = (info == 'ico') ? 'n-input' : '搜索框';
    }
    if (e.attr('type') == 'submit' && e.attr('value') == 'search') {
        res = (info == 'ico') ? 'n-button' : '搜索按钮';
    }

    if (e.is('.w-tab-pane')) {
        res = (info == 'ico') ? 'n-tabs-pane' : '选项卡内容窗格';
    }
    if (e.is('.w-tab-content')) {
        res = (info == 'ico') ? 'n-mask' : '选项卡内容';
    }
    if (e.is('.w-tabs')) {
        res = (info == 'ico') ? 'n-tabs' : '选项卡';
    }
    if (e.is('.w-tab-menu')) {
        res = (info == 'ico') ? 'n-tabs-menu' : '选项卡菜单';
    }
    if (e.is('.w-tab-link')) {
        res = (info == 'ico') ? 'n-link' : '选项卡链接';
    }
    if (e.is('.w-nav')) {
        res = (info == 'ico') ? 'n-nav' : '导航';
    }
    if (e.is('.w-nav-menu')) {
        res = (info == 'ico') ? 'n-div' : '导航菜单';
    }
    if (e.is('.w-nav-brand')) {
        res = (info == 'ico') ? 'n-link' : '品牌';
    }
    if (e.is('.w-nav-link')) {
        res = (info == 'ico') ? 'n-link' : '导航链接';
    }
    if (e.is('.w-dropdown-toggle')) {
        res = (info == 'ico') ? 'n-button' : '下拉菜单';
    }
    if (e.is('.w-slide')) {
        res = (info == 'ico') ? 'n-slider' : '幻灯片';
    }
    if (e.is('.w-slider-arrow-left')) {
        res = (info == 'ico') ? 'n-link' : '左箭头';
    }
    if (e.is('.w-slider-arrow-right')) {
        res = (info == 'ico') ? 'n-link' : '右箭头';
    }
    if (e.is('.w-slider-nav')) {
        res = (info == 'ico') ? 'n-link' : '幻灯片导航';
    }
    if (e.is('.w-icon-slider-left') || e.is('.w-icon-slider-right') || e.is('.w-icon-dropdown-toggle')) {
        res = (info == 'ico') ? 'n-icon' : '图标';
    }
    if (e.is('.w-widget-map')) {
        res = (info == 'ico') ? 'n-map' : '地图';
    }

    return res;
}
/**
 * 获得底部面包屑导航，根据点击的元素向上遍历到body
 */
exports.get_bottom_breadcrumb = function (e) {
    $('.bem-BottomBar_Placeholder').remove();
    $('.bem-Breadcrumbs_Container').html('');//清空
    var $e = e;
    do {
        $('.bem-Breadcrumbs_Container').append('<div class="bem-Breadcrumbs_Breadcrumb " style="background-color: rgb(235, 235, 235);"><svg width="7" height="28" viewBox="0 0 7 28" class="bem-Svg left notch" style="display: block; transform: translate(0px, 0px); color: rgb(235, 235, 235);"><path fill="currentColor" d="M6.5 14L.5 0H0v28h.5z"></path><path fill="#858585" d="M1 0H0l6 14-6 14h1l6-14z"></path></svg><div class="bem-Breadcrumbs_Breadcrumb_Inner "><i class="el-icon ' + exports.getNodeIco($e, 'ico') + '"></i><div class="label">' + exports.getNodeIco($e, 'txt') + '</div></div><svg width="7" height="28" viewBox="0 0 7 28" class="bem-Svg right notch" style="display: block; transform: translate(0px, 0px); color: rgb(235, 235, 235);"><path fill="currentColor" d="M.5 0l6 14-6 14H7V0z"></path><path fill="#858585" d="M1 0H0l6 14-6 14h1l6-14z"></path></svg></div>');
        $e = $e.parent();//循环
    } while (!$e.is('.wf-design-mode'));
}

/**
 * 底部导航节点的鼠标动作
 */
exports.bottom_breadcrumb_mouse = function () {
    var $node = $('.bem-Breadcrumbs_Breadcrumb');
    $node.livequery(function () {
        $(this).mouseenter(function () {
            $(this).css({
                zIndex: 1,
                backgroundColor: '#rgb(255,255,255)',
                cuusor: 'pointer'
            });
        });
        $(this).mouseleave(function () {
            $(this).attr('style', 'backgroundColor:rgb(235,235,235)');
        });
        $(this).click(function () {
            //点击底部导航，第一步找到当前点击的index,第二步找到clickmark，通过循环找到index对应的节点
            var i = $(this).index();
            var $node = $('#site-iframe-next').contents().find('.clickmark');
            if (i == 0) { return false; }
            //如果点击的不是当前已经选中的节点，执行如下操作
            $node.removeClass('clickmark');
            for (var p = 0; p < i; p++) {
                $node = $node.parent();
            }
            //移动clickmark的位置
            $node.addClass('clickmark');
            exports.create_click_selected($node);
            exports.node_outline_icon_set($node, 3);
            //移除面包屑导航剩下的元素
            $(this).prevAll().remove();
        });
    })
}
/**
 * 节点辅助工具点击操作，弹出节点选择列表
 * 只有点击后才有的selected-outline
 */
exports.node_outline_icon_mouse = function () {
    $('.selected-outline').livequery(function () {
        //点击事件
        $(this).find('.crumb').click(function () {
            if ($(this).is('.current')) {
                //点击到切换按钮上
                $('.selected-outline').toggleClass('expanded');
            } else {
                //点击上级节点按钮，删除因mouseenter产生的黄色边框
                $('.bem-OutlineHoveredParentNode').remove();
                //寻找被定为的节点
                var lg = $('.selected-outline').find('.crumb').length;
                var i = lg - $(this).index() - 1;
                //选择框架中的节点，需要使用contents
                var $e = $('#site-iframe-next').contents().find('.clickmark');
                $e.removeClass('clickmark');
                //0,1,2表示点击的是第几个crumb
                if (i == 0) { $e = $e; }
                if (i == 1) { $e = $e.parent(); }
                if (i == 2) { $e = $e.parent().parent(); }
                $e.addClass('clickmark');//将标记移动到新的位置
                //以上为寻找$e定位点
                //创建辅助线
                exports.create_click_selected($e);
                //给selected创建一个标记，在mouseup的时候，在mouseenter里面判断，去掉由此产生的hover事件
                //$('.selected-outline').addClass('fromparent');
                exports.node_outline_icon_set($e, 3);//e是点击的节点事件，修正节点图片
                exports.get_bottom_breadcrumb($e);//面包屑导航实时变化
            }
        });
        //鼠标进入事件
        $(this).find('.crumb').mouseenter(function () {
            //鼠标进入辅助工具，删除hover辅助
            $('.hovered-outline').remove();

            var lg = $('.selected-outline').find('.crumb').length;
            var i = lg - $(this).index() - 1;
            //选择框架中的节点，需要使用contents
            var $e = $('#site-iframe-next').contents().find('.clickmark');
            if (i == 0) { $e = $e; }
            if (i == 1) { $e = $e.parent(); }
            if (i == 2) { $e = $e.parent().parent(); }

            var x = $e.offset().left,
                y = $e.offset().top,
                w = $e.width() + parseInt($e.css('paddingLeft')) + parseInt($e.css('paddingRight')),
                h = $e.height() + parseInt($e.css('paddingTop')) + parseInt($e.css('paddingBottom'));
            //当前节点不需要黄色标记，只创建一次
            if (!$('.bem-OutlineHoveredParentNode').length) {
                if (!$(this).is('.current')) {
                    $('.selected-outline').after('<div class="active bem-OutlineHoveredParentNode wf-outline" style="top:0;left:0;width:' + w + 'px;height:' + h + 'px;transform:translate(' + x + 'px,' + y + 'px)"></div>');
                }
            }
        });


        //鼠标离开，销毁
        $(this).find('.crumb').mouseleave(function () {
            $('.bem-OutlineHoveredParentNode').remove();
        });

    });
}

/**
 * 鼠标滚动，为保证selected元素辅助工具能对准指定元素
 * 以及Hover对准当前元素
 */
exports.mouse_scroll_resizehint = function () {
    var ifm = document.getElementsByTagName('iframe')[0].contentWindow;
    $(ifm).scroll(function () {
        var st = $(this).scrollTop();
        $('.resize-hint').css({
            transform: 'translate(10px, ' + (st + 10) + 'px)'
        });
        $('#toolAcontent').css('top', -st + 'px');
    })
}
