import axios from '@/utils/request'

import config from '@/common/config'


import {
  listAssigneeToAnyTasks
} from "@/api/mdp/workflow/ru/task";

import {
  listProcinst
} from "@/api/mdp/workflow/hi/procinst";


export const showFlowTaskDetail = (that, row) => { 
  if (row.bizProcInstId) {
    if (row.bizFlowState == '1') {
      var params = {
        procInstId: row.bizProcInstId,
        assignee: that.userInfo.userId,
        tenantId: that.userInfo.branchId,
      }
      that.load.list = true;
      listAssigneeToAnyTasks(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            var taskList = res.data.data;
            taskList.forEach(i => {
              i.taskId = i.id;
              i.actId = i.taskDefKey;
              i.taskName = i.name;
            });
            that.tasks = taskList;
            that.flowTaskDetailVisible = true;
          } else {
            that.$message({
              showClose: true,
              message: tips.msg,
              type: "error"
            });
          }
          that.load.list = false;
        })
        .catch(() => {
          that.load.list = false;
        });
    } else {
      var params = {
        procInstId: row.bizProcInstId,
      }
      that.load.list = true;
      listProcinst(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            var taskList = res.data.data;
            that.tasks = taskList;
            that.flowTaskDetailVisible = true;
          } else {
            that.$message({
              showClose: true,
              message: tips.msg,
              type: "error"
            });
          }
          that.load.list = false;
        })
        .catch(() => {
          that.load.list = false;
        });

    }

  } else {

  }

};


export const sendReceiveToProcessApprova = (that, row) => {
  var bizKey = "asset_receive_process_approva"
  let extVars = { assetReceiveId: row.assetMng.id }
  let jsonExtVars = JSON.stringify(extVars);
  var currDomain = window.location.protocol + "//" + window.location.host;
  var fullPath = that.$route.fullPath;
  var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath + '?extVars=' + jsonExtVars
  var mainTitle = '关于【' + row.assetMng.reqTitle + '】的审批'
  var mainContext = mainTitle + ',申请部门：' + row.assetMng.reqDeptName + ",申请原因：" + row.assetMng.reqReason;

  let params = {
    mainContext: mainContext,
    mainTitle: mainTitle,
    bizKey: bizKey,
    bizUrl: bizUrl,
    restUrl: config.getOaBasePath() + "/erp/ass/assetMng/processApprova",
    extVars: extVars,
    flowVars: {
      subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
      branchId: row.assetMng.reqBranchId,
      assetMngId: row.assetMng.id
    },
  }
  let jsonParmas = encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
  that.$router.push({ path: '/mdp/workflow/re/procdef/ProcdefListForBizStart', query: { params: jsonParmas } });
};
export const sendReturnToProcessApprova = (that, row) => { 
  var bizKey = 'asset_return_process_approva';
  let extVars = { assetReceiveId: row.assetMng.id }
  let jsonExtVars = JSON.stringify(extVars);

  var currDomain = window.location.protocol + "//" + window.location.host;
  var fullPath = that.$route.fullPath;
  var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath + '?extVars=' + jsonExtVars
  var mainTitle = '关于【' + row.assetMng.reqTitle + "】的审批"
  var mainContext = mainTitle + ',所在部门：' + row.assetMng.reqDeptName + ",申请事由：" + row.assetMng.reqReason;

  let params = {
    mainContext: mainContext,
    mainTitle: mainTitle,
    bizKey: bizKey,
    bizUrl: bizUrl,
    restUrl: config.getOaBasePath() + "/erp/ass/assetMng/returnProcessApprova",
    extVars: extVars,
    flowVars: {
      subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
      branchId: row.assetMng.reqBranchId,
      assetMngId: row.assetMng.id
    },
  }
  let jsonParmas = encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
  that.$router.push({ path: '/mdp/workflow/re/procdef/ProcdefListForBizStart', query: { params: jsonParmas } });
};



export const  sendStockInToProcessApprova=(that,row)=>{
  var bizKey = 'erp_stock_in_approva';  
  let extVars = { receiptNo: row.stockIn.id }
  let jsonExtVars = JSON.stringify(extVars);

  var currDomain = window.location.protocol + "//" + window.location.host;
  var fullPath = that.$route.fullPath;
  var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath + '?extVars=' + jsonExtVars
  var mainTitle = '关于【' + row.stockIn.title + "】的审批"
  var mainContext = mainTitle + ',所在部门：' + row.stockIn.reqDeptName + ",申请事由：" + row.stockIn.reqReason;

  let params = {
    mainContext: mainContext,
    mainTitle: mainTitle,
    bizKey: bizKey,
    bizUrl: bizUrl,
    restUrl: config.getOaBasePath() + "/erp/pur/stockIn/processApprova",
    extVars: extVars,
    flowVars: {
      subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
      branchId: row.stockIn.reqBranchId,
      receiptNo: row.stockIn.id
    },
  }
  let jsonParmas = encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
  that.$router.push({ path: '/mdp/workflow/re/procdef/ProcdefListForBizStart', query: { params: jsonParmas } });
};



