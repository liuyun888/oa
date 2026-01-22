<template>
	<section>
		<el-row>
			<!--工具条1-->  
			<!--如果有更多工具条,放开此注释
			<el-col :span="24" class="toolbar" size="small" style="padding-bottom: 0px;">
				<el-col :span="4">
				</el-col>
			</el-col>
			-->
			 
			<!--新增界面 Company 往来单位--> 
			<el-form :model="addForm" size="small" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="公司编号" prop="companyId">
					<el-input v-model="addForm.companyId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="往来单位名称" prop="companyName">
					<el-input v-model="addForm.companyName" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="归属地区" prop="districtId">
					<el-input v-model="addForm.districtId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="分类" prop="categoryId">
					<el-input v-model="addForm.categoryId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="电话" prop="phoneNo">
					<el-input v-model="addForm.phoneNo" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="组织机构代码/统一信用代码" prop="orgId">
					<el-input v-model="addForm.orgId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="详细地址" prop="address">
					<el-input v-model="addForm.address" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="云用户机构编号" prop="branchId">
					<el-input v-model="addForm.branchId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" size="small">
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { addCompany } from '../../../../api/oa/pub/company';
	
	export default {
		props:['company','visible'],
		watch: {
	      'company':function( company ) {
	        this.addForm = company;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				addLoading: false,
				addFormRules: {
					companyId: [
						//{ required: true, message: '公司编号', trigger: 'change' }
					]
				},
				//新增界面数据 往来单位
				addForm: {
					companyId:'',companyName:'',districtId:'',categoryId:'',phoneNo:'',orgId:'',address:'',branchId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Company 往来单位 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							addCompany(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
							});
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'company-edit':CompanyEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.company);
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>