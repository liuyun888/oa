<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item style="display:none" label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="费用项目编号" prop="itemId">
					<el-input v-model="editForm.itemId" placeholder="费用项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="费用项目" prop="itemName">
					<el-input v-model="editForm.itemName" placeholder="费用项目"></el-input>
				</el-form-item> 
				<el-form-item label="费用" prop="feeAmount">
					<!-- <el-input v-model="editForm.feeAmount" placeholder="费用"></el-input> -->
					<el-input-number v-model="editForm.feeAmount" :min="0" :max="2000000"></el-input-number>
				</el-form-item> 
				<el-form-item label="费用说明" prop="feeRemark">
					<el-input v-model="editForm.feeRemark" placeholder="费用说明"></el-input>
				</el-form-item> 
				<el-form-item style="display:none" label="归属机构" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="归属机构"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col> 
          <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
						<el-button @click.native="handleCancel">取消</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editCarExpenseDetailTpl } from '@/api/oa/car/carExpenseDetailTpl';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carExpenseDetailTpl','visible'],
		watch: {
	      'carExpenseDetailTpl':function( carExpenseDetailTpl ) {
	        this.editForm = carExpenseDetailTpl;
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
					itemName: [
						{ required: true, message: '费用名字不能为空', trigger: 'change' },
						{  max: 50, message: '不能超过 50 个字符', trigger: 'change' }
					],
					feeAmount: [
						{ required: true, message: '费用不能为空', trigger: 'change' },
						{  max: 10, message: '不能超过 10 位数', trigger: 'change' }
					]
				},
				//编辑界面数据  CarExpenseDetailTpl car_expense_detail_tpl
				editForm: {
					id:'',itemId:'',itemName:'',feeAmount:'',feeRemark:'',branchId:''
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
			//编辑提交CarExpenseDetailTpl car_expense_detail_tpl父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editCarExpenseDetailTpl(params).then((res) => {
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
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			checkPrice: (rule, value, callback)=>{
				if(value <= 0){
					return callback(new Error('费用不能低于0!'));
				}
			},	
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'car-expense-detail-tpl-edit':CarExpenseDetailTplEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.carExpenseDetailTpl);  
		}
	}

</script>

<style scoped>

</style>