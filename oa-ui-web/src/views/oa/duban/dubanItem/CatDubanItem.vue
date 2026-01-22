<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchDubanItems">查询</el-button>
			<el-button @click="queryTopFormVisible = true" type="text">高级查询</el-button>
		</el-row>
		<el-row class="page-main padding-top"> 

			<el-col v-if="isShowNav" class="menuNav" :span="menuSpan">
				<drawer-components @selectCategory="selectCategory"></drawer-components>
			</el-col>
			
			<el-col class="itemTable" :span="itemSpan">
				<div :style="{'top': Number(menuTop / 3 - 100) + 'px'}" class="showMenuIcon" @click="openDrawer">
				</div>
				<!--列表 DubanItem duban_item-->
				<el-table ref="itemTable" :data="dubanItems" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column>
					<el-table-column sortable type="index" width="40"></el-table-column>
					<el-table-column prop="id" label="督办字号" min-width="80" ></el-table-column>
					<el-table-column prop="name" label="事项名称" min-width="80" >
						<template slot-scope="scope">
							<el-button type="text" @click="routeSkip(scope.row.id)">{{scope.row.name}}</el-button>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="dutyId" label="责任人id" min-width="80" ></el-table-column> -->
					<el-table-column prop="status" label="状态" min-width="80" >
						<template slot-scope="scope">
							<el-tag v-if="scope.row.status == '0'" type="" effect="dark">已申报</el-tag>
							<el-tag v-if="scope.row.status == '1'" type="info" effect="dark">进行中</el-tag>
							<el-tag v-if="scope.row.status == '2'" type="success" effect="dark">已完成</el-tag>
							<el-tag v-if="scope.row.status == '3'" type="danger" effect="dark">已超时</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="progress" label="进度" min-width="120" >
						<template slot-scope="scope">
							<el-progress v-if="scope.row.progress < 25 " :text-inside="true" :stroke-width="26" :percentage="Number(scope.row.progress)" status="exception" ></el-progress>
							<el-progress v-if="scope.row.progress < 50 && scope.row.progress >= 25 " :text-inside="true" :stroke-width="26" :percentage="Number(scope.row.progress)" status="warning" ></el-progress>
							<el-progress v-if="scope.row.progress < 100 && scope.row.progress >= 50 " :text-inside="true" :stroke-width="26" :percentage="Number(scope.row.progress)" ></el-progress>
							<el-progress v-if="scope.row.progress >= 100" :text-inside="true" :stroke-width="26" :percentage="Number(scope.row.progress)" status="success" ></el-progress>
						</template>
					</el-table-column>
					<el-table-column prop="createUsername" label="创建人" min-width="80" ></el-table-column>
					<el-table-column prop="categoryName" label="事项类型" min-width="80" ></el-table-column>
					<el-table-column prop="dutyName" label="责任人" min-width="80" ></el-table-column>
					<!-- <el-table-column prop="betweenDeptid" label="牵头部门id" min-width="80" ></el-table-column>
					<el-table-column prop="betweenDeptName" label="牵头部门名称" min-width="80" ></el-table-column>
					<el-table-column prop="betweenId" label="牵头人id||中间人id" min-width="80" ></el-table-column>
					<el-table-column prop="betweenName" label="牵头人名称" min-width="80" ></el-table-column>
					<el-table-column prop="branchId" label="归属机构" min-width="80" ></el-table-column> -->
					<el-table-column prop="startTime" :formatter="dateFamtter" label="计划开始时间" min-width="80" ></el-table-column>
					<el-table-column prop="endTime" :formatter="dateFamtter" label="计划结束时间" min-width="80" ></el-table-column>	
					<!-- <el-table-column prop="hostDeptId" label="主办单位id" min-width="80" ></el-table-column>
					<el-table-column prop="hostDeptName" label="主办单位" min-width="80" ></el-table-column>
					<el-table-column prop="hostId" label="主办id" min-width="80" ></el-table-column> -->
					<el-table-column prop="hostName" label="主办" min-width="80" ></el-table-column>
					<!-- <el-table-column prop="remark" label="任务描述" min-width="80" ></el-table-column>
					<el-table-column prop="createTime" label="创建时间" min-width="80" ></el-table-column> -->
					<el-table-column prop="coopusers" label="协办" min-width="120" >
						<template slot-scope="scope">
							<el-button v-for="(item,index) in scope.row.coopUsers" :key="index" type="text">{{item.username}}</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
			</el-col>

			<el-dialog :visible.sync="queryTopFormVisible"  width="60%"  :close-on-click-modal="false">
				<query-top  @queryTop="queryTop"  @cancel="queryTopFormVisible=false"></query-top>
			</el-dialog> 

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listDubanItem } from '@/api/oa/duban/dubanItem';
	import { mapGetters } from 'vuex'
	import DrawerComponents from '../components/DrawerComponents';
	import QueryTop from '../components/QueryTop';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			'menuTop': function(){
				return screen.height 
			},
		},
		data() {
			return {
				filters: {
					key: ''
				},
				dubanItems: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增dubanItem界面是否显示
				//新增dubanItem界面初始化数据
				addForm: {
					id:'',name:'',dutyId:'',dutyName:'',betweenDeptid:'',betweenDeptName:'',betweenId:'',betweenName:'',branchId:'',startTime:'',endTime:'',hostDeptId:'',hostDeptName:'',hostId:'',hostName:'',remark:'',status:'',createTime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑dubanItem界面初始化数据
				editForm: {
					id:'',name:'',dutyId:'',dutyName:'',betweenDeptid:'',betweenDeptName:'',betweenId:'',betweenName:'',branchId:'',startTime:'',endTime:'',hostDeptId:'',hostDeptName:'',hostId:'',hostName:'',remark:'',status:'',createTime:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				queryTopFormVisible: false, //是否显示高级查询
				//侧面抽屉
				itemSpan: 20,
				menuSpan: 4,
				//是否展示右侧内容
				isShowNav: true,
				//事项分类的id
				categoryId:'',
				//查询对象
				queryObj: null,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getDubanItems();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getDubanItems();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getDubanItems();
			},
			searchDubanItems(){
				 this.pageInfo.count=true; 
				 this.getDubanItems();
			},
			//高级查询
			queryTop(params){
				console.log(params)
				this.queryTopFormVisible = false
				this.queryObj = params
				this.filters.key = ''
				this.searchDubanItems()
			},
			//获取列表 DubanItem duban_item
			getDubanItems() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					categoryId:this.categoryId,
					betweenId: this.userInfo.userid
				};

				if(this.queryObj != null){
					if(!this.isNull(this.queryObj.id)){
						params.id = this.queryObj.id
					}
					if(!this.isNull(this.queryObj.name)){
						params.name = this.queryObj.name
					}
					if(!this.isNull(this.queryObj.dutyId)){
						params.dutyId = this.queryObj.dutyId
					}
					// if(!this.isNull(this.queryObj.betweenId)){
					// 	params.betweenId = this.queryObj.betweenId
					// }
					if(!this.isNull(this.queryObj.endTime)){
						params.endTime = this.queryObj.endTime
					}
					if(!this.isNull(this.queryObj.startTime)){
						params.startTime = this.queryObj.startTime
					}
					if(!this.isNull(this.queryObj.hostId)){
						params.hostId = this.queryObj.hostId
					}
					if(!this.isNull(this.queryObj.coopUser) && this.queryObj.coopUser.length > 0 ){
						params.coopUsers = ''
						this.queryObj.coopUser.forEach(element => {
							if(!this.isNull(element.userId)){
								params.coopUsers +=element.userId + ","
							}
						});	
					}
					if(!this.isNull(this.queryObj.startTimeSelectStart)){
						params.startTimeSelectStart = this.queryObj.startTimeSelectStart
					}
					if(!this.isNull(this.queryObj.startTimeSelectEnd)){
						params.startTimeSelectEnd = this.queryObj.startTimeSelectEnd
					}

					if(!this.isNull(this.queryObj.endTimeSelectStart)){
						params.endTimeSelectStart = this.queryObj.endTimeSelectStart
					}
					if(!this.isNull(this.queryObj.endTimeSelectEnd)){
						params.endTimeSelectEnd = this.queryObj.endTimeSelectEnd
					}
				}
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listDubanItem(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.dubanItems = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			//选择行dubanItem
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			dateFamtter(row, column, cellValue){
				let date = new Date(cellValue)
				return date.toLocaleDateString()
			},
			//开启右侧抽屉
			openDrawer() {
				this.isShowNav = !this.isShowNav;
				this.isShowNav ? this.itemSpan = 20 : this.itemSpan = 24;
			},
			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},
			selectCategory(id){
				this.categoryId = id
				// console.log(this.categoryId)
				this.$nextTick(() => {
					this.getDubanItems();
				}); 
			},
			routeSkip(id){
				this.$router.push({
					path: '/oa/duban/detail',
					query:{id: id}
				})
			},
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    
			//在下面添加其它组件
			'drawer-components':DrawerComponents,
			'query-top': QueryTop,
		},
		mounted() { 
			this.$nextTick(() => {
				this.getDubanItems();
        	}); 
		}
	}

</script>

<style scoped>

.itemTable {
	position: relative;
}

.showMenuIcon {
	font-size: 40px;
	/* color: royalblue; */
	position: absolute;
	cursor: pointer;
	left: -15px;
	height: 58px;
	padding: 10px;
	background: url('../../../../assets/image/show-drawer.png') -2px 0px no-repeat;
}



</style>