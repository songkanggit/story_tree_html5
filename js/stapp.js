//var url = "https://admin.guostory.com/";
//var url = "http://192.168.0.105:8080/storytree/";
var url = "https://xcx.guostory.com/";
//初始化黑色蒙版点击区域高度
function loadclosemaskheight() {
	var WH = $(window).height();
	$(".closemask").css("height", WH - $(".closemask").siblings().height() + "px");
}
//关闭蒙版层
function closemask(box) {
	$("." + box).fadeOut(200);
}
//显示alert
function showalert(con) {
	$(".alertbox .con").text(con);
	$(".alertbox").fadeIn(200);
}
//关闭alert
function truealert() {
	$(".alertbox").fadeOut(200);
}
//显示confirm
function showconfirm(con, ids) {
	$(".confirmbox .con").text(con);
	$(".confirmbox").attr("name", ids);
	$(".confirmbox").fadeIn(200);
}
//确定confirm
function trueconfirm(okcallback) {
	okcallback();
	$(".confirmbox").fadeOut(200);
}
//关闭confirm
function falseconfirm() {
	$(".confirmbox").fadeOut(200);
}
//删除数组
function delsong() {
	showconfirm("确定要删除吗？", magarr);
}
//删除单个
function del(id) {
	arr = [];
	arr.push(id);
	showconfirm("确定要删除吗？", arr);
}
//获取地址栏参数
function getQueryString(key) {
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
}
//初始化首页
function loadindex() {
	$("#mainbox").load("index.html");
	window.localStorage.setItem("navbar", "故事树");
	if (window.localStorage.getItem("accountId") == null || window.localStorage.getItem("accountId") == "-1") {
		window.localStorage.setItem("accountId", "-1");
	}
}
//初始化发现
function loadfind() {
	$("#mainbox").load("find.html");
	window.localStorage.setItem("navbar", "发现");
	if (window.localStorage.getItem("accountId") == null || window.localStorage.getItem("accountId") == "-1") {
		window.localStorage.setItem("accountId", "-1");
	}

}
//初始化我的
function loadmine() {
	$("#mainbox").load("mine.html");
	window.localStorage.setItem("navbar", "我的");
	if (window.localStorage.getItem("accountId") == null || window.localStorage.getItem("accountId") == "-1") {
		window.localStorage.setItem("accountId", "-1");
	}

}
//初始化搜索
function loadsreach() {
	$("#mainbox").load("sreach.html");
	window.localStorage.setItem("navbar", "搜索");
	if (window.localStorage.getItem("accountId") == null || window.localStorage.getItem("accountId") == "-1") {
		window.localStorage.setItem("accountId", "-1");
	}

}
//路由
var oldhtmlarr = [];
function rount(oldhtml, newhtml, callback) {
	oldhtmlarr.push(oldhtml+".html");
//	console.log(oldhtmlarr)
	$("#mainbox").load(newhtml + ".html");
	callback();
}
//请先登录封装
function judelogin(nocallback, okcallback) {
	if (window.localStorage.getItem("accountId") == "-1") {
		nocallback();
	} else {
		okcallback();
	}
}
//		上传图片
function uploadimg() {
	$("#coverImage").attr("action", url + "common/imageUpload.do");
	$('#headimg').trigger('click');
}

function subimtimgBtn() {
	$(".allloadding").show();
	var form = $("#coverImage");
	var options = {
		url: $(form).attr("action"),
		type: 'post',
		success: function(data) {
			window.console.log(data);
			if (data.code == 0) {
				$("#Image").val($("#ImageFile").val());
				$("#Imagetext").val(data.data.src);
				$(".allloadding").hide();
			} else {
				showalert(data.msg)
			}
		}
	};
	form.ajaxSubmit(options);
};
//下一页
function nextpage() {
	page++;
	if (page > parseInt($("#allpage").val())) {
		return false;
	}
	defaultdata(2);
}

