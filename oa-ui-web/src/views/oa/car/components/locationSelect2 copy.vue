<template>
		<div>
			<el-row>
				<el-col :span="8">
				
				</el-col>
				<el-col :span="3">
					<el-button  plain @click="searchPoi">搜索</el-button>
				</el-col>
				<el-col :span="13">
					<div v-if="showPointNewText">找不到合适地址？<span class="point_new" @click="pointResult(lng,lat)">标注新地址</span></div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">
			
				</el-col>
				<el-col :span="18">
					<div id="map"></div>
					<el-input id="suggestId" v-model="searchValue" placeholder="输入地点关键词搜索，可多个关键字" ></el-input>
				</el-col>
			</el-row>
			
		</div> 
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库 
	import {MP} from '../../../../common/js/map';
	import Vue from 'vue';
	
	//value为双向绑定的对象,其中需要地址信息和经纬度的数据，作用就是接收提交的数据，展示数据，改变提交的数据
	export default {
		
		data() {
			return {
				// /**begin 在下面加自定义属性,记得补上面的一个逗号**/
				// imgList:[],
				map: '',
				serchValue: '',
				// localSearch:{},
				// poiList:[],//搜索出来的地址
				// showPointNew:false,
				showPointNewText:false,
				lng:113.275,//初始化的经纬度113.275,23.117
				lat:23.117,
				searchValue:'',
				//searchResultPanel : '',
				// addressDisable:true,//地址描述是否不可修改

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {			
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/	    
		    initMap(){
		    	MP("q0GgIhNs7nDkY7FvFpGCcsrQrSp23I7R").then( BMap => {

					console.log(BMap)
		            var map = new BMap.Map("map",{enableMapClick:false});            // 创建Map实例
					var point = new BMap.Point(this.lng,this.lat); // 创建点坐标
					// 初始化地图,设置坐标点和地图级别
					map.centerAndZoom(point,15);
					//开启滑动
		            map.enableScrollWheelZoom();
		            
		            var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
		            var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
		            map.addControl(top_left_control);        
                    map.addControl(top_left_navigation); 

					// 创建标注
					var marker = new BMap.Marker(point);
					// 将标注添加到地图中
					map.addOverlay(marker);
					//跳动的动画
					marker.setAnimation(BMAP_ANIMATION_BOUNCE);

					// 城市列表控件显示位置
					var size = new BMap.Size(30, 20);
					//城市列表控件
					map.addControl(new BMap.CityListControl({
						 	anchor: BMAP_ANCHOR_TOP_RIGHT,
							offset: size,
							// 切换城市之间事件
							// onChangeBefore: function() {
							// 	alert('before');
							// },
							// 切换城市之后事件
							// onChangeAfter: function() {
							// 	alert('after');
							// }
					}));

					//this.map.addEventListener('click', this.handleClick);

					
					//建立一个自动完成的对象
					var ac = new BMap.Autocomplete({
						"input": "suggestId",
						"location": map
					});
					ac.show()

					//鼠标放在下拉列表上的事件
					ac.addEventListener("onhighlight", (e) => {
						console.log("onhighlight,onhighlight" )
						var str = "";
						var _value = e.fromitem.value;
						var value = "";
						if (e.fromitem.index > -1) {
							value = _value.province + _value.city + _value.district + _value.street + _value.business;
						}
						str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

						value = "";
						if (e.toitem.index > -1) {
							_value = e.toitem.value;
							value = _value.province + _value.city + _value.district + _value.street + _value.business;
						}
						str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
						
						this.G("searchResultPanel").innerHTML = str;
					});

					var myValue;
					//鼠标点击下拉列表后的事件
					ac.addEventListener("onconfirm", (e) =>{
						console.log("onconfirm,onconfirmonconfirmonconfirm" )
						var _value = e.item.value;
						myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
						this.G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
						this.setPlace();
					});
				})
					
			},
			handleClick(event) {
					console.log(event)
					//alert('点击的经纬度：' + event.Ag.lng + ', ' + event.Ag.lat);
					this.map.clearOverlays();  
					this.lng =  event.point.lng
					this.lat = event.point.lat
					
					// 创建点坐标
					var point = new BMap.Point(this.lng,this.lat); 
					// 创建标注
					var marker = new BMap.Marker(point);
					// 将标注添加到地图中
					this.map.addOverlay(marker);
					// 跳动的动画
					marker.setAnimation(BMAP_ANIMATION_BOUNCE);
			},
			//查询画点
		    pointResult(lng,lat){
		        this.map.clearOverlays();
		        var point = new BMap.Point(lng,lat);
				var marker = new BMap.Marker(point);  // 创建标注
				var that=this;
				var opts = {
				  width : 300,     // 信息窗口宽度
				  height: 10,     // 信息窗口高度
				  title :"需要编辑，请搜索或者拖拽标注！" , // 信息窗口标题
				  enableMessage:true,//设置允许信息窗发送短息
				  message:""
				}
				var infoWindow1 = new BMap.InfoWindow("", opts);  // 创建信息窗口对象 
				//var infoWindow2 = new BMap.InfoWindow("地址："+that.addForm.address, { width : 300,height: 10,enableMessage:true,message:""});  // 创建信息窗口对象 
				this.map.openInfoWindow(infoWindow1,point); //开启信息窗口
				marker.enableDragging();
				//开始拖拽时。隐藏信息窗口
				marker.addEventListener("dragstart", function(){          
					that.map.closeInfoWindow();
				});
				//拖拽结束
				marker.addEventListener("dragend", function(type){          
					that.value[that.longitude]=type.point.lng;
					that.value[that.latitude]=type.point.lat;
					that.value[that.address]='';
					that.showPointNew=true;
				});
				/* marker.addEventListener("click", function(){          
					that.map.openInfoWindow(infoWindow2,point); //开启信息窗口
				}); */
				this.map.addOverlay(marker);
			},
			G(id) {
				console.log("G(id)G(id)G(id)G(id)")
				return document.getElementById(id);
			},	
			searchPoi(){
				var local = new BMap.LocalSearch(this.map, {
						renderOptions:{map: this.map}
				});
				local.search(this.serchValue);
			},
			setPlace() {
				//清除地图上所有覆盖物
				map.clearOverlays();

				function myFun() {
					//获取第一个智能搜索的结果
					var pp = local.getResults().getPoi(0).point;
					// 获取搜索结果的详细地址
					window.alert(local.getResults().getPoi(0).address)
					let address = local.getResults().getPoi(0).address;
					// 将获取到的地址填充到表单
					window.document.getElementById("address").value = address
					map.centerAndZoom(pp, 18);
					//添加标注
					map.addOverlay(new BMap.Marker(pp));
				}
				//智能搜索
				var local = new BMap.LocalSearch(map, {
					onSearchComplete: myFun
				});
				local.search(this.myValue);
			}
		/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'shop-location-edit':ShopLocationEdit
		    //'rich-editor':RichEditor,
		    // 'third-map':ThirdMap,
		},
		mounted() {
			this.$nextTick(function () {
			   this.initMap();
            })
            
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
	#map{
	    width: 100%;height:356px;margin:0;font-family:"微软雅黑";
	}
	#r-result{
	    height:auto;
	    overflow: scroll;
	    overflow-x: visible;
	    padding: 10px;
	    border: 1px solid #e0e0e0;
	}
	.sign{
	   color: #fbfbfb;
	    background-color: #0d2b90;
	    padding: 3px 7px;
	    border-radius: 21px;
	}
	.one_address{
	    border-bottom: 1px solid #cecece;
        line-height: 26px;
        margin-bottom: 7px;
	}
	.one_bg{
	   background-color: #e7f1ff;
	}
    .content{
        position:absolute; 
        width:100%; 
        background-color:#f6f8f9;
        left:0; 
        top:0;
    }
    .smallContent{
        padding: 30px 128px;
    }
    .bigtitle{
       font-size: 26px;
    }
    .main_title{
       color: #44b549;
    }
    .second_tile{
       color: #9a9a9a;
    }
    .titlediv{
       padding: 26px 0px 40px;
    }
    .form_context{
       margin-bottom: 30px;
       background-color: #fff;
       -moz-border-radius: 3px;
       -webkit-border-radius: 3px;
       box-shadow: 0 1px 5px 0 rgba(0,0,0,0.05);
       padding: 40px;
    }
    .form_title{
        font-size: 14px;
	    height: 32px;
	    line-height: 32px;
	    border-bottom: 1px solid #e7e7eb;
	    margin-bottom: 25px;
	    font-weight: normal;
    }
    .form_intro{
        color: #8d8d8d;
	    margin-left: 1em;
	    font-weight: normal;
    }
    .shuomingtext{
      color: #8b8e8e;
      line-height: 24px;
   }
   .shuomingtext_red{
      color: #e25b5b;
      line-height: 24px;
   }
   .bottomdiv{
      border-top: 1px solid #e7e7eb;
      padding-top: 20px;
      text-align: center;
   }
   .point_new{
      color: #4c81af;
      cursor: pointer;
   }
	.tangram-suggestion-main {
		z-index: 9999999999;
	}
	#searchResultPanel{
		z-index: 9999999999;
	}
</style>