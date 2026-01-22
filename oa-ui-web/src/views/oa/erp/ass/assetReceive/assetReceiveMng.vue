<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-date-picker
      	v-model="filters.reqDate" class="hidden-md-and-down"
      	type="daterange"
      	align="right"
      	unlink-panels
      	range-separator="至"
      	start-placeholder="创建日期"
      	end-placeholder="创建日期"
      	value-format="yyyy-MM-dd"
      	:default-time="['00:00:00','23:59:59']"
      	:picker-options="pickerOptions">
      </el-date-picker>
			<el-input v-model="filters.key" style="width: 270px;" placeholder="按标题 申请单编号 申请人模糊查询">
        <el-button slot="append" type="primary" icon="el-icon-search" :disabled="load.list==true" v-on:click="searchAssetDetails">查询</el-button>
      </el-input>
			<el-button icon="el-icon-plus" @click="showAdd">发起申请</el-button>
      <el-button icon="el-icon-download" class="hidden-md-and-down" @click="exportData">导出</el-button>
			<el-button icon="el-icon-delete" type="danger"  class="hidden-sm-and-down" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
      <el-popover title="更多查询条件" placement="top-start" width="400" trigger="click">
        <el-row class="more-filter-item">
          <el-col :span="24">
            <font class="more-label-font">
              时间范围
            </font>
           <el-date-picker
           	v-model="filters.reqDate"
           	type="daterange"
           	align="right"
           	unlink-panels
           	range-separator="至"
           	start-placeholder="创建日期"
           	end-placeholder="创建日期"
           	value-format="yyyy-MM-dd"
           	:default-time="['00:00:00','23:59:59']"
           	:picker-options="pickerOptions">
           </el-date-picker>
          </el-col>

          <el-col :span="24" style="margin-top: 11px;">
            <el-button size="mini" type="primary" v-on:click="searchAssetDetails" icon="el-icon-search">查询</el-button>
          </el-col>

          <el-col :span="24">
            <el-divider content-position="left">其它操作</el-divider>
            <el-button size="mini"  @click="showAdd">发起申请</el-button>
            <el-button size="mini"  v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
            <el-button size="mini"  @click="exportData">导出</el-button>
          </el-col>
        </el-row>
        <el-button slot="reference" icon="el-icon-more" style="margin-left: 13px;" circle></el-button>
      </el-popover>
		</el-row>
		<el-row class="page-main padding-top">
			<!--列表 AssetDetail ass_asset_detail-->
			<el-table :height="tableHeight" ref="procdefsTable" @cell-click="cellClick" :data="assetDetails" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index"  show-overflow-tooltip></el-table-column>
				<el-table-column prop="reqTitle" label="标题"  show-overflow-tooltip></el-table-column>
				<el-table-column prop="id" label="申请单编号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="reqUsername" label="申请人"  show-overflow-tooltip></el-table-column>
				<el-table-column prop="reqDate" label="申请日期"  show-overflow-tooltip></el-table-column>
				<el-table-column prop="mngStatus" label="状态"  show-overflow-tooltip>
					<template slot-scope="scope"> 
						<el-link @click="showFlowTaskDetail(scope.row)">
						<el-tag  v-if="scope.row.bizFlowState == '0'||!scope.row.bizFlowState">未发审</el-tag>
						<el-tag  v-if="scope.row.bizFlowState == '1'">审核中</el-tag>
						<el-tag  v-if="scope.row.bizFlowState == '2'">已通过</el-tag>
						<el-tag  v-if="scope.row.bizFlowState == '5'">待领取</el-tag>
						<el-tag  v-if="scope.row.bizFlowState == '4'">已取消</el-tag>
						<el-tag  v-if="scope.row.bizFlowState == '3'">未通过</el-tag> 
            			{{scope.row.assigneeName}}&nbsp;&nbsp;{{scope.row.commentMsg}}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" fixed="right"  show-overflow-tooltip>
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" @click="sendToProcessApprova(scope.row,scope.$index)"></el-button>
						<el-button icon="el-icon-edit" @click="showEdit(scope.row,scope.$index)"></el-button>
						<el-button icon="el-icon-delete" type="danger" @click="handleDel(scope.row,scope.$index)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

			<!--编辑 AssetDetail ass_asset_detail界面-->
			<el-dialog title="编辑领用单" center :fullscreen="true" :visible.sync="editFormVisible"  @close="editClose" width="50%"  :close-on-click-modal="false">
				  <asset-receive-edit ref="assetReceive" :asset-receive="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></asset-receive-edit>
			</el-dialog>

			<!--新增 AssetDetail ass_asset_detail界面-->
			<el-dialog title="新增领用单" center :fullscreen="true" :visible.sync="addFormVisible" @close="addClose" :close-on-click-modal="false">
				<asset-receive-add ref="assetReceive" :asset-receive="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></asset-receive-add>
			</el-dialog>


			<el-dialog title="领用明细" center :fullscreen="true" :visible.sync="detailFormVisible" @close="detailClose" :close-on-click-modal="false">
				<asset-receive-detail ref="assetReceive" :asset-receive="detailForm" :visible="detailFormVisible" @cancel="detailFormVisible=false"></asset-receive-detail>
			</el-dialog> 

			<el-dialog title="新增归还单" center :fullscreen="true" :visible.sync="addFormVisible" @close="addClose" :close-on-click-modal="false">
				<asset-return-add ref="assetReturn" :asset-receive="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></asset-return-add>
			</el-dialog>
			<el-drawer fullscreen size="100%" title="任务详情" :visible.sync="flowTaskDetailVisible" :withHeader="false"
				:close-on-click-modal="false">
				<procinst-parames-execution-set v-if="tasks.length>0" :taskInfo="tasks[0]" :procDefId="tasks[0].procDefId" :procInstId="tasks[0].procInstId"
				:visible="flowTaskDetailVisible" @cancel="flowTaskDetailVisible=false" @submit="afterFlowSubmit">
				</procinst-parames-execution-set>
			</el-drawer>

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listAssetMng, delAssetMng, batchDelAssetMng} from '@/api/oa/erp/ass/assetMng';
	import assetReceiveAdd from './assetReceiveAdd';
	
	import assetReturnAdd from '../assetReturn/assetReturnAdd';
	import assetReceiveEdit from './assetReceiveEdit';
	import assetReceiveDetail from './assetReceiveDetail';
	import { mapGetters } from 'vuex'
  	import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载
    import {sendReceiveToProcessApprova} from '@/api/oa/erp/ass/assUtil';
	import {
		listAssigneeToAnyTasks
	} from "@/api/mdp/workflow/ru/task";

	import {
		listProcinst
	} from "@/api/mdp/workflow/hi/procinst";
  import config from "@/common/config"; //全局公共库

	export default {
		props:['queryScene'],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			const fromStartTime = new Date();
			const toStartTime = new Date();
			fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
			return {
				filters: {
					key: '',
					opType: '',
					reqDate:[util.formatDate(fromStartTime,'yyyy-MM-dd'),util.formatDate(toStartTime,'yyyy-MM-dd')],
				},
				pickerOptions:  util.pickerOptions,
        tableHeight:300,
				assetDetails: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				addFormVisible: false,//新增assetDetail界面是否显示
				//新增assetDetail界面初始化数据
				addForm: {
					reqTitle: '', reqUserid: '', reqUsername: '', reqDeptid: '', reqDeptName: '', reqDate: '', id: '', opType: '',
					reqReason: '', startDate: '', endDate: '', totalDay: '', maintTotalFeeAmount: '', maintIsConsumables: '',
					dispTotalOrignAmount: '', dispTotalScrapSaleAmount: '', dispAddAssets: '', inDeptId: '', inDeptName: '',
					outDeptId: '', outDeptName: '', mngStatus: ''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑assetDetail界面初始化数据
				editForm: {
					reqTitle: '', reqUserid: '', reqUsername: '', reqDeptid: '', reqDeptName: '', reqDate: '', id: '', opType: '',
					reqReason: '', startDate: '', endDate: '', totalDay: '', maintTotalFeeAmount: '', maintIsConsumables: '',
					dispTotalOrignAmount: '', dispTotalScrapSaleAmount: '', dispAddAssets: '', inDeptId: '', inDeptName: '',
					outDeptId: '', outDeptName: '',mngStatus: ''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				detailFormVisible: false, //明细界面是否显示
				detailForm: {
					reqTitle: '', reqUserid: '', reqUsername: '', reqDeptid: '', reqDeptName: '', reqDate: '', id: '', opType: '',
					reqReason: '', startDate: '', endDate: '', totalDay: '', maintTotalFeeAmount: '', maintIsConsumables: '',
					dispTotalOrignAmount: '', dispTotalScrapSaleAmount: '', dispAddAssets: '', inDeptId: '', inDeptName: '',
					outDeptId: '', outDeptName: '',mngStatus: ''
				},
				flowTaskDetailVisible:false,
				tasks:[],
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getAssetMng();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getAssetMng();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getAssetMng();
			},
			searchAssetDetails(){
				 this.pageInfo.count=true;
				 this.getAssetMng();
			},
			//获取列表 AssetDetail ass_asset_detail
			getAssetMng() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};

				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}

				if(this.filters.key!==""){
					params.reqTitle='%'+this.filters.key+'%';
				}else{
					//params.xxx=xxxxx
				}

				if(this.filters.reqDate!=null && this.filters.reqDate.length==2){
					params.reqStartDate=this.filters.reqDate[0]+" 00:00:00"
					params.reqEndDate=this.filters.reqDate[1]+" 23:59:59"
				}
				if(this.queryScene=='my'){
					params.reqUserid=this.userInfo.userid
				}

				params.opType='use';
				this.load.list = true;
				listAssetMng(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.assetDetails = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 AssetDetail ass_asset_detail
			showEdit: function ( row,index ) {
				if(row.mngStatus === 'submit'|| row.mngStatus === 'waiting'||row.mngStatus === 'permit') {
					this.$message({ message: "该单目前状态不允许修改", type: 'error' });
					return;
				}

				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 AssetDetail ass_asset_detail
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(val){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getAssetMng(); 
			},

			addClose() {
				this.$refs.assetReceive.addClose();
			},

			detailClose() {
				this.$refs.assetReceive.addClose();
			},

			editClose() {
				this.$refs.assetReceive.addClose();
			},

			afterEditSubmit(val){
				this.editFormVisible=false;
				this.getAssetMng(); 
			},
			//选择行assetDetail
			selsChange: function (sels) {
				this.sels = sels;
			},

			//删除assetDetail
			handleDel: function (row,index) {
				if(row.mngStatus === 'submit'|| row.mngStatus === 'waiting'||row.mngStatus === 'permit') {
					this.$message({ message: "该单已发布，不能删除", type: 'error' });
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id, opType: row.opType};
					delAssetMng(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getAssetMng();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},

			//批量删除assetDetail
			batchDel: function () {
				let validate = this.validateIsCanBatchDelete(this.sels);
				if(!validate) {
					this.$message({ message: "选择的数据中存在已发布的数据，不能删除", type: 'error' });
					return;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelAssetMng(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getAssetMng();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},

			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},

			/**begin 自定义函数请在下面加**/
			cellClick: function(row, column, cell, event) {
				if(column.label == '操作'||column.label=='状态') return;
				this.detailForm = Object.assign({}, row);
				this.detailFormVisible = true;
			},

			//批量删除验证
			validateIsCanBatchDelete(data) {
				let flag = true;
				data.forEach(d => {
					if(d.mngStatus === 'submit'||d.mngStatus === 'waiting'||d.mngStatus === 'permit') {
						flag = false;
						return;
					}
				})
				return flag;
			},

			/**导出数据 */
			exportData() {
				if(this.sels.length < 1) {
					this.$message.error("必须先选择一条数据");
					return;
				}
				this.sels.forEach(s => {
          if(s.mngStatus==='hold'){
            s.mngStatus='未发审';
          }else if(s.mngStatus==='submit'){
            s.mngStatus='审核中';
          }else if(s.mngStatus==='permit'){
            s.mngStatus='已通过';
          }else if(s.mngStatus==='cancel'){
            s.mngStatus='已取消';
          }else if(s.mngStatus==='reject'){
            s.mngStatus='未通过';
          }else if(s.mngStatus==='waiting'){
            s.mngStatus='待领取';
          }
				})
				this.deriveExcel(this.sels);
			},

			/**导出数据 */
            deriveExcel(resData) {
                import("@/vendor/Export2Excel").then(excel => {
                    const tHeader = [
                    "标题",
                    "申请单编号",
                    "申请人",
                    "申请日期",
                    "文档状态"
                    ];
                    const filterVal = [
                        "reqTitle",
                        "id",
                        "reqUsername",
                        "reqDate",
                        "mngStatus"
                    ];
                    const list = resData;
                    const data = this.formatJson(filterVal, list);
                    var filename = "列表数据导出";
                    if (this.formDefSelected) {
                        filename = this.formDefSelected.formName
                            ? this.formDefSelected.formName
                            : this.formDefSelected.id + "列表数据导出";
                        }
                        excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: filename,
                        autoWidth: true,
                        bookType: "xlsx"
                    });
                });
                },
			formatJson(filterVal, jsonData) {
				return jsonData.map(v =>
					filterVal.map(j => {
					if (j === "timestamp") {
						return parseTime(v[j]);
					} else {
						return v[j];
					}
					})
				);
			}, 
	  		sendToProcessApprova(row){
				  sendReceiveToProcessApprova(this,{assetMng:row});
			  },
			/**end 自定义函数请在上面加**/
			showFlowTaskDetail(row){
					if(row.bizProcInstId){
					if(row.bizFlowState=='1'){
						var params={
						procInstId:row.bizProcInstId, 
						assignee:this.userInfo.userId,
						tenantId:this.userInfo.branchId,
						}
						this.load.list=true;
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
								this.tasks = taskList; 
								this.flowTaskDetailVisible=true;
							} else {
								this.$message({showClose: true,
								message: tips.msg,
								type: "error"
								});
							}
							this.load.list = false;
							})
							.catch(() => {
							this.load.list = false;
							});
					}else{
						var params={
						procInstId:row.bizProcInstId,  
						}
						this.load.list=true;
						listProcinst(params)
							.then(res => {
							var tips = res.data.tips;
							if (tips.isOk) { 
								var taskList = res.data.data; 
								this.tasks = taskList; 
								this.flowTaskDetailVisible=true;
							} else {
								this.$message({showClose: true,
								message: tips.msg,
								type: "error"
								});
							}
							this.load.list = false;
							})
							.catch(() => {
							this.load.list = false;
							});

					}
					
					}else{

					}
					
				},
				afterFlowSubmit(){ 
					this.flowTaskDetailVisible=false;
					this.searchAssetDetails()
				},

		},//end methods
		components: {

			//在下面添加其它组件
			'asset-receive-add' : assetReceiveAdd,
			'asset-receive-detail' : assetReceiveDetail,
			'asset-receive-edit' : assetReceiveEdit,
			assetReturnAdd,ProcinstParamesExecutionSet,
		},
		mounted() {
			//默认查询领用类型的数据
			this.$nextTick(() => {
				this.getAssetMng();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
			});

		}
	}

</script>

<style scoped>

	.filters-show {
		margin-left: 20px;
		margin-top: 10px;
		margin-bottom: 0px;
	}
	.filters-label {
		font-size: 14px;
		color:black;
		font-weight: bold;
	}

</style>
