<template>
    <el-row class="container"> 
      <el-row class="header">
         
         <div class="left">
            <i class="el-icon-tickets"></i>
         </div>

         <div class="center">
            
            <div class="title">
               <span><font color="grap" style="font-size:18px;">{{editForm.htName}}</font> &nbsp;&nbsp;<el-tag>合同总额￥{{editForm.htGrossAmount}}</el-tag>&nbsp;&nbsp;<el-tag v-if="editForm.htParentType=='1'">已开票￥{{editForm.htKaiPiaoAmount}}</el-tag>&nbsp;&nbsp;<el-tag v-if="editForm.htParentType!='1'">已收票￥{{editForm.htShouPiaoAmount}}</el-tag>&nbsp;&nbsp;<el-tag  v-if="editForm.htParentType=='1'">已收款￥{{editForm.htReceivedAmount}}</el-tag><el-tag v-if="editForm.htParentType!='1'">已付款￥{{editForm.htPayedAmount}}</el-tag>&nbsp;&nbsp;</span>
            </div>

            <ul class="list">
               <li :class="{'liActive':activeName==='tabBase'}" @click="activeName = 'tabBase' " :v-bind="activeName">基本信息</li>
               <li :class="{'liActive':activeName==='tabCondition'}" @click="activeName = 'tabCondition' " :v-bind="activeName">{{editForm.htParentType=='1'?'收款条件':'付款条件'}}</li>
               <li :class="{'liActive':activeName==='tabProduct'}" @click="activeName = 'tabProduct' " :v-bind="activeName">产品</li>
               <li :class="{'liActive':activeName==='tabCb'}" @click="activeName = 'tabCb' " :v-bind="activeName">成本</li>
               <li :class="{'liActive':activeName==='tabProject'}" @click="activeName = 'tabProject' " :v-bind="activeName">项目</li>

               <li v-if="contractCard.htParentType=='1'" :class="{'liActive':activeName==='tabInvoiceOpen'}" @click="activeName = 'tabInvoiceOpen' " :v-bind="activeName">
                  开票记录
               </li>
               <li v-else :class="{'liActive':activeName==='tabInvoiceReceive'}" @click="activeName = 'tabInvoiceReceive' " :v-bind="activeName">
                  收票记录
               </li>
               <li v-if="contractCard.htParentType=='1'" :class="{'liActive':activeName==='tabRece'}" @click="activeName = 'tabRece' " :v-bind="activeName">
                     收款记录   
               </li> 
               <li v-else :class="{'liActive':activeName==='tabPayment'}" @click="activeName = 'tabPayment' " :v-bind="activeName">
                     付款记录 
               </li>
               <!-- <li :class="{'liActive':activeName==='tab4'}" @click="activeName = 'tab4' " :v-bind="activeName">合同档案</li>
               <li :class="{'liActive':activeName==='tab5'}" @click="activeName = 'tab5' " :v-bind="activeName">操作日志</li>
               <li :class="{'liActive':activeName==='tab6'}" @click="activeName = 'tab6' " :v-bind="activeName">执行反馈</li>
               <li :class="{'liActive':activeName==='tab7'}" @click="activeName = 'tab7' " :v-bind="activeName">变更记录</li> -->
               <li :class="{'liActive':activeName==='tabRisk'}" @click="activeName = 'tabRisk' " :v-bind="activeName">合同风险说明</li>
               
               <li :class="{'liActive':activeName==='tabTaskMng'}" @click="activeName = 'tabTaskMng' " :v-bind="activeName">当前审批</li>
               <li :class="{'liActive':activeName==='tabHisTaskMng'}" @click="activeName = 'tabHisTaskMng' " :v-bind="activeName">历史审批</li>
               <!-- <li :class="{'liActive':activeName==='tab9'}" @click="activeName = 'tab9' " :v-bind="activeName">查看盖章文件</li>  -->
                  <li :class="{'liActive':activeName==='tabLog'}" @click="activeName = 'tabLog' " :v-bind="activeName">操作日志</li>
            </ul>
         </div>

         <div class="right">
            <div class="btn2">
               <el-button v-if="activeName === 'tabBase'" @click="tabBaseClick" size="mini" type="primary">保存基本信息</el-button>
               <el-button v-if="activeName === 'tabBase'" @click="tabBaseSigningClick" size="mini" type="primary">合同签订审批</el-button>
               <el-button v-if="activeName === 'tabBase'" @click="tabBaseChangeClick" size="mini" type="primary">合同变更审批</el-button>
               <el-button v-if="activeName === 'tabCondition'" @click="tabConditionSave" size="mini" type="primary">{{editForm.htParentType=='1'?'保存收款条件':'保存付款条件'}}</el-button>
               <el-button v-if="activeName === 'tabProduct'" @click="tabProductSave" size="mini" type="primary">保存产品信息</el-button>
               <el-button v-if="activeName === 'tabCb'" @click="tabCbSave" size="mini" type="primary">保存成本信息</el-button>
               <el-button v-if="activeName === 'tabProject'" @click="tabProjectSave" size="mini" type="primary">保存项目信息</el-button>

               <el-button v-if="activeName === 'tabInvoiceOpen'" @click="tabInvoiceOpenClick('new')" size="mini" type="primary">新增开票</el-button>
               <el-button v-if="activeName === 'tabInvoiceOpen'" @click="tabInvoiceOpenClick('tui')" size="mini" type="primary">退票</el-button>
               
               <el-button v-if="activeName === 'tabInvoiceReceive'" @click="tabInvoiceReceiveClick('new')" size="mini" type="primary">新增收票</el-button>
               <el-button v-if="activeName === 'tabInvoiceReceive'" @click="tabInvoiceReceiveClick('tui')" size="mini" type="primary">退票</el-button>
               <el-button v-if="activeName === 'tabInvoiceOpen'" @click="tabInvoiceOpenClick('fei')" size="mini" type="primary">废止</el-button>
               <el-button v-if="activeName === 'tabRece'" @click="tabReceClick" size="mini" type="primary">新增收款</el-button>
               <el-button v-if="activeName === 'tabPayment'" @click="tabPaymentClick" size="mini" type="primary">新增付款</el-button>

               <el-button v-if="activeName === 'tabRisk'" @click="tabRiskClick" size="mini" type="primary">新增风险</el-button>
               <el-button @click="handleCancel" size="mini">关闭</el-button>
            </div>
         </div>
      </el-row>

		<el-row class="content">

			<!--合同基本信息 -->
			<div v-if="activeName === 'tabBase' ">
				<contract-card-edit ref="tabBaseRef" @submit="afterEditSubmit" :visible="visible" :contractCard="editForm"></contract-card-edit>
			</div>

         <!-- 销售合同开票记录 -->
         <div v-if="activeName === 'tabInvoiceOpen' ">
				<contract-invoice-open-mng ref="tabInvoiceOpenRef" :contractCard="contractCard"></contract-invoice-open-mng>
			</div>

         <!-- 采购合同收票记录-->
         <div v-if="activeName === 'tabInvoiceReceive'  ">
            <contract-invoice-receive-mng ref="tabInvoiceReceiveRef" :contractCard="contractCard"></contract-invoice-receive-mng>
			</div>

          <!-- 销售合同收款记录 -->
         <div v-if="activeName === 'tabRece'  ">
            <contract-receive-mng ref="tabReceRef" :contractCard="contractCard"></contract-receive-mng>
         </div>

          <!-- 采购合同付款记录-->
         <div v-if="activeName === 'tabPayment'  ">
            <contract-payment-mng ref="tabPaymentRef" :contractCard="contractCard"></contract-payment-mng>
			</div>
         
         <div v-if="activeName === 'tabRisk' ">
            <contract-risk-mng ref="tabRiskRef" :contractCard="contractCard"> </contract-risk-mng>
         </div>
         <div v-if="activeName === 'tabLog' ">
            <contract-log-mng ref="tabLogRef" :contractCard="contractCard"> </contract-log-mng>
         </div>
         
         <div v-if="activeName === 'tabCondition' ">
            <contract-condition-mng ref="tabConditionRef" :contractCard="contractCard"> </contract-condition-mng>
         </div>
         
         <div v-if="activeName === 'tabCb' ">
            <contract-cb-mng ref="tabCbRef" :contractCard="contractCard"> </contract-cb-mng>
         </div>
         
         <div v-if="activeName === 'tabProduct' ">
            <contract-product-mng ref="tabProductRef" :contractCard="contractCard"> </contract-product-mng>
         </div>
         
         <div v-if="activeName === 'tabTaskMng' ">
            <task-mng ref="tabTaskMngRef" :biz-parent-pkid="contractCard.htId" > </task-mng>
         </div>
         <div v-if="activeName === 'tabHisTaskMng' ">
            <procinst-mng ref="tabHisTaskMngRef" isAll="true" :biz-parent-pkid="contractCard.htId"></procinst-mng>
         </div>
         
		</el-row>

    </el-row>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import config from '@/common/config';//全局公共库
   import ContractCardEdit from './ContractCardEdit';
   import ContractInvoiceOpenMng from '../contractInvoice/ContractInvoiceOpenMng';
   import ContractInvoiceReceiveMng from '../contractInvoice/ContractInvoiceReceiveMng';
   import ContractReceiveMng from '../contractReceive/ContractReceiveMng';
   import ContractPaymentMng from '../contractPayment/ContractPaymentMng';
   import ContractRiskMng from '../contractRisk/ContractRiskMng';
   import ContractLogMng from '../contractLog/ContractLogMng';
   import ContractConditionMng from '../contractCondition/ContractConditionMng';
   import ContractCbMng from '../contractCb/ContractCbMng';
   import ContractProductMng from '../contractProduct/ContractProductMng';
   import ContractProjectMng from '../contractProject/ContractProjectMng';
   
   import TaskMng from '@/views/mdp/workflow/ru/task/TaskMng';

   import ProcinstMng from '@/views//mdp/workflow/hi/procinst/ProcinstMng';
   


	import { mapGetters } from 'vuex';
	
	export default { 
		
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},

		props:['contractCard','visible'],
		watch: {

		  'contractCard':function( contractCard ) {
            this.editForm = contractCard;
		   },
		  
	      'visible':function(visible) { 
	      	if(visible==true){
               //从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
         }
         
	    },
		data() {
			return {
            activeName: "tabBase",
            editForm: {},
			}//end return
      },//end data
      
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
            this.activeName = 'tabBase';
				this.$emit('cancel');
			},
            /**begin 在下面加自定义方法,记得补上面的一个逗号**/

         //tab1修改
         tabBaseClick() { 
             var diffMsg=this.getObjDiff();
               if(diffMsg&&diffMsg.length>0){
                  this.$message.error("修改了关键信息，请走合同变更审批");
                  return;
               } 
            this.$refs.tabBaseRef.editSubmit();
         },

         //tab2修改
         tabInvoiceOpenClick(options) {
            switch(options) {
               case 'new' : 
                     this.$refs.tabInvoiceOpenRef.showAdd(); 
               break;
               case 'tui' : 
                     this.$refs.tabInvoiceOpenRef.tuiPiao(); 
               break;
               case 'fei' :
                  this.$refs.tabInvoiceOpenRef.feiZhi();
               break;
            }
         },
         //tab2修改
         tabInvoiceReceiveClick(options) {
            switch(options) {
               case 'new' : 
                     this.$refs.tabInvoiceReceiveRef.showAdd(); 
               break;
               case 'tui' : 
                     this.$refs.tabInvoiceReceiveRef.tuiPiao(); 
               break;
               case 'fei' :
                  this.$refs.tabInvoiceReceiveRef.feiZhi();
               break;
            }
         },

         tabReceClick() {
            this.$refs.tabReceRef.showAdd();
         },

         tabPaymentClick() {
            this.$refs.tabPaymentRef.showAdd();
         },
         afterEditSubmit(data) {
            this.editForm = data;
         },

         tabRiskClick() {
            this.$refs.tabRiskRef.showAdd();
         },

         tabConditionSave() {
            this.$refs.tabConditionRef.editSubmit();
         },
         tabProductSave(){
            this.$refs.tabProductRef.editSubmit();
         },
         tabCbSave(){
            this.$refs.tabCbRef.editSubmit();
         },
         tabProjectSave(){
            this.$refs.tabProjectRef.editSubmit();
         },
         tabBaseChangeClick:function(){
            this.$refs.tabBaseRef.$refs.editForm.validate((valid) => {
               if (!valid) {
                  this.$message.error("表单验证不通过，请检查修改");
                  return;
               }else{
                   this.sendToProcessApprova(this.contractCard,"contract_change_process_approva")
               }
            }) 
           
         },
         tabBaseSigningClick:function(){ 
            this.$refs.tabBaseRef.$refs.editForm.validate((valid) => {
               if (!valid) {
                  this.$message.error("表单验证不通过，请检查修改");
                  return;
               }else{
                  this.sendToProcessApprova(this.contractCard,"contract_signing_process_approva")
               }
            }) 
             
         },
         

			sendToProcessApprova:function(row,bizKey){
				// 传过来的参数格式
				if(row.flowState=='1'){
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
					bizParentPkid:row.htId,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED',
                  htId:row.htId,
                  branchId:this.userInfo.branchId,  
					},
				}
				if(bizKey=="contract_signing_process_approva"){
					//预算变更审核
					params.mainTitle='关于合同【'+row.htName+"】签订并正式生效的申请";
					params.mainContext='合同编号：'+row.htSn+','+'合同名称：'+row.htName+',相对方名称：'+row.cpName+',合同总金额：￥'+row.htGrossAmount
										+'<br>'+row.htPartyName+'于'+row.htSignDate+'签订('+row.htSn+')：'+row.htName
										+'<br>合同重要条款：'+row.htImportantClause;
					params.restUrl=config.getOaBasePath()+"/ht/contractCard/processApprova";
					this.$router.push({name:'ProcdefListForBizStart',params:params});

				}else if(bizKey=="contract_change_process_approva"){
					//预算变更审核
               var diffMsg=this.getObjDiff();
               if(!diffMsg||diffMsg.length<=0){
                  this.$message.error("无需要审批的变更，请直接提交保存即可");
                  return;
               } 
               params.flowVars.data=this.$refs.tabBaseRef.editForm
               params.flowVars.diffMsg=diffMsg
					params.mainTitle='关于合同【'+row.htName+"】变更并正式生效的申请";
					params.mainContext='合同编号：'+row.htSn+','+'合同名称：'+row.htName+',相对方名称：'+row.cpName+',合同总金额：￥'+row.htGrossAmount
										+'<br>'+row.htPartyName+'于'+row.htSignDate+'签订('+row.htSn+')：'+row.htName
										+'<br>合同变更说明：'+diffMsg;

					params.restUrl=config.getOaBasePath()+"/ht/contractCard/processApprova";
					this.$router.push({name:'ProcdefListForBizStart',params:params});

				}else {
					this.$message.error("不支持的审批事项");
					return;
				}
				//this.$store.dispatch('addVisitedViews', {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
         //htId:'',draftId:'',cpId:'',cpName:'',linkName:'',linkPhone:'',cpAddress:'',cpOpenBank:'',cpBankAccount:'',htName:'',htSn:'',htGrossAmount:'',htKaiPiaoAmount:'',htReceivedAmount:'',htReceivableAmount:'',htPayedAmount:'',htPayableAmount:'',htFile:'',htEffectDate:'',htFzUserid:'',htFzUsername:'',htParentType:'',htType:'',htSignDate:'',htExpireDate:'',htStatus:'',htDemand:'',htParty:'',htPartyName:'',htImportantClause:'',branchId:'',createTime:'',createUserId:'',createUserName:'',cbCenterId:'',cbCenterName:'',cbCenterId:'',cbCenterName:''
         getObjDiff(){
            var from=this.$refs.tabBaseRef.contractCard;
            var to=this.$refs.tabBaseRef.editForm;
            var diffMsgs=this.objDiff(from,to)
            return diffMsgs.join("<br>");
         },
         objDiff(from,to){
            var diffMsgs=[]
           if(from.htStatus!=to.htStatus){
              var htStatusDicts=this.$refs.tabBaseRef.dicts.contractStatus;
              var fromStatus=htStatusDicts.find(i=>i.id==from.htStatus)
              var toStatus=htStatusDicts.find(i=>i.id==to.htStatus)
              diffMsgs.push("合同状态由"+fromStatus.name+"变更为"+toStatus.name);
           }
           if(from.cpName!=to.cpName){
              diffMsgs.push("相对方由"+rom.cpName+"变更为"+to.cpName);
           }
           if(from.htGrossAmount!=to.htGrossAmount){
              diffMsgs.push("合同总金额由￥"+from.htGrossAmount+"变更为￥"+to.htGrossAmount);
           }
           if(from.htName!=to.htName){
              diffMsgs.push("合同名称由"+from.htName+"变更为"+to.htName);
           }
           if(from.htFzUsername!=to.htFzUsername){
              diffMsgs.push("负责人由"+from.htFzUsername+"变更为"+to.htFzUsername);
           }
           if(from.cbCenterName!=to.cbCenterName){
              diffMsgs.push("成本中心由"+from.cbCenterName+"变更为"+to.cbCenterName);
           }
           if(from.htSignDate!=to.htSignDate){
              diffMsgs.push("签约时间由"+from.htSignDate+"变更为"+to.htSignDate);
           }
           if(from.htExpireDate!=to.htExpireDate){
              diffMsgs.push("到期时间由"+from.htExpireDate+"变更为"+to.htExpireDate);
           }
           if(from.cpBankAccount!=to.cpBankAccount){
              diffMsgs.push("相对方银行账户由"+from.cpBankAccount+"变更为"+to.cpBankAccount);
           }
           if(from.cpBankAccount!=to.cpBankAccount){
              diffMsgs.push("相对方银行账户由"+from.cpBankAccount+"变更为"+to.cpBankAccount);
           }
           if(from.linkName!=to.linkName){
              diffMsgs.push("相对方联系人由"+from.linkName+"变更为"+to.linkName);
           } 
           return diffMsgs
         }

			/**end 在上面加自定义方法**/
		},//end method
		
		components: {  
          'contract-card-edit':ContractCardEdit,
          'contract-invoice-open-mng' : ContractInvoiceOpenMng,
          'contract-invoice-receive-mng' : ContractInvoiceReceiveMng,
          'contract-receive-mng' : ContractReceiveMng,
          'contract-payment-mng' : ContractPaymentMng,
          'contract-risk-mng' : ContractRiskMng,
          ContractLogMng,
          ContractConditionMng,
          ContractCbMng,
          ContractProductMng,
          ContractProjectMng,
          TaskMng,
          ProcinstMng,

		},

		created() {
         this.editForm = Object.assign(this.editForm, this.contractCard);
		}
	}

