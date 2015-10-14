var easypage = function() {
    this.pageWrap = $(".page-wrap");
    this.container = this.pageWrap.children(".container");
    this.item = this.container.children(".page-item");
    this.loading = $('<div class="loading"><div class="spin"><i></i><i></i><i></i></div></div>');
    this.blank = $('<div class="blank">');
    this.curPage = 1;
    this.initialize();
};

easypage.prototype = {
    initialize:function() {
        var that = this;
        $("body").append(that.loading).append(that.blank);
        //初始化第一页
        var indexItem = that.container.children(".page-" + that.curPage);
        that.translate(indexItem[0], [ 0, 0 ]);
        indexItem.css({
            position:"relative"
        });
        indexItem[0].been = 1;
        var imgs = indexItem.find("img[data-src]");
        that.loadImg(imgs);
        that.pageReady(indexItem);
        //页面跳转事件
        that.item.find(".to-page").click(function(event) {
            var target = $(this), index = target.attr("data-page");
            if (that.curPage == index) {
                return;
            }
            that.curPage = index;
            var inItem = that.container.children(".page-" + index), outItem = target.parents(".page-item");
            that.pageSwitch({
                inItem:inItem,
                outItem:outItem,
                target:target
            });
        });
    },
    loadImg:function(a) {
        if (!a.length) {
            return;
        }
        for (var i = 0; i < a.length; i++) {
            var s = a[i].getAttribute("data-src");
            if (s != null) {
                a[i].src = s;
            }
        }
    },
    checkImgs:function(a, f) {
        var n = 0;
        for (var i = 0; i < a.length; i++) {
            var b = new Image();
            b.src = a[i];
            b.onload = function() {
                n++;
                if (n == a.length) {
                    "undefined" != typeof f && f();
                }
            };
        }
    },
    translate:function(a, b, c) {
        if (!a || !b) return;
        var s = a && a.style, x = b[0] || 0, y = b[1] || 0, z = b[2] || 0;
        if (typeof c != "undefined") {
            s.webkitTransitionDuration = s.MozTransitionDuration = s.msTransitionDuration = s.OTransitionDuration = s.transitionDuration = c + "ms";
        }
        s.webkitTransform = "translate3d(" + x + "px," + y + "px," + z + "px)";
        s.msTransform = s.MozTransform = s.OTransform = "translate(" + x + "px," + y + "px)";
    },
    isLoading:function(a) {
        var that = this;
        if (a) {
            that.loading.css({
                width:"100%",
                opacity:1
            });
        } else {
            that.loading.css("opacity", 0);
            setTimeout(function() {
                that.loading.css("width", 0);
            }, 500);
        }
    },
    pageReady:function(a) {
        var that = this;
        var imgs = a.find("img.w-img");
        if (!imgs.length) {
            a.addClass("page-active");
            return;
        }
        that.isLoading(1);
        var srcs = [];
        imgs.each(function() {
            srcs.push($(this).attr("data-src"));
        });
        that.checkImgs(srcs, function() {
            that.isLoading(0);
            setTimeout(function() {
                a.addClass("page-active");
            }, 500);
        });
    },
    pageSwitch:function(args) {
        var that = this;
        var inItem = args.inItem;
        var outItem = args.outItem;
        var target = args.target;
        var inItemN = inItem[0];
        //初始化进入
        var winH = $(window).height();
        var outH = outItem.height();
        var cH = winH > outH ? winH :outH;
        that.container.height(cH);
        that.blank.css("display", "block");
        var back = target.attr("data-back") == null ? !1 :!0;
        var direction = back ? -1 :1;
        that.translate(inItem[0], [ 640 * direction, 0 ], 0);
        setTimeout(function() {
            inItem.css({
                top:that.pageWrap.scrollTop()
            });
            that.translate(inItem[0], [ 0, 0 ], 500);
            outItem.css({
                position:"absolute"
            });
            that.translate(outItem[0], [ -640 * direction, 0 ], 500);
        }, 1);
        //进入以后
        setTimeout(function() {
            //是否为第一次进入，加载图片，进入后加载图片可减小进入动画的卡顿
            if ("undefined" == typeof inItemN.been) {
                inItemN.been = 1;
                var imgs = inItem.find("img[data-src]");
                that.loadImg(imgs);
                that.pageReady(inItem);
            } else {
                inItem.addClass("page-active");
            }
            that.pageWrap.scrollTop(0);
            that.container.height("auto");
            that.blank.css("display", "none");
            inItem.css({
                top:0,
                position:"relative"
            });
            outItem.removeClass("page-active").css({
                position:"absolute"
            });
        }, 500);
    }
};

$(function() {
    var mypage = new easypage();
    console.log(mypage);
});