<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item style="display:none" label="司机编号" prop="driverId">
					<el-input v-model="addForm.driverId" placeholder="司机编号" ></el-input>
				</el-form-item> 
				<el-form-item label="汽车司机" prop="driverUserid">
					<!-- <el-input v-model="addForm.driverUserid" placeholder="汽车司机" ></el-input> -->
					<el-button type="text" @click="selectUserFormVisible = true">选择司机</el-button>
					<el-tag style="margin-left: 50px;" v-if="addForm.driverUserid != ''" v-text='"已选择: " + addForm.driverUserid'></el-tag>
				</el-form-item> 
				<el-form-item label="司机姓名" prop="driverUsername">
					<el-input v-model="addForm.driverUsername" placeholder="司机姓名" ></el-input>
				</el-form-item> 
				<el-form-item label="司机电话" prop="driverPhoneno">
					<el-input v-model="addForm.driverPhoneno" placeholder="司机电话" ></el-input>
				</el-form-item> 
				<el-form-item label="微信号" prop="driverWeixin">
					<el-input v-model="addForm.driverWeixin" placeholder="微信号" ></el-input>
				</el-form-item> 
				<el-form-item label="邮件" prop="driverEmel">
					<el-input v-model="addForm.driverEmel" placeholder="邮件" ></el-input>
				</el-form-item> 
				<el-form-item label="驾驶证号码" prop="driverCardNum">
					<el-input v-model="addForm.driverCardNum" placeholder="驾驶证号码" ></el-input>
				</el-form-item> 
				<el-form-item label="驾驶证照片" prop="driverCardImageUrl">
					<car-upload @on-change="onChange"></car-upload>
				</el-form-item> 
				<el-form-item label="驾驶证状态" prop="driverStatus">
					<!--A 正常B 超分C 转出D 暂扣E 撤销F 吊销G 注销H 违法未处理J 停止使用 -->
					<!-- <el-input v-model="addForm.driverStatus" placeholder="驾驶证状态" ></el-input> -->
					<el-radio-group v-model="addForm.driverStatus" size="medium">
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
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.driverCardStartTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="驾驶年龄" prop="driverAge">
					<el-input-number v-model="addForm.driverAge" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="司机性别" prop="driverSex">
					<!-- <el-input v-model="addForm.driverSex" placeholder="司机性别" ></el-input> -->
					<el-radio-group v-model="addForm.driverSex" size="medium">
						<el-radio-button label="男"></el-radio-button>
						<el-radio-button label="女"></el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="司机实际驾龄" prop="driverActYear">
					<el-input-number v-model="addForm.driverActYear" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item style="display:none"  label="增加时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="驾驶证类型" prop="driverCardType">
					<!-- <el-input v-model="addForm.driverCardType" placeholder="驾驶证类型" ></el-input> -->
					<el-radio-group v-model="addForm.driverCardType" size="medium">
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
					<el-input v-model="addForm.driverBranchId" placeholder="司机归属机构" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col>
            <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
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
	import { addCarDriver } from '@/api/oa/car/carDriver';
	import { mapGetters } from 'vuex'
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carDriver','visible'],
		watch: {
	      'carDriver':function( carDriver ) {
	        this.addForm = carDriver;
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
						{ max: 50, message: '不能超过 50 个字符', trigger: 'change' },
						{ validator: this.checkPhone, trigger: 'change' }
					],
					driverCardNum:[
						{ required: true, message: '驾驶证号码不能为空', trigger: 'change' },
						{  max: 50, message: '不能超过 50 个字符', trigger: 'change' }
					]
				},
				//新增界面数据 car_driver
				addForm: {
					driverId:'',driverUserid:'',driverUsername:'',driverPhoneno:'',driverWeixin:'',driverEmel:'',driverCardNum:'',driverCardImageUrl:'',driverStatus:'',driverCardStartTime:'',driverAge:'',driverSex:'',driverActYear:'',createTime:'',driverCardType:'',driverBranchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectUserFormVisible: false,
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交CarDriver car_driver 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCarDriver(params).then((res) => {
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
			onChange : function(file,fileList){
				this.addForm.driverCardImageUrl = file.url
				//console.log(file)
				//console.log(fileList)
			},
			onUserSelected: function(users) {
				console.log(users[0].userid)
				this.addForm.driverUserid = users[0].userid
				this.addForm.driverUsername = users[0].username
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
		mounted() {
			this.addForm=Object.assign(this.addForm, this.carDriver);  
			/**在下面写其它函数***/
			this.addForm.driverSex = '男'
			this.addForm.driverCardType = 'C1'
			this.addForm.driverStatus = '正常'
		}, //end mounted
		
	}

</script>

<style scoped>

</style>