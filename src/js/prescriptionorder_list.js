$(function() {
	var $orderList = $('.all-order');
	var chufangObj = {
		ajaxData: {
			 customerId: LS.get('custormid'),
			 // customerId:54,
			 state: ''
		},
		init: function() {
			var _this = this;
			_this.getAjax()
			//获取ip
	        $.post('http://synsunny.parsec.com.cn/Dorado/ip/address',function(data,status){
	            document.querySelector("#keleyivisitorip").innerHTML= data.host
	        })
			$('.nav-bar').on('click', '.nav-bar-detail', function(e) {
				var $index = $(this).index();
				$(this).addClass('active').siblings().removeClass('active')
				if ($index == 1) {
					$orderList.empty()
					_this.getAjax(2)
				} else if ($index == 0) {
					$orderList.empty()
					_this.getAjax()
				}
			})
			$orderList.on('click', '.order-content', function(e) {
				e.stopPropagation()
				var id = $(this).parents('.order-box').data('id');
				location.href = "chufang-detail.html?id=" + id;
			})			
			$orderList.on('click', '.order-btn', function(e) {
				e.stopPropagation()
				var id = $(this).parents('.order-box').data('id')
				_this.pay(id)
			})
		},
		pay: function(id) {
			var payObj = {
				ip: document.querySelector('#keleyivisitorip').innerHTML,
				id: id,
				openid: LS.get(Constants.openid),
				customerId: LS.get('custormid')
			}
			console.log(payObj);
			$.ajax({
				url: Constants.hostIp + 'weixin/plus/recipe/pay',
				type: 'post',
				data: payObj,
				timeout: 5000,
				success: function(data) {
					console.log(data);
					if (data.status == 0) {
						js_params = data.object;
						// alert(data.msg)
						paybill(function(){
							location.reload()
						});
					} else {
						console.log(data.msg)
					}
				}.bind(this),
				error: function(err) {
					console.log('err')
				}
			})
		},
		getAjax: function(type) {
			var _this = this;
			if (typeof type == "number" && type == 2) {
				_this.ajaxData['state'] = type;
			} else {
				_this.ajaxData['state'] = '';
			}
			$.ajax({
				type: "get",
				url: Constants.hostIp + 'weixin/plus/recipe/list',
				dataType: "json",
				data: _this.ajaxData,
				success: function(data) {
					console.log(data);
					if (data.status == 0) {
						var Str = '';
						if (data.lst.length > 0) {
							data.lst.forEach(function(item) {
								var temp = _this.domStr(item)
								Str += temp;
							})
							$orderList.append(Str)
						}else{
							$orderList.append("<p style=\"margin-top:1rem;text-align:center;font-size:0.5rem;\">您还没有处方抓药订单</p>")
						}
					}
				}.bind(this),
				error: function(err) {
					console.log('err')
				}
			});
		},
		stateJudge: function(item) {
			var str = '';
			if (item.state == 1) {
				str = '待客服确认'
				return str;
			}
			if (item.state == 2) {
				str = '待付款'
				return str;
			}
			if (item.state == 3) {
				str = '待发货'
				return str;
			}
			if (item.state == 4) {
				str = '待收货'
				return str;
			}
			if (item.state == 5) {
				str = '已完成 '
				return str;
			}
			if (item.state == 6) {
				str = '无效订单'
				return str;
			}
		},
		domStr: function(item) {
			var stateText = this.stateJudge(item)
			var payClickShow = "";
			var totalPriceshow=''
			if (item.state == 2) {
				payClickShow = 'show'
			}
			if(item.state==2){
				totalPriceshow="<div class=\"order-price\">总价: <span>￥"+item.totalPrice+"</span></div>";
			}
			var imgsrc=item.img.split(',')[0]
			var str =
				"<div data-id=" + item.id + " class=\"order-box\">" +
				"<div class=\"order-title\">" +
				"<div class=\"order-status\">状态: " + stateText + "</div>" +
				// "<div class=\"order-price hide "+totalPriceshow+"\">总价: <span>￥"+item.totalPrice+"</span></div>" +
				totalPriceshow+
				"<div class=\"order-btn btn-warning " + payClickShow + " \">付款</div>" +
				"</div>" +
				"<div class=\"order-content\">" +
				"<div class=\"content-left\">" +
				"<img src=\"" +Constants.host +imgsrc + "\" />" +
				"</div>" +
				"<div class=\"content-right\">" +
				"<div class=\"content-txt\">" + item.number + "件</div>" +
				"<div class=\"content-txt\">提交时间: " + item.showCreateTime + "</div>" +
				"</div>" +
				"</div>" +
				"</div>"
			return str;
		}
	}
	chufangObj.init()
})