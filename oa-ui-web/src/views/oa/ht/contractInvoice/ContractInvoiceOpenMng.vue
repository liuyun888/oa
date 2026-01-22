<template>
	<section class="page-container border padding">
		<el-row  class="page-main padding-top"> 
            <!--列表 ContractInvoice ht_contract_invoice-->
            <el-table class="contractInvoiceOpen" :data="contractInvoicesOpen" @sort-change="sortChange2" :height="tableHeight" highlight-current-row v-loading="load.list" border @selection-change="selsChange2" @row-click="rowClick" style="width: 100%;">
                <el-table-column sortable type="selection" width="40"></el-table-column>
            <el-table-column prop="htName"  label="合同名称" min-width="120"> 
              <template slot-scope="scope">
                <span class="detail" @click="gotoDetail(scope.row, scope.row.$index)">
                  {{scope.row.htName}}
                </span>
              </template>
            </el-table-column>
			<el-table-column prop="conditionType" label="款项" min-width="150" >
				<template slot-scope="scope">
					<span class="detail" @click="gotoDetail(scope.row)">
					<el-tag v-if="scope.row.conditionStatus=='0'||scope.row.conditionStatus==''||scope.row.conditionStatus==null" type="primary">{{getConditionStatusName(scope.row)}}</el-tag>
					<el-tag v-else-if="scope.row.conditionStatus=='1'" type="warning">{{getConditionStatusName(scope.row)}}</el-tag>
					<el-tag v-else-if="scope.row.conditionStatus=='2'" type="success">{{getConditionStatusName(scope.row)}}</el-tag>
					<el-tag v-else type="info">{{getConditionStatusName(scope.row)}}</el-tag>
					&nbsp;&nbsp;<font color="#F00">{{getConditionTypeName(scope.row)}}</font>
					<br>{{scope.row.conditionTiaoJian}}</span>
				</template>
			</el-table-column> 
            <el-table-column prop="conditionAmount" label="款项金额" min-width="80" >
              <template slot-scope="scope">
                ￥{{scope.row.conditionAmount}}
              </template>
            </el-table-column>  
            <el-table-column prop="amount" show-overflow-tooltip label="开票金额" min-width="80"> 
              <template slot-scope="scope">
                ￥{{scope.row.amount}}
              </template>
			</el-table-column>
            <el-table-column label="发票状态" show-overflow-tooltip min-width="80">
              <template slot-scope="scope">
                <span>{{invoiceStatusArr[scope.row.invoiceStatus]}}</span>
              </template>
            </el-table-column>

            <el-table-column label="发票编号" show-overflow-tooltip min-width="80">
              <template slot-scope="scope">
                <span class="detail"
                  @click="gotoDetail(scope.row, scope.row.$index)">{{scope.row.number === "" ? "无" : scope.row.number}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="title" show-overflow-tooltip label="发票抬头" min-width="80"></el-table-column>
            <el-table-column prop="cpName" show-overflow-tooltip label="相对方" min-width="80"></el-table-column>
            
            <el-table-column prop="point" show-overflow-tooltip label="票点(%)" min-width="80"></el-table-column>
            <el-table-column prop="openDate" show-overflow-tooltip label="开票时间" min-width="80"></el-table-column>
            <el-table-column prop="expressNumber" show-overflow-tooltip label="快递单号" min-width="80"></el-table-column> 
            </el-table>
            <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange2" @size-change="handleSizeChange2" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfoOpen.pageNum" :page-size="pageInfoOpen.pageSize"  :total="pageInfoOpen.total" style="float:right;"></el-pagination> 

			<!--编辑 ContractInvoice ht_contract_invoice界面-->
            <el-dialog custom-class="cDialog" append-to-body  :visible.sync="addOpenFormVisible" :fullscreen="true" :close-on-click-modal="false">
                <contract-invoice-open-add :contract-card="contractCard" :contract-invoice="addOpenForm" :visible="addOpenFormVisible" @cancel="addOpenFormVisible=false" @submit="afterAddSubmit"></contract-invoice-open-add>
            </el-dialog>

            <el-dialog custom-class="cDialog" append-to-body :visible.sync="editOpenFormVisible"  :fullscreen="true"  :close-on-click-modal="false">
                <contract-invoice-open-edit :contract-invoice="editOpenForm" :visible="editOpenFormVisible" @cancel="editOpenFormVisible=false" @submit="afterEditSubmit"></contract-invoice-open-edit>
            </el-dialog>
            
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listContractInvoiceOpen, delContractInvoiceOpen, batchDelContractInvoiceOpen, updateOpenStatus} from '@/api/oa/ht/contractInvoiceOpen';
	import ContractInvoiceOpenAdd from './ContractInvoiceOpenAdd';//新增开票
	import ContractInvoiceOpenEdit from './ContractInvoiceOpenEdit';//新增开票
	import { mapGetters } from 'vuex'
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },
        props: ['contractCard'],

		data() {
			return {
				filters: {
					key: ''
				},
				contractInvoicesOpen: [],
				pageInfoOpen:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},

				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels2: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				statusArr: ['', '未付款', '已付款', '已退票'],
	
				/**begin 自定义属性请在下面加 请加备注**/
				addOpenFormVisible: false,//新增contractInvoice界面是否显示
				addOpenForm: {
					id:'',htId:'',requireId:'',cpId:'', cpName: '', number: '', requireName:'',title:'',gtaxid:'',amount:'',point:'',content:'',type:'',status:'',invoiceStatus:'',returnDate:'',openDate:'',relationWay:'',expressNumber:'',address:'',signDate:'',signPeople:'',htNumber:'',createUserId:'',createUserName:'',createTime:'',branchId:''
				},
				editOpenFormVisible: false,//编辑界面是否显示
				//编辑contractInvoice界面初始化数据
				editOpenForm: {
					id:'',htId:'',requireId:'',cpId:'', cpName: '', number: '', requireName:'',title:'',gtaxid:'',amount:'',point:'',content:'',type:'',status:'',invoiceStatus:'',returnDate:'',openDate:'',relationWay:'',expressNumber:'',address:'',signDate:'',signPeople:'',htNumber:'',createUserId:'',createUserName:'',createTime:'',branchId:''
				},
				//开票记录
				//发票状态
				invoiceStatusArr: ['', '已开票', '未开票', '已退票', '已废止'],
				dicts:{
					amountType:[],
				},
				tableHeight:500,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 

			handleSizeChange2(pageSize) { 
				this.pageInfoOpen.pageSize=pageSize; 
				this.getContractInvoicesOpen();
			},
			handleCurrentChange2(pageNum) {
				this.pageInfoOpen.pageNum = pageNum;
				this.getContractInvoicesOpen();
			},

			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange2( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfoOpen.orderFields=['xxx'];
					this.pageInfoOpen.orderDirs=[dir];
				}
				this.getContractInvoicesOpen();
			},

			getContractInvoicesOpen() {
				let params = {
					pageSize: this.pageInfoOpen.pageSize,
					pageNum: this.pageInfoOpen.pageNum,
					total: this.pageInfoOpen.total,
                    count:this.pageInfoOpen.count,
                    htId: this.contractCard.htId
				};
				if(this.pageInfoOpen.orderFields!=null && this.pageInfoOpen.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfoOpen.orderFields.length;i++){ 
						orderBys.push(this.pageInfoOpen.orderFields[i]+" "+this.pageInfoOpen.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listContractInvoiceOpen(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfoOpen.total = res.data.total;
						this.pageInfoOpen.count=false;
						this.contractInvoicesOpen = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},


			//显示编辑界面 ContractInvoice ht_contract_invoice
			showEdit: function ( row,index ) {
                this.editOpenFormVisible = true;
                this.editOpenForm = Object.assign({}, row);
			},

			//显示新增界面 ContractInvoice ht_contract_invoice
			showAdd: function () {
				this.addOpenFormVisible = true;
			},

			//退票
			tuiPiao() {
				if(this.sels2.length < 1) {
					this.$message.error("当前未选中数据");
					return
				}
				//修改开票状态
				this.updateStatus("3");
			},

			//废止
			feiZhi() {
				if(this.sels2.length < 1) {
					this.$message.error("当前未选中数据");
					return
				}
				//修改开票状态
				this.updateStatus("4");	
			},

			updateStatus(status) {
				this.$confirm('是否执行该操作', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = { invoiceStatus: status, ids: this.sels2};
					updateOpenStatus(params).then((res) => {
						var tips=res.data.tips;
						if(tips.isOk){
							this.getContractInvoicesOpen();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				}).catch(() => {
				});
			},

			afterAddSubmit(){
                this.addOpenFormVisible=false;
                this.pageInfoOpen.count=true;
                this.getContractInvoicesOpen();
			},

			afterEditSubmit(){
				if(this.activeName === 'first') {
					this.editReceiveFormVisible=false;
				}else {
					this.editOpenFormVisible=false;
				}

			},

			//选择行contractInvoice
			selsChange: function (sels) {
				this.sels = sels.map(res => res.id);
			}, 

			selsChange2: function (sels) {
				this.sels2 = sels.map(res => res.id);
			}, 

			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
			gotoDetail(row, index) {
				this.showEdit(row, index);
			},

			handleClick() {

			}, 
			getConditionTypeName(row){
				var amountType=this.dicts.amountType.find(i=>i.id==row.conditionType);
				if(amountType){
					return amountType.name
				}else{
					return row.conditionType
				}
			},
			getConditionStatusName(row){
				if(row.dct=='1'){
					if(row.conditionStatus=='0'){
						return "初始"
					}else if(row.conditionStatus=='1'){
						return "待收款"
					}else{
						return "已收款"
					}
				}else{
					if(row.conditionStatus=='0'){
						return "初始"
					}else if(row.conditionStatus=='1'){
						return "待付款"
					}else{
						return "已付款"
					}
				} 
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods

		components: {
			'contract-invoice-open-add': ContractInvoiceOpenAdd,
			'contract-invoice-open-edit':ContractInvoiceOpenEdit,
		    
		    //在下面添加其它组件
		},

		mounted() { 
			initSimpleDicts('all',[ 'amountType' ]).then(res=>this.dicts=res.data.data); 
			this.$nextTick(() => {
				var table=document.querySelector('.contractInvoiceOpen');
				var top=util.getPositionTop(table)
				this.tableHeight = window.innerHeight - top -60;
				this.getContractInvoicesOpen();
        	}); 
		}
	}

</script>

<style scoped>
.detail:hover {
	text-decoration: underline;
	color: royalblue;
	cursor: pointer !important;
}
</style>

<style>

.cDialog .el-dialog {
	width: 100%;
	height: 100%;
	-webkit-box-shadow: none !important;
	margin-top: 0 !important;
	position: relative;
	margin: 0 auto 0px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

.cDialog .el-dialog__header {
	padding: 0;
	margin: 0;
	height: 0px;
}

.cDialog .el-dialog__body {
	padding: 0;
	margin: 0;
	height: 100%;
	border: 1px solid #dcdfe6;
	border-bottom: 1px solid #dcdfe6;
}


</style>