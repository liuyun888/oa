<template>
	<section>
<!--		<el-row class="title">
			<span>参加会议</span>
			<span class="btn_class">
				<el-button @click="updateAttend('attend','1')" :disabled="load.attend==true" type="primary">参加</el-button>
				<el-button @click="updateRejectAttend('noAttend','0')" :disabled="load.noAttend==true" type="danger">不参加</el-button>

			</span>
		</el-row>-->
		<el-row class="app-container me_form">
		<!--编辑界面 MeetMeeting meet_meeting-->
			<el-form :model="submitForm"  label-width="200px" :rules="editFormRules" ref="submitForm">
        <el-form-item label="是否参会" prop="isAttend">
          <el-radio-group v-model="submitForm.isAttend">
            <el-radio label=1>参加</el-radio>
            <el-radio label=2>不参加</el-radio>
          </el-radio-group>
        </el-form-item>
				<el-form-item label="参加会议备注" prop="remark">
					<el-input
						type="textarea"
						placeholder="请输入内容"
						rows="7"
						v-model="submitForm.remark"
						maxlength="1024"
						show-word-limit
						>
					</el-input>
				</el-form-item>
        <el-form-item>
          <el-col :span="16" :offset="8">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.add" type="primary" @click.native="editSubmit" :disabled="load.add==true">提交
            </el-button>
          </el-col>
        </el-form-item>
      </el-form>
