<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="操作记录id" prop="operId">
					<el-input v-model="addForm.operId" placeholder="操作记录id" ></el-input>
				</el-form-item> 
				<el-form-item label="客户id" prop="customerId">
					<el-input v-model="addForm.customerId" placeholder="客户id" ></el-input>
				</el-form-item> 
				<el-form-item label="操作人" prop="operUserId">
					<el-input v-model="addForm.operUserId" placeholder="操作人" ></el-input>
				</el-form-item> 
				<el-form-item label="操作人名称" prop="operUserName">
					<el-input v-model="addForm.operUserName" placeholder="操作人名称" ></el-input>
				</el-form-item> 
				<el-form-item label="操作人部门id" prop="operDeptId">
					<el-input v-model="addForm.operDeptId" placeholder="操作人部门id" ></el-input>
				</el-form-item> 
				<el-form-item label="操作人部门名称" prop="operDeptName">
					<el-input v-model="addForm.operDeptName" placeholder="操作人部门名称" ></el-input>
				</el-form-item> 
				<el-form-item label="ip地址" prop="ipAddress">
					<el-input v-model="addForm.ipAddress" placeholder="ip地址" ></el-input>
				</el-form-item> 
				<el-form-item label="之前的值" prop="oldValue">
					<el-input v-model="addForm.oldValue" placeholder="之前的值" ></el-input>
				</el-form-item> 
				<el-form-item label="之后修改的值" prop="newValue">
					<el-input v-model="addForm.newValue" placeholder="之后修改的值" ></el-input>
				</el-form-item> 
				<el-form-item label="create" prop="operType">
					<el-input v-model="addForm.operType" placeholder="create" ></el-input>
				</el-form-item> 
				<el-form-item label="操作时间" prop="operTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.operTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="机构id" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构id" ></el-input>
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
	import { addCustomerOpertion } from '@/api/oa/crm/customerOpertion';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerOpertion','visible'],
		watch: {
	      'customerOpertion':function( customerOpertion ) {
	        this.addForm = customerOpertion;
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
					operId: [
						//{ required: true, message: '操作记录id不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 crm_customer_opertion
				addForm: {
					operId:'',customerId:'',operUserId:'',operUserName:'',operDeptId:'',operDeptName:'',ipAddress:'',oldValue:'',newValue:'',operType:'',operTime:'',branchId:''
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
			//新增提交CustomerOpertion crm_customer_opertion 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCustomerOpertion(params).then((res) => {
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
		    //在下面添加其它组件 'customer-opertion-edit':CustomerOpertionEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.customerOpertion);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>