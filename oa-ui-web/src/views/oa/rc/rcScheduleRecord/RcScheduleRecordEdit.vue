<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="日志id" prop="id">
					<el-input v-model="editForm.id" placeholder="日志id"></el-input>
				</el-form-item> 
				<el-form-item label="操作者id" prop="operatorId">
					<el-input v-model="editForm.operatorId" placeholder="操作者id"></el-input>
				</el-form-item> 
				<el-form-item label="操作者名字" prop="operatorName">
					<el-input v-model="editForm.operatorName" placeholder="操作者名字"></el-input>
				</el-form-item> 
				<el-form-item label="操作时间" prop="operationTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.operationTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="日志模块" prop="modules">
					<el-input v-model="editForm.modules" placeholder="日志模块"></el-input>
				</el-form-item> 
				<el-form-item label="操作类型" prop="operationType">
					<el-input v-model="editForm.operationType" placeholder="操作类型"></el-input>
				</el-form-item> 
				<el-form-item label="操作项目" prop="recordProject">
					<el-input v-model="editForm.recordProject" placeholder="操作项目"></el-input>
				</el-form-item> 
				<el-form-item label="日程标题" prop="rcTitle">
					<el-input v-model="editForm.rcTitle" placeholder="日程标题"></el-input>
				</el-form-item> 
				<el-form-item label="操作者ip" prop="operatorIp">
					<el-input v-model="editForm.operatorIp" placeholder="操作者ip"></el-input>
				</el-form-item> 
				<el-form-item label="日程编号" prop="scheduleId">
					<el-input v-model="editForm.scheduleId" placeholder="日程编号"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editRcScheduleRecord } from '@/api/oa/rc/rcScheduleRecord';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['rcScheduleRecord','visible'],
		watch: {
	      'rcScheduleRecord':function( rcScheduleRecord ) {
	        this.editForm = rcScheduleRecord;
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
						//{ required: true, message: '日志id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  RcScheduleRecord rc_schedule_record
				editForm: {
					id:'',operatorId:'',operatorName:'',operationTime:'',modules:'',operationType:'',recordProject:'',rcTitle:'',operatorIp:'',scheduleId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交RcScheduleRecord rc_schedule_record父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editRcScheduleRecord(params).then((res) => {
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
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'rc-schedule-record-edit':RcScheduleRecordEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.rcScheduleRecord);  
		}
	}

</script>

<style scoped>

</style>