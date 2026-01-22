<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="商机名称" prop="businessName">
							<el-input v-model="editForm.businessName" placeholder="商机名称" ></el-input>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="商机类型" prop="businessType">
							<el-select v-model="editForm.businessType" placeholder="请选择">
								<el-option
								v-for="item in businessTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="销售预期" prop="expectDate">
							<el-date-picker type="date" placeholder="选择日期" v-model="editForm.expectDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="客户名称" prop="customerName">
							<el-input @focus="sjdwVisible = true" v-model="editForm.customerName" placeholder="所属客户名称" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="预期收益" prop="expectEarnings">
							<el-input-number v-model="editForm.expectEarnings" :min="0.0" placeholder="预期收益"></el-input-number>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="客户经理" prop="managerUserName">
							<el-input @focus="customerUserVisible=true" v-model="editForm.managerUserName" placeholder="客户经理名称" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="可能性" prop="possibility">
							<el-input-number v-model="editForm.possibility" :precision="1" :step="0.1" :min="0.0" :max="1.0" placeholder="可能性"></el-input-number>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="商机来源" prop="scheduleId">
							<el-input v-model="editForm.scheduleId" placeholder="商机来源" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="成功关键因素" prop="successKeyCause">
							<el-select v-model="editForm.successKeyCause" placeholder="请选择">
								<el-option
								v-for="item in successCauseOptions"	
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="中介机构名称" prop="intermediaryOrganName">
							<el-input @focus="zjjgVisible = true" v-model="editForm.intermediaryOrganName" placeholder="中介机构名称" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="失败关键因素" prop="faulitKeyCause">
							<el-select v-model="editForm.faulitKeyCause" placeholder="请选择">
								<el-option
								v-for="item in faulitCauseOptions"	
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="商机状态" prop="businessStatus">
							<el-select v-model="editForm.businessStatus" placeholder="请选择">
								<el-option
								v-for="item in businessStatusOptions"	
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item> 
					</el-col>
				</el-row>


				<el-row>
					<el-col :span="12">
						<el-form-item label="归档状态" prop="archiveStatus">
							<el-select v-model="editForm.archiveStatus" placeholder="请选择">
								<el-option
								v-for="item in archiveStatusOptions"	
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<!-- <el-table v-loading="load.list" style="margin-top: 10px" size="small" border :data="proData" stripe>
						<el-table-column
							label="序号"
							type="index"
							width="50">
						</el-table-column>
					
						<el-table-column align="center" label="产品名称" width="">
							<template slot-scope="row">
								<span class="vTip">*</span>
								<el-input @focus="currentIndex = row.$index" @blur="validateParam(row.$index, 'one')" v-model="proData[row.$index].contacterName"> </el-input>
								<div v-show="proData[row.$index].validate.oneShow">
									<i class="el-icon-warning"></i>
									<span class="tipMsg">{{proData[row.$index].validate.oneMsg}}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column align="center" label="计量单位" width="">
							<template slot-scope="row">
								<el-input @blur="validateParam(row.$index, 'two')"   @focus="openCallDialog(row.$index)"  v-model="proData[row.$index].titleName"> </el-input>
							</template>
						</el-table-column>

						<el-table-column align="center" label="货币" width="">
							<template slot-scope="row">
								<span class="vTip">*</span>
								<el-input  @focus="currentIndex = row.$index" @blur="validateParam(row.$index, 'two')" v-model="proData[row.$index].jobTitle"> </el-input>
								<div v-show="proData[row.$index].validate.twoShow">
									<i class="el-icon-warning"></i>
									<span class="tipMsg">{{proData[row.$index].validate.twoMsg}}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column align="center" label="单价" width="">
							<template slot-scope="row">
								<el-input  @focus="currentIndex = row.$index" v-model="proData[row.$index].contacterEmail"> </el-input>
							</template>
						</el-table-column>

						<el-table-column align="center" label="数量" width="">
							<template slot-scope="row">
								<el-input  @focus="currentIndex = row.$index" v-model="proData[row.$index].phoneOffice"> </el-input>
							</template>
						</el-table-column>

						<el-table-column align="center" label="总价" width="">
							<template slot-scope="row">
								<el-input  @focus="currentIndex = row.$index" v-model="proData[row.$index].phoneHome"> </el-input>
							</template>
						</el-table-column>

						<el-table-column align="center"  width="80">
							<template slot="header">
								<i class="el-icon-circle-plus-outline"  @click="addRow"></i>
							</template>

							<template slot-scope="scope">
								<i  class="el-icon-remove-outline" @click="delRow(scope.$index)"></i>
							</template>
						</el-table-column>
					</el-table>					 -->

				</el-row>

				<el-col> 
					<el-button @click.native="handleCancel">取消</el-button>  
					<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
				</el-col>

			</el-form>

			<el-dialog append-to-body  title="客户经理" width="70%" top="2vh" :visible.sync="customerUserVisible">
				<users-select @confirm="getUserData" :isSingleUser="true"></users-select>
			</el-dialog>


			<el-dialog append-to-body title="上级单位"  top="2vh" :visible.sync="sjdwVisible" width="50%" :close-on-click-modal="false">
				<customer-components @getRowClick="getSjdwData"  :visible="sjdwVisible"></customer-components>
			</el-dialog>

			<el-dialog append-to-body title="中介机构"  top="2vh" :visible.sync="zjjgVisible" width="50%" :close-on-click-modal="false">
				<customer-components :customerType="zjjgType" @getRowClick="getZjjgData"  :visible="zjjgVisible"></customer-components>
			</el-dialog>

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editCustomerBusiness } from '@/api/oa/crm/customerBusiness';
	import { mapGetters } from 'vuex';
	import UsersSelect from '../../../mdp/sys/user/UsersSelect';
	import CustomerComponents from '../components/CustomerComponents';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerBusiness','visible'],
		watch: {
	      'customerBusiness':function( customerBusiness ) {
	        this.editForm = customerBusiness;
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
				editFormRules: {
					businessId: [
						//{ required: true, message: '商机id不能为空', trigger: 'change' }
					],
					businessName: [
						{ required: true, message: '商机名称不能为空', trigger: 'change' }
					],
					customerName: [
						{ required: true, message: '客户名称不能为空', trigger: 'change' }
					],
					expectDate: [
						{ required: true, message: '销售预期不能为空', trigger: 'change' }
					],
					possibility: [
						{ required: true, message: "可能性不能为空", trigger: 'change'}
					],
					managerUserName: [
						{ required: true, message: '客户经理不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 crm_customer_business
				editForm: {
					businessId:'',businessName:'',businessType:'',expectDate:'',customerId:'',customerName:'',expectEarnings:'',managerUserId:'',managerUserName:'',possibility:'',scheduleId:'',successKeyCause:'',faulitKeyCause:'',intermediaryOrganId:'',intermediaryOrganName:'', archiveStatus:'', businessStatus:'',businessCreateId:'',businessCreateName:'',businessCreateTime:'',branchId: '',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				proData: [],

				//客户经理选择
				customerUserVisible: false,
				//商机类型select
				businessTypeOptions: [],
				//成功关键因素select
				successCauseOptions: [],
				//失败关键因素select
				faulitCauseOptions: [],
				//商机状态select
				businessStatusOptions:[],
				//归档状态
				archiveStatusOptions: [
					{
						label: '进行中',
						value: '1'
					},
					{
						label: '成功',
						value: '2'
					},
					{
						label: '失败',
						value: '3'
					}
				],

				//上级单位显示
				sjdwVisible: false,
				//中介机构
				zjjgVisible: false,
				zjjgType: 'zjjg'

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交CustomerBusiness crm_customer_business 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.transferData(this.editForm)); 
							editCustomerBusiness(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},

			transferData(data) {
				let params = {
					customerBusiness: data
				}
				return params;
			},

			initData() {
				this.editForm.managerUserId = this.userInfo.userid;
				this.editForm.managerUserName = this.userInfo.username;
			},

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			addRow() {

			},

			delRow() {
 				this.proData.splice(index, 1);
			},

			getUserData(data) {
				this.editForm.managerUserId = data[0].userid;
				this.editForm.managerUserName = data[0].username;  
				this.customerUserVisible = false;
			},

			//获取客户信息
			getSjdwData(data , type) {
				this.editForm.customerId = data.customerId;
				this.editForm.customerName = data.customerName;
				this.sjdwVisible = false;
			},

			getZjjgData(data, type) {
				this.editForm.intermediaryOrganId = data.customerId;
				this.editForm.intermediaryOrganName = data.customerName;
				this.zjjgVisible = false;
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		
		components: {  
			//在下面添加其它组件 'customer-business-edit':CustomerBusinessEdit
			'users-select' : UsersSelect,
			'customer-components' : CustomerComponents
		},

		mounted() {
			this.editForm=Object.assign(this.editForm, this.customerBusiness);  
			/**在下面写其它函数***/
			this.initData();

		}//end mounted
	}

</script>

<style scoped>

</style>