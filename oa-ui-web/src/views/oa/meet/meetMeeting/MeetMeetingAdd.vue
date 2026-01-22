<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="会议名称" prop="name">
					<el-input v-model="addForm.name" placeholder="会议名称" ></el-input>
				</el-form-item> 
				<el-form-item label="会议分类id" prop="categoryId">
					<el-input v-model="addForm.categoryId" placeholder="会议分类id" ></el-input>
				</el-form-item> 
				<el-form-item label="会议分类" prop="categoryName">
					<el-input v-model="addForm.categoryName" placeholder="会议分类" ></el-input>
				</el-form-item> 
				<el-form-item label="申请人id" prop="requireUserid">
					<el-input v-model="addForm.requireUserid" placeholder="申请人id" ></el-input>
				</el-form-item> 
				<el-form-item label="申请人" prop="requireUsername">
					<el-input v-model="addForm.requireUsername" placeholder="申请人" ></el-input>
				</el-form-item> 
				<el-form-item label="会议室id" prop="roomId">
					<el-input v-model="addForm.roomId" placeholder="会议室id" ></el-input>
				</el-form-item> 
				<el-form-item label="会议室名称" prop="roomName">
					<el-input v-model="addForm.roomName" placeholder="会议室名称" ></el-input>
				</el-form-item> 
				<el-form-item label="自定义会议地点" prop="customRoomName">
					<el-input v-model="addForm.customRoomName" placeholder="自定义会议地点" ></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="提醒方式" prop="reminders">
					<el-input v-model="addForm.reminders" placeholder="提醒方式" ></el-input>
				</el-form-item> 
				<el-form-item label="立刻提醒" prop="remindersImmediate">
					<el-input v-model="addForm.remindersImmediate" placeholder="立刻提醒" ></el-input>
				</el-form-item> 
				<el-form-item label="开始前提醒" prop="remindersBeforeStart">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.remindersBeforeStart" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束前提醒" prop="remindersBeforeEnd">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.remindersBeforeEnd" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="其他参加" prop="otherAttender">
					<el-input v-model="addForm.otherAttender" placeholder="其他参加" ></el-input>
				</el-form-item> 
				<el-form-item label="参会人数" prop="attenderNum">
					<el-input-number v-model="addForm.attenderNum" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="参会客户数" prop="customerNum">
					<el-input-number v-model="addForm.customerNum" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="是否启用回执,0否1是,会议参与人手动参加回执" prop="isUsingReturn">
					<el-input v-model="addForm.isUsingReturn" placeholder="是否启用回执,0否1是,会议参与人手动参加回执" ></el-input>
				</el-form-item> 
				<el-form-item label="是否启用会议签到,0否1是" prop="isUsingSingin">
					<el-input v-model="addForm.isUsingSingin" placeholder="是否启用会议签到,0否1是" ></el-input>
				</el-form-item> 
				<el-form-item label="签到模式：0-人员签到,1-扫码签到,2-WIFI签到" prop="singinMode">
					<el-input v-model="addForm.singinMode" placeholder="签到模式：0-人员签到,1-扫码签到,2-WIFI签到" ></el-input>
				</el-form-item> 
				<el-form-item label="签到模式1：签到人员,所选人员为统一签到人员！默认为会议申请人！" prop="singinUserid">
					<el-input v-model="addForm.singinUserid" placeholder="签到模式1：签到人员,所选人员为统一签到人员！默认为会议申请人！" ></el-input>
				</el-form-item> 
				<el-form-item label="签到模式1：签到人员" prop="singinUsername">
					<el-input v-model="addForm.singinUsername" placeholder="签到模式1：签到人员" ></el-input>
				</el-form-item> 
				<el-form-item label="签到模式2：签到WIFI" prop="singinWifi">
					<el-input v-model="addForm.singinWifi" placeholder="签到模式2：签到WIFI" ></el-input>
				</el-form-item> 
				<el-form-item label="归属机构" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="归属机构" ></el-input>
				</el-form-item> 
				<el-form-item label="单位id" prop="deptId">
					<el-input v-model="addForm.deptId" placeholder="单位id" ></el-input>
				</el-form-item> 
				<el-form-item label="单位" prop="deptName">
					<el-input v-model="addForm.deptName" placeholder="单位" ></el-input>
				</el-form-item> 
				<el-form-item label="申请备注" prop="requireRemark">
					<el-input v-model="addForm.requireRemark" placeholder="申请备注" ></el-input>
				</el-form-item> 
				<el-form-item label="会议开始备注" prop="startRemark">
					<el-input v-model="addForm.startRemark" placeholder="会议开始备注" ></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="状态0待审批,1审批中,2已批准,3已拒绝,4已开始,5已结束" prop="status">
					<el-input v-model="addForm.status" placeholder="状态0待审批,1审批中,2已批准,3已拒绝,4已开始,5已结束" ></el-input>
				</el-form-item> 
				<el-form-item label="审批意见" prop="approveSuggestion">
					<el-input v-model="addForm.approveSuggestion" placeholder="审批意见" ></el-input>
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
	import { addMeetMeeting } from '@/api/oa/meet/meetMeeting';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['meetMeeting','visible'],
		watch: {
	      'meetMeeting':function( meetMeeting ) {
	        this.addForm = meetMeeting;
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
				//新增界面数据 meet_meeting
				addForm: {
					id:'',name:'',categoryId:'',categoryName:'',requireUserid:'',requireUsername:'',roomId:'',roomName:'',customRoomName:'',startTime:'',endTime:'',reminders:'',remindersImmediate:'',remindersBeforeStart:'',remindersBeforeEnd:'',otherAttender:'',attenderNum:'',customerNum:'',isUsingReturn:'',isUsingSingin:'',singinMode:'',singinUserid:'',singinUsername:'',singinWifi:'',branchId:'',deptId:'',deptName:'',requireRemark:'',startRemark:'',createTime:'',status:'',approveSuggestion:''
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
			//新增提交MeetMeeting meet_meeting 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addMeetMeeting(params).then((res) => {
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
		    //在下面添加其它组件 'meet-meeting-edit':MeetMeetingEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.meetMeeting);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>