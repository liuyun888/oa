<template>
	<el-row class="container">
		<div class="header">
			<div class="left">
				<i class="el-icon-tickets"></i>
			</div>
			<div class="title">
				<span>收票台账</span>
			</div>
			<div class="btn2">
				<el-button @click="addSubmit" size="mini" type="primary">保存</el-button>
				<el-button @click="handleCancel" size="mini">关闭</el-button>
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
						<el-form-item label="发票抬头" prop="title">
							<el-input v-model="addForm.title"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="纳税人识别号" prop="gtaxid">
							<el-input v-model="addForm.gtaxid" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="发票编号" prop="number">
							<el-input v-model="addForm.number"></el-input>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="发票金额" prop="amount">
							<el-input-number v-model="addForm.amount" :min="0"></el-input-number>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="发票开具日期" prop="openDate">
							<el-date-picker type="date" v-model="addForm.openDate"></el-date-picker>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="票点(%)" prop="point">
							<el-input-number v-model="addForm.point" :min="0"></el-input-number>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="发票内容" prop="content">
							<el-input v-model="addForm.content" ></el-input>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="收票日期" prop="receiveDate">
							<el-date-picker type="date" v-model="addForm.receiveDate"  ></el-date-picker>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="发票状态" prop="status">
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

					<el-col :span="12">
						<el-form-item label="发票类型" prop="type">
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
			</el-form>
		</div>

		<el-dialog append-to-body title="合同选择" width="70%" top="5vh" :visible.sync="visibleContractSelect">
			<contract-card-components :visible="visibleContractSelect" @row-click="getContract" :isSingleUser="true"></contract-card-components>
		</el-dialog>


	</el-row>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addContractInvoiceReceive } from '@/api/oa/ht/contractInvoiceReceive';
	import LineComponents from '../components/LineComponents'
	import { mapGetters } from 'vuex'
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
					id:'',htId:'', htName: '', title:'',gtaxid:'',number:'',amount:'',openDate: '' , point:'',content:'',receiveDate: '',status:'',type:'',createUserId:'',createUserName:'',createUserTime:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				statusOptions: [
					{
						label: '未付款',
						value: '1',
					},
					{
						label: '已付款',
						value: '2',
					},
					{
						label: '已退票',
						value: '3',
					}
				],
				typeOptions: [
					{
						label: '增值税专业发票',
						value: '1',
					},
					{
						label: '增值税普通发票',
						value: '2',
					},
				],
				visibleContractSelect: false,
				contractConditionSelectRef: false,

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
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addContractInvoiceReceive(params).then((res) => {
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
			initData() {
				this.addForm.openDate = new Date().getTime();
				this.addForm.receiveDate = new Date().getTime(); 
				this.addForm.openDate = new Date().getTime();
				this.addForm.signDate = new Date().getTime(); 
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
				}
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
			}, 
			onConditionSelected(condition){
				if(condition.invoicedAmount){
					this.addForm.amount=condition.conditionAmount-condition.invoicedAmount
				}else{
					this.addForm.amount=condition.conditionAmount
				}
				
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'contract-invoice-edit':ContractInvoiceEdit
			'line-components': LineComponents,
			'contract-card-components' : ContractCardComponents,
			ContractConditionSelectComponents
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