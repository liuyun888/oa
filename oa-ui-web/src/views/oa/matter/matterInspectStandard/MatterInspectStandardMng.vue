<template>
	<section>
		<el-row>
			<!--工具条1-->
			<el-col :span="24" class="toolbar" size="small" style="padding-bottom: 0px;padding-left: 0px">
				<el-col :span="4">
					<el-input v-model="filters.key" size="small" placeholder="模糊查询"></el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary"  size="small" v-on:click="searchMatterInspectStandards">查询</el-button>
					<el-button type="primary"  size="small" @click="showAdd">新增</el-button>
					<el-button type="danger"   size="small" @click="batchDel" :disabled="this.sels.length===0">批量删除</el-button>
				</el-col>	
				<el-col :span="12">
					<el-pagination size="small" layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
					</el-pagination>
				</el-col>	
			</el-col>
			
			<!--工具条2-->  
			<!--如果有更多工具条,放开此注释
			<el-col :span="24" class="toolbar" size="small" style="padding-bottom: 0px;">
				<el-col :span="4">
				</el-col>
			</el-col>
			-->		
			
			<!--列表 MatterInspectStandard 事项检查依据-->
			<el-table :data="matterInspectStandards" size="small" @sort-change="sortChange" height="480" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="id" label="id" min-width="80" ></el-table-column>
				<el-table-column prop="accordingName" label="依据名称（检查依据）" min-width="80" ></el-table-column>
				<el-table-column prop="clause" label="依据条款（检查依据）" min-width="80" ></el-table-column>
				<el-table-column prop="contentId" label="检查内容id" min-width="80" ></el-table-column>
				<el-table-column prop="branchId" label="云用户机构编号" min-width="80" ></el-table-column>
				<el-table-column prop="standard" label="检查标准" min-width="80" ></el-table-column>
				<el-table-column label="操作" min-width="150"  fixed="right">
					<template slot-scope="scope">
						<el-button size="small" @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--编辑 MatterInspectStandard 事项检查依据界面-->
			<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <matter-inspect-standard-edit :matter-inspect-standard="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></matter-inspect-standard-edit>
			</el-dialog>
	
			<!--新增 MatterInspectStandard 事项检查依据界面-->
			<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<matter-inspect-standard-add :matter-inspect-standard="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></matter-inspect-standard-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { listMatterInspectStandard, delMatterInspectStandard, batchDelMatterInspectStandard } from '../../../../api/oa/matter/matterInspectStandard';
	import  MatterInspectStandardAdd from './MatterInspectStandardAdd';//新增界面
	import  MatterInspectStandardEdit from './MatterInspectStandardEdit';//修改界面
	
	export default {
		data() {
			return {
				filters: {
					key: ''
				},
				matterInspectStandards: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					currentPage:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				listLoading: false,//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增matterInspectStandard界面是否显示
				//新增matterInspectStandard界面初始化数据
				addForm: {
					id:'',accordingName:'',clause:'',contentId:'',branchId:'',standard:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑matterInspectStandard界面初始化数据
				editForm: {
					id:'',accordingName:'',clause:'',contentId:'',branchId:'',standard:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			//获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
			getCodeName(options,codeValue){
				if(!options)return codeValue;
				let code=options.filter(i=>i.codeValue==codeValue);
				if(code.length>0){
					return code[0].codeName
				}else{
					return codeValue
				} 
			},
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.total=0;
				this.pageInfo.currentPage=1;
				this.getMatterInspectStandards();
			},
			handleCurrentChange(currentPage) {
				this.pageInfo.currentPage = currentPage;
				this.getMatterInspectStandards();
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
				this.getMatterInspectStandards();
			},
			searchMatterInspectStandards(){
				 this.pageInfo.currentPage=1;
				 this.pageInfo.total=0;
				 this.getMatterInspectStandards();
			},
			//获取列表 MatterInspectStandard 事项检查依据
			getMatterInspectStandards() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					currentPage: this.pageInfo.currentPage,
					total: this.pageInfo.total
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					params.orderFields=this.pageInfo.orderFields;
					params.orderDirs=this.pageInfo.orderDirs;
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.listLoading = true;
				listMatterInspectStandard(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.pageInfo.total;
						this.matterInspectStandards = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},

			//显示编辑界面 MatterInspectStandard 事项检查依据
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MatterInspectStandard 事项检查依据
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getMatterInspectStandards();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行matterInspectStandard
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除matterInspectStandard
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { id: row.id };
					delMatterInspectStandard(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getMatterInspectStandards();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			//批量删除matterInspectStandard
			batchDel: function () {
				 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelMatterInspectStandard(this.sels).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.total=0;
							this.getMatterInspectStandards(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'matter-inspect-standard-add':MatterInspectStandardAdd,
		    'matter-inspect-standard-edit':MatterInspectStandardEdit
		    //在下面添加其它组件
		},
		mounted() {
			
			this.$nextTick(() => {
				this.getMatterInspectStandards();
        	});
			//加载下拉列表 如有需要去年注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>

</style>