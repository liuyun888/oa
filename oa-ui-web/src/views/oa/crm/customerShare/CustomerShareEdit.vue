<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="共享id" prop="shareId">
					<el-input v-model="editForm.shareId" placeholder="共享id"></el-input>
				</el-form-item> 
				<el-form-item label="客户id" prop="customerId">
					<el-input v-model="editForm.customerId" placeholder="客户id"></el-input>
				</el-form-item> 
				<el-form-item label="dept:" prop="shareType">
					<el-input v-model="editForm.shareType" placeholder="dept:"></el-input>
				</el-form-item> 
				<el-form-item label="共享对象" prop="shareObj">
					<el-input v-model="editForm.shareObj" placeholder="共享对象"></el-input>
				</el-form-item> 
				<el-form-item label="共享对象名称" prop="shareObjName">
					<el-input v-model="editForm.shareObjName" placeholder="共享对象名称"></el-input>
				</el-form-item> 
				<el-form-item label="see:查看edit编辑" prop="shareLevel">
					<el-input v-model="editForm.shareLevel" placeholder="see:查看edit编辑"></el-input>
				</el-form-item> 
				<el-form-item label="机构id" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构id"></el-input>
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
	import { editCustomerShare } from '@/api/oa/crm/customerShare';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerShare','visible'],
		watch: {
	      'customerShare':function( customerShare ) {
	        this.editForm = customerShare;
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
					shareId: [
						//{ required: true, message: '共享id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  CustomerShare crm_customer_share
				editForm: {
					shareId:'',customerId:'',shareType:'',shareObj:'',shareObjName:'',shareLevel:'',branchId:''
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
			//编辑提交CustomerShare crm_customer_share父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editCustomerShare(params).then((res) => {
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
		    //在下面添加其它组件 'customer-share-edit':CustomerShareEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.customerShare);  
		}
	}

</script>

<style scoped>

</style>