</script>

<style scoped>

.container { 
}

ul {
    margin: 0;
    padding: 0;
}

ul li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.header {
   position: fixed;
   top:0px;
   left: 0px;
   width: 100%;
   height: 70px;
   background-color: white;
   border-bottom: 1px solid rgb(241, 241, 241);
   z-index: 999;
}

.header .left {
   height: 100%;
   width: 50px;
   margin-left: 20px;
   float: left;
}

.header .left i {
   width: 100%;
   text-align: center;
   line-height: 70px;
   font-size: 34px;
}

.header .center {
   float: left;
   height: 100%;
   margin-left: 10px;
}

.header .center .title {
   margin-top: 17px;
}

.header .center .list {
   position: absolute;
   bottom: 0px;
}

.header .center .list:hover {
	cursor: pointer;
}

.header .center .list li {
   display: inline-block;
   margin-right: 40px;
   font-size: 12px;
   height: 20px;
}

.header .right {
   float: right;
   margin-right: 20px;
   height: 100%;
}

.header .right .btn2 {
   line-height: 100px;
}

.liActive {
	border-bottom: 2px solid rgb(45, 183, 245);
}

.content {
	position: absolute; 
	width: 100%;
	top: 20px;
	overflow-y: auto; 
}

</style>

<style>
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

</style>