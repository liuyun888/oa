<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="费用项目编号" prop="itemId">
					<el-input v-model="editForm.itemId" placeholder="费用项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="费用项目" prop="itemName">
					<el-input v-model="editForm.itemName" placeholder="费用项目"></el-input>
				</el-form-item> 
				<el-form-item label="费用" prop="feeAmount">
					<el-input v-model="editForm.feeAmount" placeholder="费用"></el-input>
				</el-form-item> 
				<el-form-item label="费用说明" prop="feeRemark">
					<el-input v-model="editForm.feeRemark" placeholder="费用说明"></el-input>
				</el-form-item> 
				<el-form-item label="申请编号" prop="requireId">
					<el-input v-model="editForm.requireId" placeholder="申请编号"></el-input>
				</el-form-item> 
				<el-form-item label="实际费用" prop="actFeeAmount">
					<el-input v-model="editForm.actFeeAmount" placeholder="实际费用"></el-input>
				</el-form-item> 
				<el-form-item label="票据地址" prop="actFeeInvoiceUrl">
					<el-input v-model="editForm.actFeeInvoiceUrl" placeholder="票据地址"></el-input>
				</el-form-item> 
				<el-form-item label="实际费用说明" prop="actRemark">
					<el-input v-model="editForm.actRemark" placeholder="实际费用说明"></el-input>
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
	import { editCarRequireExpenseDetail } from '@/api/oa/car/carRequireExpenseDetail';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carRequireExpenseDetail','visible'],
		watch: {
	      'carRequireExpenseDetail':function( carRequireExpenseDetail ) {
	        this.editForm = carRequireExpenseDetail;
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
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  CarRequireExpenseDetail car_require_expense_detail
				editForm: {
					id:'',itemId:'',itemName:'',feeAmount:'',feeRemark:'',requireId:'',actFeeAmount:'',actFeeInvoiceUrl:'',actRemark:''
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
			//编辑提交CarRequireExpenseDetail car_require_expense_detail父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editCarRequireExpenseDetail(params).then((res) => {
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
		    //在下面添加其它组件 'car-require-expense-detail-edit':CarRequireExpenseDetailEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.carRequireExpenseDetail);  
		}
	}

</script>

<style scoped>

</style>