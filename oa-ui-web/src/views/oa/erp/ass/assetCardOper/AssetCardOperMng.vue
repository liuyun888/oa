<template>
	<section class="page-container border padding">
		<el-row>

			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchAssetCardOpers" icon="el-icon-search">查询</el-button>
			<el-col style="display: contents;" >

					<el-button style="margin-left:5px" @click="switchObj" size="mini">
						<i v-show="!showTable" class="el-icon-picture-outline"></i>
						<span v-show="showTable">时间轴</span>

						<i v-show="showTable" class="el-icon-s-unfold"></i>
						<span v-show="!showTable">列表</span>
					</el-button>
				</el-col>
		</el-row>
		<el-row class="padding-top" v-if="showTable==true">
			<!--列表 AssetCardOper ass_asset_card_oper-->
			<el-table class="assetCardOperTable" ref="assetCardOperTable" :data="assetCardOpers" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cardId" label="卡片编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="assetSn" label="资产编码" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="assetStatusAfter" label="操作后资产状态" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="assetStatusBefore" label="操作前资产状态" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="assetMngId" label="单据编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="adjustStockNum" label="调整库存数量" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="allocDate" label="调拨日期" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowPsersonLiableUserid" label="新责任人" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowPsersonLiableUsername" label="新责任人名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowDeptid" label="新使用部门编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowDeptName" label="新使用部门名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowBranchId" label="新机构编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowBranchName" label="新机构名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowStoreAddress" label="新地点" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowWarehouseId" label="仓库编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowWarehouseName" label="仓库名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nowStoreAddressGps" label="新地点定位" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="residualValue" label="资产处置单-残值" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="netWorth" label="资产处置单-净值" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="premiumSale" label="资产出直单-报废变卖值" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="disposalType" label="资产处置类型" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="maintType" label="维修方式" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="maintFee" label="维修费用" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="maintOutBranchId" label="外部维修单位" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="maintOutBranchName" label="外部维修单位名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="maintOrignAmountPct" label="占原值百分比" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createDate" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="requireId" label="操作单编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="disposeRemark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
			</el-table>

		</el-row>
		<el-row v-if="showTable==false">
			<div class="leftCycle">
				<div class="top">
					<i class="el-icon-s-order"></i>
					<span>资产生命周期</span>
				</div>
				<el-row style="margin: 20px 0 40px 0">
					<el-timeline>
						<el-timeline-item
							v-for="(item, index) in assetCardOpers"
								:key="index"
								:timestamp="item.createDate"
								:color="item.color"
							>
							<h2>{{item.opTypeName}}</h2>
							<el-card class="card" style="margin-top: 10px">
								<!-- <span>申请人 :  {{item.reqUsername}}; </span> -->
								<span v-show="item.opTypeName === '入库' "> 采购日期: {{editForm.purchaseDate}} &nbsp; </span>
								<span v-show="item.opTypeName === '入库' "> 入库单价:  {{editForm.orignUnitAmount}} &nbsp;</span>
								<span v-show="item.opTypeName === '入库' "> 入库日期:  {{editForm.warehouseDate}} &nbsp;</span>
								<span v-show="item.opTypeName === '领用' "> 领用日期: {{item.allocDate}} &nbsp; </span>
								<span v-show="item.opTypeName === '领用' ">  责任人:  {{item.nowPsersonLiableUsername}} &nbsp;</span>
								<span v-show="item.opTypeName === '领用' "> 使用部门:  {{item.nowDeptName}} &nbsp; </span>
								<span v-show="item.opTypeName === '领用'
									||item.opTypeName === '归还' "> 存放地点:  {{item.nowStoreAddress}} &nbsp;</span>
								<span v-show="item.opTypeName === '归还' "> 归还日期: {{item.allocDate}} &nbsp;</span>
								<span v-show="item.opTypeName === '变更' "> 变更日期: {{item.allocDate}}; &nbsp;</span>
								<span v-show="item.opTypeName === '变更' "> 原使用部门:  {{item.oldDeptName}} &nbsp;</span>
								<span v-show="item.opTypeName === '变更' "> 现使用部门:  {{item.nowDeptName}} &nbsp;</span>
								<span v-show="item.opTypeName === '变更' "> 原责任人:  {{item.oldPsersonLiableUsername}} &nbsp;</span>
								<span v-show="item.opTypeName === '变更' "> 现责任人:  {{item.nowPsersonLiableUsername}} &nbsp;</span>
								<span v-show="item.opTypeName === '变更' "> 原存放地点: {{item.oldStoreAddress}} &nbsp;</span>
								<span v-show="item.opTypeName === '变更' "> 现存放地点:  {{item.nowStoreAddress}} &nbsp;</span>
								<span v-show="item.opTypeName === '维修' "> 外部维修单位:  {{item.maintOutBranchName}} &nbsp;</span>
								<span v-show="item.opTypeName === '维修' "> 维修费用:  {{item.maintFee}} &nbsp;</span>
								<span v-show="item.opTypeName === '维修' "> 维修起止日期:  ({{item.startDate}} 至 {{item.endDate}}) &nbsp;</span>
								<span v-show="item.opTypeName === '维修' "> 维修方式:  {{item.maintType}} &nbsp;</span>
								<span v-show="item.opTypeName === '处置' "> 处置类型:  {{disposeTupeArr[item.disposalType]}} &nbsp;</span>
								<span v-show="item.opTypeName === '处置' "> 处置原因:  {{item.disposeRemark}} &nbsp;</span>
								<span v-show="item.opTypeName === '处置' "> 原值:  {{item.orignUnitAmount}} &nbsp;</span>
								<span v-show="item.opTypeName === '处置' "> 净值:  {{item.netWorth}} &nbsp;</span>
								<span v-show="item.opTypeName === '处置' "> 报废变卖值: {{item.premiumSale}} &nbsp;</span>
								<span v-show="item.opTypeName === '盘点' "> 盘点日期: {{item.allocDate}} &nbsp;</span>
								<span v-show="item.opTypeName === '盘点' "> 原使用部门:  {{item.oldDeptName}} &nbsp;</span>
								<span v-show="item.opTypeName === '盘点' "> 现使用部门:  {{item.nowDeptName}} &nbsp;</span>
								<span v-show="item.opTypeName === '盘点' "> 原责任人:  {{item.oldPsersonLiableUsername}} &nbsp;</span>
								<span v-show="item.opTypeName === '盘点' "> 现责任人:  {{item.nowPsersonLiableUsername}} &nbsp;</span>
								<span v-show="item.opTypeName === '盘点' "> 原存放地点: {{item.oldStoreAddress}} &nbsp;</span>
								<span v-show="item.opTypeName === '盘点' "> 现存放地点:  {{item.nowStoreAddress}} &nbsp;</span>

								<span v-show="item.opTypeName === '盘盈' "> 盘盈日期: {{item.allocDate}} &nbsp;</span>
								<span v-show="item.opTypeName === '盘盈' "> 存放地点: {{item.nowStoreAddress}} &nbsp;</span>

								<p v-show="item.opTypeName !== '盘盈'"> <b> 关联申请单:  </b> <span @click="gotoDetail(item)" class="requireDan">{{item.opTypeName === '入库' ? editForm.receiptNo : item.requireId}}</span> </p>

							</el-card>
						</el-timeline-item>
					</el-timeline>
				</el-row>
			</div>
		</el-row>
		<el-row>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 AssetCardOper ass_asset_card_oper界面-->
			<el-drawer title="编辑ass_asset_card_oper" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <asset-card-oper-edit op-type="edit" :asset-card-oper="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></asset-card-oper-edit>
			</el-drawer>

			<!--新增 AssetCardOper ass_asset_card_oper界面-->
			<el-drawer title="新增ass_asset_card_oper" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<asset-card-oper-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></asset-card-oper-edit>
			</el-drawer>
        <el-dialog append-to-body title="资产领用明细" center :fullscreen="true" :visible.sync="receiveDetailFormVisible"  :close-on-click-modal="false">
			<asset-receive-detail ref="assetReceive" :asset-receive="msgForm" :visible="receiveDetailFormVisible" @cancel="receiveDetailFormVisible=false"></asset-receive-detail>
		</el-dialog>

        <el-dialog append-to-body title="资产归还明细" center :fullscreen="true" :visible.sync="returnDetailFormVisible"  :close-on-click-modal="false">
			<asset-return-detail ref="assetReturn" :asset-receive="msgForm" :visible="returnDetailFormVisible" @cancel="returnDetailFormVisible=false"></asset-return-detail>
		</el-dialog>

        <el-dialog append-to-body title="资产调拨明细" center :fullscreen="true" :visible.sync="reallocationDetailFormVisible" :close-on-click-modal="false">
			<asset-reallocation-detail ref="assetReallocation" :asset-receive="msgForm" :visible="reallocationDetailFormVisible" @cancel="reallocationDetailFormVisible=false"></asset-reallocation-detail>
		</el-dialog>

        <el-dialog append-to-body title="资产维修/保养单明细" center :fullscreen="true" :visible.sync="maintDetailFormVisible" :close-on-click-modal="false">
			<asset-maint-detail ref="assetMaint" :asset-receive="msgForm" :visible="maintDetailFormVisible" @cancel="maintDetailFormVisible=false"></asset-maint-detail>
		</el-dialog>

        <el-dialog append-to-body title="资产出租明细" center :fullscreen="true" :visible.sync="leaseDetailFormVisible"  :close-on-click-modal="false">
			<asset-lease-detail ref="assetLease" :asset-receive="msgForm" :visible="leaseDetailFormVisible" @cancel="leaseDetailFormVisible=false"></asset-lease-detail>
		</el-dialog>

        <el-dialog append-to-body title="资产处置明细" center :fullscreen="true" :visible.sync="disposeDetailFormVisible"  :close-on-click-modal="false">
			<asset-dispose-detail ref="assetDispose" :asset-receive="msgForm" :visible="disposeDetailFormVisible" @cancel="disposeDetailFormVisible=false"></asset-dispose-detail>
		</el-dialog>

        <el-dialog append-to-body title="资产变更明细" center :fullscreen="true" :visible.sync="changeDetailFormVisible" :close-on-click-modal="false">
			<asset-change-detail ref="assetChange" :asset-receive="msgForm" :visible="changeDetailFormVisible" @cancel="changeDetailFormVisible=false"></asset-change-detail>
		</el-dialog>

        <el-dialog append-to-body title="入库单明细" center :fullscreen="true"  :visible.sync="stockInDetailFormVisible"  :close-on-click-modal="false">
            <stock-in-edit ref="stockInDetail" :stock-in="msgForm" :visible="stockInDetailFormVisible" @cancel="stockInDetailFormVisible=false"></stock-in-edit>
        </el-dialog>

        <el-dialog append-to-body title="盘点明细" center :fullscreen="true" :visible.sync="panDianFormVisible"  :close-on-click-modal="false">
			<asset-inventory-detail ref="assetInventoryDetail" :asset-receive="msgForm" :visible="panDianFormVisible" @cancel="panDianFormVisible=false"></asset-inventory-detail>
		</el-dialog>

	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listAssetCardOperWithMng, delAssetCardOper, batchDelAssetCardOper } from '@/api/oa/erp/ass/assetCardOper';
	import  AssetCardOperEdit from './AssetCardOperEdit';//新增修改界面
	import { mapGetters } from 'vuex'
    import assetReceiveDetail from '../assetReceive/assetReceiveDetail';
    import assetReturnDetail from '../assetReturn/assetReturnDetail';
    import assetReallocationDetail from '../assetReallocation/assetReallocationDetail';
    import assetMaintDetail from '../assetMaint/assetMaintDetail';
    import assetLeaseDetail from '../assetLease/assetLeaseDetail';
    import assetDisposeDetail from '../assetDispose/assetDisposeDetail';
    import assetChangeDetail from '../assetChange/assetChangeDetail';
    import StockInEdit from '../../pur/stockIn/StockInEdit';
    import AssetInventoryDetail from '../assetInventory/AssetInventoryDetail';

	export default {
	    name:'assetCardOperMng',
		components: {
		    AssetCardOperEdit,
            'asset-receive-detail' : assetReceiveDetail,
            'asset-return-detail' : assetReturnDetail,
            'asset-reallocation-detail' : assetReallocationDetail,
            'asset-maint-detail' : assetMaintDetail,
            'asset-lease-detail' : assetLeaseDetail,
            'asset-dispose-detail': assetDisposeDetail,
            'asset-change-detail': assetChangeDetail,
            'stock-in-edit' :StockInEdit,
            'asset-inventory-detail'  : AssetInventoryDetail,
		},
		props:['visible','assetDetail','assetCard'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchAssetCardOpers()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				assetCardOpers: [],//查询结果
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
				dicts:{
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增assetCardOper界面是否显示
				addForm: {
					cardId:'',assetSn:'',assetStatusAfter:'',assetStatusBefore:'',assetMngId:'',adjustStockNum:'',allocDate:'',nowPsersonLiableUserid:'',nowPsersonLiableUsername:'',nowDeptid:'',nowDeptName:'',nowBranchId:'',nowBranchName:'',nowStoreAddress:'',nowWarehouseId:'',nowWarehouseName:'',nowStoreAddressGps:'',residualValue:'',netWorth:'',premiumSale:'',disposalType:'',maintType:'',maintFee:'',maintOutBranchId:'',maintOutBranchName:'',maintOrignAmountPct:'',createDate:'',id:'',requireId:'',disposeRemark:'',oldPsersonLiableUserid:'',oldPsersonLiableUsername:'',oldDeptid:'',oldDeptName:'',oldBranchId:'',oldBranchName:'',oldStoreAddress:'',oldWarehouseId:'',oldWarehouseName:'',oldStoreAddressGps:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					cardId:'',assetSn:'',assetStatusAfter:'',assetStatusBefore:'',assetMngId:'',adjustStockNum:'',allocDate:'',nowPsersonLiableUserid:'',nowPsersonLiableUsername:'',nowDeptid:'',nowDeptName:'',nowBranchId:'',nowBranchName:'',nowStoreAddress:'',nowWarehouseId:'',nowWarehouseName:'',nowStoreAddressGps:'',residualValue:'',netWorth:'',premiumSale:'',disposalType:'',maintType:'',maintFee:'',maintOutBranchId:'',maintOutBranchName:'',maintOrignAmountPct:'',createDate:'',id:'',requireId:'',disposeRemark:'',oldPsersonLiableUserid:'',oldPsersonLiableUsername:'',oldDeptid:'',oldDeptName:'',oldBranchId:'',oldBranchName:'',oldStoreAddress:'',oldWarehouseId:'',oldWarehouseName:'',oldStoreAddressGps:''
				},
				maxTableHeight:300,
				showTable:false,
                disposalType: [
                    {
                        value: 'lease',
                        label: '租用'
                    },

                    {
                        value: 'reallocation',
                        label: '调拨'
                    },

                    {
                        value: 'maint',
                        label: '维修'
                    },

                    {
                        value: 'use',
                        label: '领用'
                    },

                    {
                        value: 'return',
                        label: '归还'
                    },

                    {
                        value: 'change',
                        label: '变更'
                    },

                    {
                        value: 'dispose',
                        label: '处置'
                    },

                    {
                        value: 'inventory',
                        label: '盘点'
                    },
                ],
                disposeTupeArr: ['出让','转让', '出售', '报废', '报损', '置换', '盘亏' , '拍卖', '捐赠'],
				msgForm:{},
                receiveDetailFormVisible: false,
                returnDetailFormVisible: false,
                reallocationDetailFormVisible: false,
                maintDetailFormVisible: false,
                leaseDetailFormVisible: false,
                disposeDetailFormVisible: false,
                changeDetailFormVisible: false,
                stockInDetailFormVisible: false,
                panDianFormVisible: false,
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getAssetCardOpers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getAssetCardOpers();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[];
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}

					this.pageInfo.orderFields=[util.toLine(obj.prop)];
					this.pageInfo.orderDirs=[dir];
				}
				this.getAssetCardOpers();
			},
			searchAssetCardOpers(){
				 this.pageInfo.count=true;
				 this.getAssetCardOpers();
			},
			//获取列表 AssetCardOper ass_asset_card_oper
			getAssetCardOpers() {
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
				if(this.filters.key){
					params.key=this.filters.key
				}
				if(this.assetDetail&&this.assetDetail.id){
					params.detailId=this.detailId
				}
				if(this.assetCard && this.assetCard.cardId){
					params.cardId=this.assetCard.cardId
				}

				this.load.list = true;
				listAssetCardOperWithMng(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.assetCardOpers = res.data.data;
						this.assetCardOpers.forEach((o,index) => {
                            if(index === 0) {
                                o.color = "#66b1ff"
                            }
                            if(o.assetStatusBefore === 'profit') {
                                o.opTypeName = '盘盈';
                            }
                            if(o.assetStatusBefore === null || o.assetStatusBefore === 'null') {
                                o.opTypeName = '入库';
                            }else {
                                this.disposalType.forEach(d => {
                                    if(o.opType !== null && o.opType === d.value) o.opTypeName = d.label;
                                })
                            }

                        })
					}else{
						this.$message({ showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 AssetCardOper ass_asset_card_oper
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 AssetCardOper ass_asset_card_oper
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getAssetCardOpers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行assetCardOper
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除assetCardOper
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delAssetCardOper(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getAssetCardOpers();
						}
						this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除assetCardOper
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelAssetCardOper(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getAssetCardOpers();
						}
						this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
			    if(event.label!='操作' && event.type!='selection'){
			        this.showEdit(row)
			    }
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){
				if(this.assetDetail){
					this.editForm=Object.assign({},this.assetDetail)
				}else if(this.assetCard){
					this.editForm=Object.assign({},this.assetCard)
				}
            },
			//切换图文或列表
			switchObj() {
				this.showTable = !this.showTable;
			},

            gotoDetail(item) {
                this.msgForm = Object.assign(this.msgForm, item);
                this.msgForm.id = item.requireId;

                //打开页面
                switch(item.opType) {
                    //领用
                    case 'use':
                        this.receiveDetailFormVisible = true;
                    break;

                    //变更
                    case 'change':
                        this.changeDetailFormVisible = true;
                    break;

                    //归还
                    case 'return':
                        this.returnDetailFormVisible = true;
                    break;

                    //处置
                    case 'dispose':
                        this.disposeDetailFormVisible = true;
                    break;

                    //维修
                    case 'maint':
                        this.maintDetailFormVisible = true;
                    break;

                    //调拨
                    case 'reallocation':
                        this.reallocationDetailFormVisible = true;
                    break;

                    //出租
                    case 'lease':
                        this.leaseDetailFormVisible = true;
                    break;

                    //入库
                    case null:
                        //如果是入库，则需要查询入库表
                        let params = {
                            id: this.msgForm.requireId
                        }
                        getStockInById(params).then((res) => {
                            var tips=res.data.tips;
                            if(tips.isOk){
                                let data =res.data.data;
                                this.msgForm.isAssetCard = data.isAssetCard;
                                this.msgForm.reqDate = data.reqDate;
                                this.msgForm.reqUserid = data.reqUserid;
                                this.msgForm.reqUsername = data.reqUsername;
                                this.msgForm.title = data.title;
                                this.msgForm.cardDisByNum = data.cardDisByNum;
                                this.stockInDetailFormVisible = true;
                            }else{
                                return;
                            }
				        })

                    break;
                    case 'inventory':
                        this.panDianFormVisible = true;
                    break;
                }
            },
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				this.searchAssetCardOpers();
                var table=document.querySelector('.el-table');

                var top=util.getPositionTop(table)
                this.maxTableHeight = window.innerHeight - top -60;

        	});
		}
	}

</script>

<style scoped>

.leftCycle .top {
    margin-top: 20px;
    font-size: 14px;
}

.requireDan {
    text-decoration: underline;
    cursor: pointer;
    color: rgba(10, 69, 169, 1.0);
}

.requireDan:hover{
    color: rgba(10, 69, 169, 0.6);
}

.card span {
    line-height: 30px;
}
</style>
