<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="会议id" prop="meetingId">
					<el-input v-model="addForm.meetingId" placeholder="会议id" ></el-input>
				</el-form-item> 
				<el-form-item label="参会客户id" prop="customerId">
					<el-input v-model="addForm.customerId" placeholder="参会客户id" ></el-input>
				</el-form-item> 
				<el-form-item label="参会客户" prop="customerName">
					<el-input v-model="addForm.customerName" placeholder="参会客户" ></el-input>
				</el-form-item> 
				<el-form-item label="参加状态" prop="status">
					<el-input v-model="addForm.status" placeholder="参加状态" ></el-input>
				</el-form-item> 
				<el-form-item label="参加备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="参加备注" ></el-input>
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
	import { addMeetMeetingCustomer } from '@/api/oa/meet/meetMeetingCustomer';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['meetMeetingCustomer','visible'],
		watch: {
	      'meetMeetingCustomer':function( meetMeetingCustomer ) {
	        this.addForm = meetMeetingCustomer;
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
				//新增界面数据 meet_meeting_customer
				addForm: {
					id:'',meetingId:'',customerId:'',customerName:'',status:'',remark:''
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
			//新增提交MeetMeetingCustomer meet_meeting_customer 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addMeetMeetingCustomer(params).then((res) => {
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
		    //在下面添加其它组件 'meet-meeting-customer-edit':MeetMeetingCustomerEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.meetMeetingCustomer);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>