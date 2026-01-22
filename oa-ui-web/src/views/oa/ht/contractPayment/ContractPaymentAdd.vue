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
                <el-button @click="addSubmit(true)" size="mini" type="primary">提交审核</el-button>
                <el-button @click="handleCancel" size="mini" >关闭</el-button>
            </div>
        </div>
            <div class="content">
                <el-form size="mini" :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                    
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
                            <el-form-item  label="开票条件" prop="conditionId"> 
                                <contract-condition-select-components ref="contractConditionSelectRef" style="width:100%;" :ht-id="addForm.htId" v-model="addForm.conditionId" @selected="onConditionSelected"></contract-condition-select-components>
                            </el-form-item>  
                        </el-col>
					</el-row> 
                    <line-components text="相对方信息"></line-components>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="合同相对方">
                                <el-input suffix-icon="el-icon-search" @focus="visibleCounterpartySelect=true" v-model="addForm.cpName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开户银行">
                                <el-input v-model="addForm.cpBankAccount"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="银行账号">
                                <el-input v-model="addForm.cpOpenBank"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人">
                                <el-input v-model="addForm.cpFzr"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="联系电话">
                                <el-input v-model="addForm.cpFzrPhone"></el-input>
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
                                 <el-input v-model="addForm.payAmount"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="付款状态">
                                <el-select clearable v-model="addForm.payStatus" placeholder="请选择">
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
                                <el-date-picker v-model="addForm.actualDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div> 

        <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
            <user-select @confirm="getUserData" :isSingleUser="true"></user-select>
        </el-dialog>

        <el-dialog append-to-body title="合同选择" width="70%" top="5vh" :visible.sync="visibleContractSelect">
            <contract-card-components :visible="visibleContractSelect"  @row-click="getContract" :isSingleUser="true"></contract-card-components>
        </el-dialog>

        <el-dialog append-to-body title="相对方选择" width="70%" top="5vh" :visible.sync="visibleCounterpartySelect">
            <counterparty-components @row-click="getCounterparty" :visible="visibleCounterpartySelect"></counterparty-components>
        </el-dialog>
        
        <el-dialog append-to-body title="发票选择" width="70%" top="5vh" :visible.sync="visibleInvoiceSelect">
                <contract-invoice-receive-list :ht-id="addForm.htId" :condition-id="addForm.conditionId" :show-select="true" @selectConfirm="invoiceReceiveSelectConfirm"></contract-invoice-receive-list>
        </el-dialog>

    </div>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
    import { mapGetters } from 'vuex';
    import { addContractPayment,editContractPayment } from '@/api/oa/ht/contractPayment';
    import LineComponents from '../components/LineComponents'
    import ContractCardComponents from '../components/ContractCardComponents';
    import UsersSelect from '@/views/mdp/sys/user/UsersSelect';     
    import CounterpartyComponents from '../components/CounterpartyComponents';     
	import ContractConditionSelectComponents from '../components/ContractConditionSelectComponents';
	import ContractInvoiceReceiveList from '../contractInvoice/ContractInvoiceReceiveList';


	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['contractPayment','visible'],
		watch: {
	      'contractPayment':function( contractPayment ) {
	        this.addForm = contractPayment;
	      },
	      'visible':function(visible) {
	      	if(visible==true) {
				//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
        },
        
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					typeId: [
						{ required: true, message: '所属分类不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ht_contract_template
				addForm: {
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
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.resetFields();
				this.$emit('cancel');
            },

            /**end 在上面加自定义方法**/
            getUserData(data) {
                this.visibleUserSelect = false;
                this.addForm.htFzUserid = data[0].userid;
                this.addForm.htFzUsername = data[0].username;
            },

            //获取合同
            getContract(data) {
                this.visibleContractSelect = false;
                this.addForm.htId = data.htId;
                this.addForm.htName = data.htName;
                this.addForm.htSn = data.htSn;
                this.addForm.cpFzr = data.linkName;
                this.addForm.cpId=data.cpId
                this.addForm.cpName=data.cpName
                this.addForm.cpBankAccount=data.cpBankAccount
                this.addForm.cpOpenBank=data.cpOpenBank
                this.addForm.cpFzrPhone = data.linkPhone;
            },

            //获取相对方信息
            getCounterparty(data) {
                this.visibleCounterpartySelect = false;
                this.addForm.cpId = data.cpId;
                this.addForm.cpName = data.cpName;
                this.addForm.cpBankAccount = data.cpBankAccount;
                this.addForm.cpOpenBank = data.cpOpenBank;
                this.addForm.cpFzr = data.cpFzr;
                this.addForm.cpFzrPhone = data.cpFzrPhone;
            },

            addSubmit: function (toStartFlow) {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
                        
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
                            var fun=addContractPayment
                            if(params.id){
                                fun=editContractPayment
                            }
							fun(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
                                    //this.resetFields();
                                    this.addForm=res.data.data;
                                    if(toStartFlow){
                                        this.sendToProcessApprova(this.addForm,"contract_payment_process_approva")
                                       /this.$emit('submit');//  @submit="afterAddSubmit"
                                    }else{ 
									    this.$emit('submit');//  @submit="afterAddSubmit"
                                    }
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
            }, 
			onConditionSelected(condition){
                if(!condition){
                    return;
                }
				if(condition.finishAmount){
					this.addForm.payAmount=condition.conditionAmount-condition.finishAmount
				}else{
					this.addForm.payAmount=condition.conditionAmount
				}
				
			},
            
            resetFields() {
                this.addForm = JSON.parse(JSON.stringify(this.defaultAddForm));
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
			sendToProcessApprova:function(row,bizKey){
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
					bizPkid:row.htId,
					bizParentPkid:row.id,
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
            this.defaultAddForm = JSON.parse(JSON.stringify(this.addForm));
			this.addForm=Object.assign(this.addForm, this.contractPayment);  
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