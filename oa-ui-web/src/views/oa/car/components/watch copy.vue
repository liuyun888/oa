<template>
		<div  >
			<el-row  >
				<el-col :span="24" >
					<div>
						<el-radio-group v-model="timeChoice" @change="onChange"> 
							<el-radio-button label="0">当前活跃车辆</el-radio-button>
							<el-radio-button label="1">上周车辆概况</el-radio-button>
							<el-radio-button label="2">上月车辆概况</el-radio-button>
							<el-radio-button label="3">去年车辆概况</el-radio-button>
						</el-radio-group>
						<el-date-picker
							v-model="rangeTime"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
						<el-button type="primary" @click="onclick">按时间查看路线</el-button>
						<el-button type="primary"  @click="selectReqireVisible = true">选择用车编号</el-button>
					</div>
					
					<div id="showMap" :style="{height:screenHeight+'px'}"></div>
				</el-col>
				
			</el-row>
			<el-dialog append-to-body title="选择申请请求" :visible.sync="selectReqireVisible" width="70%">
			    <require-select @getSelectRequireVal="onRequireSelected" @cancel="selectReqireVisible = !selectReqireVisible"></require-select>
			</el-dialog>
		</div> 
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库 
	import {MP} from '../../../../common/js/map';
	import Vue from 'vue';
	import requireSelect from './RequireSelect'

	import { listAddressGPS } from '@/api/oa/car/carRequireRoute';
	
	//value为双向绑定的对象,其中需要地址信息和经纬度的数据，作用就是接收提交的数据，展示数据，改变提交的数据
	export default {
		props:	{
			'list': Array,	
		},
		watch: {
			'list':function(list){
				this.listGPS = list
	    	},
		},	
		computed:{
			'screenHeight':function(){
				return screen.height;
			}
		},
		data() {
			return {
				// /**begin 在下面加自定义属性,记得补上面的一个逗号**/
				map: '',
				lng:113.327936,//初始化的经纬度113.327936,23.028239
				lat:23.028239,
				myIcon:'',
				myIcon2:'',
				listGPS: null,
				timeChoice: '0',
				startTime : null,
				endTime : null,
				rangeTime: '',
				selectReqireVisible: false,
				ids: '',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {			
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/	    
		    initMap(){
		    	MP("q0GgIhNs7nDkY7FvFpGCcsrQrSp23I7R").then( BMap => {

					this.map = new BMap.Map("showMap",{enableMapClick:false});    // 创建Map实例

					var point = new BMap.Point(this.lng,this.lat); // 创建点坐标
					// 初始化地图,设置坐标点和地图级别
					this.map.centerAndZoom(point,18);
					//开启滑动
					this.map.enableScrollWheelZoom(true);

					this.myIcon = new BMap.Icon("../../../assets/image/Car.png", new BMap.Size(45, 25), {    //小车图片
						//offset: new BMap.Size(0, -5),    //相当于CSS精灵
						imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
					});
					this.myIcon2 = new BMap.Icon("src/views/oa/car/components/Car2.png", new BMap.Size(45, 30), {    //小车图片
						//offset: new BMap.Size(0, -5),    //相当于CSS精灵
						imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
					});
					
					//循环遍历后台获取过来的值
					if(this.listGPS != null && this.listGPS.length  > 0){
						this.listGPS.forEach(element => {
							
							//定义路线的颜色
							let routeColor = this.bg2()
							console.log(routeColor)

							var startPoint = null 	//路径开始的点
							var endPoint = null 	//路径结束的点
							if(element.hasDetail != null && element.hasDetail == '1'){
								let point = new Array() //途径的点
								for (let index = 0; index < element.subRoute.length; index++) {
									var obj = element.subRoute[index]; 
									var fromAddressGpsindex = obj.fromAddressGps.indexOf(',') //获取到在经纬度中,的下标
									var destAddressGpsindex = obj.destAddressGps.indexOf(',') //获取到在经纬度中,的下标

									if(index === 0){ //判断是否为第一条子路线，是的话起点作为总路线的起点
										startPoint = new BMap.Point(obj.fromAddressGps.substring(0,fromAddressGpsindex),obj.fromAddressGps.substring(fromAddressGpsindex+1,obj.fromAddressGps.length));
									}
									if(index === element.subRoute.length - 1){ //判断是否为最后一条子路线，是的话终点点作为总路线的终点
										endPoint = new BMap.Point(obj.destAddressGps.substring(0,destAddressGpsindex),obj.destAddressGps.substring(destAddressGpsindex+1,obj.destAddressGps.length));
									}else{
										point.push(new BMap.Point(obj.destAddressGps.substring(0,destAddressGpsindex),obj.destAddressGps.substring(destAddressGpsindex+1,obj.destAddressGps.length)))
									}
								}

								let driving = new BMap.DrivingRoute(this.map, {renderOptions:{map: this.map, autoViewport: true}});    //驾车实例
								driving.search(startPoint,endPoint,{waypoints:point});
								driving.setSearchCompleteCallback( () =>{
									let plan = driving.getResults().getPlan(0);
									let pts = []
									for(let i=0;i<plan.getNumRoutes();i++){
										pts = pts.concat(plan.getRoute(i).getPath()) ;
									}
									//重点在这   这个地方是关于修改颜色的
									let polyline = new BMap.Polyline(pts,{ strokeColor: routeColor, strokeWeight: 5, strokeOpacity: 1 });
									this.map.addOverlay(polyline);
								})
								setTimeout(() =>{
									//this.run(startPoint,endPoint,point,element,routeColor);
								},500);
								// console.log(point.length)
								// console.log(startPoint )
								// console.log(endPoint  )
							}else{
								console.log(element)
								let fromAddressGpsindex = element.fromAddressGps.indexOf(',')
								let destAddressGpsindex = element.destAddressGps.indexOf(',')
								let myP1 = new BMap.Point(element.fromAddressGps.substring(0,fromAddressGpsindex),element.fromAddressGps.substring(fromAddressGpsindex+1,element.fromAddressGps.length));
								let myP2 = new BMap.Point(element.destAddressGps.substring(0,destAddressGpsindex),element.destAddressGps.substring(destAddressGpsindex+1,element.destAddressGps.length));

								let driving = new BMap.DrivingRoute(this.map, {renderOptions:{map: this.map, autoViewport: true}}, );    //驾车实例
								driving.search(myP1,myP2);
								driving.setSearchCompleteCallback( () =>{
									let plan = driving.getResults().getPlan(0);
									let pts = []
									for(let i=0;i<plan.getNumRoutes();i++){
										pts = pts.concat(plan.getRoute(i).getPath()) ;
									}
									//重点在这   这个地方是关于修改颜色的
									let polyline = new BMap.Polyline(pts,{ strokeColor: routeColor, strokeWeight: 5, strokeOpacity: 1 });
									this.map.addOverlay(polyline);
								})
								setTimeout(() =>{
									//this.run(myP1,myP2,null,element,routeColor);
								},parseInt(Math.random()*(1500-500+1)+500,10));
							}

							if(element.signIns != null && element.signIns.length >=0 ){
								let signInpoint = new Array() //途径的点
								let signInStartPoint = null 	//路径开始的点
								let signInEndPoint = null 	//路径结束的点
								for (let index = 0; index < element.signIns.length; index++) {
									let obj = element.signIns[index]; 
									let addressGpsindex = obj.addressGps.indexOf(',') //获取到在经纬度中,的下标

									if(index === 0){ //判断是否为第一条打卡路线
										if(index === element.signIns.length - 1){
											if(obj.status == '1'){
												signInStartPoint = new BMap.Point(obj.addressGps.substring(0,addressGpsindex),obj.addressGps.substring(addressGpsindex+1,obj.addressGps.length));
											}else{
												signInStartPoint = startPoint
											}
											signInEndPoint = new BMap.Point(obj.addressGps.substring(0,addressGpsindex),obj.addressGps.substring(addressGpsindex+1,obj.addressGps.length));
										}else{
											if(obj.status == '1'){
												signInStartPoint = new BMap.Point(obj.addressGps.substring(0,addressGpsindex),obj.addressGps.substring(addressGpsindex+1,obj.addressGps.length));
											}else{
												signInStartPoint = startPoint
												signInpoint.push(new BMap.Point(obj.addressGps.substring(0,addressGpsindex),obj.addressGps.substring(addressGpsindex+1,obj.addressGps.length)))
											}
										}
									}else if(index === element.signIns.length - 1){ //判断是否为最后一条子路线，是的话终点点作为总路线的终点
										if(obj.status == '3'){
											signInEndPoint = new BMap.Point(obj.addressGps.substring(0,addressGpsindex),obj.addressGps.substring(addressGpsindex+1,obj.addressGps.length));
										}else{
											signInEndPoint = endPoint
											signInpoint.push(new BMap.Point(obj.addressGps.substring(0,addressGpsindex),obj.addressGps.substring(addressGpsindex+1,obj.addressGps.length)))
										}
										//signInEndPoint = new BMap.Point(obj.addressGps.substring(0,addressGpsindex),obj.addressGps.substring(addressGpsindex+1,obj.addressGps.length));
									}else{
										signInpoint.push(new BMap.Point(obj.addressGps.substring(0,addressGpsindex),obj.addressGps.substring(addressGpsindex+1,obj.addressGps.length)))
									}
								}
								// console.log(routeColor)
								// console.log(signInpoint)
								// console.log(signInStartPoint)
								// console.log(signInEndPoint)
								let driving = new BMap.DrivingRoute(this.map, {renderOptions:{map: this.map, autoViewport: true}});    //驾车实例
								driving.search(signInStartPoint,signInEndPoint,{waypoints:signInpoint});
								driving.setSearchCompleteCallback( () =>{
									let plan = driving.getResults().getPlan(0);
									let pts = []
									for(let i=0;i<plan.getNumRoutes();i++){
										pts = pts.concat(plan.getRoute(i).getPath()) ;
									}
									//重点在这   这个地方是关于修改颜色的
									let polyline = new BMap.Polyline(pts,{ strokeColor: routeColor, strokeWeight: 5, strokeOpacity: 1 });
									this.map.addOverlay(polyline);
								})
								setTimeout(() =>{
									//this.driverRun(signInStartPoint,signInEndPoint,signInpoint,element,routeColor);
								},parseInt(Math.random()*(2500-1500+1)+1500,10));

							}
						});
					}
				})		
			},
			run(myP1,myP2,point,element,routeColor){

				var driving = new BMap.DrivingRoute(this.map);    //驾车实例
				driving.search(myP1,myP2,{waypoints:point});
				driving.setSearchCompleteCallback(() =>{
					var pts = []	;    //通过驾车实例，获得一系列点的数组
					for (let index = 0; index < driving.getResults().getPlan(0).getNumRoutes(); index++) {
						pts = pts.concat(driving.getResults().getPlan(0).getRoute(index).getPath()) 	
					}
					//重点在这   这个地方是关于修改颜色的
					//var polyline = new BMap.Polyline(pts,{ strokeColor: routeColor, strokeWeight: 5, strokeOpacity: 1 });
					//this.map.addOverlay(polyline);

					var paths = pts.length;    //获得有几个点
					var carMk = new BMap.Marker(pts[0],{icon:this.myIcon});
					this.map.addOverlay(carMk);

					var label = new BMap.Label('模板路线信息', {offset:new BMap.Size(20,-10)});  // 创建文本标注对象
					label.setStyle({
						color : "red",
						fontSize : "12px",
						height : "20px",
						lineHeight : "20px",
						fontFamily:"微软雅黑",
						weidth: '50px'
					});
					carMk.setLabel(label)
					var opts = {
									width : 250,     // 信息窗口宽度
									height: 200,     // 信息窗口高度
									title : "路线信息" , // 信息窗口标题
								}
					var infoWindow = new BMap.InfoWindow("请求Id：" + element.requireId
						    + "<br/>路线名字：" + element.detailName
							+ "<br/>起点地址：" + element.fromAddress 
							+ "<br/>终点地址：" + element.destAddress, opts);  // 创建信息窗口对象 
					label.addEventListener("click", function(){          
							carMk.openInfoWindow(infoWindow,pts[i]);   //提示信息	
						});
					var i=0;
					function resetMkPoint(i){
						carMk.setPosition(pts[i]);
						
						if(i < paths){
							setTimeout(function(){
								i++;
								resetMkPoint(i);
							},70);
						}
					}
					setTimeout(() => {
						resetMkPoint(5);
					},50)
				});
				
			},
			driverRun(myP1,myP2,point,element,routeColor){

				var driving = new BMap.DrivingRoute(this.map);    //驾车实例
				driving.search(myP1,myP2,{waypoints:point});
				driving.setSearchCompleteCallback(() =>{
					var pts = []	;    //通过驾车实例，获得一系列点的数组
					for (let index = 0; index < driving.getResults().getPlan(0).getNumRoutes(); index++) {
						pts = pts.concat(driving.getResults().getPlan(0).getRoute(index).getPath()) 	
					}
					//重点在这   这个地方是关于修改颜色的
					//var polyline = new BMap.Polyline(pts,{ strokeColor: routeColor, strokeWeight: 5, strokeOpacity: 1 });
					//this.map.addOverlay(polyline);

					var paths = pts.length;    //获得有几个点
					var carMk = new BMap.Marker(pts[0],{icon:this.myIcon2});
					this.map.addOverlay(carMk);

					var label = new BMap.Label('实际行驶路线', {offset:new BMap.Size(20,-10)});  // 创建文本标注对象
					label.setStyle({
						color : "red",
						fontSize : "12px",
						height : "20px",
						lineHeight : "20px",
						fontFamily:"微软雅黑",
						weidth: '50px'
					});
					carMk.setLabel(label)
					var opts = {
									width : 250,     // 信息窗口宽度
									height: 200,     // 信息窗口高度
									title : "路线信息" , // 信息窗口标题
								}
					var infoWindow = new BMap.InfoWindow("请求Id：" + element.requireId
						    + "<br/>路线名字：" + element.detailName
							+ "<br/>起点地址：" + element.fromAddress 
							+ "<br/>终点地址：" + element.destAddress, opts);  // 创建信息窗口对象 
					label.addEventListener("click", function(){          
							carMk.openInfoWindow(infoWindow,pts[i]);   //提示信息	
						});
					var i=0;
					function resetMkPoint(i){
						carMk.setPosition(pts[i]);
						
						if(i < paths){
							setTimeout(function(){
								i++;
								resetMkPoint(i);
							},70);
						}
					}
					setTimeout(() => {
						resetMkPoint(5);
					},50)
				});
				
			},
			onChange(val){
				//alert(new Date().format("yyyy-MM-dd hh:mm:ss"))
				this.rangeTime = ''
				if(val == "0"){
					this.startTime = null
					this.endTime = null
					this.getAddressGPS()
				}else if(val == '1'){
					let start = new Date()
					this.startTime = start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
					this.endTime = new Date().getTime()
					this.getAddressGPS()
				}else if(val == '2'){
					let start = new Date()
					this.startTime = start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
					this.endTime = new Date().getTime()
					this.getAddressGPS()
				}else if(val == '3'){
					let start = new Date()
					this.startTime = start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
					this.endTime = new Date().getTime()
					this.getAddressGPS()
				}
			},
			onclick(){
				if(this.rangeTime != null && this.rangeTime != ''){
					this.startTime = this.rangeTime[0].getTime()
					this.endTime = this.rangeTime[1].getTime()
					this.getAddressGPS()
					this.timeChoice = ''
					//console.log(this.rangeTime[0])	
				}else{
					this.$message({ message: '请选择时间', type: 'error' });
				}				
			},
			onRequireSelected(vals){
				vals.forEach((val)=>{
					this.ids = this.ids +val.id+ ","
				})
				this.startTime = null
				this.endTime = null
				this.rangeTime = ''
				this.timeChoice = ''
				this.selectReqireVisible = false
				this.getAddressGPS()
			},
			//生成随机颜色
			getRandomColor(){    
				//return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);  
				//return '#'+(Math.random()*0xffffff<<0).toString(16);
				return "hsb(" + Math.random()  + ", 1, 1)";	
				//return  '#'+Math.random().toString(16).slice(2,8)
			},
			bg1(){
             return '#'+Math.floor(Math.random()*256).toString(10);
			},
			bg2(){
				return '#'+Math.floor(Math.random()*0xffffff).toString(16);
			},
			bg3(){
				var r=Math.floor(Math.random()*256);
				var g=Math.floor(Math.random()*256);
				var b=Math.floor(Math.random()*256);
				return "rgb("+r+','+g+','+b+")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
			},
			//获取GPS列表 CarRouteDetailTpl car_route_detail_tpl
			getAddressGPS() {
				let params = {
					startTime: this.startTime,
					endTime: this.endTime,
					
				}; 
				if(this.ids != null && this.ids != ''){
					params.ids = this.ids
				}
				listAddressGPS(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						//将获取打的GPS信息赋值给listGPS
						this.listGPS = res.data.data;
						this.ids = ''
						//console.log(this.listGPS)
 						this.initMap(); //调用地图初始化
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch();
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 
			'require-select': requireSelect,
		},
		mounted() {
			this.$nextTick(function () {
				if(this.list != null){
					this.listGPS = this.list; 
				}
				//获取地图路线
				this.getAddressGPS();
            })
		}//end mounted
	}

</script>

<style scoped>
	.container{
		height: 100%;
	}
	#showMap{
	    width: 100%;height:100%;margin:0;font-family:"微软雅黑";	
	}
	.app-wrapper{
		height: 100%;
	}
	.main-container{
		height: 100%;
	}
	.app-main{
		height: 100%;
	}
</style>

