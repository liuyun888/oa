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
				<el-button @click="editSubmit" size="mini" type="primary">提交</el-button>
				<el-button @click="handleCancel" size="mini">关闭</el-button>
			</div>
		</div>

		<div class="nav">
			<div class="content">

				<line-components text="合同风险说明"></line-components>

				<el-form :model="editForm"  label-width="100px" :rules="editFormRules" ref="editForm">					
					
					<el-row>
						<el-col :span="12">
							<el-form-item label="相关合同" prop="htName">
								<el-input suffix-icon="el-icon-search" @focus="visibleContractSelect=true" v-model="editForm.htName" ></el-input>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="相关相对方" prop="cpName">
								<el-input @focus="counterpartyVisible=true" suffix-icon="el-icon-search" v-model="editForm.cpName" ></el-input>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="风险类型" prop="riskName">
								<el-input suffix-icon="el-icon-search" @focus="visibleRuleSelect=true" v-model="editForm.riskName" ></el-input>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="风险内容" prop="riskNav">
								<el-input v-model="editForm.riskNav"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="处理策略" prop="riskMethod">
								<el-input v-model="editForm.riskMethod" ></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item label="预计时间" prop="yujiTime">
								<el-date-picker type="date" placeholder="选择日期" v-model="editForm.yujiTime"></el-date-picker>
							</el-form-item> 
						</el-col>
					</el-row>

				</el-form>

				<el-dialog append-to-body title="合同选择" width="70%" top="5vh" :visible.sync="visibleContractSelect">
					<contract-card-components :visible="visibleContractSelect" @row-click="getContract" :isSingleUser="true"></contract-card-components>
				</el-dialog>

				<el-dialog append-to-body title="风险类型" width="70%" top="5vh" :visible.sync="visibleRuleSelect">
					<contract-risk-rule-components :visible="visibleRuleSelect" @row-click="getRule" :isSingleUser="true"></contract-risk-rule-components>
				</el-dialog>

				<el-dialog append-to-body width="60%" :visible.sync="counterpartyVisible">
                  <counterparty-components @row-click="getCounterparty" :visible="counterpartyVisible"></counterparty-components>
                </el-dialog>


			</div>
		</div>

	</div>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editContractRisk } from '@/api/oa/ht/contractRisk';
	import { mapGetters } from 'vuex'
	import LineComponents from '../components/LineComponents';
	import ContractCardComponents from '../components/ContractCardComponents';
	import ContractRiskRuleComponents from '../components/ContractRiskRuleComponents';
	import CounterpartyComponents from '../components/CounterpartyComponents';


	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['contractCard', 'contractRisk','visible'],
		watch: {
	      'contractRisk':function( contractRisk ) {
	        this.editForm = contractRisk;
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
					riskId: [
						//{ required: true, message: 'risk_id不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ht_contract_risk
				editForm: {
					riskId:'', htId:'', htName: '', cpId:'', cpName: '',  ruleId:'', riskName:'', riskNav:'',riskMethod:'',yujiTime:'',createTime:'',createUserId:'',createUserName:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				visibleContractSelect: false,
				visibleRuleSelect: false,
				counterpartyVisible: false,
				defaultAddForm: {},
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.resetFields();
				this.$emit('cancel');
			},
			//新增提交ContractRisk ht_contract_risk 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.editForm); 
							editContractRisk(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
            getContract(data) {
                this.visibleContractSelect = false;
                this.editForm.htId = data.htId;
                this.editForm.htName = data.htName;
			},

			getRule(data) {
				this.visibleRuleSelect = false;
				this.editForm.ruleId = data.ruleId;
				this.editForm.riskName = data.ruleName;
			},

			getCounterparty(data) {
				this.counterpartyVisible = false;
				this.editForm.cpId = data.cpId;
				this.editForm.cpName = data.cpName;
			},
			
			/**end 在上面加自定义方法**/
			resetFields() {
				this.editForm = JSON.parse(JSON.stringify(this.defaultAddForm));
			},
			
		},//end method
		
		components: {  
			//在下面添加其它组件 'contract-risk-edit':ContractRiskEdit
			'line-components': LineComponents,
			'contract-card-components' : ContractCardComponents,
			'contract-risk-rule-components' : ContractRiskRuleComponents,
			'counterparty-components' : CounterpartyComponents,
		},

		created() {
			this.editForm=Object.assign(this.editForm, this.contractRisk);  
			/**在下面写其它函数***/
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