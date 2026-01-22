<template>
		<div>
			<el-row>
				<el-col :span="10">
					<el-input id="suggestId" v-model="searchValue" placeholder="输入地点关键词搜索" ></el-input>
					<div v-html="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
				</el-col>
				<el-col :span="3">
					<el-button plain @click="">刷新</el-button>
				</el-col>
				<el-col :span="8">
					<div v-if="poiName" >
						<el-tag size="" v-text='"位置: " + poiName'></el-tag>
					</div>
				</el-col>
			</el-row>
			<br/>
			<el-row>
				<el-col :span="24">
					<div id="map"></div>
				</el-col>
			</el-row>
			 <el-row>
				<el-col :span="24" :offset="8"> 
					<el-button @click.native="handleCancel">取消</el-button>  
					<el-button type="primary" @click.native="handleConfirm">提交</el-button>  
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
		props:	{
				'value':String,
				'addrName':String,
				'attrName':String
		},
		watch: {
			'value':function(val){
				console.log(val+"----------")
				if(val != ''){
					this.addrName = this.addrName
					var vals = val.split(',')
					this.lng = vals[0]
					this.lat = vals[1]
					var p = new BMap.Point(this.lng,this.lat); 
					this.updateMap(p)
					this.map.centerAndZoom(p,18);
				}
				this.searchValue = ''
				console.log("attrName" + this.attrName)
	      },
	    },	
		data() {
			return {
				// /**begin 在下面加自定义属性,记得补上面的一个逗号**/
				map: '',
				searchValue: '',
				searchResultPanel:'',
				showPointNewText:false,
				lng:113.327936,//初始化的经纬度113.327936,23.028239
				lat:23.028239,
				poiName: '',
				myValue: '',
				addrComponent: '',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {			
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/	    
		    initMap(){
		    	MP("q0GgIhNs7nDkY7FvFpGCcsrQrSp23I7R").then( BMap => {
					this.map = new BMap.Map("map",{enableMapClick:false});    // 创建Map实例

					if(this.value != null && this.value != ''){
						var vals = this.value.split(",")
						this.lng = vals[0]
						this.lat = vals[1]
					}
					var point = new BMap.Point(this.lng,this.lat); // 创建点坐标
					// 初始化地图,设置坐标点和地图级别
					this.map.centerAndZoom(point,18);
					//开启滑动
		            this.map.enableScrollWheelZoom(true);
		            
		            var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
		            var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
		            this.map.addControl(top_left_control);        
					this.map.addControl(top_left_navigation); 
					
					this.updateMap(point)   
					
					//建立一个自动完成的对象
					var ac = new BMap.Autocomplete({
						"input": "suggestId",
						"location": this.map
					});
					
					//鼠标放在下拉列表上的事件
					ac.addEventListener("onhighlight", this.onhighlight);

					//鼠标点击下拉列表后的事件
					ac.addEventListener("onconfirm",  this.onconfirm);

					// 城市列表控件显示位置
					var size = new BMap.Size(30, 20);
					//城市列表控件
					this.map.addControl(new BMap.CityListControl({
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

					//地图单击事件
					//this.map.addEventListener('click', this.handleClick);
					  
					//添加右击菜单
					var menu = new BMap.ContextMenu();
					var txtMenuItem = [
						{
							text:'选中该地址',
							callback: this.handleClick
						},
					];
					for(var i=0; i < txtMenuItem.length; i++){
						menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
					}
					this.map.addContextMenu(menu);

				})		
			},
			//修改地图
			updateMap(point){
				
				//清除标注
				this.map.clearOverlays();
				// 创建标注
				var marker = new BMap.Marker(point);
				// 将标注添加到地图中
				this.map.addOverlay(marker);
				//跳动的动画
				marker.setAnimation(BMAP_ANIMATION_BOUNCE);

				var geoc = new BMap.Geocoder(); 
				geoc.getLocation(point, (rs) => {
					var addComp = rs.addressComponents
					this.addrComponent = addComp
					//console.log(addComp)
					this.poiName = addComp.province + addComp.city +  addComp.district +  addComp.street +  addComp.streetNumber
					
					//console.log(this.poiName + "ssssss")
				});     
				
			},
			//鼠标点击下拉列表后的事件
			onconfirm(e){
				var _value = e.item.value;
				this.myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
				this.searchResultPanel = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + this.myValue;
				this.setPlace();
			},
			//鼠标放在下拉列表上的事件
			onhighlight(e){
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
				
				this.searchResultPanel = str;
			},
			handleClick(event) {
					//alert('点击的经纬度：' + event.lng + ', ' + event.lat);
					// 创建点坐标
					this.lng = event.lng
					this.lat = event.lat
					var point = new BMap.Point(event.lng,event.lat); 
					this.map.centerAndZoom(point,18);
					this.updateMap(point)
			},
			//设置搜索出来的注标	
			setPlace(){
				this.map.clearOverlays();    //清除地图上所有覆盖物
				var local = new BMap.LocalSearch(this.map, { //智能搜索
					onSearchComplete: ()=>{
						var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
						this.lng = pp.lng
						this.lat = pp.lat
						this.map.centerAndZoom(pp, 18);
						//调用修改方法
						this.updateMap(pp)
					}
				});
				//console.log(this.myValue)
				local.search(this.myValue);
			},

			// 取消按钮点击 父组件监听@cancel="xxxVisible=false" 监听
			handleCancel: function(){
				this.$emit('cancel');
            },
            // 确定按钮点击 父组件监听@getSelectVal="xxxVisible=false" 监听
            handleConfirm: function(){
				this.$emit("getPoi",this.lng+","+this.lat,this.poiName,this.attrName,this.addrComponent)
				//console.log(this.addrComponent)
				//this.$emit("getAddrComponent",this.addrComponent)
            },
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 
		},
		mounted() {
			this.$nextTick(function () {
			   this.initMap();
            })
		}//end mounted
	}

</script>


<style scoped>
	#map{
	    width: 100%;height:356px;margin:0;font-family:"微软雅黑";
	}
</style>
<style>
	.tangram-suggestion-main {	
		z-index: 9999999999;
	}
</style>
