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
        indexItem.addClass("page-index").css({
            width: '100%',
            position:"relative"
        });;
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
        var back = target.attr("data-back") == null ? !1 :!0;
        //初始化进入
        var winH = $(window).height();
        var outH = outItem.height();
        var cH = winH > outH ? winH :outH;
        that.container.height(cH);
        that.blank.css("display", "block");
        inItem.css({
            width:"100%",
            top:that.pageWrap.scrollTop()
        });
        if (back) {
            inItem.addClass("nodur in").css({
                position:"relative",
                "z-index":1
            });
            outItem.removeClass('page-index').addClass("out").css({
                position:"absolute",
                "z-index":2
            });
        } else {
            inItem.addClass("in").css({
                position:"absolute",
                "z-index":2
            });
        }
        //进入以后
        setTimeout(function() {
            //是否为第一次进入，加载图片，进入后加载图片可减小进入动画的卡顿
            if (!inItem.hasClass("page-in")) {
                inItem.addClass("page-in");
                var imgs = inItem.find("img[data-src]");
                that.loadImg(imgs);
                that.pageReady(inItem);
            } else {
                inItem.addClass("page-active");
            }
            that.pageWrap.scrollTop(0);
            that.container.height("auto");
            that.blank.css("display", "none");
            inItem.removeClass("nodur").css({
                top:0,
                "z-index":1,
                position:"relative"
            });
            outItem.removeClass("page-active in out page-index").css({
                width:0,
                "z-index":1,
                position:"absolute"
            });
        }, 500);
    }
};

$(function() {
    var mypage = new easypage();
    console.log(mypage);
});