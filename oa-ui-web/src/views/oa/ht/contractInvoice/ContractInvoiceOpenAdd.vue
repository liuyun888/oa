<template>

	<div class="container">
		<div class="header">
			<div class="left">
				<i class="el-icon-tickets"></i>
			</div>
			<div class="title">
				<span>开票记录</span>
			</div>
			<div class="btn2">
				<el-button @click="addSubmit(true)" size="mini" type="primary">保存(关闭)</el-button> 
				<el-button @click="addSubmit(false)" size="mini" type="primary">保存(不关闭)</el-button>
				<el-button @click="handleCancel" size="mini" >关闭</el-button>
			</div>
		</div>


		<div class="nav">

			<!--新增界面 ContractInvoice ht_contract_invoice--> 
			<el-form size="mini" :model="addForm"  label-width="100px" :rules="addFormRules" ref="addForm">
				<line-components text="合同信息"></line-components>
				<el-row>
					<el-col :span="24">
						<el-form-item  label="合同" prop="htName">
							<div v-if="contractCard">
								<el-input v-model="addForm.htId" style="width:30%;" disabled >&nbsp;&nbsp;</el-input><el-input style="width:60%;"  v-model="addForm.htName" suffix-icon="el-icon-search" disabled></el-input>
							</div> 
							<div v-else>
								<el-input v-model="addForm.htId" @focus="visibleContractSelect=true" style="width:30%;"  >&nbsp;&nbsp;</el-input><el-input style="width:60%;"  @focus="visibleContractSelect=true" v-model="addForm.htName" suffix-icon="el-icon-search"></el-input>
							</div>
						</el-form-item>  
					</el-col>
					
					<el-col :span="24">
						<el-form-item  label="开票条件" prop="conditionId"> 
							 <contract-condition-select-components ref="contractConditionSelectRef" style="width:100%;" :ht-id="addForm.htId" v-model="addForm.conditionId" @selected="onConditionSelected"></contract-condition-select-components>
						</el-form-item>  
					</el-col>
				</el-row>
				<line-components text="基本信息"></line-components> 
				<el-row> 
					<el-col :span="12">
						<el-form-item label="相对方名称" prop="cpName">
							<el-input @focus="counterpartyVisible=true" v-model="addForm.cpName"  suffix-icon="el-icon-search"></el-input>
						</el-form-item> 
					</el-col> 
					<el-col :span="12">
						<el-form-item label="开票类型" prop="type">
							<el-select clearable v-model="addForm.type" placeholder="请选择">
								<el-option
									v-for="item in typeOptions"
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
						<el-form-item label="联系方式" prop="relationWay">
							<el-input v-model="addForm.relationWay"></el-input>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="收件地址" prop="address">
							<el-input v-model="addForm.address" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="快递单号" prop="expressNumber">
							<el-input v-model="addForm.expressNumber"></el-input>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="回款时间" prop="returnDate">
							<el-date-picker type="date" placeholder="选择日期" v-model="addForm.returnDate" ></el-date-picker>
						</el-form-item> 
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="申请人" prop="requireName">
							<el-input @focus="visibleUserSelect=true" v-model="addForm.requireName" suffix-icon="el-icon-search"></el-input>
						</el-form-item> 
					</el-col>
				</el-row>


				<line-components text="发票信息"></line-components>

				<el-row>
					<el-col :span="12">
						<el-form-item label="发票编号" prop="number">
							<el-input v-model="addForm.number" ></el-input>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="发票抬头" prop="title">
							<el-input v-model="addForm.title" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				
				<el-row>
					<el-col :span="12">
						<el-form-item label="票点(%)" prop="point">
							<el-input-number v-model="addForm.point" :min="0" ></el-input-number>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="开票金额" prop="amount">
							<el-input v-model="addForm.amount" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="纳税人识别号" prop="gtaxid">
							<el-input v-model="addForm.gtaxid" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="开票内容" prop="content">
							<el-input v-model="addForm.content" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="开票时间" prop="openDate">
							<el-date-picker type="date" placeholder="选择日期" v-model="addForm.openDate" ></el-date-picker>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="签收人" prop="signPeople">
							<el-input v-model="addForm.signPeople"  ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">	
						<el-form-item label="签收时间" prop="signDate">
							<el-date-picker type="date" placeholder="选择日期" v-model="addForm.signDate" ></el-date-picker>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="发票状态" prop="invoiceStatus">
							<el-select clearable v-model="addForm.invoiceStatus" placeholder="请选择">
								<el-option
									v-for="item in invoiceStatusOptions"
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
						<el-form-item label="回款状态" prop="status">
							<el-select clearable v-model="addForm.status" placeholder="请选择">
								<el-option
									v-for="item in statusOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item> 
					</el-col> 
				</el-row>
			</el-form> 

			<el-dialog append-to-body width="60%" :visible.sync="counterpartyVisible">
                <counterparty-components @row-click="getCounterparty" :visible="counterpartyVisible"></counterparty-components>
            </el-dialog>

			<el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
                <user-select @confirm="getUserData" :isSingleUser="true"></user-select>
            </el-dialog>

			<el-dialog append-to-body title="合同选择" width="70%" top="5vh" :visible.sync="visibleContractSelect">
				<contract-card-components :visible="visibleContractSelect" @row-click="getContract" :isSingleUser="true"></contract-card-components>
			</el-dialog>

		</div>
	</div>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addContractInvoiceOpen } from '@/api/oa/ht/contractInvoiceOpen';
	import LineComponents from '../components/LineComponents';
	import { mapGetters } from 'vuex';
	import CounterpartyComponents from '../components/CounterpartyComponents';
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
	import ContractCardComponents from '../components/ContractCardComponents';
	import ContractConditionSelectComponents from '../components/ContractConditionSelectComponents';

	


	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['contractInvoice','visible', 'contractCard'],
		watch: {
	      'contractInvoice':function( contractInvoice ) {
	        this.addForm = contractInvoice;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加 
				this.initData();
				this.$refs.contractConditionSelectRef.getContractConditions();
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '发票id不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ht_contract_invoice
				addForm: {
					id:'',htId:'', htName: '', requireId:'',cpId:'', cpName: '', number: '', requireName:'',title:'',gtaxid:'',amount:'',point:'',content:'',type:'',status:'',invoiceStatus:'',returnDate:'',openDate:'',relationWay:'',expressNumber:'',address:'',signDate:'',signPeople:'',htNumber:'',createUserId:'',createUserName:'',createTime:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				typeOptions: [																																		
					{
						label: '增值税专业发票',
						value: '1',
					},
					{
						label: '增值税普通发票',
						value: '2',
					},
					{
						label: '其它',
						value: '3',
					}
				],

				statusOptions: [
					{
						label: '未收款',
						value: '1',
					},
					{
						label: '已收款',
						value: '2',
					}
				],

				invoiceStatusOptions: [	
					{
						label: '已开票',
						value: '1',
					},
					{
						label: '未开票',
						value: '2',
					},
					{
						label: '已退票',
						value: '3',
					},
					{
						label: '已废止',
						value: '4',
					},
				],

				counterpartyVisible: false,
				visibleUserSelect: false,
				visibleContractSelect: false, 

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交ContractInvoice ht_contract_invoice 父组件监听@submit="afterAddSubmit"
			addSubmit: function (close) {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addContractInvoiceOpen(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									if(close){
										this.$emit('submit');//  @submit="afterAddSubmit"
									}else{
										this.$refs.contractConditionSelectRef.getContractConditions();
									}
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			getCounterparty(data) {
				this.counterpartyVisible = false;
				this.addForm.cpId = data.cpId;
				this.addForm.cpName = data.cpName;
			},

			initData() {
				this.addForm.returnDate = new Date().getTime();
				this.addForm.openDate = new Date().getTime();
				this.addForm.signDate = new Date().getTime();
				this.addForm.requireId = this.userInfo.userid;
				this.addForm.requireName = this.userInfo.username;
				if(this.contractCard){
					this.addForm.htId = this.contractCard.htId;
					this.addForm.htName = this.contractCard.htName;
					this.addForm.cpId=this.contractCard.cpId
					this.addForm.cpName=this.contractCard.cpName
					this.addForm.title=this.contractCard.cpName
					this.addForm.address=this.contractCard.cpAddress
					this.addForm.type=this.contractCard.invoiceType
					this.addForm.point=this.contractCard.invoicePoint
					this.addForm.gtaxid=this.contractCard.cpGszch
					this.addForm.relationWay=this.contractCard.linkPhone
				}
			},

			getUserData(data) {
				this.visibleUserSelect = false;
				this.addForm.requireId = data[0].userid;
				this.addForm.requireName = data[0].username;
			},

			getContract(contractCard) {
				this.visibleContractSelect = false; 
				this.addForm.htId = contractCard.htId;
				this.addForm.htName = contractCard.htName;
				this.addForm.cpId=contractCard.cpId
				this.addForm.cpName=contractCard.cpName
				this.addForm.title=contractCard.cpName
				this.addForm.address=contractCard.cpAddress
				this.addForm.type=contractCard.invoiceType
				this.addForm.point=contractCard.invoicePoint
				this.addForm.gtaxid=contractCard.cpGszch
				this.addForm.relationWay=contractCard.linkPhone
			},
			onConditionSelected(condition){
				if(condition.invoicedAmount){
					this.addForm.amount=condition.conditionAmount-condition.invoicedAmount
				}else{
					this.addForm.amount=condition.conditionAmount
				}
				
			},
			openNext(){

			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'contract-invoice-edit':ContractInvoiceEdit
			'line-components': LineComponents,
			'counterparty-components' : CounterpartyComponents,
			'user-select' : UsersSelect,
			'contract-card-components' : ContractCardComponents,
			ContractConditionSelectComponents,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.contractInvoice);  
			/**在下面写其它函数***/
			this.initData();
		}//end mounted
	}

</script>

<style scoped>

.container {
   width: 100%;
   height: 100%;
   overflow: hidden;
}

.container .header {
    width: 100%;
    border-bottom: 1px solid rgb(241, 241, 241);
    height: 70px;
    position: relative;
}

.container .header .left {
   height: 100%;
   width: 50px;
   margin-left: 20px;
   float: left;
}

.container .header i {
   width: 100%;
   text-align: center;
   font-size: 34px;
   line-height: 70px;
}

.container .header .title {
    float: left;
    margin-left: 20px;
    line-height: 70px;
}

.container .header .btn2 {
    float: right; 
    height: 100%;
    line-height: 70px;
    margin-right: 20px;
}

.container .nav {
   height: 90%;
   background-color: white;
   overflow-y: auto;
   margin: 0 auto;
   padding: 0 60px;
   padding-bottom: 200px;
}
</style>

<style>
.nav .el-form-item__label {
   font-size: 14px;
   font-weight: normal;
}
</style>