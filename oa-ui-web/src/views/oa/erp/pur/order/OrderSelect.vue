<template>
	<section class="page-container border padding">
		<el-row class="page-header">
		  <el-date-picker
		  	v-model="filters.reqDateScope" class="hidden-md-and-down"
		  	type="daterange"
		  	align="right"
		  	unlink-panels
		  	range-separator="至"
		  	start-placeholder="创建日期"
		  	end-placeholder="创建日期"
		  	value-format="yyyy-MM-dd HH:mm:ss"
		  	:default-time="['00:00:00','23:59:59']"
		  	:picker-options="pickerOptions">
		  </el-date-picker>
			<el-input v-model="filters.key" style="width: 270px;" placeholder="按标题 申请单编号 申请人模糊查询">
		  </el-input>
		  		    <el-button  type="primary" icon="el-icon-search" :disabled="load.list==true" v-on:click="searchOrders">查询</el-button>

 		  <el-popover title="更多查询条件" placement="top-start" width="400" trigger="click">
		    <el-row class="more-filter-item">
		      <el-col :span="24">
		        <font class="more-label-font">
		          时间范围
		        </font>
		       <el-date-picker
		       	v-model="filters.reqDate"
		       	type="daterange"
		       	align="right"
		       	unlink-panels
		       	range-separator="至"
		       	start-placeholder="创建日期"
		       	end-placeholder="创建日期"
		       	value-format="yyyy-MM-dd"
		       	:default-time="['00:00:00','23:59:59']"
		       	:picker-options="pickerOptions">
		       </el-date-picker>
		      </el-col>

		      <el-col :span="24" style="margin-top: 11px;">
		        <el-button size="mini" type="primary" v-on:click="searchOrders" icon="el-icon-search">查询</el-button>
		      </el-col>
 
		    </el-row>
		    <el-button slot="reference" icon="el-icon-more" style="margin-left: 13px;" circle></el-button>
		  </el-popover>
		</el-row>
		<el-row class="page-main padding-top">
			<!--列表 Order pur_order-->
			<el-table :height="tableHeight" ref="procdefsTable" @cell-click="cellClick"  :data="orders" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="index" width="40" show-overflow-tooltip></el-table-column>
				<el-table-column prop="purTitle" label="标题" min-width="80" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="id" label="申请单编号" min-width="60" show-overflow-tooltip></el-table-column>
				<el-table-column prop="purUsername" label="申请人" min-width="50" show-overflow-tooltip></el-table-column>
				<el-table-column prop="purDeptName" label="申请人部门" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="purDate" label="申请时间" min-width="80" show-overflow-tooltip></el-table-column>

				<el-table-column prop="orderStatus" label="入库状态" min-width="50" show-overflow-tooltip>
					<template slot-scope="scope">
            <el-tag  v-if="scope.row.orderStatus == '0'">未发审</el-tag>
            <el-tag  v-if="scope.row.orderStatus == '1'">审核中</el-tag>
            <el-tag  v-if="scope.row.orderStatus == '2'">待入库</el-tag>
            <el-tag  v-if="scope.row.orderStatus == '3'">已完成</el-tag>
            <el-tag  v-if="scope.row.orderStatus == '4'">流程取消</el-tag>
					</template>
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
 

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listOrder, delOrder, batchDelOrder } from '@/api/oa/erp/pur/order'; 
	import { mapGetters } from 'vuex';
  import config from "@/common/config"; //全局公共库

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			const fromStartTime = new Date();
			const toStartTime = new Date();
			fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
			return {
				filters: {
					key: '',
					reqDateScope:[util.formatDate(fromStartTime,'yyyy-MM-dd 00:00:00'),util.formatDate(toStartTime,'yyyy-MM-dd 23:59:59')],
				},
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
						}
					},{
						text: '最近两周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *2);
						picker.$emit('pick', [start, end]);
						}
					},{
						text: '最近三周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *3);
						picker.$emit('pick', [start, end]);
						}
					},{
						text: '最近四周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *4);
						picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
						}
					}]
				},
        tableHeight:300,
				orders: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['pur_date'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增order界面是否显示
				//新增order界面初始化数据
				addForm: {
					id:'',purTitle:'',purUserid:'',purUsername:'',purDeptid:'',purDeptName:'',purBranchId:'',purBranchName:'',purDate:'',purItems:'',orderStatus: ''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑order界面初始化数据
				editForm: {
					id:'',purTitle:'',purUserid:'',purUsername:'',purDeptid:'',purDeptName:'',purBranchId:'',purBranchName:'',purDate:'',purItems:'',orderStatus: ''
				}, 

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getOrders();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getOrders();
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
				this.getOrders();
			},
			searchOrders(){
				 this.pageInfo.count=true;
				 this.getOrders();
			},
			//获取列表 Order pur_order
			getOrders() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					purBranchId: this.userInfo.branchId
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
					params.purTitle='%'+this.filters.key+'%';
				}else{
					//params.xxx=xxxxx
				}

				if(this.filters.reqDateScope!=null && this.filters.reqDateScope.length==2){ 
					params.reqStartDate=this.filters.reqDateScope[0]
					params.reqEndDate=this.filters.reqDateScope[1]
				}

				this.load.list = true;
				listOrder(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.orders = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			//显示编辑界面 Order pur_order
			showEdit: function ( row,index ) {
				if(row.orderStatus === '1'||row.orderStatus === '2'||row.orderStatus === '3') {
					this.$message({ message: "该单已发布，不能修改", type: 'error' });
					return;
				}
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Order pur_order
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getOrders();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getOrders();
			},
			//选择行order
			selsChange: function (sels) {
				this.sels = sels;
			}, 

		},//end methods
		components: { 

		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.getOrders();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
        	});
		}
	}

</script>

<style scoped>

 	.filters-show {
		margin-left: 20px;
		margin-top: 10px;
		margin-bottom: 0px;
	}
	.filters-label {
		font-size: 14px;
		color:black;
		font-weight: bold;
	}

</style>
