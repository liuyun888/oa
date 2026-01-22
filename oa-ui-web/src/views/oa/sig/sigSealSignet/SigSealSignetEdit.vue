<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="申请单编号" prop="sealId">
					<el-input v-model="editForm.sealId" placeholder="申请单编号"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="材料名称" prop="docName">
					<el-input v-model="editForm.docName" placeholder="材料名称"></el-input>
				</el-form-item> 
				<el-form-item label="材料保存地址/下载地址/上传地址" prop="docFileUrl">
					<el-input v-model="editForm.docFileUrl" placeholder="材料保存地址/下载地址/上传地址"></el-input>
				</el-form-item> 
				<el-form-item label="印章编号" prop="signetId">
					<el-input v-model="editForm.signetId" placeholder="印章编号"></el-input>
				</el-form-item> 
				<el-form-item label="印章类型公章0法人代表章1法人代表章" prop="signetType">
					<el-input v-model="editForm.signetType" placeholder="印章类型公章0法人代表章1法人代表章"></el-input>
				</el-form-item> 
				<el-form-item label="所属主体" prop="signetBranchId">
					<el-input v-model="editForm.signetBranchId" placeholder="所属主体"></el-input>
				</el-form-item> 
				<el-form-item label="用印份数" prop="sealCount">
					<el-input-number v-model="editForm.sealCount" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="是否加盖骑缝章" prop="pageSeal">
					<el-input v-model="editForm.pageSeal" placeholder="是否加盖骑缝章"></el-input>
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
	import { editSigSealSignet } from '@/api/oa/sig/sigSealSignet';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['sigSealSignet','visible'],
		watch: {
	      'sigSealSignet':function( sigSealSignet ) {
	        this.editForm = sigSealSignet;
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
				//编辑界面数据  SigSealSignet sig_seal_signet
				editForm: {
					sealId:'',id:'',docName:'',docFileUrl:'',signetId:'',signetType:'',signetBranchId:'',sealCount:'',pageSeal:''
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
			//编辑提交SigSealSignet sig_seal_signet父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editSigSealSignet(params).then((res) => {
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
		    //在下面添加其它组件 'sig-seal-signet-edit':SigSealSignetEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.sigSealSignet);  
		}
	}

</script>

<style scoped>

</style>