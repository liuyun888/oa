<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="tem_id" prop="temId">
					<el-input v-model="editForm.temId" placeholder="tem_id"></el-input>
				</el-form-item> 
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" placeholder="名称"></el-input>
				</el-form-item> 
				<el-form-item label="分值" prop="value">
					<el-input v-model="editForm.value" placeholder="分值"></el-input>
				</el-form-item> 
				<el-form-item label="权重" prop="proportion">
					<el-input-number v-model="editForm.proportion" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editCustomerEvaluationTem } from '@/api/oa/crm/customerEvaluationTem';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerEvaluationTem','visible'],
		watch: {
	      'customerEvaluationTem':function( customerEvaluationTem ) {
	        this.editForm = customerEvaluationTem;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					temId: [
						//{ required: true, message: 'tem_id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  CustomerEvaluationTem crm_customer_evaluation_tem
				editForm: {
					temId:'',name:'',value:'',proportion:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交CustomerEvaluationTem crm_customer_evaluation_tem父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editCustomerEvaluationTem(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'customer-evaluation-tem-edit':CustomerEvaluationTemEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.customerEvaluationTem);  
		}
	}

</script>

<style scoped>

</style>