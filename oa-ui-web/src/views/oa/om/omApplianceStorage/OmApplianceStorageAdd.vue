<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="用品id" prop="applianceId">
					<el-input v-model="addForm.applianceId" placeholder="用品id" ></el-input>
				</el-form-item> 
				<el-form-item label="用品名称" prop="applianceName">
					<el-input v-model="addForm.applianceName" placeholder="用品名称" ></el-input>
				</el-form-item> 
				<el-form-item label="规格" prop="standard">
					<el-input v-model="addForm.standard" placeholder="规格" ></el-input>
				</el-form-item> 
				<el-form-item label="单价" prop="price">
					<el-input v-model="addForm.price" placeholder="单价"></el-input>
				</el-form-item> 
				<el-form-item label="入库数量" prop="num">
					<el-input-number v-model="addForm.num" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="金额" prop="totalPrice">
					<el-input v-model="addForm.totalPrice" placeholder="金额"></el-input>
				</el-form-item> 
				<el-form-item label="库存量" prop="stock">
					<el-input-number v-model="addForm.stock" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="操作人id" prop="userid">
					<el-input v-model="addForm.userid" placeholder="操作人id" ></el-input>
				</el-form-item> 
				<el-form-item label="操作人名字" prop="username">
					<el-input v-model="addForm.username" placeholder="操作人名字" ></el-input>
				</el-form-item> 
				<el-form-item label="入库日期" prop="createTime">
					<el-input-number v-model="addForm.createTime" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item label="供应商id" prop="supplierId">
					<el-input v-model="addForm.supplierId" placeholder="供应商id" ></el-input>
				</el-form-item> 
				<el-form-item label="供应商" prop="supplierName">
					<el-input v-model="addForm.supplierName" placeholder="供应商" ></el-input>
				</el-form-item> 
				<el-form-item label="机构号" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构号" ></el-input>
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
	import { addOmApplianceStorage } from '@/api/oa/om/omApplianceStorage';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['omApplianceStorage','visible'],
		watch: {
	      'omApplianceStorage':function( omApplianceStorage ) {
	        this.addForm = omApplianceStorage;
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
				//新增界面数据 om_appliance_storage
				addForm: {
					id:'',applianceId:'',applianceName:'',standard:'',price:'',num:'',totalPrice:'',stock:'',userid:'',username:'',createTime:'',remark:'',supplierId:'',supplierName:'',branchId:''
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
			//新增提交OmApplianceStorage om_appliance_storage 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addOmApplianceStorage(params).then((res) => {
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
		    //在下面添加其它组件 'om-appliance-storage-edit':OmApplianceStorageEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.omApplianceStorage);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>