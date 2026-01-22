<template>
	<section>
		<el-row class="app-container MailEmailAdd">
			<!--新增界面 MailEmail mail_email-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">

				<el-form-item label="发件邮箱" prop="sendEmail">
					<!-- <el-input v-model="addForm.sendEmail" placeholder="发件人邮箱" ></el-input> -->
					<el-select v-model="addForm.sendEmail" filterable placeholder="请选择">
						<el-option
						v-for="item in mailAccounts"
						:key="item.id"
						:label="item.email"
						:value="item.email">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="收件人">
					<el-button type="text" @click="openSelectUser('addresseeList')" icon="el-icon-search">选择用户</el-button>
					<el-button v-if="isOuter == '1'" type="text" @click="openSelectCustomer('addresseeList')" icon="el-icon-search">选择客户</el-button><br/>
					<el-tag style="margin-right:10px" v-for="(item,index) in addForm.addresseeList" @close="handleUserClose(item,'addressee')" closable>{{item.username}}</el-tag>
				</el-form-item>

				<el-form-item label="抄送人">
					<el-button type="text" @click="openSelectUser('cc')" icon="el-icon-search">选择用户</el-button>
					<el-button v-if="isOuter == '1'" type="text" @click="openSelectCustomer('cc')" icon="el-icon-search">选择客户</el-button><br/>
					<el-tag style="margin-right:10px" v-for="(item,index) in addForm.ccList" @close="handleUserClose(item,'cc')" closable>{{item.username}}</el-tag>
				</el-form-item>

				<el-form-item label="密送人">
					<el-button type="text" @click="openSelectUser('bcc')" icon="el-icon-search">选择用户</el-button>
					<el-button v-if="isOuter == '1'" type="text" @click="openSelectCustomer('bcc')" icon="el-icon-search">选择客户</el-button><br/>
					<el-tag style="margin-right:10px" v-for="(item,index) in addForm.bccList" @close="handleUserClose(item,'bcc')" closable>{{item.username}}</el-tag>
				</el-form-item>

				<el-form-item label="主题" prop="subject">
					<el-input v-model="addForm.subject" placeholder="主题" ></el-input>
				</el-form-item>


				<el-form-item label="正文">
					<vue-editor  :branch-id="userInfo.branchId" v-model="addForm.content"></vue-editor>
				</el-form-item>

				<el-form-item label="附件">
					<upload v-if="fileVisible" :archiveId="addForm.id" :branchId="userInfo.branchId"  @on-change="onChange"></upload>
				</el-form-item>

				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="primary" @click="addSubmit('1')" :disabled="load.add==true">发送</el-button>
						<el-button v-loading="load.add" type="info" @click="addSubmit('0')" :disabled="load.add==true">保存</el-button>
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
	import { addMailEmail } from '@/api/oa/mail/mailEmail';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; //选择用户
	import CustomerSelect from "@/views/oa/crm/components/CustomerComponents";
	import { listMailAccount } from '@/api/oa/mail/mailAccount';
	import VueEditor from '@/components/Tinymce/index' // 粘性header组件
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import { sn } from "@/common/js/sequence"; //id生成器
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
			//this.addForm=Object.assign(this.addForm, this.mailEmail);
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				this.addForm.id = sn()
				this.addForm.isOuter = this.isOuter
				this.fileVisible = true
				this.getMailAccounts();
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
				//新增界面数据 mail_email
				addForm: {
					id:'',subject:'',content:'',userId:'',username:'',sendEmail:'',sendTime:'',type:'',isOuter:'',isStar:'',isRead:'',status:'',branchId:'',
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
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交MailEmail mail_email 父组件监听@submit="afterAddSubmit"
			addSubmit: function (value) {

				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							//this.addForm.type = value
							this.addForm.userId = this.userInfo.userid
							this.addForm.username = this.userInfo.username
							this.addForm.branchId  = this.userInfo.branchId

							let params = Object.assign({}, this.addForm);
							params.type = value
							//console.log(params.type + "sssssssss")
							addMailEmail(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									this.fileVisible = false
									let newForm = {
										id:'',subject:'',content:'',userId:'',username:'',sendEmail:'',sendTime:'',type:'',isOuter:'',isStar:'',isRead:'',status:'',branchId:'',
										addresseeList:[],
										ccList:[],
										bccList:[],
										appendixList:[],
									}
									this.addForm = newForm
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
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
								emailId: this.addForm.id,
								userId: user.userid,
								username: user.username,
								userEmail: user.email,
								type:'0'
							}
							let flag = 0
							for (let index = 0; index < this.addForm.addresseeList.length; index++) {
								const element = this.addForm.addresseeList[index];
								if(JSON.stringify(element)  == JSON.stringify(newAddress) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.addForm.addresseeList.push(newAddress)
							}
						})
					}
				}else if(this.mark1 ==  'cc'){
					if(users!=null){
						users.forEach((user)=>{
							let newCc = {
								id : '',
								emailId: this.addForm.id,
								userId: user.userid,
								username: user.username,
								userEmail: user.email,
								type:'0'
							}
							let flag = 0
							for (let index = 0; index < this.addForm.ccList.length; index++) {
								const element = this.addForm.ccList[index];
								if(JSON.stringify(element)  == JSON.stringify(newCc) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.addForm.ccList.push(newCc)
							}
						})
					}
				}else{
					if(users!=null){
						users.forEach((user)=>{
							let newBcc = {
								id : '',
								emailId: this.addForm.id,
								userId: user.userid,
								username: user.username,
								userEmail: user.email,
								type:'0'
							}
							let flag = 0
							for (let index = 0; index < this.addForm.bccList.length; index++) {
								const element = this.addForm.bccList[index];
								if(JSON.stringify(element)  == JSON.stringify(newBcc) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.addForm.bccList.push(newBcc)
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
								emailId: this.addForm.id,
								userId: customer.customerId,
								username: customer.customerName,
								userEmail: customer.email,
								type:'1'
							}
							let flag = 0
							for (let index = 0; index < this.addForm.addresseeList.length; index++) {
								const element = this.addForm.addresseeList[index];
								if(JSON.stringify(element)  == JSON.stringify(newCustomer) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.addForm.addresseeList.push(newCustomer)
							}
						})
					}
				}else if(this.mark2  == 'cc'){
					if(vls!=null){
						vls.forEach((customer)=>{
							let newCc = {
								id : '',
								emailId: this.addForm.id,
								userId: customer.customerId,
								username: customer.customerName,
								userEmail: customer.email,
								type:'1'
							}
							let flag = 0
							for (let index = 0; index < this.addForm.ccList.length; index++) {
								const element = this.addForm.ccList[index];
								if(JSON.stringify(element)  == JSON.stringify(newCc) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.addForm.ccList.push(newCc)
							}
						})
					}
				}else{
					if(vls!=null){
						vls.forEach((customer)=>{
							let newCc = {
								id : '',
								emailId: this.addForm.id,
								userId: customer.customerId,
								username: customer.customerName,
								userEmail: customer.email,
								type:'1'
							}
							let flag = 0
							for (let index = 0; index < this.addForm.bccList.length; index++) {
								const element = this.addForm.bccList[index];
								if(JSON.stringify(element)  == JSON.stringify(newCc) ){
									flag = 1
									break;
								}
							}
							if(flag == 0){
								this.addForm.bccList.push(newCc)
							}
						})
					}
				}
			},

			handleUserClose(value,mark1){
				if(mark1 == 'addressee'){
					this.addForm.addresseeList.splice(this.addForm.addresseeList.indexOf(value),1)
				}else if (mark1 == 'cc'){
					this.addForm.ccList.splice(this.addForm.ccList.indexOf(value),1)
				}else{
					this.addForm.bccList.splice(this.addForm.bccList.indexOf(value),1)
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
							emailId: this.addForm.id,
							name: item.name,
							addr: item.url,
							type: item.fileSuffix,
							remark: item.remark,
						}
						list.push(fileOne)
					} )
					this.addForm.appendixList = list
				}
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
			this.getMailAccounts();
			//this.addForm=Object.assign(this.addForm, this.mailEmail);
			this.addForm.id = sn()
			this.addForm.isOuter = this.isOuter
			this.fileVisible = true

			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style>
	.MailEmailAdd{

	}
	.MailEmailAdd .el-form-item__label{
		text-align: left;
	}
</style>
