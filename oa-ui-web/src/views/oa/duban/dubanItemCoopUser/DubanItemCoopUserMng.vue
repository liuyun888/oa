<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchDubanItemCoopUsers">查询</el-button>
			<el-button type="primary" @click="showAdd">+duban_item_coop_user</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="page-main padding-top"> 
			<!--列表 DubanItemCoopUser duban_item_coop_user-->
			<el-table :data="dubanItemCoopUsers" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="dubanItemId" label="督办id" min-width="80" ></el-table-column>
				<el-table-column prop="userId" label="协助用户id" min-width="80" ></el-table-column>
				<el-table-column prop="username" label="协助用户" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="180" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 DubanItemCoopUser duban_item_coop_user界面-->
			<el-dialog title="编辑duban_item_coop_user" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <duban-item-coop-user-edit :duban-item-coop-user="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></duban-item-coop-user-edit>
			</el-dialog>
	
			<!--新增 DubanItemCoopUser duban_item_coop_user界面-->
			<el-dialog title="新增duban_item_coop_user" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<duban-item-coop-user-add :duban-item-coop-user="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></duban-item-coop-user-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listDubanItemCoopUser, delDubanItemCoopUser, batchDelDubanItemCoopUser } from '@/api/oa/duban/dubanItemCoopUser';
	import  DubanItemCoopUserAdd from './DubanItemCoopUserAdd';//新增界面
	import  DubanItemCoopUserEdit from './DubanItemCoopUserEdit';//修改界面
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
				dubanItemCoopUsers: [],//查询结果
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
				
				addFormVisible: false,//新增dubanItemCoopUser界面是否显示
				//新增dubanItemCoopUser界面初始化数据
				addForm: {
					id:'',dubanItemId:'',userId:'',username:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑dubanItemCoopUser界面初始化数据
				editForm: {
					id:'',dubanItemId:'',userId:'',username:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getDubanItemCoopUsers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getDubanItemCoopUsers();
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
				this.getDubanItemCoopUsers();
			},
			searchDubanItemCoopUsers(){
				 this.pageInfo.count=true; 
				 this.getDubanItemCoopUsers();
			},
			//获取列表 DubanItemCoopUser duban_item_coop_user
			getDubanItemCoopUsers() {
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
				listDubanItemCoopUser(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.dubanItemCoopUsers = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 DubanItemCoopUser duban_item_coop_user
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 DubanItemCoopUser duban_item_coop_user
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getDubanItemCoopUsers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行dubanItemCoopUser
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除dubanItemCoopUser
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delDubanItemCoopUser(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getDubanItemCoopUsers();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除dubanItemCoopUser
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelDubanItemCoopUser(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getDubanItemCoopUsers(); 
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
		    'duban-item-coop-user-add':DubanItemCoopUserAdd,
		    'duban-item-coop-user-edit':DubanItemCoopUserEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getDubanItemCoopUsers();
        	}); 
		}
	}

</script>

<style scoped>

</style>