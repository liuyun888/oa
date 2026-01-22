<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="邮箱账号" prop="email">
					<el-input v-model="addForm.email" placeholder="推荐使用qq邮箱喔" @input="changeInput" @blur="blurInput"></el-input>
				</el-form-item> 
				<el-form-item label="邮箱密码" prop="password">
					<el-input type="password" v-model="addForm.password" placeholder="邮箱密码" ></el-input>
				</el-form-item> 
				<br/>
				<el-form-item label="收件服务器类型" prop="receiveServerType">
					<el-radio-group v-model="addForm.receiveServerType" @change="receiveServerTypeChange" >
						<el-radio label="0">POP3</el-radio>
						<el-radio label="1">IMAP</el-radio>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="收件服务器" prop="receiveServer">
					<el-input v-model="addForm.receiveServer" placeholder="收件服务器" ></el-input>
				</el-form-item> 
				<el-form-item prop="receiveIsSsl">
					<el-checkbox v-model="addForm.receiveIsSsl" @change="receiveIsSslChange">SSL</el-checkbox>
				</el-form-item> 
				<el-form-item label="端口" prop="receivePort">
					<el-input v-model="addForm.receivePort" placeholder="端口" ></el-input>
				</el-form-item> 
				<br/>
				<el-form-item label="SMTP服务器" prop="sendServer">
					<el-input v-model="addForm.sendServer" placeholder="SMTP服务器" ></el-input>
				</el-form-item> 
				<el-form-item label="是否使用SSL" prop="sendIsSsl">
					<!-- <el-input v-model="addForm.sendIsSsl" placeholder="是否使用SSL" ></el-input> -->
					<el-checkbox v-model="addForm.sendIsSsl" @change="sendIsSslChange">SSL</el-checkbox>
				</el-form-item> 
				<el-form-item label="端口" prop="sendPort">
					<el-input v-model="addForm.sendPort" placeholder="端口" ></el-input>
				</el-form-item> 
				<br/>

				<el-form-item label="是否使用昵称" prop="isDefault">
					<el-checkbox v-model="addForm.isUseNick" label="1" >是的</el-checkbox>
				</el-form-item> 

				<el-form-item v-if="addForm.isUseNick" label="" prop="nickName">
					<el-input v-model="addForm.nickName" placeholder="昵称" ></el-input>
				</el-form-item> 

				<el-form-item label="是否默认" prop="isDefault">
					<el-checkbox v-model="addForm.isDefault" label="1" >是的</el-checkbox>
				</el-form-item> 
				<el-form-item style="display:none" label="备注说明" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注说明" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col> 
          <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
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
	import { testMailAccount,addMailAccount } from '@/api/oa/mail/mailAccount';
	import { mapGetters } from 'vuex'
	import md5 from 'js-md5';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['mailAccount','visible'],
		watch: {
	      'mailAccount':function( mailAccount ) {
	        	this.addForm=Object.assign(this.addForm, this.mailAccount); 
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
				//新增界面数据 mail_account
				addForm: {
					id:'',email:'',password:'',receiveServerType: '1',receiveServer:'',receiveIsSsl:'',receivePort:'',sendServer:'',sendIsSsl:'',sendPort:'',isDefault:'',remark:'',branchId:'',nickName:'',isUseNick:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				emailNameList:['163.com','qq.com','139.com','aliyun.com','sohu.com']
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交MailAccount mail_account 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							//params.password = md5(this.addForm.password)
							params.branchId  = this.userInfo.branchId
							params.isDefault == true ? params.isDefault = '1' : params.isDefault = '0'
							params.receiveIsSsl == true? params.receiveIsSsl = '1' : params.receiveIsSsl = '0'
							params.sendIsSsl == true ? params.sendIsSsl = '1' : params.sendIsSsl = '0'
							params.isUseNick == true ? params.isUseNick = '1' : params.isUseNick = '0'

							addMailAccount(params).then((res) => {
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
			testSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.load.test=true
						let params = Object.assign({}, this.addForm); 
						this.addForm.branchId  = this.userInfo.branchId
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
				let index = this.addForm.email.lastIndexOf("@")
				let emailName = this.addForm.email.substring(index+1,this.addForm.email.length)

				let flag = this.emailNameList.indexOf(emailName)
				//console.log(flag)
				if(index != -1 && flag != '-1'){
					if(value == '0'){
						//this.$message({ message: '建议使用imap作为服务器类型,pop3权限不够,推荐你去邮箱上修改!', type: 'error' }); 
						this.$confirm('建议使用imap作为服务器类型,pop3权限不够,推荐你去邮箱上修改!是否继续使用!', '温馨提示', {}).then(() => { 
							this.addForm.receiveServer = 'pop.' + emailName
							if(this.addForm.receiveIsSsl)
								this.addForm.receivePort = "995"
							else
								this.addForm.receivePort = "110"
						}).catch(() => {
							this.addForm.receiveServerType = '1'
						});
						
					}else{
						this.addForm.receiveServer = 'imap.' + emailName
						if(this.addForm.receiveIsSsl)
							this.addForm.receivePort = "993"
						else
							this.addForm.receivePort = "143"
					}
					if(this.addForm.sendIsSsl)
							this.addForm.sendPort = "465"
						else
							this.addForm.sendPort = "25"
					this.addForm.sendServer = 'smtp.' + emailName
				}else{
					this.addForm.receiveServer = ''
					this.addForm.sendServer = ''
				}
			},
			changeInput(value){
				if(value.length < 5){
					return 
				}
				let index = this.addForm.email.lastIndexOf("@")
				let emailName = this.addForm.email.substring(index+1,this.addForm.email.length)
				let flag = this.emailNameList.indexOf(emailName)
				if(flag != '-1'){
					this.addForm.receiveServerType  = '1'
					this.addForm.receiveServer = 'imap.' + emailName	
					this.addForm.receiveIsSsl = true
					this.addForm.sendServer = 'smtp.' + emailName		
					this.addForm.sendIsSsl = true
					this.addForm.sendPort = '465'
				}
			},	
			blurInput(value){
				let index = this.addForm.email.lastIndexOf("@")
				if(index == -1){
					this.$message({ message: '输入的邮箱格式错误!请重新输入', type: 'error' }); 
					return true
				}
				let emailName = this.addForm.email.substring(index+1,this.addForm.email.length)
				//console.log(emailName + "-----------")
				let flag = this.emailNameList.indexOf(emailName)
				if(flag == -1){
					this.$message({ message: '输入的邮箱格式可能不太正确,请思考是否需要重新输入!', type: 'error' }); 
				}
			},
			sendIsSslChange(value){
				if(value){
					this.addForm.sendPort = '465'
				}else{
					this.addForm.sendPort = '25'
				}
			},
			receiveIsSslChange(value){
				console.log(value)
				if(value){
					console.log(this.addForm.receiveServerType + "ssssssss")
					if(this.addForm.receiveServerType == '0'){
						this.addForm.receivePort = '995'
					}else{
						this.addForm.receivePort = '993'
					}
				}else{
					if(this.addForm.receiveServerType == '0'){
						this.addForm.receivePort = '110'
					}else{
						this.addForm.receivePort = '143'
					}
				}
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'mail-account-edit':MailAccountEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.mailAccount);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>