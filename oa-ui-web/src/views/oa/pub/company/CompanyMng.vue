<template>
	<section>
		<el-row>
			<!--工具条1-->
			<el-col :span="24" class="toolbar" size="small" style="padding-bottom: 0px;padding-left: 0px">
				<el-col :span="4">
					<el-input v-model="filters.key" size="small" placeholder="模糊查询"></el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary"  size="small" v-on:click="searchCompanys">查询</el-button>
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
			
			<!--列表 Company 往来单位-->
			<el-table :data="companys" size="small" @sort-change="sortChange" height="480" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="companyName" label="公司名称" min-width="80" ></el-table-column>
				<el-table-column prop="districtId" label="归属地区" min-width="80" ></el-table-column>
				<el-table-column prop="categoryId" label="分类" min-width="80" ></el-table-column>
				<el-table-column prop="phoneNo" label="电话" min-width="80" ></el-table-column>
				<el-table-column prop="orgId" label="组织机构代码/统一信用代码" min-width="80" ></el-table-column>
				<el-table-column prop="address" label="详细地址" min-width="80" ></el-table-column>
				<el-table-column label="操作" min-width="250"  fixed="right">
					<template slot-scope="scope">
					    <el-button size="small" @click="showMatterMng(scope.row,scope.$index)">管理事项库</el-button>
						<el-button size="small" @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--设置事项库-->
			<el-dialog title="管理事项库" :visible.sync="matterMngVisible"  width="50%"  :close-on-click-modal="false">
				  <el-transfer
				    filterable
				     :props="{
				      key: 'id',
				      label: 'businessName'
				     }"
				     @change="getSelected"
				     :titles="['事项列表','选中']"
				    filter-placeholder="请输入业务名称"
				    v-model="selectedInfoList"
				    :data="matterInfoList">
				  </el-transfer>
				  <div style="text-align: center;padding: 15px;">
				      <el-button size="small" type="primary" @click.native="addMatter" :loading="addMatterLoading">保存</el-button>  
				  </div>
			</el-dialog>
			
			<!--编辑 Company 往来单位界面-->
			<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <company-edit :company="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></company-edit>
			</el-dialog>
	
			<!--新增 Company 往来单位界面-->
			<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<company-add :company="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></company-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	import sequence from '../../../../common/js/sequence';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { listCompany, delCompany, batchDelCompany } from '../../../../api/oa/pub/company';
	import  CompanyAdd from './CompanyAdd';//新增界面
	import  CompanyEdit from './CompanyEdit';//修改界面
	import { listMatterInfo} from '../../../../api/oa/matter/matterInfo';
    import { addOrDeleteMatter } from '../../../../api/oa/matter/matterCompany';
	import { listMatterCompany} from '../../../../api/oa/matter/matterCompany';
	export default {
		data() {
			return {
				filters: {
					key: ''
				},
				companys: [],//查询结果
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
				
				addFormVisible: false,//新增company界面是否显示
				//新增company界面初始化数据
				addForm: {
					companyId:'',companyName:'',districtId:'',categoryId:'',phoneNo:'',orgId:'',address:'',branchId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑company界面初始化数据
				editForm: {
					companyId:'',companyName:'',districtId:'',categoryId:'',phoneNo:'',orgId:'',address:'',branchId:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				matterMngVisible:false,
				matterInfoList:[],
				selectedInfoList:[],
				addMatterLoading:false
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
				this.getCompanys();
			},
			handleCurrentChange(currentPage) {
				this.pageInfo.currentPage = currentPage;
				this.getCompanys();
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
				this.getCompanys();
			},
			searchCompanys(){
				 this.pageInfo.currentPage=1;
				 this.pageInfo.total=0;
				 this.getCompanys();
			},
			//获取列表 Company 往来单位
			getCompanys() {
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
				listCompany(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.pageInfo.total;
						this.companys = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},

			//显示编辑界面 Company 往来单位
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			showMatterMng: function ( row,index ) {
			    this.matterMngVisible=true;
				this.editForm = Object.assign({}, row);
				this.initSelected();
			},
			//显示新增界面 Company 往来单位
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getCompanys();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.pageInfo.total=0;
				this.getCompanys();
			},
			//选择行company
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除company
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { companyId: row.companyId };
					delCompany(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getCompanys();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			//批量删除company
			batchDel: function () {
				 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelCompany(this.sels).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.total=0;
							this.getCompanys(); 
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
			},
			/**begin 自定义函数请在下面加**/
			getMatterList(){
			   listMatterInfo().then((res) => {
					var tips=res.data.tips;
					console.log(tips);
					if(tips.isOk){ 
					    console.log("事项库");
					    console.log(res.data.data);
						this.matterInfoList = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch(() => {
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			addMatter(){
			   this.addMatterLoading = true; 
			   //保存事项
			   var s=this.selectedInfoList;
			   var sl=[];
			   for(var i=0;i<s.length;i++){
			      var save={
			         id:sequence.sn(),
			         matterInfoId:s[i],
			         companyId:this.editForm.companyId
			      }
			      sl.push(save);
			   }
			   let params={
			      companyId:this.editForm.companyId,
			      matterCompanyList:sl
			   }
			   console.log(this.editForm.companyId);
			   addOrDeleteMatter(params).then((res) => {
					this.addMatterLoading = false; 
					var tips=res.data.tips;
					if(tips.isOk){
						
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch(() => {
					this.addMatterLoading = false; 
				});
			},
			getSelected(currentList,direction,currentkey){
			    this.selectedInfoList=currentList;
			},
			initSelected(){
			    let params = {
					companyId:this.editForm.companyId
				};
				listMatterCompany(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
					    var a=res.data.data;
					    var l=[];
					    for(var i=0;i<a.length;i++){
					       l.push(a[i].matterInfoId);
					    }
						this.selectedInfoList =l;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			}
			
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'company-add':CompanyAdd,
		    'company-edit':CompanyEdit
		    //在下面添加其它组件
		},
		mounted() {
			
			this.$nextTick(() => {
				this.getCompanys();
				this.getMatterList();
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