<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item style="display:none" label="司机编号" prop="driverId">
					<el-input v-model="editForm.driverId" placeholder="司机编号"></el-input>
				</el-form-item> 
				<el-form-item label="汽车司机" prop="driverUserid">
					<el-button type="text" @click="selectUserFormVisible = true">选择司机</el-button>
					<el-tag style="margin-left: 50px;" v-if="editForm.driverUserid != ''" v-text='"已选择: " + editForm.driverUserid'></el-tag>
				</el-form-item> 
				<el-form-item label="司机姓名" prop="driverUsername">
					<el-input v-model="editForm.driverUsername" placeholder="司机姓名"></el-input>
				</el-form-item> 
				<el-form-item label="司机电话" prop="driverPhoneno">
					<el-input v-model="editForm.driverPhoneno" placeholder="司机电话"></el-input>
				</el-form-item> 
				<el-form-item label="微信号" prop="driverWeixin">
					<el-input v-model="editForm.driverWeixin" placeholder="微信号"></el-input>
				</el-form-item> 
				<el-form-item label="邮件" prop="driverEmel">
					<el-input v-model="editForm.driverEmel" placeholder="邮件"></el-input>
				</el-form-item> 
				<el-form-item label="驾驶证号码" prop="driverCardNum">
					<el-input v-model="editForm.driverCardNum" placeholder="驾驶证号码"></el-input>
				</el-form-item> 
				<el-form-item label="驾驶证照片" prop="driverCardImageUrl">
					<el-image style="width: 250px; height: 200px" :src="imageUrl + editForm.driverCardImageUrl "></el-image>
        			<car-upload @on-change="onChange"></car-upload>
				</el-form-item> 
				<el-form-item label="驾驶证状态" prop="driverStatus">
					<!-- <el-input v-model="editForm.driverStatus" placeholder="驾驶证状态"></el-input> -->
					<el-radio-group v-model="editForm.driverStatus" size="medium">
						<el-radio-button label="正常"></el-radio-button>
						<el-radio-button label="超分"></el-radio-button>
						<el-radio-button label="转出"></el-radio-button>
						<el-radio-button label="暂扣"></el-radio-button>
						<el-radio-button label="撤销"></el-radio-button>
						<el-radio-button label="吊销"></el-radio-button>
						<el-radio-button label="注销"></el-radio-button>
						<el-radio-button label="违法未处理"></el-radio-button>
						<el-radio-button label="停止使用"></el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="驾驶证领证日期" prop="driverCardStartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.driverCardStartTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="驾驶年龄" prop="driverAge">
					<el-input-number v-model="editForm.driverAge" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="司机性别" prop="driverSex">
					<!-- <el-input v-model="editForm.driverSex" placeholder="司机性别"></el-input> -->
					<el-radio-group v-model="editForm.driverSex" size="medium">
						<el-radio-button label="男"></el-radio-button>
						<el-radio-button label="女"></el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="司机实际驾龄" prop="driverActYear">
					<el-input-number v-model="editForm.driverActYear" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item style="display:none"  label="增加时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="驾驶证类型" prop="driverCardType">
					<!-- <el-input v-model="editForm.driverCardType" placeholder="驾驶证类型"></el-input> -->
					<el-radio-group v-model="editForm.driverCardType" size="medium">
						<el-radio-button label="A1"></el-radio-button>
						<el-radio-button label="A2"></el-radio-button>
						<el-radio-button label="A3"></el-radio-button>
						<el-radio-button label="B1"></el-radio-button>
						<el-radio-button label="B2"></el-radio-button>
						<el-radio-button label="C1"></el-radio-button>
						<el-radio-button label="C2"></el-radio-button>
						<el-radio-button label="C3"></el-radio-button>
						<el-radio-button label="C4"></el-radio-button>
						<el-radio-button label="C5"></el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item style="display:none" label="司机归属机构" prop="driverBranchId">
					<el-input v-model="editForm.driverBranchId" placeholder="司机归属机构"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col > 
          <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
						<el-button @click.native="handleCancel">取消</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
		<el-dialog append-to-body title="选择员工" :visible.sync="selectUserFormVisible" width="80%">
		    <users-select @confirm="onUserSelected">
			</users-select>
			<!-- <div slot="footer" class="dialog-footer">
					<el-button @click="selectUserFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectUserFormVisible = false">确 定</el-button>
			</div> -->
		 </el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editCarDriver } from '@/api/oa/car/carDriver';
	import { mapGetters } from 'vuex'
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import config from '@/common/config'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import { delArchiveAttachment } from "@/api/mdp/arc/archiveAttachment";
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carDriver','visible'],
		watch: {
	      'carDriver':function( carDriver ) {
				this.editForm = carDriver;
				this.driverCardImageUrl = this.editForm.driverCardImageUrl
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
					driverUserid: [
						{ required: true, message: '汽车司机不能为空', trigger: 'change' },
						{  max: 50, message: '不能超过 50 个字符', trigger: 'change' }
					],
					driverUsername: [
						{ required: true, message: '司机姓名不能为空', trigger: 'change' },
						{  max: 50, message: '不能超过 50 个字符', trigger: 'change' }
					],
					driverPhoneno: [
						{ required: true, message: '司机电话不能为空', trigger: 'change' },
						{ validator: this.checkPhone, trigger: 'change' }
					],
					driverCardNum:[
						{ required: true, message: '驾驶证号码不能为空', trigger: 'change' },
						{ max: 50, message: '不能超过 50 个字符', trigger: 'change' },
						
					]	
				},
				//编辑界面数据  CarDriver car_driver
				editForm: {
					driverId:'',driverUserid:'',driverUsername:'',driverPhoneno:'',driverWeixin:'',driverEmel:'',driverCardNum:'',driverCardImageUrl:'',driverStatus:'',driverCardStartTime:'',driverAge:'',driverSex:'',driverActYear:'',createTime:'',driverCardType:'',driverBranchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				imageUrl: config.getArcFileUploadBasePath() + '/',
				selectUserFormVisible: false,
				driverCardImageUrl: '',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交CarDriver car_driver父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editCarDriver(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){

									if(res.data.data.driverCardImageUrl != this.driverCardImageUrl){
										this.handleRemove(this.driverCardImageUrl)
									}

									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},
			handleRemove(url) {

				let index1 = url.lastIndexOf('/')
				let index2 = url.lastIndexOf('.')
				let id = url.substring(index1+1,index2)
				
				let file = {
						id: id
					};
				delArchiveAttachment(file).then(res => {
					if (res.data.tips.isOk) {
						//this.$message("成功");
					} else {
						//this.$message("删除失败");
					}
				})
				.catch(() => {
					this.$message.warning("删除失败");
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			onChange : function(file,fileList){
				this.editForm.driverCardImageUrl = file.url
				//this.imageUrl = this.editForm.driverCardImageUrl
				console.log(file)
				console.log(fileList)
			},
			onUserSelected: function(users) {
				console.log(users[0].userid)
				this.editForm.driverUserid = users[0].userid
				this.editForm.driverUsername = users[0].username
    		},
			checkPhone: function(rule, value, callback){
				if (!value) {
					return callback(new Error('手机号不能为空'));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					console.log(reg.test(value));
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的手机号'));
					}
				}
			},	
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			//在下面添加其它组件 'car-driver-edit':CarDriverEdit
			 "car-upload": AttachmentUpload,
			 "users-select" : UsersSelect
		},
		created(){
			this.editForm=Object.assign(this.editForm, this.carDriver);  
			this.driverCardImageUrl = this.editForm.driverCardImageUrl
			//this.imageUrl = config.getArcFileUploadBasePath() + '/' + this.editForm.driverCardImageUrl
			//console.log(this.imageUrl)
			
		},
		mounted(){
		}
	}

</script>

<style scoped>

</style>