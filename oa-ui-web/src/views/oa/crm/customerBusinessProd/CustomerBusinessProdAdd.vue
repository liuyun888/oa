<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="客户商机关联产品id" prop="id">
					<el-input v-model="addForm.id" placeholder="客户商机关联产品id" ></el-input>
				</el-form-item> 
				<el-form-item label="商机id" prop="businessId">
					<el-input v-model="addForm.businessId" placeholder="商机id" ></el-input>
				</el-form-item> 
				<el-form-item label="产品id" prop="productId">
					<el-input v-model="addForm.productId" placeholder="产品id" ></el-input>
				</el-form-item> 
				<el-form-item label="单价" prop="unitPrice">
					<el-input v-model="addForm.unitPrice" placeholder="单价"></el-input>
				</el-form-item> 
				<el-form-item label="数量" prop="count">
					<el-input-number v-model="addForm.count" :min="0" :max="200"></el-input-number>
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
	import { addCustomerBusinessProd } from '@/api/oa/crm/customerBusinessProd';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerBusinessProd','visible'],
		watch: {
	      'customerBusinessProd':function( customerBusinessProd ) {
	        this.addForm = customerBusinessProd;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '客户商机关联产品id不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 crm_customer_business_prod
				addForm: {
					id:'',businessId:'',productId:'',unitPrice:'',count:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交CustomerBusinessProd crm_customer_business_prod 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCustomerBusinessProd(params).then((res) => {
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
		    //在下面添加其它组件 'customer-business-prod-edit':CustomerBusinessProdEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.customerBusinessProd);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>