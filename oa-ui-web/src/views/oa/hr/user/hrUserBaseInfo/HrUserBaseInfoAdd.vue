<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="id" prop="id">
					<el-input v-model="addForm.id" placeholder="id" ></el-input>
				</el-form-item> 
				<el-form-item label="用户编号" prop="userid">
					<el-input v-model="addForm.userid" placeholder="用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="部门编号" prop="deptid">
					<el-input v-model="addForm.deptid" placeholder="部门编号" ></el-input>
				</el-form-item> 
				<el-form-item label="部门名称" prop="deptName">
					<el-input v-model="addForm.deptName" placeholder="部门名称" ></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构编号" ></el-input>
				</el-form-item> 
				<el-form-item label="机构名称" prop="branchName">
					<el-input v-model="addForm.branchName" placeholder="机构名称" ></el-input>
				</el-form-item> 
				<el-form-item label="汇报上级编号" prop="reportId">
					<el-input v-model="addForm.reportId" placeholder="汇报上级编号" ></el-input>
				</el-form-item> 
				<el-form-item label="汇报上级名称" prop="reportName">
					<el-input v-model="addForm.reportName" placeholder="汇报上级名称" ></el-input>
				</el-form-item> 
				<el-form-item label="职务" prop="duty">
					<el-input v-model="addForm.duty" placeholder="职务" ></el-input>
				</el-form-item> 
				<el-form-item label="工作地点" prop="workplace">
					<el-input v-model="addForm.workplace" placeholder="工作地点" ></el-input>
				</el-form-item> 
				<el-form-item label="系统账号" prop="account">
					<el-input v-model="addForm.account" placeholder="系统账号" ></el-input>
				</el-form-item> 
				<el-form-item label="所属岗位" prop="post">
					<el-input v-model="addForm.post" placeholder="所属岗位" ></el-input>
				</el-form-item> 
				<el-form-item label="员工状态---0-试用，1-实习，2-正式，3-临时，4-试用延期，5-解聘，6-离职，7-退休" prop="status">
					<el-input v-model="addForm.status" placeholder="员工状态---0-试用，1-实习，2-正式，3-临时，4-试用延期，5-解聘，6-离职，7-退休" ></el-input>
				</el-form-item> 
				<el-form-item label="人员级别---0-总裁，1-公司副总，2-部门经理，3-中心总监，4-普通员工" prop="level">
					<el-input v-model="addForm.level" placeholder="人员级别---0-总裁，1-公司副总，2-部门经理，3-中心总监，4-普通员工" ></el-input>
				</el-form-item> 
				<el-form-item label="工作性质" prop="jobNature">
					<el-input v-model="addForm.jobNature" placeholder="工作性质" ></el-input>
				</el-form-item> 
				<el-form-item label="入职日期" prop="entryTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.entryTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="转正日期" prop="positiveTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.positiveTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="用工期限，单位是年" prop="jobDeadline">
					<el-input v-model="addForm.jobDeadline" placeholder="用工期限，单位是年" ></el-input>
				</el-form-item> 
				<el-form-item label="试用期限，单位是月" prop="trialDeadline">
					<el-input v-model="addForm.trialDeadline" placeholder="试用期限，单位是月" ></el-input>
				</el-form-item> 
				<el-form-item label="手机号码" prop="phoneno">
					<el-input v-model="addForm.phoneno" placeholder="手机号码" ></el-input>
				</el-form-item> 
				<el-form-item label="邮箱地址" prop="email">
					<el-input v-model="addForm.email" placeholder="邮箱地址" ></el-input>
				</el-form-item> 
				<el-form-item label="办公地址" prop="officeAddress">
					<el-input v-model="addForm.officeAddress" placeholder="办公地址" ></el-input>
				</el-form-item> 
				<el-form-item label="办公电话" prop="officePhoneno">
					<el-input v-model="addForm.officePhoneno" placeholder="办公电话" ></el-input>
				</el-form-item> 
				<el-form-item label="紧急联系人" prop="emergencyContact">
					<el-input v-model="addForm.emergencyContact" placeholder="紧急联系人" ></el-input>
				</el-form-item> 
				<el-form-item label="紧急联系人电话" prop="emeContactPho">
					<el-input v-model="addForm.emeContactPho" placeholder="紧急联系人电话" ></el-input>
				</el-form-item> 
				<el-form-item label="其他联系方式" prop="ortherPhoneno">
					<el-input v-model="addForm.ortherPhoneno" placeholder="其他联系方式" ></el-input>
				</el-form-item> 
				<el-form-item label="姓名" prop="username">
					<el-input v-model="addForm.username" placeholder="姓名" ></el-input>
				</el-form-item> 
				<el-form-item label="曾用名" prop="formerName">
					<el-input v-model="addForm.formerName" placeholder="曾用名" ></el-input>
				</el-form-item> 
				<el-form-item label="身份证号码" prop="idCardNo">
					<el-input v-model="addForm.idCardNo" placeholder="身份证号码" ></el-input>
				</el-form-item> 
				<el-form-item label="性别" prop="sex">
					<el-input v-model="addForm.sex" placeholder="性别" ></el-input>
				</el-form-item> 
				<el-form-item label="出生日期" prop="birthdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birthdate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="年龄" prop="age">
					<el-input v-model="addForm.age" placeholder="年龄" ></el-input>
				</el-form-item> 
				<el-form-item label="民族" prop="nation">
					<el-input v-model="addForm.nation" placeholder="民族" ></el-input>
				</el-form-item> 
				<el-form-item label="政治面貌" prop="politicsStatus">
					<el-input v-model="addForm.politicsStatus" placeholder="政治面貌" ></el-input>
				</el-form-item> 
				<el-form-item label="入团日期" prop="smokedDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.smokedDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="入党日期" prop="partyDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.partyDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="最高学历" prop="eduBack">
					<el-input v-model="addForm.eduBack" placeholder="最高学历" ></el-input>
				</el-form-item> 
				<el-form-item label="最高学位" prop="degree">
					<el-input v-model="addForm.degree" placeholder="最高学位" ></el-input>
				</el-form-item> 
				<el-form-item label="婚姻情况" prop="maritalStatus">
					<el-input v-model="addForm.maritalStatus" placeholder="婚姻情况" ></el-input>
				</el-form-item> 
				<el-form-item label="健康情况" prop="healthyCondition">
					<el-input v-model="addForm.healthyCondition" placeholder="健康情况" ></el-input>
				</el-form-item> 
				<el-form-item label="身高(厘米)" prop="stature">
					<el-input v-model="addForm.stature" placeholder="身高(厘米)" ></el-input>
				</el-form-item> 
				<el-form-item label="体重(千克)" prop="weight">
					<el-input v-model="addForm.weight" placeholder="体重(千克)" ></el-input>
				</el-form-item> 
				<el-form-item label="现居地" prop="presentAddress">
					<el-input v-model="addForm.presentAddress" placeholder="现居地" ></el-input>
				</el-form-item> 
				<el-form-item label="籍贯" prop="nativePlace">
					<el-input v-model="addForm.nativePlace" placeholder="籍贯" ></el-input>
				</el-form-item> 
				<el-form-item label="出生地" prop="birthplace">
					<el-input v-model="addForm.birthplace" placeholder="出生地" ></el-input>
				</el-form-item> 
				<el-form-item label="户口所在地" prop="regPerResidence">
					<el-input v-model="addForm.regPerResidence" placeholder="户口所在地" ></el-input>
				</el-form-item> 
				<el-form-item label="户口所在派出所" prop="regPerResidenceLocal">
					<el-input v-model="addForm.regPerResidenceLocal" placeholder="户口所在派出所" ></el-input>
				</el-form-item> 
				<el-form-item label="到本单位日期" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="参加工作日期" prop="workTime">
					<el-input v-model="addForm.workTime" placeholder="参加工作日期" ></el-input>
				</el-form-item> 
				<el-form-item label="连续工龄" prop="workingYears">
					<el-input v-model="addForm.workingYears" placeholder="连续工龄" ></el-input>
				</el-form-item> 
				<el-form-item label="本企业工龄" prop="enterpriseYears">
					<el-input v-model="addForm.enterpriseYears" placeholder="本企业工龄" ></el-input>
				</el-form-item> 
				<el-form-item label="附件" prop="accessory">
					<el-input v-model="addForm.accessory" placeholder="附件" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addHrUserBaseInfo } from '@/api/oa/hr/user/hrUserBaseInfo';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['hrUserBaseInfo','visible'],
		watch: {
	      'hrUserBaseInfo':function( hrUserBaseInfo ) {
	        this.addForm = hrUserBaseInfo;
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
						//{ required: true, message: 'id不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 hr_user_base_info
				addForm: {
					id:'',userid:'',deptid:'',deptName:'',branchId:'',branchName:'',reportId:'',reportName:'',duty:'',workplace:'',account:'',post:'',status:'',level:'',jobNature:'',entryTime:'',positiveTime:'',jobDeadline:'',trialDeadline:'',phoneno:'',email:'',officeAddress:'',officePhoneno:'',emergencyContact:'',emeContactPho:'',ortherPhoneno:'',username:'',formerName:'',idCardNo:'',sex:'',birthdate:'',age:'',nation:'',politicsStatus:'',smokedDate:'',partyDate:'',eduBack:'',degree:'',maritalStatus:'',healthyCondition:'',stature:'',weight:'',presentAddress:'',nativePlace:'',birthplace:'',regPerResidence:'',regPerResidenceLocal:'',startTime:'',workTime:'',workingYears:'',enterpriseYears:'',accessory:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交HrUserBaseInfo hr_user_base_info 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addHrUserBaseInfo(params).then((res) => {
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
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'hr-user-base-info-edit':HrUserBaseInfoEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.hrUserBaseInfo);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>