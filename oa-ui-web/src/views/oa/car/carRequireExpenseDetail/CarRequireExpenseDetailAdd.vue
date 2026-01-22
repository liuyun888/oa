<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="费用项目编号" prop="itemId">
					<el-input v-model="addForm.itemId" placeholder="费用项目编号" ></el-input>
				</el-form-item> 
				<el-form-item label="费用项目" prop="itemName">
					<el-input v-model="addForm.itemName" placeholder="费用项目" ></el-input>
				</el-form-item> 
				<el-form-item label="费用" prop="feeAmount">
					<el-input v-model="addForm.feeAmount" placeholder="费用"></el-input>
				</el-form-item> 
				<el-form-item label="费用说明" prop="feeRemark">
					<el-input v-model="addForm.feeRemark" placeholder="费用说明" ></el-input>
				</el-form-item> 
				<el-form-item label="申请编号" prop="requireId">
					<el-input v-model="addForm.requireId" placeholder="申请编号" ></el-input>
				</el-form-item> 
				<el-form-item label="实际费用" prop="actFeeAmount">
					<el-input v-model="addForm.actFeeAmount" placeholder="实际费用"></el-input>
				</el-form-item> 
				<el-form-item label="票据地址" prop="actFeeInvoiceUrl">
					<el-input v-model="addForm.actFeeInvoiceUrl" placeholder="票据地址" ></el-input>
				</el-form-item> 
				<el-form-item label="实际费用说明" prop="actRemark">
					<el-input v-model="addForm.actRemark" placeholder="实际费用说明" ></el-input>
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
	import { addCarRequireExpenseDetail } from '@/api/oa/car/carRequireExpenseDetail';
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
	        this.addForm = carRequireExpenseDetail;
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
						//{ required: true, message: '主键不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 car_require_expense_detail
				addForm: {
					id:'',itemId:'',itemName:'',feeAmount:'',feeRemark:'',requireId:'',actFeeAmount:'',actFeeInvoiceUrl:'',actRemark:''
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
			//新增提交CarRequireExpenseDetail car_require_expense_detail 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCarRequireExpenseDetail(params).then((res) => {
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
		    //在下面添加其它组件 'car-require-expense-detail-edit':CarRequireExpenseDetailEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.carRequireExpenseDetail);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>