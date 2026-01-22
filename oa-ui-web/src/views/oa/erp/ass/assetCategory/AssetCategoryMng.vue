<template>
	<section>
		<!-- <el-row class="page-container border padding">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchAssetCategorys">查询</el-button>
			<el-button type="primary" @click="showAdd">+ass_asset_category</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row> -->
		<el-row class="page-container border padding"> 
			<el-tree
				class="filter-tree"
				:data="subjectTreeData"
				:props="defaultSubjectTreeProps"
				:filter-node-method="filterSubjectNode"
				:show-checkbox="showCheckbox"
				:expand-on-click-node="false"
				:indent="indent"
				:node-key="nodeKey_"
				:default-expand-all="true"
				:default-expanded-keys="defaultExpandedKeys"
				:default-checked-keys="defaultCheckedKeys"
				v-loading="listLoading"
				@check-change="handleCheckChange"
				@current-change="handleCurrentChange"
				@node-click="handleNodeClick"
				check-strictly
				
				ref="subjectTree">
					<span class="custom-tree-node" slot-scope="{ node, data }" >
					<span>{{ node.label+'('+(data.children?data.children.length:0)+')'}}</span>
					<span>
						<el-button type="text" size="medium"  @click="() => append(data)" v-if="data.parentId === '0' && !selectSingleSubjectFlag">新增</el-button>
						<el-button type="text" size="medium" @click="() => showEdit(data)" v-if="data.categoryId!='0' && !selectSingleSubjectFlag">编辑</el-button>
						<el-button type="text" size="medium" @click="() => remove(node, data)" v-if="data.categoryId!='0' && !selectSingleSubjectFlag" v-loading="removeNodeLoading">删除</el-button>
						<el-button type="text" size="medium" @click="() => sureMethod(node, data)" v-if="data.categoryId!='0' && selectSingleSubjectFlag" >确定</el-button>
					</span>
				</span>
			</el-tree>

			<!--编辑 AssetCategory ass_asset_category界面-->
			<el-dialog title="编辑资产分类" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <asset-category-edit :asset-category="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></asset-category-edit>
			</el-dialog>
	
			<!--新增 AssetCategory ass_asset_category界面-->
			<el-dialog title="新增资产分类" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<asset-category-add :asset-category="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></asset-category-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import {getAssetCategoryTree, listAssetCategory, delAssetCategory, batchDelAssetCategory } from '@/api/oa/erp/ass/assetCategory';
	import  AssetCategoryAdd from './AssetCategoryAdd';//新增界面
	import  AssetCategoryEdit from './AssetCategoryEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			
			defaultExpandedKeys(){
	    		return this.defaultCheckedKeys;
	    	},
	    	defaultCheckedKeys(){
	    		if(this.currentKey){
	    			return [this.currentKey];
	    		}
	    		if(this.checkedKeys){
	    			return this.checkedKeys
	    		};
	    		return ["0"];
	    	},
	    	nodeKey_(){
	    		return this.nodeKey?this.nodeKey:'subjectId'
	    	}
		},

		
		props: ['selectSingleSubjectFlag','visible','currentKey','nodeKey','showCount','countTips','showFilter','rootKey','multiple','checkedKeys','refresh','defaultExpandAll','expandOnClickNode','showCheckbox','indent','treeStyle'],
		data() {
			return {
				filters: {
					key: ''
				},
				assetCategorys: [],//查询结果
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
				
				addFormVisible: false,//新增assetCategory界面是否显示
				//新增assetCategory界面初始化数据
				addForm: {
					categoryId:'',categoryName:'',parentId:'',level:'',seq:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑assetCategory界面初始化数据
				editForm: {
					categoryId:'',categoryName:'',parentId:'',level:'',seq:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				subjectTreeData: [],
				defaultSubjectTreeProps:{
					id: this.nodeKey_,
					label:'categoryName',
					children: 'children',
					disabled:''
				},  
				listLoading: false,
				removeNodeLoading:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getAssetCategorys();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getAssetCategorys();
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
				this.getAssetCategorys();
			},
			searchAssetCategorys(){
				 this.pageInfo.count=true; 
				 this.getAssetCategorys();
			},
			//显示编辑界面 AssetCategory ass_asset_category
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				this.getAssetCategorys();
			},

			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getAssetCategorys();
			},

			afterEditSubmit(){
				this.editFormVisible=false;
        this.getAssetCategorys();
			},
			//选择行assetCategory
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除assetCategory
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { categoryId: row.categoryId };
					delAssetCategory(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getAssetCategorys();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},

			//批量删除assetCategory
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelAssetCategory(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getAssetCategorys(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},


			//获取分类树列表
			getAssetCategorys(refresh) {
				let id='0';
				if(this.rootKey!='' && this.rootKey!=null){
					id=this.rootKey;
				}
				let params = { 
					id: id
				};
 				if(refresh){
 					params.refresh=true;
 				}
				this.listLoading = true;
				getAssetCategoryTree(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk==true){ 
						let params = [
							{	
								parentId: '0',
								categoryId: '0',
								categoryName: '全部',
								children: res.data.data,
								disabled:''
							}
						]
						this.subjectTreeData= params;
					}else{
						this.$message({ message: tips.msg, type: 'error'});
					}
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			}, 

			renderContent(h, { node, data, store }) {
		    	 var countMsg='';	
		    	 if(this.countTips){
	    	 			countMsg=this.countTips;
	    	 		}
		    	 	if(this.showCount==true || this.showCount=='true'){
		    	 		return h('span',node.label+"("+data.count+countMsg+")") ;
						
		    	 	}else{
		    	 		return h('span',node.label+"("+(data.children==null?0:data.children.length)+countMsg+")") ;
		    	 	}
			},




			handleCheckChange: function() {

			},

			handleCurrentChange: function() {

			},

			handleNodeClick: function() {

			},

			append: function(data) {
				this.addFormVisible = true;
				this.addForm = Object.assign({}, data);
			},

			showEdit: function(data) {
				console.log(data, "data");
				this.editFormVisible = true;
				this.editForm = Object.assign({}, data);
				
			},

			remove: function(node, data) {			
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { categoryId: data.categoryId };
					delAssetCategory(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getAssetCategorys();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},

			sureMethod: function() {

			},

			filterSubjectNode(value, data) {
		        if (!value) return true;
		        return data.name.indexOf(value) !== -1;
		     },





			/**begin 自定义函数请在下面加**/


			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'asset-category-add':AssetCategoryAdd,
		    'asset-category-edit':AssetCategoryEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getAssetCategorys();
			}); 
		}
	}

