<template>
	<section>

		 <el-row class="page-container border padding"> 
			<div class="nav">
				<el-form :model="addForm"  label-width="100px" :rules="addFormRules" ref="addForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="姓名" prop="contacterName">
								<el-input v-model="addForm.contacterName" placeholder="姓名"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item label="称呼" prop="titleName">
								<el-input @focus="customerCallVisible=true" v-model="addForm.titleName" placeholder="称呼"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="别名" prop="anotherName">
								<el-input v-model="addForm.anotherName" placeholder="别名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="岗位" prop="jobTitle">
								<el-input v-model="addForm.jobTitle" placeholder="岗位"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="项目角色" prop="projectRole">
								<el-input v-model="addForm.projectRole" placeholder="项目角色"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="意向判断" prop="attitude">
								<el-input v-model="addForm.attitude" placeholder="意向判断"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="关注点" prop="attention">
								<el-input v-model="addForm.attention" placeholder="关注点"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="电子邮件" prop="contacterEmail">
								<el-input v-model="addForm.contacterEmail" placeholder="电子邮件"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="办公室电话" prop="phoneOffice">
								<el-input v-model="addForm.phoneOffice" placeholder="办公室电话"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="住宅电话" prop="phoneHome">
								<el-input v-model="addForm.phoneHome" placeholder="住宅电话"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="移动电话" prop="mobilePhone">
								<el-input v-model="addForm.mobilePhone" placeholder="移动电话"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="传真" prop="contacterFax">
								<el-input v-model="addForm.contacterFax" placeholder="传真"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="IM号码" prop="imcode">
								<el-input v-model="addForm.imcode" placeholder="移动电话"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-divider content-position="center">自定义信息</el-divider>

					<el-row>
						<el-col :span="12">
							<el-form-item label="出生年月" prop="birthday">
								<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birthday"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="生日提醒前几天" prop="birthdayNotifydays">
								<el-input-number  v-model="addForm.birthdayNotifydays" :min="0" :max="200"></el-input-number>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="语言" prop="contacterLanguage">
								<el-select  v-model="addForm.contacterLanguage" placeholder="请选择">
									<el-option
										v-for="item in languageOptions"
										:key="item.optionValue"
										:label="item.optionName"
										:value="item.optionValue">
									</el-option>
								</el-select>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="是否主联系人" prop="isMain">
								<el-checkbox true-label="1" false-label="0" v-model="addForm.isMain"></el-checkbox>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="是否人脉" prop="isPerson">
								<el-checkbox true-label="1" false-label="0" v-model="addForm.isPerson"></el-checkbox>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="备注文档" prop="remarkDoc">
								<el-input  @focus="openDocSelect" v-model="addForm.remarkDocName"></el-input>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" :rows="4" v-model="addForm.remark" placeholder="备注"></el-input>
							</el-form-item> 
						</el-col>
					</el-row>
				</el-form>
			</div>

			<div class="footer">
				<div>
					<el-button @click.native="handleCancel">取消</el-button>  
					<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
				</div>
			</div>

			<el-dialog append-to-body  title="称呼"  top="2vh" :visible.sync="customerCallVisible" width="50%" :close-on-click-modal="false">
				<customer-base-data-components @getRowClick="getRowClickData" :visible="customerCallVisible" :type="callType">
				</customer-base-data-components>
			</el-dialog>

			<archive-select-components  @get-archive-data="getArchiveData" ref="archiveSelect">
			</archive-select-components>

		</el-row>

	</section>

</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addCustomerContacter } from '@/api/oa/crm/customerContacter';
	import { mapGetters } from 'vuex';
	import CustomerBaseDataComponents from '../components/CustomerBaseDataComponents';
	import ArchiveSelectComponents from '../components/ArchiveSelectComponents';

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerContacter','visible', 'customerId', 'customerName'],
		watch: {
	      'customerContacter':function( customerContacter ) {
	        this.addForm = customerContacter;
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
					contacterName: [
						{ required: true, message: '姓名不能为空', trigger: 'change' }
					],
					titleName: [
						{ required: true, message: '称呼不能为空', trigger: 'change' }
					],
					jobTitle: [
						{ required: true, message: '岗位不能为空', trigger: 'change' }
					],
					contacterLanguage: [
						{ required: true, message: '语言不能为空', trigger: 'change' }
					],
				},
				//新增界面数据 crm_customer_contacter
				addForm: {
					contacterId:'',contacterName:'',customerId:'',customerName:'',title:'',titleName:'',anotherName:'',firstName:'',jobTitle:'',projectRole:'',attitude:'',attention:'',contacterEmail:'',phoneOffice:'',phoneHome:'',mobilePhone:'',contacterFax:'',imcode:'',birthday:'',birthdayNotifydays:'',contacterLanguage:'',isMain:'',isPerson:'',remark:'',remarkDoc:'', parentId: '', branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				customerCallVisible:false,
				callType: 'call',
				languageOptions: [],

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交CustomerContacter crm_customer_contacter 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.addForm.customerId = this.customerId;
				this.addForm.customerName = this.customerName;
				this.addForm.branchId = this.userInfo.branchId;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCustomerContacter(params).then((res) => {
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
			getRowClickData (row, type) {
				switch(type) {
					case 'call':
						this.customerCallVisible = false;
						this.addForm.title = row.id;
						this.addForm.titleName = row.text;
					break;
				}
			},

			getOption() {
                let params = [
					{ categoryId: "all", itemCode: "language" },
                ];
                listOption(params).then(res => {
					this.languageOptions = res.data.data.language;
                });
			},

			openDocSelect() {
				this.$refs.archiveSelect.openDialog();
			},

			getArchiveData(data) {
				this.addForm.remarkDoc = data.archiveId;
				this.addForm.remarkDocName = data.archiveTitle;
			},

			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'customer-contacter-edit':CustomerContacterEdit
			'archive-select-components' : ArchiveSelectComponents,
			'customer-base-data-components': CustomerBaseDataComponents,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.customerContacter);
			/**在下面写其它函数***/
			this.getOption();

		}//end mounted
	}

</script>

<style scoped>

/* .app-container .nav {
	position: absolute;
	top: 0;
	bottom: 40px;
	overflow-y: auto;
}


.app-container .footer {
	position: absolute;
	height: 40px;
	bottom: 0;
	left: 0;

} */



</style>