function scrollpage(stype) {
	if (stype == 'true') {
		$(window).scroll(function() {
			var bot = 1;
			if ((bot + $(window).scrollTop()) > ($(document).height() - $(window).height())) {
				nextpage();
			}
		});
	}

}
//添加收藏
function showCollect(t, id) {
	judelogin(function() {
		showalert("请先登录您的账号");
	}, function() {
		$(".allloadding").show();
		if ($(t).hasClass("collectioned") == false) {
			$.ajax({
				type: 'POST',
				url: url + 'app/favoriteMelody/add.do',
				data: {
					melodyId: id,
					accountId: window.localStorage.getItem("accountId"),
					accountTelephone: window.localStorage.getItem("accountIdTelePhone")
				},
				dataType: 'json',
				success: function(data) {
					window.console.log(data);
					if (data.state == true) {
						$(".allloadding").hide();
						$(t).addClass("collectioned");
					} else {
						showalert("数据错误，请重试");
					}
				}
			});
		} else if ($(t).hasClass("collectioned") == true) {
			$.ajax({
				type: 'POST',
				url: url + 'app/favoriteMelody/delete.do',
				data: {
					melodyId: id,
					accountId: window.localStorage.getItem("accountId")
				},
				dataType: 'json',
				success: function(data) {
					window.console.log(data);
					if (data.state == true) {
						$(".allloadding").hide();
						$(t).removeClass("collectioned");
					} else {
						showalert("数据错误，请重试");
					}
				}
			});
		}
	})

}
//判断悬浮框显示
function showmagfixed() {
	for (var i = 0; i < $("#listbox .magselect").length; i++) {
		if ($("#listbox .magselect").eq(i).hasClass("magselected") == true) {
			$(".magfixed").fadeIn(200);
			break;
		} else {
			$(".magfixed").fadeOut(200);
		}
	}
}
//管理单选
function oneselect(t, id) {
	if ($(t).hasClass("magselected") == false) {
		magarr.push(id);
		$(t).addClass("magselected");
	} else {
		magarr.splice($.inArray(id, magarr), 1);
		$(t).removeClass("magselected");
	}
	showmagfixed();
}
//全选
function allselect(t) {
	if ($(t).text() == "全选") {
		magarr = [];
		$(t).html("全不选");
		for (var i = 0; i < $("#listbox .magselect").length; i++) {
			magarr.push($("#listbox .magselect").eq(i).attr("id"));
			$("#listbox .magselect").eq(i).addClass("magselected");
		}
	} else {
		magarr = [];
		$(t).html("全选");
		$("#listbox .magselect").removeClass("magselected");
	}
	showmagfixed();
}
//验证码发送时的时间
var logintimer;
var tt = 60;

function getTokentime() {
	logintimer = setInterval(function() {
		tt--;
		if (tt == 0) {
			tt = 60;
			$("#getToken").html("重新发送");
			clearInterval(logintimer);
		} else {
			$("#getToken").html(tt + "S重新发送");
		}
	}, 1000);
}
//退出
function quit() {
	window.localStorage.setItem("accountId", "-1");
	window.localStorage.setItem("accountIdTelePhone", "");
	window.localStorage.setItem("magarr", "");
	$("#mainbox").load("mine.html");
}
//转换时间
function getLocalTime(nS) {
	return new Date(parseInt(nS)).toLocaleString().replace(/年月|下午|上午/g, "").replace(/日/g, "").replace("/", "-").replace("/", "-");
}
//判断客户端进入页面
function checkAIEnter(title, historyhtml, layerDepth) {
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { 
		//判断iPhone|iPad|iPod|iOS
//		alert(title);
		var paras = {title:title,url:historyhtml,layerDepth:layerDepth};
		IOS.loadWebPage(JSON.stringify(paras));
	} else if (/(Android)/i.test(navigator.userAgent)) { 
		//判断Android
//		alert(title);
		var paras = {title:title,url:historyhtml,layerDepth:layerDepth};
		Android.loadWebPage(JSON.stringify(paras));
	} else { //pc
		alert(title)
	};
}
//全部播放
function allplayer(idbox) {
	var allplayer = [];
	for (var i = 0; i < $("#" + idbox + " li").length; i++) {
		var paras = {
			mUrl: $("#" + idbox + " li").eq(i).attr("data-murl"),
			mCoverImageUrl: $("#" + idbox + " li").eq(i).attr("data-mcoverimageurl"),
			mTitle: $("#" + idbox + " li").eq(i).attr("data-mtitle"),
			mAlbum: $("#" + idbox + " li").eq(i).attr("data-malbum"),
			mArtist: $("#" + idbox + " li").eq(i).attr("data-martist"),
			mFavorite:$("#" + idbox + " li").eq(i).attr("data-mfavorite")
		}
		allplayer.push(paras);
	}
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
		IOS.playMusic(allplayer);
	} else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
		Android.playMusic(allplayer);
	}
}
//单个播放
function oneplayer(id) {
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
		var paras = [{
			mUrl: $("#song" + id).attr("data-murl"),
			mCoverImageUrl: $("#song" + id).attr("data-mcoverimageurl"),
			mTitle: $("#song" + id).attr("data-mtitle"),
			mAlbum: $("#song" + id).attr("data-malbum"),
			mArtist: $("#song" + id).attr("data-martist"),
			mFavorite:$("#song" + id).attr("data-mfavorite")
		}];
		IOS.playMusic(paras);
	} else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
		var paras = [{
			mUrl: $("#song" + id).attr("data-murl"),
			mCoverImageUrl: $("#song" + id).attr("data-mcoverimageurl"),
			mTitle: $("#song" + id).attr("data-mtitle"),
			mAlbum: $("#song" + id).attr("data-malbum"),
			mArtist: $("#song" + id).attr("data-martist"),
			mFavorite:$("#song" + id).attr("data-mfavorite")
		}];
		Android.playMusic(paras);
	}
}