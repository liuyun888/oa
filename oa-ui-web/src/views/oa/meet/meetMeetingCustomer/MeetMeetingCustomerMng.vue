<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchMeetMeetingCustomers">查询</el-button>
			<el-button type="primary" @click="showAdd">+meet_meeting_customer</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="page-main padding-top"> 
			<!--列表 MeetMeetingCustomer meet_meeting_customer-->
			<el-table :data="meetMeetingCustomers" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="meetingId" label="会议id" min-width="80" ></el-table-column>
				<el-table-column prop="customerId" label="参会客户id" min-width="80" ></el-table-column>
				<el-table-column prop="customerName" label="参会客户" min-width="80" ></el-table-column>
				<el-table-column prop="status" label="参加状态" min-width="80" ></el-table-column>
				<el-table-column prop="remark" label="参加备注" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="180" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 MeetMeetingCustomer meet_meeting_customer界面-->
			<el-dialog title="编辑meet_meeting_customer" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <meet-meeting-customer-edit :meet-meeting-customer="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></meet-meeting-customer-edit>
			</el-dialog>
	
			<!--新增 MeetMeetingCustomer meet_meeting_customer界面-->
			<el-dialog title="新增meet_meeting_customer" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<meet-meeting-customer-add :meet-meeting-customer="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></meet-meeting-customer-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listMeetMeetingCustomer, delMeetMeetingCustomer, batchDelMeetMeetingCustomer } from '@/api/oa/meet/meetMeetingCustomer';
	import  MeetMeetingCustomerAdd from './MeetMeetingCustomerAdd';//新增界面
	import  MeetMeetingCustomerEdit from './MeetMeetingCustomerEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				meetMeetingCustomers: [],//查询结果
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
				
				addFormVisible: false,//新增meetMeetingCustomer界面是否显示
				//新增meetMeetingCustomer界面初始化数据
				addForm: {
					id:'',meetingId:'',customerId:'',customerName:'',status:'',remark:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑meetMeetingCustomer界面初始化数据
				editForm: {
					id:'',meetingId:'',customerId:'',customerName:'',status:'',remark:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getMeetMeetingCustomers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMeetMeetingCustomers();
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
				this.getMeetMeetingCustomers();
			},
			searchMeetMeetingCustomers(){
				 this.pageInfo.count=true; 
				 this.getMeetMeetingCustomers();
			},
			//获取列表 MeetMeetingCustomer meet_meeting_customer
			getMeetMeetingCustomers() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
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
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listMeetMeetingCustomer(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.meetMeetingCustomers = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 MeetMeetingCustomer meet_meeting_customer
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MeetMeetingCustomer meet_meeting_customer
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getMeetMeetingCustomers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行meetMeetingCustomer
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除meetMeetingCustomer
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delMeetMeetingCustomer(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getMeetMeetingCustomers();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除meetMeetingCustomer
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelMeetMeetingCustomer(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getMeetMeetingCustomers(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'meet-meeting-customer-add':MeetMeetingCustomerAdd,
		    'meet-meeting-customer-edit':MeetMeetingCustomerEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getMeetMeetingCustomers();
        	}); 
		}
	}

</script>

<style scoped>

</style>