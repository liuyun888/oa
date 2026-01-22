<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="联系人id" prop="linkId">
					<el-input v-model="addForm.linkId" placeholder="联系人id" ></el-input>
				</el-form-item> 
				<el-form-item label="向对方名称" prop="cpId">
					<el-input v-model="addForm.cpId" placeholder="向对方名称" ></el-input>
				</el-form-item> 
				<el-form-item label="联系人名称" prop="linkName">
					<el-input v-model="addForm.linkName" placeholder="联系人名称" ></el-input>
				</el-form-item> 
				<el-form-item label="联系人称呼" prop="linkCall">
					<el-input v-model="addForm.linkCall" placeholder="联系人称呼" ></el-input>
				</el-form-item> 
				<el-form-item label="联系人岗位" prop="linkJob">
					<el-input v-model="addForm.linkJob" placeholder="联系人岗位" ></el-input>
				</el-form-item> 
				<el-form-item label="联系人部门" prop="linkDept">
					<el-input v-model="addForm.linkDept" placeholder="联系人部门" ></el-input>
				</el-form-item> 
				<el-form-item label="联系人办公电话" prop="linkPhone">
					<el-input v-model="addForm.linkPhone" placeholder="联系人办公电话" ></el-input>
				</el-form-item> 
				<el-form-item label="联系人邮箱" prop="linkEmail">
					<el-input v-model="addForm.linkEmail" placeholder="联系人邮箱" ></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构编号" ></el-input>
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
	import { addCounterpartyLinkman } from '@/api/oa/ht/counterpartyLinkman';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['counterpartyLinkman','visible'],
		watch: {
	      'counterpartyLinkman':function( counterpartyLinkman ) {
	        this.addForm = counterpartyLinkman;
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
					linkId: [
						//{ required: true, message: '联系人id不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ht_counterparty_linkman
				addForm: {
					linkId:'',cpId:'',linkName:'',linkCall:'',linkJob:'',linkDept:'',linkPhone:'',linkEmail:'',branchId:''
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
			//新增提交CounterpartyLinkman ht_counterparty_linkman 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCounterpartyLinkman(params).then((res) => {
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
		    //在下面添加其它组件 'counterparty-linkman-edit':CounterpartyLinkmanEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.counterpartyLinkman);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>