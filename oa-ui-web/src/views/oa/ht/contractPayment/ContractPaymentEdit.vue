<template>
    <div class="container">
        
        <div class="header">
            <div class="left">
                <i class="el-icon-tickets"></i>
            </div>
            <div class="title">
                <span>付款记录</span>
            </div>
            <div class="btn2">
                 <el-button @click="editSubmit()" size="mini" type="primary" :disabled="load.edit">提交审核</el-button>
                <el-button @click="saveLinkInvoices" size="mini" type="primary" :disabled="load.edit">保存发票</el-button>
                <el-button @click="handleCancel" size="mini" >关闭</el-button>
            </div>
        </div>
            <div class="content">
                <el-form size="mini" :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                    
                   <line-components text="合同信息"></line-components>
					<el-row>
						<el-col :span="12">
							<el-form-item label="对应合同" prop="htName">
								<el-input @focus="visibleContractSelect=true" suffix-icon="el-icon-search" v-model="editForm.htName" disabled></el-input>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="合同号" prop="htSn">
								<el-input v-model="editForm.htSn" disabled></el-input>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row> 
                        <el-col :span="24">
                            <el-form-item  label="开票条件" prop="conditionId"> 
                                <contract-condition-select-components ref="contractConditionSelectRef" style="width:100%;" :ht-id="editForm.htId" v-model="editForm.conditionId" @selected="onConditionSelected" :disabled=true></contract-condition-select-components>
                            </el-form-item>  
                        </el-col>
					</el-row> 
                    <line-components text="相对方信息"></line-components>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="合同相对方">
                                <el-input suffix-icon="el-icon-search" @focus="visibleCounterpartySelect=true" v-model="editForm.cpName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开户银行">
                                <el-input v-model="editForm.cpBankAccount"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="银行账号">
                                <el-input v-model="editForm.cpOpenBank"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人">
                                <el-input v-model="editForm.cpFzr"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="联系电话">
                                <el-input v-model="editForm.cpFzrPhone"></el-input>
                            </el-form-item>
                        </el-col>
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
                    <line-components text="付款信息"></line-components>
                    
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="实际付款金额">
                                 <el-input v-model="editForm.payAmount"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="付款状态">
                                <el-select clearable v-model="editForm.payStatus" placeholder="请选择">
                                    <el-option
                                        v-for="item in fuKuanStatuOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="实际付款日期">
                                <el-date-picker v-model="editForm.actualDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

        <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
            <user-select @confirm="getUserData" :isSingleUser="true"></user-select>
        </el-dialog>

        <el-dialog append-to-body title="合同选择" width="70%" top="5vh" :visible.sync="visibleContractSelect">
            <contract-card-components :visible="visibleContractSelect" @row-click="getContract" :isSingleUser="true"></contract-card-components>
        </el-dialog>

        <el-dialog append-to-body title="相对方选择" width="70%" top="5vh" :visible.sync="visibleCounterpartySelect">
            <counterparty-components @row-click="getCounterparty" :visible="visibleCounterpartySelect"></counterparty-components>
        </el-dialog>
        
        <el-dialog append-to-body title="发票选择" width="70%" top="5vh" :visible.sync="visibleInvoiceSelect">
                <contract-invoice-receive-list :ht-id="editForm.htId" :show-select="true" @selectConfirm="invoiceReceiveSelectConfirm"></contract-invoice-receive-list>
        </el-dialog>

    </div>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
    import { mapGetters } from 'vuex';
    import { editContractPayment,linkInvoices } from '@/api/oa/ht/contractPayment';
    import LineComponents from '../components/LineComponents'
    import ContractCardComponents from '../components/ContractCardComponents';
    import UsersSelect from '@/views/mdp/sys/user/UsersSelect';     
    import CounterpartyComponents from '../components/CounterpartyComponents';     
	import ContractConditionSelectComponents from '../components/ContractConditionSelectComponents';
	import ContractInvoiceReceiveList from '../contractInvoice/ContractInvoiceReceiveList';
	import { listContractInvoiceReceive} from '@/api/oa/ht/contractInvoiceReceive';


	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['contractPayment','visible'],
		watch: {
	      'contractPayment':function( contractPayment ) {
	        this.editForm = contractPayment;
	      },
	      'visible':function(visible) {
	      	if(visible==true) {
				//从新打开页面时某些数据需要重新加载，可以在这里添加
                this.getContractInvoicesReceive();
	      	}
	      }
        },
        
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, edit: false },//查询中...
				editFormRules: {
					typeId: [
						{ required: true, message: '所属分类不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ht_contract_template
				editForm: {
					id:'',htId:'',cpId:'', conditionId: '',  htName:'', htSn:'', htGrossAmount:'', htFzUserid:'', htFzUsername:'', htPayedAmount:'', payCondition:'', payType:'', payRatio:'', payAmount:'', cpName:'', cpBankAccount:'', cpOpenBank:'', cpFzr:'', cpFzrPhone:'', payFlow:'', payStatus:'', actualDate:'', createUserId:'', createUserName:'', createDate:'',branchId:''
                },
                defaultAddForm: {},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/ 
                visibleUserSelect: false,
                visibleContractSelect: false,
                visibleCounterpartySelect: false,
                invoices:[],
                //款项类别
                kxTypeOptions: [
                    {
                        label: '',
                        value: '',
                    },
                    {
                        label: '首付款',
                        value: '1',
                    },
                    {
                        label: '方案款',
                        value: '2',
                    },
                    {
                        label: '上线款',
                        value: '3',
                    },
                    {
                        label: '验收款',
                        value: '4',
                    },
                    {
                        label: '质保金',
                        value: '5',
                    },
                    {
                        label: '中期款',
                        value: '6',
                    },

                    {
                        label: '尾款',
                        value: '7',
                    },
                ],

                fuKuanStatuOptions: [
                    {
                        label: '已付款',
                        value: '1',
                    },

                    {
                        label: '等待财务付款',
                        value: '2',
                    },

                    {
                        label: '申请中',
                        value: '3',
                    },
                ],           
                    
                /**end 在上面加自定义属性**/
                visibleConditionSelect: false,
                visibleInvoiceSelect:false,


                

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.resetFields();
				this.$emit('cancel');
            },

            /**end 在上面加自定义方法**/
            getUserData(data) {
                this.visibleUserSelect = false;
                this.editForm.htFzUserid = data[0].userid;
                this.editForm.htFzUsername = data[0].username;
            },

            //获取合同
            getContract(data) {
                this.visibleContractSelect = false;
                this.editForm.htId = data.htId;
                this.editForm.htName = data.htName;
                this.editForm.htSn = data.htSn;
                this.editForm.cpFzr = data.linkName;
                this.editForm.cpId=data.cpId
                this.editForm.cpName=data.cpName
                this.editForm.cpBankAccount=data.cpBankAccount
                this.editForm.cpOpenBank=data.cpOpenBank
                this.editForm.cpFzrPhone = data.linkPhone;
            },

            //获取相对方信息
            getCounterparty(data) {
                this.visibleCounterpartySelect = false;
                this.editForm.cpId = data.cpId;
                this.editForm.cpName = data.cpName;
                this.editForm.cpBankAccount = data.cpBankAccount;
                this.editForm.cpOpenBank = data.cpOpenBank;
                this.editForm.cpFzr = data.cpFzr;
                this.editForm.cpFzrPhone = data.cpFzrPhone;
            },

            editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
                        
						/**
						if(this.invoices.length<=0){
							this.$message.error("请选择发票");
							return;
						}
						*/
						if(this.invoices.length>0 && this.invoices.some(i=>i.conditionId!=this.editForm.conditionId)){
							this.$message.error("发票与款项不对应，请选择正确的发票");
							return;
						}
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
                            
							params.invoiceIds=this.invoices.map(i=>i.id)
							editContractPayment(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){ 
                                    this.sendToProcessApprova(this.editForm,"contract_payment_process_approva")
                                    this.$emit("submit")
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}
				});
            }, 
			onConditionSelected(condition){
                if(!condition){
                    return;
                }
				if(condition.finishAmount){
					this.editForm.payAmount=condition.conditionAmount-condition.finishAmount
				}else{
					this.editForm.payAmount=condition.conditionAmount
				}
				
			},
            
            resetFields() {
                this.editForm = JSON.parse(JSON.stringify(this.defaultAddForm));
            },
			invoiceReceiveSelectConfirm(invoices){ 
				if(!invoices){
					this.invoices=[];
				}else{
					if(invoices.some(i=>i.conditionStatus=='2')){
						this.$message.error("请选择未完成付款的发票进行关联");
						return;
					}
					this.invoices=invoices
				}
				this.visibleInvoiceSelect=false;
			},
			getContractInvoicesReceive() {
				var params={paymentId:this.editForm.id}
				this.load.list = true;
				listContractInvoiceReceive(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){  
						this.invoices = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
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
                        paymentId:row.id,
                        branchId:this.userInfo.branchId,  
					},
				}
				if(bizKey=="contract_payment_process_approva"){
					params.mainTitle='关于合同【'+row.htName+"】付款 ￥"+row.payAmount+"的申请";
					params.mainContext='合同编号：'+row.htSn+','+'合同名称：'+row.htName+',相对方名称：'+row.cpName+',合同总金额：￥'+row.htGrossAmount
										+'<br>'+row.htPartyName+'于'+row.htSignDate+'签订('+row.htSn+')：'+row.htName
										+'<br>付款条件：'+row.conditionTiaoJian
										+'<br>付款金额：￥'+row.payAmount
										+'<br>付款流程: 销售发起审批->经理审核->客户开票->收票登记->财务付款->结束'

					params.restUrl=config.getOaBasePath()+"/ht/contractPayment/processApprova";
					this.$router.push({name:'ProcdefListForBizStart',params:params});

				}else {
					this.$message.error("不支持的审批事项");
					return;
				}
				//this.$store.dispatch('addVisitedViews', {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},

			saveLinkInvoices(){
				var params={
					htId:this.editForm.htId,
					paymentId:this.editForm.id,
					invoiceIds:this.invoices.map(i=>i.id)
				}
				this.load.edit=true;
				linkInvoices(params).then(res=>{
					this.load.edit=false;
					var tips = res.data.tips;
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			}

        },//end method
        
		components: {
            'line-components': LineComponents,
            'contract-card-components' : ContractCardComponents,
            'user-select' : UsersSelect,
            'counterparty-components': CounterpartyComponents, 
			ContractConditionSelectComponents,
            ContractInvoiceReceiveList,
        },
        
		mounted() {
            this.defaultAddForm = JSON.parse(JSON.stringify(this.editForm));
			this.editForm=Object.assign(this.editForm, this.contractPayment);  
            this.getContractInvoicesReceive();
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