<!--				<el-form-item label="开始时间" prop="startTime">
          <div>{{this.meetMeeting.startTime}}</div>
				</el-form-item>
				<el-form-item label="结束时间" prop="endTime">
					<div>{{this.meetMeeting.endTime}}</div>
				</el-form-item>
				<el-form-item label="会议名称" prop="name">
					<div>{{this.meetMeeting.name}}</div>
				</el-form-item>
				<el-form-item label="会议分类" prop="categoryName">
					<div>{{this.meetMeeting.categoryName}}</div>
				</el-form-item>
				<el-form-item label="申请人" prop="requireUsername">
					<div>{{meetMeeting.requireUsername}}</div>
				</el-form-item>
				<el-form-item label="会议室" prop="roomName">
					<div>{{meetMeeting.customRoomName?meetMeeting.customRoomName:meetMeeting.roomName}}</div>
				</el-form-item>
				<el-form-item label="其他参加" prop="otherAttender">
					<div>{{meetMeeting.otherAttender}}</div>
				</el-form-item>
				<el-form-item label="参会人数" prop="attenderNum">
					<div>{{meetMeeting.attenderNum}}</div>
				</el-form-item>
				<el-form-item label="参会客户数" prop="customerNum">
					<div>{{meetMeeting.customerNum}}</div>
				</el-form-item>
				<el-form-item label="申请备注" prop="requireRemark">
					<div>{{meetMeeting.requireRemark}}</div>
				</el-form-item> -->
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editMeetMeeting, minelistMeetMeeting } from '@/api/oa/meet/meetMeeting';
	import { mapGetters } from 'vuex'

	import { editMeetMeetingAttender,toJoinMeeting,toNoJoinMeeting } from '@/api/oa/meet/meetMeetingAttender';

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ]),
      meetMeetingCpd() {
		      return this.meetMeeting
      }
    },
		props:['meetMeeting','visible'],
		watch: {
		    meetMeetingCpd(newV,oldV){
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
				load:{ list: false, edit: false, del: false, add: false , attend: false, noAttend: false},//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  MeetMeeting meet_meeting
				editForm: {
					id:'',name:'',categoryId:'',categoryName:'',requireUserid:'',requireUsername:'',roomId:'',roomName:'',customRoomName:'',startTime:'',endTime:'',reminders:'',remindersImmediate:'',remindersBeforeStart:'',remindersBeforeEnd:'',otherAttender:'',attenderNum:'',customerNum:'',isUsingReturn:'',isUsingSignin:'',signinMode:'',signinUserId:'',signinUsername:'',signinWifi:'',branchId:'',deptId:'',deptName:'',requireRemark:'',startRemark:'',createTime:'',status:'',approveSuggestion:'',userId:'',username:'',attenderId:'',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
        submitForm:{
          id:'',
          meetingId:'',
          execId:'',
          remark:'',
          isAttend:'',},
        start:'',
        end:''
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},

			//获取列表 MeetMeeting meet_meeting
			getMeetMeetings() {
				let params = {
					branchId : this.userInfo.branchId,
					id: this.editForm.id,
					attenderId: this.editForm.attenderId,
				};
				this.load.list = true;
				minelistMeetMeeting(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.editForm = res.data.data[0];
            let date = this.editForm.execCalcDate.substring(0, 10)
            this.start = date + ' ' + this.editForm.startTime
            this.end = date + ' ' + this.editForm.endTime
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//编辑提交MeetMeeting meet_meeting父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.submitForm.validate((valid) => {
					if (valid) {
					  if(this.submitForm.isAttend==null||this.submitForm.isAttend==''){
					    this.$message( {message:"是否参会为空，不能提交",type:'error'});
					    return false;
            }else{
					    this.submitForm.id=this.meetMeeting.attenderId;
					    this.submitForm.meetingId=this.meetMeeting.id;
					    this.submitForm.execId = this.meetMeeting.attenderExecId;
            }

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true;
							let params = Object.assign({}, this.submitForm);
							if(this.submitForm.isAttend==1){
                toJoinMeeting(params).then((res) => {
                  this.load.add=false
                  let tips=res.data.tips;
                  if(tips.isOk){
                    this.$refs['submitForm'].resetFields();
                    this.$emit('submit');//  @submit="afterAddSubmit"
                  }
                  this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err =>this.load.add=false );
              }else{
                toNoJoinMeeting(params).then((res) => {
                  this.load.add=false;
                  let tips=res.data.tips;
                  if(tips.isOk){
                    this.$refs['submitForm'].resetFields();
                    this.$emit('submit');//  @submit="afterAddSubmit"
                  }
                  this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err =>this.load.add=false );
              }
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			updateAttend: function (flag,status) {
				this.$confirm('确认操作吗？', '提示', {}).then(() => {
					this.load[flag]=true
					let params = {}
          console.log(this.editForm)
					params.id = this.meetMeeting.id,
          params.userid = this.userInfo.userid,
          params.username = this.userInfo.username,
					// params.status = status
					params.remark = this.remark
					toJoinMeeting(params).then((res) => {
						this.load[flag]=false
						var tips=res.data.tips;
						if(tips.isOk){
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err =>this.load[flag]=false );
				});
			},
      updateRejectAttend: function (flag,status) {
      	this.$confirm('确认操作吗？', '提示', {}).then(() => {
      		this.load[flag]=true
      		let params = {}
          // console.log(this.editForm)
          // return false
      		// params.id = this.editForm.attenderId
      		// params.status = status
      		// params.remark = this.remark

          params.meetingId = this.meetMeeting.id,
          params.execId = this.meetMeeting.execId,
          params.id = this.meetMeeting.attenderId,
          params.remark = this.remark,

      		toNoJoinMeeting(params).then((res) => {
      			this.load[flag]=false
      			var tips=res.data.tips;
      			if(tips.isOk){
      			}
      			this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
      		}).catch( err =>this.load[flag]=false );
      	});
      },
			/**end 在上面加自定义方法**/
		},//end method
		components: {
		    //在下面添加其它组件 'meet-meeting-edit':MeetMeetingEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.meetMeeting);
			//this.getMeetMeetings();
		}
	}

</script>

<style scoped>
	.title{
		font-size: 16px;
		background-color: #fafbfc;
		height: 50px;
		line-height: 50px;
		padding-left: 20px;
	}
	.btn_class{
		float: right;
	}

</style>
<style>
	.me_form .el-form-item__label{
		text-align: left;
	}
</style>
