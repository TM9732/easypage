var easypage = function(args) {
    this.pageWrap = $(".page-wrap");
    this.container = this.pageWrap.children(".container");
    this.item = this.container.children(".page-item");
    this.loading = $('<div class="loading"><div class="spin"><i></i><i></i><i></i></div></div>');
    this.curPage = 1;
    if ("undefined" != typeof args) {
        this.afterIn = args.afterIn;
    }
    this.initialize();
};

easypage.prototype = {
    initialize:function() {
        var that = this;
        $("body").append(that.loading);
        //初始化第一页
        var indexItem = that.container.children(".page-" + that.curPage);
        that.translate(indexItem[0], [ 0, 0 ]);
        indexItem.addClass("page-in").css({
            position:"relative"
        });
        var imgs = indexItem.find("img[data-src]");
        that.loadImg(imgs);
        that.pageReady(indexItem, function() {
            indexItem.addClass("page-active");
        });
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
            }, 300);
        }
    },
    pageReady:function(a, f) {
        var that = this;
        var imgs = a.find("img.w-img");
        var bgImg = a.css("background-image");
        if (!imgs.length && bgImg == "none") {
            "undefined" != typeof f && f();
            return;
        }
        that.isLoading(1);
        var srcs = [];
        if (bgImg != "none") {
            bgImg = bgImg.replace("url(", "").replace("url(", "").replace(")", "").replace('"', "").replace('"', "");
            srcs = [ bgImg ];
        }
        if (imgs.length) {
            imgs.each(function() {
                srcs.push($(this).attr("data-src"));
            });
        }
        that.checkImgs(srcs, function() {
            setTimeout(function() {
                that.isLoading(0);
            }, 300);
            setTimeout(function() {
                "undefined" != typeof f && f();
            }, 600);
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
        var back = target.attr("data-back") == null ? !1 :!0;
        var direction = back ? -1 :1;
        that.translate(inItem[0], [ 640 * direction, 0 ], 0);
        function pageIn() {
            //开始进入
            inItem.css({
                top:that.pageWrap.scrollTop()
            });
            that.translate(inItem[0], [ 0, 0 ], 500);
            outItem.css({
                position:"absolute"
            });
            that.translate(outItem[0], [ -640 * direction, 0 ], 500);
            //进入以后
            setTimeout(function() {
                that.pageWrap.scrollTop(0);
                that.container.height("auto");
                inItem.addClass("page-active").css({
                    top:0,
                    position:"relative"
                });
                outItem.removeClass("page-active").css({
                    position:"absolute"
                });
                "undefined" != typeof that.afterIn && that.afterIn();
            }, 500);
        }
        //是否为第一次进入
        if (!inItem.hasClass("page-in")) {
            inItem.addClass("page-in");
            var imgs = inItem.find("img[data-src]");
            that.loadImg(imgs);
            that.pageReady(inItem, pageIn);
        } else {
            pageIn();
        }
    }
};

$(function() {
    var a = 1;
    var mypage = new easypage({
        afterIn:function() {
            console.log("Animation effect end.");
        }
    });
    console.log(mypage);
});