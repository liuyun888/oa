<template>
	<section class="page-container border padding">
		<el-row class="page-header"> 
					<el-input v-model="filters.key" size="small" placeholder="模糊查询"></el-input> 
					<el-button type="primary"  size="small" v-on:click="searchMatterCompanys">查询</el-button>
					<el-button type="primary"  size="small" @click="showAdd">新增</el-button>
					<el-button type="danger"   size="small" @click="batchDel" :disabled="this.sels.length===0">批量删除</el-button> 
					<el-pagination size="small" layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
					</el-pagination>  
		</el-row>
		<el-row class="page-main padding-top">
			<!--列表 MatterCompany 事项与公司关联表-->
			<el-table :data="matterCompanys" size="small" @sort-change="sortChange" height="480" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="id" label="id" min-width="80" ></el-table-column>
				<el-table-column prop="matterInfoId" label="事项id" min-width="80" ></el-table-column>
				<el-table-column prop="companyId" label="公司id" min-width="80" ></el-table-column>
				<el-table-column label="操作" min-width="150"  fixed="right">
					<template slot-scope="scope">
						<el-button size="small" @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--编辑 MatterCompany 事项与公司关联表界面-->
			<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <matter-company-edit :matter-company="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></matter-company-edit>
			</el-dialog>
	
			<!--新增 MatterCompany 事项与公司关联表界面-->
			<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<matter-company-add :matter-company="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></matter-company-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { listMatterCompany, delMatterCompany, batchDelMatterCompany } from '../../../../api/oa/matter/matterCompany';
	import  MatterCompanyAdd from './MatterCompanyAdd';//新增界面
	import  MatterCompanyEdit from './MatterCompanyEdit';//修改界面
	
	export default {
		data() {
			return {
				filters: {
					key: ''
				},
				matterCompanys: [],//查询结果
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
				
				addFormVisible: false,//新增matterCompany界面是否显示
				//新增matterCompany界面初始化数据
				addForm: {
					id:'',matterInfoId:'',companyId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑matterCompany界面初始化数据
				editForm: {
					id:'',matterInfoId:'',companyId:''
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
				this.getMatterCompanys();
			},
			handleCurrentChange(currentPage) {
				this.pageInfo.currentPage = currentPage;
				this.getMatterCompanys();
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
				this.getMatterCompanys();
			},
			searchMatterCompanys(){
				 this.pageInfo.currentPage=1;
				 this.pageInfo.total=0;
				 this.getMatterCompanys();
			},
			//获取列表 MatterCompany 事项与公司关联表
			getMatterCompanys() {
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
				listMatterCompany(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.pageInfo.total;
						this.matterCompanys = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},

			//显示编辑界面 MatterCompany 事项与公司关联表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MatterCompany 事项与公司关联表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getMatterCompanys();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行matterCompany
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除matterCompany
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { id: row.id };
					delMatterCompany(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getMatterCompanys();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			//批量删除matterCompany
			batchDel: function () {
				 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelMatterCompany(this.sels).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.total=0;
							this.getMatterCompanys(); 
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
		    'matter-company-add':MatterCompanyAdd,
		    'matter-company-edit':MatterCompanyEdit
		    //在下面添加其它组件
		},
		mounted() {
			
			this.$nextTick(() => {
				this.getMatterCompanys();
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