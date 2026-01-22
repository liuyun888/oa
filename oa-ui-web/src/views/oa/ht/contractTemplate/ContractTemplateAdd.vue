<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				
				<el-form-item label="所属分类" prop="typeId">
					<el-input  @focus="typeSelectVisible=true" v-model="typeName"></el-input>
				</el-form-item>

				<el-form-item label="上传" prop="name">
					<attachment-upload limit="1" @uploadSuccess="getUploadData" @on-remove="removeFile" :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
				</el-form-item>
				
				<el-form-item>
					<el-col> 
					<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
						<el-button @click.native="handleCancel">取消</el-button>  
					</el-col>
				</el-form-item>
			</el-form>
		</el-row>

		<div class="type">
			<el-dialog append-to-body title="选择分类" :visible.sync="typeSelectVisible"  width="50%"  :close-on-click-modal="false">
				<contract-type-tree-components  @node-click="getTypeData"></contract-type-tree-components>
			</el-dialog>
		</div>


	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addContractTemplate } from '@/api/oa/ht/contractTemplate';
	import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
	import { mapGetters } from 'vuex'
	import  ContractTypeTreeComponents from '../components/ContractTypeTreeComponents';
	import {sn} from '@/common/js/sequence'; //id生成器



	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['contractTemplate','visible'],
		watch: {
	      'contractTemplate':function( contractTemplate ) {
	        this.addForm = contractTemplate;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.initData();
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					typeId: [
						{ required: true, message: '所属分类不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ht_contract_template
				addForm: {
					id:'',typeId:'',name:'',isOpen:'',url:'',version:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				uploadArchiveId: '',
				uploadCategoryId: '',
				typeName: '',
				typeSelectVisible: false,


				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交ContractTemplate ht_contract_template 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addContractTemplate(params).then((res) => {
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
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//获取分类数据
			getTypeData(data) {
				if(data.typeParentId === '0') {
					this.$message.error("不能选择该层级数据");
					return;
				}
				this.addForm.typeId = data.typeId;
				this.typeName = data.typeName;
				this.typeSelectVisible = false;
			},


			getUploadData(data) {
				this.addForm.url = data.url;
				this.addForm.name = data.name;
			},

			//移除文件
			removeFile(data) {
				this.addForm.url = '';
				this.addForm.name = '';
			},

			initData() {
				this.addForm.id = sn();
				this.uploadArchiveId = this.addForm.id;
				this.uploadCategoryId = 'contract_template';
			},

			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'contract-template-edit':ContractTemplateEdit
			'attachment-upload': AttachmentUpload,
			'contract-type-tree-components' : ContractTypeTreeComponents
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.contractTemplate);  
			/**在下面写其它函数***/
			this.initData();
			
		}//end mounted
	}

</script>

<style>

</style>