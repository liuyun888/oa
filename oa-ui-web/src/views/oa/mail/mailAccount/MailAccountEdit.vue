<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="邮箱账号" prop="email">
					<el-input  :disabled="true" v-model="editForm.email" placeholder="邮箱账号" @input="changeInput" @blur="blurInput"></el-input>
				</el-form-item> 
				<el-form-item label="邮箱密码" prop="password">
					<el-input  type="password" v-model="editForm.password" placeholder="邮箱密码" ></el-input>
				</el-form-item> 
				<br/>
				<el-form-item label="收件服务器类型" prop="receiveServerType">
					<el-radio-group v-model="editForm.receiveServerType" @change="receiveServerTypeChange" >
						<el-radio label="0">POP3</el-radio>
						<el-radio label="1">IMAP</el-radio>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="收件服务器" prop="receiveServer">
					<el-input v-model="editForm.receiveServer" placeholder="收件服务器" ></el-input>
				</el-form-item> 
				<el-form-item prop="receiveIsSsl">
					<el-checkbox v-model="editForm.receiveIsSsl" @change="receiveIsSslChange">SSL</el-checkbox>
				</el-form-item> 
				<el-form-item label="端口" prop="receivePort">
					<el-input v-model="editForm.receivePort" placeholder="端口" ></el-input>
				</el-form-item> 
				<br/>
				<el-form-item label="SMTP服务器" prop="sendServer">
					<el-input v-model="editForm.sendServer" placeholder="SMTP服务器" ></el-input>
				</el-form-item> 
				<el-form-item label="是否使用SSL" prop="sendIsSsl">
					<el-checkbox v-model="editForm.sendIsSsl" @change="sendIsSslChange">SSL</el-checkbox>
				</el-form-item> 
				<el-form-item label="端口" prop="sendPort">
					<el-input v-model="editForm.sendPort" placeholder="端口" ></el-input>
				</el-form-item> 
				<br/>
				<el-form-item label="是否默认" prop="isDefault">
					<el-checkbox v-model="editForm.isDefault" label="1" >是的</el-checkbox>
				</el-form-item> 

				<el-form-item label="是否使用昵称" prop="isDefault">
					<el-checkbox v-model="editForm.isUseNick" label="1" >是的</el-checkbox>
				</el-form-item> 

				<el-form-item v-if="editForm.isUseNick" label="" prop="nickName">
					<el-input v-model="editForm.nickName" placeholder="昵称" ></el-input>
				</el-form-item> 


				<el-form-item style="display:none" label="备注说明" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注说明" ></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col> 
          <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
          <el-button v-loading="load.test" @click.native="testSubmit" :disabled="load.test==true">检测配置</el-button>
						<el-button @click.native="handleCancel">取消</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editMailAccount,testMailAccount } from '@/api/oa/mail/mailAccount';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['mailAccount','visible'],
		watch: {
	      'mailAccount':function( mailAccount ) {
			this.editForm=Object.assign(this.editForm, this.mailAccount);  
			this.editForm.isDefault == '1' ? this.editForm.isDefault = true : this.editForm.isDefault = false
			this.editForm.receiveIsSsl == '1' ? this.editForm.receiveIsSsl = true : this.editForm.receiveIsSsl = false
			this.editForm.sendIsSsl == '1' ? this.editForm.sendIsSsl = true : this.editForm.sendIsSsl = false
			this.editForm.isUseNick == '1' ? this.editForm.isUseNick = true : this.editForm.isUseNick = false
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
				load:{ list: false, edit: false, del: false, add: false ,test: false},//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  MailAccount mail_account
				editForm: {
					id:'',email:'',password:'',receiveServerType:'',receiveServer:'',receiveIsSsl:'',receivePort:'',sendServer:'',sendIsSsl:'',sendPort:'',isDefault:'',remark:'',nickName:'',isUseNick:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				emailNameList:['163.com','qq.com','139.com','aliyun.com','sohu.com']
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交MailAccount mail_account父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							params.isDefault == true ? params.isDefault = '1' : params.isDefault = '0'
							params.receiveIsSsl == true? params.receiveIsSsl = '1' : params.receiveIsSsl = '0'
							params.sendIsSsl == true ? params.sendIsSsl = '1' : params.sendIsSsl = '0'
							params.isUseNick == true ? params.isUseNick = '1' : params.isUseNick = '0'
							editMailAccount(params).then((res) => {
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
			testSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.load.test=true
						let params = Object.assign({}, this.editForm); 
						params.isDefault == true ? params.isDefault = '1' : params.isDefault = '0'
						params.receiveIsSsl == true? params.receiveIsSsl = '1' : params.receiveIsSsl = '0'
						params.sendIsSsl == true ? params.sendIsSsl = '1' : params.sendIsSsl = '0'
						params.isUseNick == true ? params.isUseNick = '1' : params.isUseNick = '0'

						testMailAccount(params).then((res) => {
							this.load.test=false
							var tips=res.data.tips;
							if(tips.isOk){
							}
							this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}).catch( err  => this.load.test=false);
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			receiveServerTypeChange(value){
				let index = this.editForm.email.lastIndexOf("@")
				let emailName = this.editForm.email.substring(index+1,this.editForm.email.length)

				let flag = this.emailNameList.indexOf(emailName)
				//console.log(flag)
				if(index != -1 && flag != '-1'){
					if(value == '0'){
						this.editForm.receiveServer = 'pop.' + emailName
						if(this.editForm.receiveIsSsl)
							this.editForm.receivePort = "995"
						else
							this.editForm.receivePort = "110"
					}else{
						this.editForm.receiveServer = 'imap.' + emailName
						if(this.editForm.receiveIsSsl)
							this.editForm.receivePort = "993"
						else
							this.editForm.receivePort = "143"
					}
					if(this.editForm.sendIsSsl)
							this.editForm.sendPort = "465"
						else
							this.editForm.sendPort = "25"
					this.editForm.sendServer = 'smtp.' + emailName
				}else{
					this.editForm.receiveServer = ''
					this.editForm.sendServer = ''
				}
			},
			changeInput(value){
				if(value.length < 5){
					return 
				}
				let index = this.editForm.email.lastIndexOf("@")
				let emailName = this.editForm.email.substring(index+1,this.editForm.email.length)
				let flag = this.emailNameList.indexOf(emailName)
				if(flag != '-1'){
					this.editForm.receiveServerType  = '0'
					this.editForm.receiveServer = 'pop.' + emailName	
					this.editForm.receiveIsSsl = true
					this.editForm.sendServer = 'smtp.' + emailName		
					this.editForm.sendIsSsl = true
					this.editForm.sendPort = '465'
				}
			},	
			blurInput(value){
				let index = this.editForm.email.lastIndexOf("@")
				if(index == -1){
					this.$message({ message: '输入的邮箱格式错误!请重新输入', type: 'error' }); 
					return
				}
				let emailName = this.editForm.email.substring(index+1,this.editForm.email.length)
				console.log(emailName + "-----------")
				let flag = this.emailNameList.indexOf(emailName)
				if(flag == -1){
					this.$message({ message: '输入的邮箱格式可能不太正确,请思考是否需要重新输入!', type: 'error' }); 
				}
			},
			sendIsSslChange(value){
				if(value){
					this.editForm.sendPort = '465'
				}else{
					this.editForm.sendPort = '25'
				}
			},
			receiveIsSslChange(value){
				console.log(value)
				if(value){
					if(this.editForm.receiveServerType == '0'){
						this.editForm.receivePort = '995'
					}else{
						this.editForm.receivePort = '993'
					}
				}else{
					if(this.editForm.receiveServerType == '0'){
						this.editForm.receivePort = '110'
					}else{
						this.editForm.receivePort = '143'
					}
				}
			}	
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'mail-account-edit':MailAccountEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.mailAccount);  
			this.editForm.isDefault == '1' ? this.editForm.isDefault = true : this.editForm.isDefault = false
			this.editForm.receiveIsSsl == '1' ? this.editForm.receiveIsSsl = true : this.editForm.receiveIsSsl = false
			this.editForm.sendIsSsl == '1' ? this.editForm.sendIsSsl = true : this.editForm.sendIsSsl = false
			this.editForm.isUseNick == '1' ? this.editForm.isUseNick = true : this.editForm.isUseNick = false
		}
	}

</script>

<style scoped>

</style>