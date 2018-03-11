var url = "https://admin.guostory.com/";
//var url = "http://192.168.0.120:8080/storytree/";
//var url = "https://xcx.guostory.com/";
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
	oldhtmlarr.push(oldhtml + ".html");
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
//		上传头像
function uploadimg() {
	$("#coverImage").attr("action", url + "common/imageUpload.do");
	$('#ImageFile').trigger('click');
}

function subimtimgBtn() {
	$(".allloadding").show();
	var form = $("#coverImage");
	var options = {
		url: $(form).attr("action"),
		type: 'post',
		success: function(data) {
			if (data.code == 0) {

				$("#Imagetext").val(data.data.src);
				$("#headimg").attr("src", url + data.data.src);
				window.localStorage.setItem("icon", data.data.src);
				$.ajax({
					type: 'POST',
					url: url + 'account/update.do',
					data: {
						id: window.localStorage.getItem("accountId"),
						icon: data.data.src
					},
					dataType: 'json',
					success: function(data) {
						$(".allloadding").hide();
					}
				});
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

function changedata(okcallback) {
	okcallback();
}

function getRandomArrayElements(arr, count) {
	var shuffled = arr.slice(0),
		i = arr.length,
		min = i - count,
		temp, index;
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random());
		temp = shuffled[index];
		shuffled[index] = shuffled[i];
		shuffled[i] = temp;
	}
	return shuffled.slice(min);
}

function scrollpage(stype) {
	$(window).scroll(function() {
		var bot = 1;
		if ((bot + $(window).scrollTop()) > ($(document).height() - $(window).height())) {
			if (stype == 'true') {
				nextpage();
			}
		}
	});
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
	var date = new Date(nS);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
	var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
	return Y + M + D + h + m + s;
}

function judetelphone(Icallback, Acallback, Pcallback) {
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		//判断iPhone|iPad|iPod|iOS
		Icallback()
	} else if (/(Android)/i.test(navigator.userAgent)) {
		//判断Android
		Acallback();
	} else { //pc
		Pcallback();
	};
}
//判断客户端进入页面
function checkAIEnter(title, historyhtml, layerDepth) {
	judetelphone(function() {
		//		alert(title);
		var paras = {
			title: title,
			url: historyhtml,
			layerDepth: layerDepth
		};
		window.webkit.messageHandlers.loadWebPage.postMessage(JSON.stringify(paras))
	}, function() {
//		alert(title);
		var paras = {
			title: title,
			url: historyhtml,
			layerDepth: layerDepth
		};
		Android.loadWebPage(JSON.stringify(paras));
	}, function() {
		alert(title)
	})
}
//全部播放或单个播放
function allplayer(d, id) {
	var allplayer = [];
	if (d == 0) {
		for (var i = 0; i < $("#listbox li").length; i++) {
			var paras = {
				mId: $("#listbox li").eq(i).attr("data-mid"),
				mUrl: $("#listbox li").eq(i).attr("data-murl"),
				mCoverImageUrl: $("#listbox li").eq(i).attr("data-mcoverimageurl"),
				mTitle: $("#listbox li").eq(i).attr("data-mtitle"),
				mAlbum: $("#listbox li").eq(i).attr("data-malbum"),
				mArtist: $("#listbox li").eq(i).attr("data-martist"),
				mFavorite: $("#listbox li").eq(i).attr("data-mfavorite"),
			}
			allplayer.push(paras);
		}
		var newparas = {
			musicList: allplayer,
			position: 0
		};
	} else if (d == 1) {
		for (var i = 0; i < $("#listbox li").length; i++) {
			if (id == $("#listbox li").eq(i).attr("id").substring(4)) {
				var showposition = i;
			}
			var paras = {
				mId: $("#listbox li").eq(i).attr("data-mid"),
				mUrl: $("#listbox li").eq(i).attr("data-murl"),
				mCoverImageUrl: $("#listbox li").eq(i).attr("data-mcoverimageurl"),
				mTitle: $("#listbox li").eq(i).attr("data-mtitle"),
				mAlbum: $("#listbox li").eq(i).attr("data-malbum"),
				mArtist: $("#listbox li").eq(i).attr("data-martist"),
				mFavorite: $("#listbox li").eq(i).attr("data-mfavorite"),
			}
			allplayer.push(paras);
		}
		var newparas = {
			musicList: allplayer,
			position: showposition
		};
	}
	judetelphone(function() {
		window.webkit.messageHandlers.playMusic.postMessage(JSON.stringify(newparas))
	}, function() {
		Android.playMusic(JSON.stringify(newparas));
	}, function() {
		alert(JSON.stringify(newparas))
	})
}
//banner图点击播放
function bannerplayer(id) {
	var allplayer = [];
	var bannerid = ['184', '155', '421', '420'];
	for (var i = 0; i < bannerid.length; i++) {
		if (id == bannerid[i]) {
			var showposition = i;
		}
	}
	$.ajax({
		type: 'POST',
		url: url + 'app/favoriteMelody/query.do',
		data: {
			melodyId: bannerid[0],
			accountId: window.localStorage.getItem("accountId")
		},
		dataType: 'json',
		success: function(data) {
			var paras = {
				mId: data.data.id,
				mUrl: url + data.data.melodyFilePath,
				mCoverImageUrl: url + data.data.melodyCoverImage,
				mTitle: data.data.melodyName,
				mAlbum: data.data.melodyAlbum,
				mArtist: data.data.melodyArtist,
				mFavorite: data.data.favorated
			};
			allplayer.push(paras);
			$.ajax({
				type: 'POST',
				url: url + 'app/favoriteMelody/query.do',
				data: {
					melodyId: bannerid[1],
					accountId: window.localStorage.getItem("accountId")
				},
				dataType: 'json',
				success: function(data) {
					var paras = {
						mId: data.data.id,
						mUrl: url + data.data.melodyFilePath,
						mCoverImageUrl: url + data.data.melodyCoverImage,
						mTitle: data.data.melodyName,
						mAlbum: data.data.melodyAlbum,
						mArtist: data.data.melodyArtist,
						mFavorite: data.data.favorated
					};
					allplayer.push(paras);
					$.ajax({
						type: 'POST',
						url: url + 'app/favoriteMelody/query.do',
						data: {
							melodyId: bannerid[2],
							accountId: window.localStorage.getItem("accountId")
						},
						dataType: 'json',
						success: function(data) {
							var paras = {
								mId: data.data.id,
								mUrl: url + data.data.melodyFilePath,
								mCoverImageUrl: url + data.data.melodyCoverImage,
								mTitle: data.data.melodyName,
								mAlbum: data.data.melodyAlbum,
								mArtist: data.data.melodyArtist,
								mFavorite: data.data.favorated
							};
							allplayer.push(paras);
							$.ajax({
								type: 'POST',
								url: url + 'app/favoriteMelody/query.do',
								data: {
									melodyId: bannerid[3],
									accountId: window.localStorage.getItem("accountId")
								},
								dataType: 'json',
								success: function(data) {
									var paras = {
										mId: data.data.id,
										mUrl: url + data.data.melodyFilePath,
										mCoverImageUrl: url + data.data.melodyCoverImage,
										mTitle: data.data.melodyName,
										mAlbum: data.data.melodyAlbum,
										mArtist: data.data.melodyArtist,
										mFavorite: data.data.favorated
									};
									allplayer.push(paras);
									var newparas = {
										musicList: allplayer,
										position: showposition
									};
									judetelphone(function() {
										window.webkit.messageHandlers.playMusic.postMessage(JSON.stringify(newparas))
									}, function() {
										Android.playMusic(JSON.stringify(newparas));
									}, function() {
										alert(JSON.stringify(newparas))
									})
								}
							});
						}
					});
				}
			});
		}
	});
}
//进入我的钱包
function entermywalet(mytype) {
	if (mytype == 1) {
		showalert("此功能尚未开通");
	} else {
		judetelphone(function() {
			judelogin(function() {
				showalert("请先登录您的账号");
			}, function() {
				window.webkit.messageHandlers.wallet.postMessage(null)
			})
		}, function() {
			judelogin(function() {
				showalert("请先登录您的账号");
			}, function() {
				Android.wallet();
			})
		}, function() {
			alert("我的钱包");
		})
	}
}
//进入成为vip
function entermember(mytype) {
	if (mytype == 1) {
		showalert("此功能尚未开通");
	} else {
		judetelphone(function() {
			judelogin(function() {
				showalert("请先登录您的账号");
			}, function() {
				window.webkit.messageHandlers.member.postMessage(null)
			})
		}, function() {
			judelogin(function() {
				showalert("请先登录您的账号");
			}, function() {
				Android.member();
			})
		}, function() {
			alert("成为vip");
		})
	}
}
//登录成功后传递accountid
function sendaccountid() {
	judetelphone(function() {
		var newparas = {
			accountId: window.localStorage.getItem("accountId")
		};
		window.webkit.messageHandlers.returnLogin.postMessage(JSON.stringify(newparas))
	}, function() {
		var newparas = {
			accountId: window.localStorage.getItem("accountId")
		};
		Android.returnLogin(JSON.stringify(newparas));
	}, function() {
		alert("成为vip");
	})
}