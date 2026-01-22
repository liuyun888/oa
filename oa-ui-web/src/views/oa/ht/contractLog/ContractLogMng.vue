<template>
	<section class="page-container border padding">
		<el-row class="padding-top">
			<!--列表 ContractLog ht_contract_log-->
			<el-table ref="contractLogTable" :data="contractLogs" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column prop="htId" label="合同编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="opRemark" label="操作描述" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="opUsername" label="操作人姓名" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="opTime" label="操作时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="opIp" label="操作者机器ip" min-width="80" show-overflow-tooltip></el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 ContractLog ht_contract_log界面-->
			<el-drawer title="编辑ht_contract_log" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <contract-log-edit op-type="edit" :contract-log="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></contract-log-edit>
			</el-drawer>

			<!--新增 ContractLog ht_contract_log界面-->
			<el-drawer title="新增ht_contract_log" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<contract-log-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></contract-log-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listContractLog, delContractLog, batchDelContractLog } from '@/api/oa/ht/contractLog';
	import  ContractLogEdit from './ContractLogEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
		components: {
		    ContractLogEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchContractLogs()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				contractLogs: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['op_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增contractLog界面是否显示
				//新增contractLog界面初始化数据
				addForm: {
					id:'',htId:'',opRemark:'',opUserid:'',opUsername:'',opTime:'',opIp:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑contractLog界面初始化数据
				editForm: {
					id:'',htId:'',opRemark:'',opUserid:'',opUsername:'',opTime:'',opIp:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getContractLogs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getContractLogs();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[]; 
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}
					 
					this.pageInfo.orderFields=[util.toLine(obj.prop)]; 
					this.pageInfo.orderDirs=[dir];
				}
				this.getContractLogs();
			},
			searchContractLogs(){
				 this.pageInfo.count=true; 
				 this.getContractLogs();
			},
			//获取列表 ContractLog ht_contract_log
			getContractLogs() {
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
				if(this.filters.key){
					params.key=this.filters.key
				}

				this.load.list = true;
				listContractLog(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.contractLogs = res.data.data;
					}else{
						this.$message({ showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 ContractLog ht_contract_log
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 ContractLog ht_contract_log
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getContractLogs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行contractLog
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除contractLog
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delContractLog(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getContractLogs();
						}
						this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除contractLog
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelContractLog(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getContractLogs(); 
						}
						this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			/**begin 自定义函数请在下面加**/
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				this.searchContractLogs();
				if(this.$refs.contractLogTable){
				    var clientRect=this.$refs.contractLogTable.$el.getBoundingClientRect();
                    var subHeight=70/1000 * window.innerHeight;
                    this.maxTableHeight =  window.innerHeight -clientRect.y - this.$refs.contractLogTable.$el.offsetTop-subHeight;
				}

        	});
		}
	}

</script>

<style scoped>
</style>