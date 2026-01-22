<template>
	<section>
		<el-row>
			<!--工具条1-->
			<el-col :span="24" class="toolbar" size="small" style="">
				<el-col :span="4">
					<el-input v-model="filters.key" size="small" placeholder="模糊查询"></el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary"  size="small" v-on:click="searchMatterInfos">查询</el-button>
					<el-button type="primary"  size="small" @click="dialogImportVisible = true">导入</el-button>
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
			
			<!--列表 MatterInfo 事项库-事项基本信息-->
			<el-table :data="matterInfos" size="small" @sort-change="sortChange" height="480" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="majorName" label="专业名称" min-width="80" ></el-table-column>
				<el-table-column prop="businessName" label="业务名称" min-width="100" ></el-table-column>
				<el-table-column prop="companyHandbook" label="公司手册" min-width="80" ></el-table-column>
				<el-table-column label="操作" min-width="150"  fixed="right">
					<template slot-scope="scope">
						<el-button size="small" @click="showEdit( scope.row,scope.$index)">管理事项</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.row,scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--编辑 MatterInfo 事项库-事项基本信息界面-->
			<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <matter-info-edit :matter-info="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></matter-info-edit>
			</el-dialog>
	
			<!--新增 MatterInfo 事项库-事项基本信息界面-->
			<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<matter-info-add :matter-info="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></matter-info-add>
			</el-dialog> 
		</el-row>
		
		<el-dialog title="导入"  :close-on-click-modal="false" :visible.sync="dialogImportVisible">
				<div style="margin-left:15px;">
					<el-upload class="upload-demo" 
					  action="mk/mng/sxk/matter/matterInfo/uploadFile" 
					  :http-request="uploadFile" 
					  :file-list="fileList" 
					  :on-remove="removeFile" 
					  :before-upload="beforeFileUpload">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传excel文件</div>
					</el-upload>
				</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogImportVisible = false">取 消</el-button>
				<el-button type="primary" @click="beginImport" :loading="importLoading">开始导入</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { listMatterInfo, delMatterInfo, batchDelMatterInfo,uploadFileToRemote,importData} from '../../../../api/oa/matter/matterInfo';
	import  MatterInfoAdd from './MatterInfoAdd';//新增界面
	import  MatterInfoEdit from './MatterInfoEdit';//修改界面
	
	export default {
		data() {
			return {
				filters: {
					key: ''
				},
				matterInfos: [],//查询结果
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
				
				addFormVisible: false,//新增matterInfo界面是否显示
				//新增matterInfo界面初始化数据
				addForm: {
					id:'',majorName:'',businessName:'',companyHandbook:'',branchId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑matterInfo界面初始化数据
				editForm: {
					id:'',majorName:'',businessName:'',companyHandbook:'',branchId:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				dialogImportVisible:false,
				fileList:[],
				sxkData:{},
				importLoading:false
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
				this.getMatterInfos();
			},
			handleCurrentChange(currentPage) {
				this.pageInfo.currentPage = currentPage;
				this.getMatterInfos();
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
				this.getMatterInfos();
			},
			searchMatterInfos(){
				 this.pageInfo.currentPage=1;
				 this.pageInfo.total=0;
				 this.getMatterInfos();
			},
			//获取列表 MatterInfo 事项库-事项基本信息
			getMatterInfos() {
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
				listMatterInfo(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.pageInfo.total;
						this.matterInfos = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},

			//显示编辑界面 MatterInfo 事项库-事项基本信息
			showEdit: function ( row,index ) {
				//this.editFormVisible = true;
				//this.editForm = Object.assign({}, row);
				this.$router.push({ path: '/mdp/workflow/oa/matter/matterInfo/MatterInfoEdit', query: { id:row.id}})
			},
			//显示新增界面 MatterInfo 事项库-事项基本信息
			showAdd: function () {
				this.addFormVisible = true;
				this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getMatterInfos();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行matterInfo
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除matterInfo
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { id: row.id };
					delMatterInfo(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getMatterInfos();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			//批量删除matterInfo
			batchDel: function () {
				 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelMatterInfo(this.sels).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.total=0;
							this.getMatterInfos(); 
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
			//导入部分
			beforeFileUpload(file) {
					let fileType = file.name;
					var index = fileType.lastIndexOf(".");  
					//console.log(fileType);
					//console.log(index);
                    fileType  = fileType.substring(index + 1, fileType.length);
					//console.log(fileType);
					if(fileType== 'xls') {
						let f = {
							name: file.name
						}
						this.fileList = [];
						this.fileList.push(f);
						return true;
					} else {
						this.$message({
							message: '请上传excel文件,后缀名xls!',
							type: 'warning'
						});
						this.fileList = [];
						return false;
					}
				},
				uploadFile(request) {
					// console.log(request);
					this.importLoading=true;
					uploadFileToRemote(request).then((res) => {
						console.log(res);
						console.log(res.data);
						if(res.data.tips.isOk){
						   var d=res.data.data;
						   console.log(d);
						   this.sxkData=d;
						   this.importLoading=false;
						}else{
						   this.$message({
								type: 'error',
								message: res.data.tips.msg
							});
							this.importLoading=false;
						}
						
					});
				},
				removeFile(file, fileList) {
				    this.fileList = [];
				},
				beginImport() {
					//开始导入
					if(this.sxkData.infoList==undefined){
					   this.$message({
							type: 'error',
							message:"无法获取文件中的数据，请检查文件中是否存在数据"
						});
						return;
					}
					this.importLoading=true;
				    this.$message('正在导入');
				        let parm=this.sxkData;
				        importData(parm).then((res) => {
						console.log(res);
						if(res.data.tips.isOk) {
							this.dialogImportVisible = false;
							this.$message({
								type: 'success',
								message: '导入成功!'
							});
							this.importLoading=false;
							this.removeFile(this.fileList[0], this.fileList);
						} else {
							this.$message({
								type: 'error',
								message:res.data.tips.msg
							});
							this.importLoading=false;
						}
					  });
						
					
				}
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'matter-info-add':MatterInfoAdd,
		    'matter-info-edit':MatterInfoEdit
		    //在下面添加其它组件
		},
		mounted() {
			
			this.$nextTick(() => {
				this.getMatterInfos();
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