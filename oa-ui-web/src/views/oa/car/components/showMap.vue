<template>
		<div>
			<el-row>
				<el-col :span="24">
					<div id="showMap"></div>
				</el-col>
			</el-row>
		</div> 
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库 
	import {MP} from '../../../../common/js/map';
	import Vue from 'vue';

	import car from "../../../../assets/image/Car.png";
	
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
		data() {
			return {
				// /**begin 在下面加自定义属性,记得补上面的一个逗号**/
				map: '',
				lng:113.327936,//初始化的经纬度113.327936,23.028239
				lat:23.028239,
				listGPS: null,
				// bounds : null,
				// linesPoints : null,
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
			
					this.myIcon = new BMap.Icon(car, new BMap.Size(45, 25), {    //小车图片
						//offset: new BMap.Size(0, -5),    //相当于CSS精灵
						imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
					});
					
					if(this.listGPS != null){
						if( this.listGPS.length  > 1){

							var point = new Array() //途径的点
							var startPoint = null 	//路径开始的点
							var endPoint = null 	//路径结束的点

							//循环遍历后台获取过来的值
							for (let index = 0; index < this.listGPS.length; index++) {
								var obj = this.listGPS[index] 
								var fromAddressGpsindex = obj.fromAddressGps.indexOf(',') //获取到在经纬度中,的下标
								var destAddressGpsindex = obj.destAddressGps.indexOf(',') //获取到在经纬度中,的下标

								if(index === 0){ //判断是否为第一条子路线，是的话起点作为总路线的起点
									startPoint = new BMap.Point(obj.fromAddressGps.substring(0,fromAddressGpsindex),obj.fromAddressGps.substring(fromAddressGpsindex+1,obj.fromAddressGps.length));
								}
								if(index === this.listGPS.length - 1){ //判断是否为最后一条子路线，是的话终点点作为总路线的终点
									endPoint = new BMap.Point(obj.destAddressGps.substring(0,destAddressGpsindex),obj.destAddressGps.substring(destAddressGpsindex+1,obj.destAddressGps.length));
								}else{
									point.push(new BMap.Point(obj.destAddressGps.substring(0,destAddressGpsindex),obj.destAddressGps.substring(destAddressGpsindex+1,obj.destAddressGps.length)))
								}
							}
							var driving = new BMap.DrivingRoute(this.map, {renderOptions:{map: this.map, autoViewport: true}});    //驾车实例
							driving.search(startPoint,endPoint,{waypoints:point});
							driving.setSearchCompleteCallback( () =>{
								var plan = driving.getResults().getPlan(0);
								var pts = []
								for(var i=0;i<plan.getNumRoutes();i++){
									pts = pts.concat(plan.getRoute(i).getPath()) ;
								}
								//重点在这  这个地方是关于修改颜色的
								// var polyline = new BMap.Polyline(pts,{ strokeColor: this.getRandomColor(), strokeWeight: 5, strokeOpacity: 1 });
								// this.map.addOverlay(polyline);
							})

							// console.log(point.length)
							// console.log(startPoint )
							// console.log(endPoint  )
							
							setTimeout(() =>{
								this.run(startPoint,endPoint,point);
							},500);
							

						}else{
							var element = this.listGPS[0] 
							var fromAddressGpsindex = element.fromAddressGps.indexOf(',')
							var destAddressGpsindex = element.destAddressGps.indexOf(',')
							var myP1 = new BMap.Point(element.fromAddressGps.substring(0,fromAddressGpsindex),element.fromAddressGps.substring(fromAddressGpsindex+1,element.fromAddressGps.length));
							var myP2 = new BMap.Point(element.destAddressGps.substring(0,destAddressGpsindex),element.destAddressGps.substring(destAddressGpsindex+1,element.destAddressGps.length));

							var driving = new BMap.DrivingRoute(this.map, {renderOptions:{map: this.map, autoViewport: true}}, );    //驾车实例
							driving.search(myP1,myP2);
							driving.setSearchCompleteCallback( () =>{
								var plan = driving.getResults().getPlan(0);
								var pts = []
								for(var i=0;i<plan.getNumRoutes();i++){
									pts = pts.concat(plan.getRoute(i).getPath()) ;
								}
								//重点在这   这个地方是关于修改颜色的
								// var polyline = new BMap.Polyline(pts,{ strokeColor:this.getRandomColor(), strokeWeight: 5, strokeOpacity: 1 });
								// this.map.addOverlay(polyline);
							})

							setTimeout(() =>{
								this.run(myP1,myP2);
							},500);
						}
					}

					//第一版本的代码
					//this.initLine();
					// setTimeout(()=>{
					// 	this.run();
					// },1000);
				})		
			},
			run(myP1,myP2,point){
				var driving = new BMap.DrivingRoute(this.map);    //驾车实例
				driving.search(myP1,myP2,{waypoints:point});
				driving.setSearchCompleteCallback(() =>{
					var pts = [];    //通过驾车实例，获得一系列点的数组
					for (let index = 0; index < driving.getResults().getPlan(0).getNumRoutes(); index++) {
						pts = pts.concat(driving.getResults().getPlan(0).getRoute(index).getPath()) 	
					}
					//重点在这   这个地方是关于修改颜色的
					// var polyline = new BMap.Polyline(pts,{ strokeColor: this.getRandomColor(), strokeWeight: 5, strokeOpacity: 1 });
					// this.map.addOverlay(polyline);

					var paths = pts.length;    //获得有几个点
					var carMk = new BMap.Marker(pts[0],{icon:this.myIcon});
					this.map.addOverlay(carMk);

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
			//生成随机颜色
			getRandomColor(){    
				//return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);  
				return '#'+(Math.random()*0xffffff<<0).toString(16);
			},

			//下面是第一版本的代码
			// run(){
			// 	var myIcon = new BMap.Icon("/src/views/oa/car/components/Car.png", new BMap.Size(32, 70), {imageOffset: new BMap.Size(0, 0)});

			// 	for(var m = 0;m < this.linesPoints.length; m++){
			// 		var pts = this.linesPoints[m];
			// 		var len = pts.length;
			// 		var carMk = new BMap.Marker(pts[0],{icon:myIcon});
			// 		this.map.addOverlay(carMk);
			// 		resetMkPoint(1,len,pts,carMk)
			// 	}
			// 	function resetMkPoint(i,len,pts,carMk){
			// 		carMk.setPosition(pts[i]);
			// 		if(i < len){
			// 			setTimeout(function(){
			// 				i++;
			// 				resetMkPoint(i,len,pts,carMk);
			// 			},100);
			// 		}
			// 	}
			// },
			// initLine(){
			// 	this.bounds = new Array();
			// 	this.linesPoints = new Array();
			// 	this.map.clearOverlays();  //清楚地图障碍物

			// 	// var spoi1 = new BMap.Point(113.327936,23.028239);    // 起点1
			// 	// var spoi2 = new BMap.Point(116.62794,23.663825);    // 起点2
			// 	// var epoi1  = new BMap.Point(114.037238,22.616716);    // 终点
			// 	// var epoi2  = new BMap.Point(114.037238,22.616716);    // 终点
				                                                  
			// 	// var driving3 = new BMap.DrivingRoute(this.map,{onSearchComplete: this.drawLine});  // 驾车实例,并设置回调
			// 	// 	driving3.search(spoi1, epoi1);                                       // 搜索一条线路
			// 	// var driving4 = new BMap.DrivingRoute(this.map,{onSearchComplete: this.drawLine});  // 驾车实例,并设置回调
			// 	// 	driving4.search(spoi2, epoi2);                                       // 搜索一条线路

			// 	if(this.listGPS != null && this.listGPS.length > 0){
			// 		this.listGPS.forEach(element => {
			// 			console.log(element)
			// 			var fromAddressGpsindex = element.fromAddressGps.indexOf(',')
			// 			var destAddressGpsindex = element.destAddressGps.indexOf(',')
			// 			var point1 = new BMap.Point(element.fromAddressGps.substring(0,fromAddressGpsindex),element.fromAddressGps.substring(fromAddressGpsindex+1,element.fromAddressGps.length));
			// 			var point2 = new BMap.Point(element.destAddressGps.substring(0,destAddressGpsindex),element.destAddressGps.substring(destAddressGpsindex+1,element.destAddressGps.length));
						
			// 			console.log(point1)
			// 			console.log(point2)

			// 			var driving = new BMap.DrivingRoute(this.map, {onSearchComplete: this.drawLine});  // 驾车实例,并设置回调
			// 			driving.search(point1, point2);     

			// 		});
			// 	}else{
			// 			this.$message('error')
			// 	}
			// },
			// drawLine(results){
			// 	var opacity = 0.45;
			// 	var planObj = results.getPlan(0);
			// 	var b = new Array();
			// 	var addMarkerFun = (point,imgType,index,title) =>  {
			// 		var url;
			// 		var width;
			// 		var height
			// 		var myIcon;
			// 		// imgType:1的场合，为起点和终点的图；2的场合为车的图形
			// 		if(imgType == 1){
			// 			url = "/src/views/oa/car/components/dest_markers.png";
			// 			width = 42;
			// 			height = 34;
			// 			myIcon = new BMap.Icon(url,new BMap.Size(width, height),{offset: new BMap.Size(14, 32),imageOffset: new BMap.Size(0, 0 - index * height)});
			// 		}else{
			// 			url = "/src/views/oa/car/components/trans_icons.png";
			// 			width = 22;
			// 			height = 25;
			// 			var d = 25;
			// 			var cha = 0;
			// 			var jia = 0
			// 			if(index == 2){
			// 				d = 21;
			// 				cha = 5;
			// 				jia = 1;
			// 			}
			// 			myIcon = new BMap.Icon(url,new BMap.Size(width, d),{offset: new BMap.Size(10, (11 + jia)),imageOffset: new BMap.Size(0, 0 - index * height - cha)});
			// 		}	
			// 		var marker = new BMap.Marker(point, {icon: myIcon});
			// 		if(title != null && title != ""){
			// 			marker.setTitle(title);
			// 		}
			// 		// 起点和终点放在最上面
			// 		if(imgType == 1){
			// 			marker.setTop(true);
			// 		}
			// 		this.map.addOverlay(marker);
			// 	}
			// 	var addPoints = (points) => {
			// 		for(var i = 0; i < points.length; i++){
			// 			this.bounds.push(points[i]);
			// 			b.push(points[i]);
			// 		}
			// 	}	
			// 	// 绘制驾车步行线路
			// 	for (var i = 0; i < planObj.getNumRoutes(); i ++){
			// 		var route = planObj.getRoute(i);
			// 		if (route.getDistance(false) <= 0){continue;}
			// 		addPoints(route.getPath());
			// 		// 驾车线路
			// 		if(route.getRouteType() == BMAP_ROUTE_TYPE_DRIVING){
			// 			this.map.addOverlay(new BMap.Polyline(route.getPath(), {strokeColor: "#0030ff",strokeOpacity:opacity,strokeWeight:6,enableMassClear:true}));
			// 		}else{
			// 			// 步行线路有可能为0
			// 			this.map.addOverlay(new BMap.Polyline(route.getPath(), {strokeColor: "#30a208",strokeOpacity:0.75,strokeWeight:4,enableMassClear:true}));
			// 		}
			// 	}	
			// 	this.map.setViewport(this.bounds);	
			// 	// 终点
			// 	addMarkerFun(results.getEnd().point,1,1);
			// 	// 开始点
			// 	addMarkerFun(results.getStart().point,1,0);
			// 	this.linesPoints[this.linesPoints.length] = b;
			// },
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 
		},
		mounted() {
			this.$nextTick(function () {
				this.listGPS = this.list; 
			    this.initMap();
            })
		}//end mounted
	}

</script>


<style scoped>
	#showMap{
	    width: 100%;height:356px;margin:0;font-family:"微软雅黑";
	}
</style>
<style>
	
</style>
