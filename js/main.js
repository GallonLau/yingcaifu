$(window).on('resize', function() {
    $('.swiper-slide,.swiper-container').css({
        height: $(window).height()
    })
});

//雪花效果
var snow = function(targetDom, left, height, src) {
    var div = document.createElement("div");
    var img = document.createElement("img");
    div.appendChild(img);
    img.className = "roll";
    img.src = src;
    div.style.left = left + "px";
    div.style.height = height + "px";
    div.className = "snowItem";
    document.getElementById(targetDom).appendChild(div);
    setTimeout(function() {
        document.getElementById(targetDom).removeChild(div);
    }, 50000);
};
var snowHandle = function(targetDom,src,time) {
    setInterval(function() {
        var left = Math.random() * window.innerWidth;
        var height = Math.random() * window.innerHeight;
        snow(targetDom, left, height, src);
    }, time);
};

//激活当前屏动画
var activeCurrentItem = function(index) {
    var activeItems = $("[class*=animated]");
    if (activeItems && activeItems.length) {
        for (var i = 0, len = activeItems.length; i < len; i++) {
            var activeItem = $(activeItems[i]);
            var animateClass = activeItem.attr("class");
            if (animateClass && animateClass.length) {
                animateClass.replace("/hide/", "");
                activeItem.attr("data-animate", animateClass).attr("class", "hide");
            };
        };
    };

    (function(index) {
        var currentPage = $(".slide" + index);
        var animateItems = currentPage.find("[data-animate]");
        if (animateItems && animateItems.length) {
            for (var i = 0, len = animateItems.length; i < len; i++) {
				(function(i) {
                    var animateItem = $(animateItems[i]);
                    var animateDelay = 0;
                    var delayAttr = animateItem.attr("data-delay");
                    if (delayAttr && delayAttr.length) {
                        animateDelay = parseInt(delayAttr);
                    }

                    var animateFunc = function(){
                    	var animates = animateItem.removeClass("hide").attr("data-animate");
                        animateItem.addClass(animates);
                    };
                    if (animateDelay > 0) {
                    	var timer = setTimeout(function() {
                        	animateFunc();
                        	clearTimeout(timer);
                    	}, animateDelay);
                    }else{
                    	animateFunc();
                    }
                })(i);
            };
        };
    })(index);
};

//初始化划动插件
var mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    mousewheelControl: true,
    watchSlidesProgress: true,
    preventClicks : false,
    height : $(window).height(),
    onInit: function(swiper) {
        swiper.myactive = 0;
        snowHandle("snowDown","img/snow.png",50);
        snowHandle("petalDown","img/petal.png",1000);
    },
    onProgress: function(swiper) {
        for (var i = 0; i < swiper.slides.length; i++) {
            var slide = swiper.slides[i];
            var progress = slide.progress;
            var translate, boxShadow;
            translate = progress * swiper.height * 0.8;
            scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
            boxShadowOpacity = 0;
            slide.style.boxShadow = '0px 0px 10px rgba(0,0,0,' + boxShadowOpacity + ')';
            if (i == swiper.myactive) {
                es = slide.style;
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')';
                es.zIndex = 0;
            } else {
                es = slide.style;
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = '';
                es.zIndex = 1;
            }
        }  
    },
    onTransitionEnd: function(swiper, speed) {
        for (var i = 0; i < swiper.slides.length; i++) {}
        swiper.myactive = swiper.activeIndex;
    },
    onSetTransition: function(swiper, speed) {
        for (var i = 0; i < swiper.slides.length; i++) {
            es = swiper.slides[i].style;
            es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
        }
    },
    onSlideChangeEnd: function(swiper) {
        //滑动到最后一屏，隐藏底部滑动提示
        var activeIndex = swiper.activeIndex + 1;
        slideLength = swiper.slides.length;
        if (activeIndex == slideLength) {
            $(".arrow-up").css("display", "none");
        } else {
            $(".arrow-up").css("display", "block");
        }
        activeCurrentItem(swiper.activeIndex + 1);
    }
});

//获取URL参数信息
var getUrlParam = function(name){
    var reg = new RegExp("(^|&|#|/?)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.href.substr(1).match(reg);
    if (r != null) {
        var result = unescape(r[2]);
        if (result.indexOf('#') > 0) {
            result = result.slice(0, result.indexOf('#'));
        };
        return result;
    }
    return null;
};

(function(){
    var btnSign = document.getElementById("btnSign");
    if (btnSign) {
        var signLink = "http://o2o.hx168.com.cn/m/o2o/index.php?page=ycf&package=gpscan-0-0-0-0";
        var brokercode = getUrlParam("brokercode");
        if(brokercode){
            signLink = signLink + "&c=" + brokercode;
        }
        btnSign.href = signLink;    
    }
})();