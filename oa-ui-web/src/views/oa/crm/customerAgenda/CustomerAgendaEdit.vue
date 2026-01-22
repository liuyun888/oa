<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="日程id" prop="agendaId">
					<el-input v-model="editForm.agendaId" placeholder="日程id"></el-input>
				</el-form-item> 
				<el-form-item label="日程标题" prop="agendaText">
					<el-input v-model="editForm.agendaText" placeholder="日程标题"></el-input>
				</el-form-item> 
				<el-form-item label="日程内容" prop="agendaNav">
					<el-input v-model="editForm.agendaNav" placeholder="日程内容"></el-input>
				</el-form-item> 
				<el-form-item label="客户id" prop="customerId">
					<el-input v-model="editForm.customerId" placeholder="客户id"></el-input>
				</el-form-item> 
				<el-form-item label="客户名称" prop="customerName">
					<el-input v-model="editForm.customerName" placeholder="客户名称"></el-input>
				</el-form-item> 
				<el-form-item label="客户联系人id" prop="contacterId">
					<el-input v-model="editForm.contacterId" placeholder="客户联系人id"></el-input>
				</el-form-item> 
				<el-form-item label="客户联系人名称" prop="contacterName">
					<el-input v-model="editForm.contacterName" placeholder="客户联系人名称"></el-input>
				</el-form-item> 
				<el-form-item label="紧急程度" prop="urgentLevel">
					<el-input v-model="editForm.urgentLevel" placeholder="紧急程度"></el-input>
				</el-form-item> 
				<el-form-item label="紧急程度名称" prop="urgentLevelName">
					<el-input v-model="editForm.urgentLevelName" placeholder="紧急程度名称"></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="beginTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.beginTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="提醒方式" prop="tipType">
					<el-input v-model="editForm.tipType" placeholder="提醒方式"></el-input>
				</el-form-item> 
				<el-form-item label="是否立即提醒" prop="remindImmediately">
					<el-input v-model="editForm.remindImmediately" placeholder="是否立即提醒"></el-input>
				</el-form-item> 
				<el-form-item label="是否开始前提醒" prop="remindBeforeStart">
					<el-input v-model="editForm.remindBeforeStart" placeholder="是否开始前提醒"></el-input>
				</el-form-item> 
				<el-form-item label="开始前提醒小时" prop="remindBeforeHour">
					<el-input v-model="editForm.remindBeforeHour" placeholder="开始前提醒小时"></el-input>
				</el-form-item> 
				<el-form-item label="开始前提醒分钟" prop="remindBeforeMinute">
					<el-input v-model="editForm.remindBeforeMinute" placeholder="开始前提醒分钟"></el-input>
				</el-form-item> 
				<el-form-item label="是否结束前提醒" prop="remindEndStart">
					<el-input v-model="editForm.remindEndStart" placeholder="是否结束前提醒"></el-input>
				</el-form-item> 
				<el-form-item label="结束前提醒小时" prop="remindEndHour">
					<el-input v-model="editForm.remindEndHour" placeholder="结束前提醒小时"></el-input>
				</el-form-item> 
				<el-form-item label="结束前提醒分钟" prop="remindEndMinute">
					<el-input v-model="editForm.remindEndMinute" placeholder="结束前提醒分钟"></el-input>
				</el-form-item> 
				<el-form-item label="日程类型" prop="workPlanType">
					<el-input v-model="editForm.workPlanType" placeholder="日程类型"></el-input>
				</el-form-item> 
				<el-form-item label="创建人Id" prop="agendaCreateId">
					<el-input v-model="editForm.agendaCreateId" placeholder="创建人Id"></el-input>
				</el-form-item> 
				<el-form-item label="创建人姓名" prop="agendaCreateName">
					<el-input v-model="editForm.agendaCreateName" placeholder="创建人姓名"></el-input>
				</el-form-item> 
				<el-form-item label="创建人头像" prop="agendaCreateImg">
					<el-input v-model="editForm.agendaCreateImg" placeholder="创建人头像"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="agendaCreateTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.agendaCreateTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="是否日程计划" prop="isPlan">
					<el-input v-model="editForm.isPlan" placeholder="是否日程计划"></el-input>
				</el-form-item> 
				<el-form-item label="机构id" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构id"></el-input>
				</el-form-item> 
				<el-form-item label="关联商机id" prop="businessId">
					<el-input v-model="editForm.businessId" placeholder="关联商机id"></el-input>
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
	import { editCustomerAgenda } from '@/api/oa/crm/customerAgenda';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerAgenda','visible'],
		watch: {
	      'customerAgenda':function( customerAgenda ) {
	        this.editForm = customerAgenda;
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
					agendaId: [
						//{ required: true, message: '日程id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  CustomerAgenda crm_customer_agenda
				editForm: {
					agendaId:'',agendaText:'',agendaNav:'',customerId:'',customerName:'',contacterId:'',contacterName:'',urgentLevel:'',urgentLevelName:'',beginTime:'',endTime:'',tipType:'',remindImmediately:'',remindBeforeStart:'',remindBeforeHour:'',remindBeforeMinute:'',remindEndStart:'',remindEndHour:'',remindEndMinute:'',workPlanType:'',agendaCreateId:'',agendaCreateName:'',agendaCreateImg:'',agendaCreateTime:'',isPlan:'',branchId:'',businessId:''
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
			//编辑提交CustomerAgenda crm_customer_agenda父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editCustomerAgenda(params).then((res) => {
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
		    //在下面添加其它组件 'customer-agenda-edit':CustomerAgendaEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.customerAgenda);  
		}
	}

</script>

<style scoped>

</style>