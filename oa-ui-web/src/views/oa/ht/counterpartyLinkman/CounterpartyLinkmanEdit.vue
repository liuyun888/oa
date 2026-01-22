<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="联系人id" prop="linkId">
					<el-input v-model="editForm.linkId" placeholder="联系人id"></el-input>
				</el-form-item> 
				<el-form-item label="向对方名称" prop="cpId">
					<el-input v-model="editForm.cpId" placeholder="向对方名称"></el-input>
				</el-form-item> 
				<el-form-item label="联系人名称" prop="linkName">
					<el-input v-model="editForm.linkName" placeholder="联系人名称"></el-input>
				</el-form-item> 
				<el-form-item label="联系人称呼" prop="linkCall">
					<el-input v-model="editForm.linkCall" placeholder="联系人称呼"></el-input>
				</el-form-item> 
				<el-form-item label="联系人岗位" prop="linkJob">
					<el-input v-model="editForm.linkJob" placeholder="联系人岗位"></el-input>
				</el-form-item> 
				<el-form-item label="联系人部门" prop="linkDept">
					<el-input v-model="editForm.linkDept" placeholder="联系人部门"></el-input>
				</el-form-item> 
				<el-form-item label="联系人办公电话" prop="linkPhone">
					<el-input v-model="editForm.linkPhone" placeholder="联系人办公电话"></el-input>
				</el-form-item> 
				<el-form-item label="联系人邮箱" prop="linkEmail">
					<el-input v-model="editForm.linkEmail" placeholder="联系人邮箱"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号"></el-input>
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
	import { editCounterpartyLinkman } from '@/api/oa/ht/counterpartyLinkman';
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
	        this.editForm = counterpartyLinkman;
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
					linkId: [
						//{ required: true, message: '联系人id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  CounterpartyLinkman ht_counterparty_linkman
				editForm: {
					linkId:'',cpId:'',linkName:'',linkCall:'',linkJob:'',linkDept:'',linkPhone:'',linkEmail:'',branchId:''
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
			//编辑提交CounterpartyLinkman ht_counterparty_linkman父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editCounterpartyLinkman(params).then((res) => {
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
		    //在下面添加其它组件 'counterparty-linkman-edit':CounterpartyLinkmanEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.counterpartyLinkman);  
		}
	}

</script>

<style scoped>

</style>