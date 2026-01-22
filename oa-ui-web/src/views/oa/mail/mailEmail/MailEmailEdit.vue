<template>
	<section>
		 <el-row class="page-container border padding">
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<!-- <el-form-item label="发件邮箱" prop="sendEmail">
					<el-select v-model="editForm.sendEmail" filterable placeholder="请选择">
						<el-option
						v-for="item in mailAccounts"
						:key="item.id"
						:label="item.email"
						:value="item.email">
						</el-option>
					</el-select>
				</el-form-item>  -->

				<el-form-item label="收件人">
					<el-button type="text" @click="openSelectUser('addresseeList')" icon="el-icon-search">选择用户</el-button>
					<el-button v-if="isOuter == '1'" type="text" @click="openSelectCustomer('addresseeList')" icon="el-icon-search">选择客户</el-button><br/>
					<el-tag style="margin-right:10px" v-for="(item,index) in editForm.addresseeList" @close="handleUserClose(item,'addressee')" closable>{{item.username}}</el-tag>
				</el-form-item>

				<el-form-item label="抄送人">
					<el-button type="text" @click="openSelectUser('cc')" icon="el-icon-search">选择用户</el-button>
					<el-button v-if="isOuter == '1'" type="text" @click="openSelectCustomer('cc')" icon="el-icon-search">选择客户</el-button><br/>
					<el-tag style="margin-right:10px" v-for="(item,index) in editForm.ccList" @close="handleUserClose(item,'cc')" closable>{{item.username}}</el-tag>
				</el-form-item>

				<el-form-item label="密送人">
					<el-button type="text" @click="openSelectUser('bcc')" icon="el-icon-search">选择用户</el-button>
					<el-button v-if="isOuter == '1'" type="text" @click="openSelectCustomer('bcc')" icon="el-icon-search">选择客户</el-button><br/>
					<el-tag style="margin-right:10px" v-for="(item,index) in editForm.bccList" @close="handleUserClose(item,'bcc')" closable>{{item.username}}</el-tag>
				</el-form-item>

				<el-form-item label="主题" prop="subject">
					<el-input v-model="editForm.subject" placeholder="主题" ></el-input>
				</el-form-item>


				<el-form-item label="正文">
					<vue-editor  :branch-id="userInfo.branchId" v-model="editForm.content"></vue-editor>
				</el-form-item>

				<el-form-item label="附件">
					<upload v-if="fileVisible" :archiveId="editForm.id" :branchId="userInfo.branchId"  @on-change="onChange"></upload>
				</el-form-item>
				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="primary" @click="editSubmit('1')" :disabled="load.add==true">发送</el-button>
						<el-button v-loading="load.add" type="info" @click="editSubmit('0')" :disabled="load.add==true">保存</el-button>
					</el-col>
				</el-form-item>
			</el-form>
			<el-dialog append-to-body title="选择用户" :visible.sync="selectUserFormVisible" width="80%">
			    <users-select @confirm="onUserSelected">
				</users-select>
			</el-dialog>
			<el-dialog append-to-body title="选择客户" :visible.sync="selectCustomerFormVisible" width="80%">
			    <customer-select @cancel="selectCustomerFormVisible = false"  @getSelectCustomers="onCustomerSelected">
				</customer-select>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editMailEmail,getMailMessage } from '@/api/oa/mail/mailEmail';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; //选择用户
	import CustomerSelect from "@/views/oa/crm/components/CustomerComponents";
	import { listMailAccount } from '@/api/oa/mail/mailAccount';
	import VueEditor from '@/components/Tinymce/index' // 粘性header组件
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import config from '@/common/config'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['mailEmail','visible','isOuter'],
		watch: {
	      'mailEmail':function( mailEmail ) {
				this.editForm=Object.assign(this.editForm, this.mailEmail);
				this.getMailEmail();
				//console.log(this.editForm)
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
				//编辑界面数据  MailEmail mail_email
				editForm: {
					id:'',subject:'',content:'',userId:'',username:'',sendEmail:'',sendTime:'',isStar:'',isRead:'',status:'',
					addresseeList:[],
					ccList:[],
					bccList:[],
					appendixList:[],
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectUserFormVisible: false,
				selectCustomerFormVisible: false,
				mailAccounts: [],
				mark1:'',
				mark2:'',
				fileVisible : true,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交MailEmail mail_email父组件监听@submit="afterEditSubmit"
			editSubmit: function (value) {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							params.type = value
							editMailEmail(params).then((res) => {
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

			//获取列表 MailAccount mail_account
			getMailAccounts() {
				let params = {
					branchId: this.userInfo.branchId
				};
				listMailAccount(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.mailAccounts = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
				}).catch( err => this.load.list = false );
			},
			openSelectUser(mark){
				this.mark1 = mark
				this.selectUserFormVisible = true
			},
			openSelectCustomer(mark){
				this.mark2 = mark
				this.selectCustomerFormVisible = true
			},
			onUserSelected: function(users) {
				this.selectUserFormVisible = false
				if(this.mark1 ==  'addresseeList'){
					if(users!=null){
						users.forEach((user)=>{
							let newAddress = {
								id : '',
								emailId: this.editForm.id,
								userId: user.userid,
								username: user.username,
								userEmail: user.email,
								type:'0',
								receiveType: '0',
							}
							let flag = 0
							for (let index = 0; index < this.editForm.addresseeList.length; index++) {
								const element = this.editForm.addresseeList[index];
								if(JSON.stringify(element)  == JSON.stringify(newAddress) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.editForm.addresseeList.push(newAddress)
							}
						})
					}
				}else if(this.mark1 ==  'cc'){
					if(users!=null){
						users.forEach((user)=>{
							let newCc = {
								id : '',
								emailId: this.editForm.id,
								userId: user.userid,
								username: user.username,
								userEmail: user.email,
								type:'0',
								receiveType: '1',
							}
							let flag = 0
							for (let index = 0; index < this.editForm.ccList.length; index++) {
								const element = this.editForm.ccList[index];
								if(JSON.stringify(element)  == JSON.stringify(newCc) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.editForm.ccList.push(newCc)
							}
						})
					}
				}else{
					if(users!=null){
						users.forEach((user)=>{
							let newBcc = {
								id : '',
								emailId: this.editForm.id,
								userId: user.userid,
								username: user.username,
								userEmail: user.email,
								type:'0',
								receiveType: '2',
							}
							let flag = 0
							for (let index = 0; index < this.editForm.bccList.length; index++) {
								const element = this.editForm.bccList[index];
								if(JSON.stringify(element)  == JSON.stringify(newBcc) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.editForm.bccList.push(newBcc)
							}
						})
					}
				}
    		},
			onCustomerSelected(vls){
				this.selectCustomerFormVisible = false
				if(this.mark2  == 'addresseeList'){
					if(vls!=null){
						vls.forEach((customer)=>{
							let newCustomer = {
								id : '',
								emailId: this.editForm.id,
								userId: customer.customerId,
								username: customer.customerName,
								userEmail: customer.email,
								type:'1',
								receiveType: '0',
							}
							let flag = 0
							for (let index = 0; index < this.editForm.addresseeList.length; index++) {
								const element = this.editForm.addresseeList[index];
								if(JSON.stringify(element)  == JSON.stringify(newCustomer) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.editForm.addresseeList.push(newCustomer)
							}
						})
					}
				}else if(this.mark2  == 'cc'){
					if(vls!=null){
						vls.forEach((customer)=>{
							let newCc = {
								id : '',
								emailId: this.editForm.id,
								userId: customer.customerId,
								username: customer.customerName,
								userEmail: customer.email,
								type:'1',
								receiveType: '1',
							}
							let flag = 0
							for (let index = 0; index < this.editForm.ccList.length; index++) {
								const element = this.editForm.ccList[index];
								if(JSON.stringify(element)  == JSON.stringify(newCc) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.editForm.ccList.push(newCc)
							}
						})
					}
				}else{
					if(vls!=null){
						vls.forEach((customer)=>{
							let newCc = {
								id : '',
								emailId: this.editForm.id,
								userId: customer.customerId,
								username: customer.customerName,
								userEmail: customer.email,
								type:'1',
								receiveType: '2',
							}
							let flag = 0
							for (let index = 0; index < this.editForm.bccList.length; index++) {
								const element = this.editForm.bccList[index];
								if(JSON.stringify(element)  == JSON.stringify(newCc) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.editForm.bccList.push(newCc)
							}
						})
					}
				}
			},

			handleUserClose(value,mark1){
				if(mark1 == 'addressee'){
					this.editForm.addresseeList.splice(this.editForm.addresseeList.indexOf(value),1)
				}else if (mark1 == 'cc'){
					this.editForm.ccList.splice(this.editForm.ccList.indexOf(value),1)
				}else{
					this.editForm.bccList.splice(this.editForm.bccList.indexOf(value),1)
				}
			},
			onChange : function(file,fileList){
				//console.log(file)
				//console.log(fileList)
				let list = []
				if(fileList != null && fileList.length > 0){
					fileList.forEach( (item)=>{
						let fileOne = {
							id: item.id,
							emailId: this.editForm.id,
							name: item.name,
							addr: config.getArcFileUploadBasePath() + '/' + item.url,
							type: item.fileSuffix,
							remark: item.remark,
						}
						list.push(fileOne)
					} )
					this.editForm.appendixList = list
				}
			},
			getMailEmail(){
				let params = {
					id: this.editForm.id
				};
				getMailMessage(params).then((res) => {
					var tips=res.data.tips;
					if(res.data.data != null){
						this.editForm.ccList = res.data.data.ccList
						this.editForm.bccList = res.data.data.bccList
						this.editForm.addresseeList = res.data.data.addresseeList
						this.editForm.appendixList = res.data.data.appendixList
					}
					//this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err =>this.load.edit=false);
			},
			/**end 在上面加自定义方法**/
		},//end method
		components: {
			//在下面添加其它组件 'mail-email-edit':MailEmailEdit
			"users-select" : UsersSelect,
			"customer-select":CustomerSelect,
			'vue-editor' :VueEditor,
			'upload': AttachmentUpload,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.mailEmail);
			this.getMailEmail();
			//console.log(this.editForm)
			this.getMailAccounts();
		}
	}

</script>

<style scoped>

</style>
