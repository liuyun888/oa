<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="ID" prop="id">
					<el-input v-model="addForm.id" placeholder="ID" ></el-input>
				</el-form-item> 
				<el-form-item label="员工id" prop="userid">
					<el-input v-model="addForm.userid" placeholder="员工id" ></el-input>
				</el-form-item> 
				<el-form-item label="员工名称" prop="username">
					<el-input v-model="addForm.username" placeholder="员工名称" ></el-input>
				</el-form-item> 
				<el-form-item label="加班类型" prop="workOvertimeType">
					<el-input v-model="addForm.workOvertimeType" placeholder="加班类型" ></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="beginTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.beginTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="加班小时数" prop="workOvertimeHours">
					<el-input v-model="addForm.workOvertimeHours" placeholder="加班小时数" ></el-input>
				</el-form-item> 
				<el-form-item label="加班原因" prop="reasonWorkOvertime">
					<el-input v-model="addForm.reasonWorkOvertime" placeholder="加班原因" ></el-input>
				</el-form-item> 
				<el-form-item label="组织id" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="组织id" ></el-input>
				</el-form-item> 
				<el-form-item label="部门id" prop="deptid">
					<el-input v-model="addForm.deptid" placeholder="部门id" ></el-input>
				</el-form-item> 
				<el-form-item label="部门名称" prop="deptName">
					<el-input v-model="addForm.deptName" placeholder="部门名称" ></el-input>
				</el-form-item> 
				<el-form-item label="申请时间" prop="applyTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.applyTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="附件" prop="accessory">
					<el-input v-model="addForm.accessory" placeholder="附件" ></el-input>
				</el-form-item> 
				<el-form-item label="当前流程实例编号" prop="bizProcInstId">
					<el-input v-model="addForm.bizProcInstId" placeholder="当前流程实例编号" ></el-input>
				</el-form-item> 
				<el-form-item label="当前流程状态" prop="bizFlowState">
					<el-input v-model="addForm.bizFlowState" placeholder="当前流程状态" ></el-input>
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
	import { addKqWorkOvertimeInfo } from '@/api/oa/kq/kqWorkOvertimeInfo';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['kqWorkOvertimeInfo','visible'],
		watch: {
	      'kqWorkOvertimeInfo':function( kqWorkOvertimeInfo ) {
	        this.addForm = kqWorkOvertimeInfo;
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
						//{ required: true, message: 'ID不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 kq_work_overtime_info
				addForm: {
					id:'',userid:'',username:'',workOvertimeType:'',beginTime:'',endTime:'',workOvertimeHours:'',reasonWorkOvertime:'',branchId:'',deptid:'',deptName:'',applyTime:'',accessory:'',bizProcInstId:'',bizFlowState:''
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
			//新增提交KqWorkOvertimeInfo kq_work_overtime_info 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addKqWorkOvertimeInfo(params).then((res) => {
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
		    //在下面添加其它组件 'kq-work-overtime-info-edit':KqWorkOvertimeInfoEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.kqWorkOvertimeInfo);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>