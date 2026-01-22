<template>
	<div class="container">

		<div class="header">
            <div class="left">
                <i class="el-icon-tickets"></i>
            </div>
            <div class="title">
                <span>到款登记</span>
            </div>
            <div class="btn2">
                <el-button @click="addSubmit" size="mini" type="primary">发起审批</el-button>
                <el-button @click="handleCancel" size="mini">关闭</el-button>
            </div>
        </div>
            <div class="content">
				<!--新增界面 ContractReceive ht_contract_receive--> 
				<el-form :model="addForm"  label-width="100px" :rules="addFormRules" ref="addForm">
					<line-components text="合同信息"></line-components>
					<el-row>
						<el-col :span="12">
							<el-form-item label="对应合同" prop="htName">
								<el-input @focus="visibleContractSelect=true" suffix-icon="el-icon-search" v-model="addForm.htName" ></el-input>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="合同号" prop="htSn">
								<el-input v-model="addForm.htSn" ></el-input>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="24">
							<el-form-item label="对应收款项" prop="conditionId">
								<contract-condition-select-components ref="contractConditionSelectRef" style="width:100%;" :ht-id="addForm.htId" v-model="addForm.conditionId" @selected="onConditionSelected"></contract-condition-select-components>
							</el-form-item> 
						</el-col>
					</el-row>

					<line-components text="到款信息"></line-components>

					<el-row>
						<el-col :span="12">
							<el-form-item label="到款金额" prop="amount">
								<el-input @change="amountCheck('amount')" v-model="addForm.amount" ></el-input>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="到款日期" prop="receiveDate">
								<el-date-picker v-model="addForm.receiveDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="付款银行" prop="bank">
								<el-input v-model="addForm.bank" ></el-input>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="付款账号" prop="bankAccount">
								<el-input v-model="addForm.bankAccount" ></el-input>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-form-item label="付款单位" prop="office">
							<el-input v-model="addForm.office" ></el-input>
						</el-form-item> 
					</el-row>
					<line-components text="发票信息"></line-components>
					<el-row>
						<el-button @click="visibleInvoiceSelect=true">关联发票</el-button>
					</el-row>
					<el-row v-if="invoices.length>0">
						<el-table :data="invoices"  highlight-current-row  border  style="width: 100%;">
							<el-table-column prop="amount" label="开票金额" min-width="80" ></el-table-column>  
							<el-table-column label="发票编号" min-width="80" > 
							</el-table-column>
							<el-table-column prop="title" label="发票抬头" min-width="80" ></el-table-column>
							<el-table-column prop="cpName" label="相对方名称" min-width="80" ></el-table-column>
							<el-table-column prop="htName" label="合同名称" min-width="80" ></el-table-column>
							<el-table-column prop="point" label="票点(%)" min-width="80" ></el-table-column>
							<el-table-column prop="openDate" label="开票时间" min-width="80" ></el-table-column> 
						</el-table>
					</el-row>
				</el-form>

			<el-dialog append-to-body title="合同选择" width="70%" top="5vh" :visible.sync="visibleContractSelect">
				<contract-card-components :visible="visibleContractSelect" @row-click="getContract" :isSingleUser="true"></contract-card-components>
			</el-dialog>

			<el-dialog append-to-body title="款项选择" width="70%" top="5vh" :visible.sync="visibleConditionSelect">
				<contract-condition-components :visible="visibleConditionSelect" @row-click="getCondition" :ht-id="addForm.htId" :isSingleUser="true"></contract-condition-components>
			</el-dialog>
			<el-dialog append-to-body title="发票选择" width="70%" top="5vh" :visible.sync="visibleInvoiceSelect">
				 <contract-invoice-open-list :ht-id="addForm.htId" :show-select="true" :condition-id="addForm.conditionId" @selectConfirm="invoiceOpenSelectConfirm"></contract-invoice-open-list>
			</el-dialog>
		  </div>
		
	</div>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addContractReceive,editContractReceive } from '@/api/oa/ht/contractReceive';
	import { mapGetters } from 'vuex';
	import LineComponents from '../components/LineComponents';
	import ContractCardComponents from '../components/ContractCardComponents'; 
	import ContractConditionSelectComponents from '../components/ContractConditionSelectComponents';
	import ContractInvoiceOpenList from '../contractInvoice/ContractInvoiceOpenList';
	
	//金额正则
	var amountReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['contractReceive','visible'],
		watch: {
	      'contractReceive':function( contractReceive ) {
	        this.addForm = contractReceive;
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
						//{ required: true, message: 'id不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ht_contract_receive
				addForm: {
					id:'',htId:'', htName: '', htSn:'', conditionId: '', conditionTiaoJian: '',  amount:'',receiveDate:'',bank:'',bankAccount:'',office:'',receiveType:'',receiveAmount:'',matchStatus:'',createUserId:'',createUserName:'',createTime:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				visibleContractSelect: false,
				defaultAddForm: {},
				/**end 在上面加自定义属性**/
				visibleConditionSelect: false,
				visibleInvoiceSelect:false,
				invoices:[],

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.resetFields();
				this.$emit('cancel');
			},
			//新增提交ContractReceive ht_contract_receive 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						if(!this.addForm.conditionId){
							this.$message.error("请选择收款条件");
							return;
						}
						/**
						if(this.invoices.length<=0){
							this.$message.error("请选择发票");
							return;
						}
						 */
						if(this.invoices.length>0 && this.invoices.some(i=>i.conditionId!=this.addForm.conditionId)){
							this.$message.error("发票与款项不对应，请选择正确的发票");
							return;
						}
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.invoiceIds=this.invoices.map(i=>i.id)
							var fun=addContractReceive
                            if(params.id){
                                fun=editContractReceive
                            }
							fun(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){ 
									this.addForm=res.data.data
									this.sendToProcessApprova(this.addForm,"contract_receive_process_approva")
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			validateAmount(value) {
				if(util.isNull(value)) {return null;}
				if(amountReg.test(value)) {
					return value;
				}else {
					return null;
				}
			},

			amountCheck(type) {
				switch(type) {
					case 'amount':
						this.addForm.amount = this.validateAmount(this.addForm.amount);
					break;
					case 'receiveAmount':
						this.addForm.receiveAmount = this.validateAmount(this.addForm.receiveAmount);
						this.addForm.amount=this.addForm.receiveAmount
					break;	
				}
			},
			/**end 在上面加自定义方法**/

			//获取合同
            getContract(data) {
                this.visibleContractSelect = false;
                this.addForm.htId = data.htId;
                this.addForm.htName = data.htName;
                this.addForm.htSn = data.htSn;
			},
			
			//清空表单数据 + 表格数据
			resetFields() {
				this.addForm = new Date().getTime();
			},

			initData(){
				this.addForm.receiveDate = util.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss')
			},

			getCondition(data) {
				if(data.conditionStatus=='2'){
					if(data.dct=='1'){
						this.$message.error("该款项已收款")
					}else{
						this.$message.error("该款项已付款")
					}
					return;
					
				}
				this.visibleConditionSelect = false;
				this.addForm.conditionId = data.conditionId;
				this.addForm.conditionTiaoJian = data.conditionTiaoJian;
				this.addForm.receiveAmount = data.conditionAmount;
				this.addForm.amount=this.addForm.receiveAmount
			},
			invoiceOpenSelectConfirm(invoices){ 
				if(!invoices){
					this.invoices=[];
				}else{
					if(invoices.some(i=>i.conditionStatus=='2')){
						this.$message.error("请选择未完成收款的发票进行关联");
						return;
					}
					this.invoices=invoices
				}
				this.visibleInvoiceSelect=false;
			}, 
			sendToProcessApprova:function(row,bizKey){
				debugger;
				// 传过来的参数格式
				if(row.bizFlowState=='1'){
					this.$message.error("已经发起，不允许重复发起");
					return;
				}
				let extVars={htId:row.htId,branchId:this.userInfo.branchId}
				let jsonExtVars=JSON.stringify(extVars);

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizPkid:row.id,
					bizParentPkid:row.htId,
					mainContext:'',
					extVars:extVars,
					flowVars:{
                        subscribeTaskEvent:'TASK_COMPLETED',
                        htId:row.htId,
                        receiveId:row.id,
                        branchId:this.userInfo.branchId,  
					},
				}
				if(bizKey=="contract_receive_process_approva"){
					params.mainTitle='关于合同【'+row.htName+"】收款 ￥"+row.amount+"的申请";
					params.mainContext='合同编号：'+row.htSn+','+'合同名称：'+row.htName+',相对方名称：'+row.cpName+',合同总金额：￥'+row.htGrossAmount
										+'<br>'+row.htPartyName+'于'+row.htSignDate+'签订('+row.htSn+')：'+row.htName
										+'<br>收款条件：'+row.conditionTiaoJian
										+'<br>收款金额：￥'+row.amount
										+'<br>收款流程: 销售发起审批->经理审核->开票->客户付款->收款登记->结束'

					params.restUrl=config.getOaBasePath()+"/ht/contractReceive/processApprova";
					this.$router.push({name:'ProcdefListForBizStart',params:params});

				}else {
					this.$message.error("不支持的审批事项");
					return;
				}
				//this.$store.dispatch('addVisitedViews', {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
			
			onConditionSelected(condition){
                if(!condition){
                    return;
                }
				if(condition.finishAmount){
					this.addForm.amount=condition.conditionAmount-condition.finishAmount
				}else{
					this.addForm.amount=condition.conditionAmount
				}
				this.addForm.receiveAmount=condition.conditionAmount
			},
		},//end method

		components: {  
			//在下面添加其它组件 'contract-receive-edit':ContractReceiveEdit
			'line-components': LineComponents,
			'contract-card-components' : ContractCardComponents,
			'contract-condition-select-components' : ContractConditionSelectComponents,
			ContractInvoiceOpenList,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.contractReceive);
			this.defaultAddForm = JSON.parse(JSON.stringify(this.addForm));
			this.initData();
		}//end mounted
	}

</script>

<style scoped>

html, body{overflow:hidden}

div::-webkit-scrollbar{
  width:10px;
  height:10px;
}

div::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
div::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
div::-webkit-scrollbar-thumb:hover{
  background: #333;
}
div::-webkit-scrollbar-corner{
  background: #179a16;
}

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
.content .el-form-item__label {
   font-size: 14px;
   font-weight: normal;
}
</style>