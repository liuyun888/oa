<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				
				<el-form-item label="上级" prop="categoryName">
					<el-tag>{{topCategoryName}}</el-tag>
				</el-form-item>

				<el-form-item label="资产分类名称" prop="categoryName">
					<el-input v-model="addForm.categoryName" placeholder="资产分类名称" ></el-input>
				</el-form-item> 
			
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addAssetCategory } from '@/api/oa/erp/ass/assetCategory';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['assetCategory','visible'],
		watch: {
		  'assetCategory':function( assetCategory ) {
				this.topCategoryName = this.assetCategory.categoryName;
				this.addForm.parentId = this.assetCategory.categoryId;

		  },
		  
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.topCategoryName = this.assetCategory.categoryName;
				this.addForm.parentId = this.assetCategory.categoryId;
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					categoryId: [
						//{ required: true, message: '资产编码不能为空', trigger: 'change' }
					],
					categoryName: [
						{ required: true, message: '资产分类名称不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ass_asset_category
				addForm: {
					categoryName:'',parentId:'', seq:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				//上级资产分类名称
				topCategoryName: '',


				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交AssetCategory ass_asset_category 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addAssetCategory(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'asset-category-edit':AssetCategoryEdit
		},
		mounted() {
			// this.addForm=Object.assign(this.addForm, this.assetCategory);  
			this.topCategoryName = this.assetCategory.categoryName;
			this.addForm.parentId = this.assetCategory.categoryId;
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>