</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    padding-right: 8px;
  }
 .copyButton {
 	margin-left: 10px;
 	border-radius: 20px;
 	padding: 10px 20px;
 	font-weight: bold;
 	margin-top: 10px;
 	border: 1px solid rgb(220, 223, 230);
 	/* color:#039; */
 }
 
 .copyButton:hover {
 	color: #409eff;
 	border-color: #c6e2ff;
 	background-color: #ecf5ff;
 	cursor: default;
 }
 
 .checkCopyButton {
 	/*color: #fff;*/
 	margin-top: 10px;
 	/*background-color: #e6a23c;*/
 	margin-left: 10px;
 	border-radius: 20px;
 	padding: 10px 20px;
 	font-weight: bold;
 	border: 1px solid #FFA00A;
 	/*background-color: rgba(230, 162, 60, .1);*/
 	/* background-color: #f9f9f9; */
 	background-color: #fff;
 	/*border-color: rgba(230,162,60,.2);*/
 	color: #FFA00A;
 }
 
 .add {
 	display: flex;
 	align-items: center;
 	margin-left: 10px;
 	margin-top: 10px;
 }
 
 .add:hover {
 	cursor: pointer;
 	animation: myrotate 0.5s linear infinite;
 }
 
 
 .closeStyle {
 	padding: 5px;
 }
 
 .closeStyle:hover {
 	cursor: pointer;
 	/* border-color:#f40; */
 	/* border: 1px solid #f40; */
 	background-color: #FFA00A;
 	color: #fff;
 	border-radius: 50%;
 	padding: 5px;
 	animation: myrotate 1s linear;
 }
 
 .addTagSquare {
 	width: 15px;
 	height: 15px;
 	display: inline-block;
 	background-color: #FFA00A;
 	animation: myrotate 2s linear infinite;
 }
 
 .closeTagSquare {
 	width: 15px;
 	height: 15px;
 	display: inline-block;
 	background-color: #fff;
 	animation: myrotate 2s linear infinite;
 }
 
 .buttonDefault{
	display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -webkit-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
	border-radius: 20px;
    padding: 6px 11px;
 }
 
 .buttonDefault:nth-of-type(n+2) {
    margin-left:10px;
}
 
 .buttonBlue{
	
	color:#fff;
	background:#409eff;
	border: 1px solid #409eff;

 }

</style>