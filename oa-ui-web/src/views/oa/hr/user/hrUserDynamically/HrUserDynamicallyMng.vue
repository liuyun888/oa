<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<!--列表 HrUserDynamically hr_user_dynamically-->
			<el-table :data="hrUserDynamicallys" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="time" label="操作时间" min-width="80" ></el-table-column>
				<el-table-column prop="way" label="操作者" min-width="80" ></el-table-column>
				<el-table-column prop="cause" label="操作方法" min-width="80" ></el-table-column>
				<el-table-column prop="record" label="操作记录" min-width="80" ></el-table-column>
				<el-table-column prop="ip" label="IP地址" min-width="80" ></el-table-column>
				<el-table-column prop="browser" label="浏览器" min-width="80" ></el-table-column>
				<el-table-column prop="equipment" label="设备" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="180" fixed="right"  >
					<template slot-scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="primary" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 HrUserDynamically hr_user_dynamically界面-->
			<el-dialog title="编辑员工动态" :visible.sync="editFormVisible"  width="60%"  :close-on-click-modal="false">
				  <hr-user-dynamically-edit :hr-user-dynamically="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></hr-user-dynamically-edit>
			</el-dialog>
	
			<!--新增 HrUserDynamically hr_user_dynamically界面-->
			<el-dialog title="新增员工动态" :visible.sync="addFormVisible"  width="60%"  :close-on-click-modal="false">
				<hr-user-dynamically-add :hr-user-dynamically="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></hr-user-dynamically-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listHrUserDynamically, delHrUserDynamically, batchDelHrUserDynamically } from '@/api/oa/hr/user/hrUserDynamically';
	import  HrUserDynamicallyAdd from './HrUserDynamicallyAdd';//新增界面
	import  HrUserDynamicallyEdit from './HrUserDynamicallyEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['userid'],
		data() {
			return {
				filters: {
					key: ''
				},
				hrUserDynamicallys: [],//查询结果
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
				
				addFormVisible: false,//新增hrUserDynamically界面是否显示
				//新增hrUserDynamically界面初始化数据
				addForm: {
					id:'',userid:'',time:'',way:'',cause:'',record:'',ip:'',browser:'',equipment:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑hrUserDynamically界面初始化数据
				editForm: {
					id:'',userid:'',time:'',way:'',cause:'',record:'',ip:'',browser:'',equipment:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getHrUserDynamicallys();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getHrUserDynamicallys();
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
				this.getHrUserDynamicallys();
			},
			searchHrUserDynamicallys(){
				 this.pageInfo.count=true; 
				 this.getHrUserDynamicallys();
			},
			//获取列表 HrUserDynamically hr_user_dynamically
			getHrUserDynamicallys() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					userid:this.userid
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
				listHrUserDynamically(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.hrUserDynamicallys = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 HrUserDynamically hr_user_dynamically
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 HrUserDynamically hr_user_dynamically
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getHrUserDynamicallys();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getHrUserDynamicallys();
			},
			//选择行hrUserDynamically
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除hrUserDynamically
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delHrUserDynamically(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getHrUserDynamicallys();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除hrUserDynamically
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelHrUserDynamically(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getHrUserDynamicallys(); 
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
		    'hr-user-dynamically-add':HrUserDynamicallyAdd,
		    'hr-user-dynamically-edit':HrUserDynamicallyEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.addForm.userid = this.userid;
			this.editForm.userid = this.userid;
			this.$nextTick(() => {
				this.getHrUserDynamicallys();
        	}); 
		}
	}

</script>

<style scoped>
.app-container{
	padding: 0px!important;
}
</style>