<template>
	<section class="page-container border padding center">
		
		<el-row v-if="showSelect" style="margin-left: 130px">
			<el-button @click="selectConfirm">确认选择</el-button>
		</el-row>
		<el-row class="page-main padding-top">
            <!--列表 ContractInvoice ht_contract_invoice-->
            <el-table :data="contractInvoicesReceive" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
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
                <el-table-column prop="content" label="发票内容" min-width="80" >
                    <template slot-scope="scope">
                        <span class="detail" @click="gotoDetail(scope.row, scope.row.$index)">{{scope.row.content === "" ? "无" : scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="receiveDate" label="收票日期" min-width="80" ></el-table-column>
                <el-table-column prop="title" label="发票抬头" min-width="80" ></el-table-column>
                <el-table-column prop="openDate" label="发票开具日期" min-width="80" ></el-table-column>
                <el-table-column prop="amount" label="发票金额" min-width="80" ></el-table-column>
                <el-table-column prop="type" label="发票类型" min-width="80" >
                    <template slot-scope="scope">
                        <span>{{scope.type==='1'? '增值税专业发票' : '增值税普通发票'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="发票状态" min-width="80" >
                    <template slot-scope="scope">
                        <span>{{invoiceStatusArr[scope.row.status]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfoReceive.pageNum" :page-size="pageInfoReceive.pageSize"  :total="pageInfoReceive.total" style="float:right;"></el-pagination> 


		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listContractInvoiceReceive, delContractInvoiceReceive, batchDelContractInvoiceReceive, updateReceiveStatus} from '@/api/oa/ht/contractInvoiceReceive';
	import { mapGetters } from 'vuex'
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        }, 
        props: ['paymentId','htId','showSelect','conditionId'],
		watch:{
			paymentId(){ 
				this.getContractInvoicesReceive();
			},
			htId(){ 
				this.getContractInvoicesReceive();
			}, 
			conditionId(){ 
				this.getContractInvoicesReceive();
			}
		},

		data() {
			return {
				filters: {
					key: ''
				},
				contractInvoicesReceive: [],//查询结果
				pageInfoReceive:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},

				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				sels2: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addReceiveFormVisible: false,   

				//新增contractInvoice界面初始化数据
				addForm: {
					id:'',htId:'',title:'',gtaxid:'',number:'',amount:'',openDate:'',point:'',content:'',receiveDate:'',status:'',type:'',createUserId:'',createUserName:'',createUserTime:'',branchId:''
				},

				editReceiveFormVisible: false,//编辑界面是否显示
				//编辑contractInvoice界面初始化数据
				editForm: {
					id:'',htId:'',title:'',gtaxid:'',number:'',amount:'',openDate:'',point:'',content:'',receiveDate:'',status:'',type:'',createUserId:'',createUserName:'',createUserTime:'',branchId:''
				},
				//开票记录
				//发票状态
				invoiceStatusArr: ['', '已开票', '未开票', '已退票', '已废止'],
				
				dicts:{
					amountType:[],
				}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfoReceive.pageSize=pageSize; 
				this.getContractInvoicesReceive();
			},
			handleCurrentChange(pageNum) {
				this.pageInfoReceive.pageNum = pageNum;
				this.getContractInvoicesReceive();
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
					this.pageInfoReceive.orderFields=['xxx'];
					this.pageInfoReceive.orderDirs=[dir];
				}
				this.getContractInvoicesReceive();
			},

			searchContractInvoices(){
                this.pageInfoReceive.count=true; 
                this.getContractInvoicesReceive();
			},


			//获取列表 ContractInvoice ht_contract_invoice
			getContractInvoicesReceive() {
				let params = {
					pageSize: this.pageInfoReceive.pageSize,
					pageNum: this.pageInfoReceive.pageNum,
					total: this.pageInfoReceive.total,
                    count:this.pageInfoReceive.count
				};
				if(this.pageInfoReceive.orderFields!=null && this.pageInfoReceive.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfoReceive.orderFields.length;i++){ 
						orderBys.push(this.pageInfoReceive.orderFields[i]+" "+this.pageInfoReceive.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				
				if(this.paymentId){
					params.paymentId=this.paymentId
				}
				if(this.htId){
					params.htId=this.htId
				}
				
				if(this.conditionId){
					params.conditionId=this.conditionId
				}
				if(!params.paymentId && !params.htId && !params.conditionId){
					return;
				}
				this.load.list = true;
				listContractInvoiceReceive(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfoReceive.total = res.data.total;
						this.pageInfoReceive.count=false;
						this.contractInvoicesReceive = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 ContractInvoice ht_contract_invoice
			showEdit: function ( row,index ) {
                this.editReceiveFormVisible = true
                this.editForm = Object.assign({}, row);
			},

			//显示新增界面 ContractInvoice ht_contract_invoice
			showAdd: function () {
				this.addReceiveFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},

			//退票
			tuiPiao() {
                if(this.sels.length < 1) {
                    this.$message.error("当前未选中数据");
                    return
                }
                this.updateStatus2("3");
			},

			updateStatus2(status) {
				this.$confirm('是否执行该操作', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = { status: status, ids: this.sels};
					updateReceiveStatus(params).then((res) => {
						var tips=res.data.tips;
						if(tips.isOk){
							this.getContractInvoicesReceive();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				}).catch(() => {
				});
			},

			afterAddSubmit(){
                this.addReceiveFormVisible=false;
                this.pageInfoReceive.count=true;
                this.getContractInvoicesReceive();
			},

			afterEditSubmit(){
                this.editReceiveFormVisible=false;
			},

			//选择行contractInvoice
			selsChange: function (sels) {
				this.sels = sels;
			}, 

			selsChange2: function (sels) {
				this.sels2 = sels.map(res => res.id);
			}, 

			//删除contractInvoice
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delContractInvoiceReceive(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfoReceive.count=true;
							this.getContractInvoicesReceive();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除contractInvoice
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelContractInvoiceReceive(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfoReceive.count=true;
							this.getContractInvoicesReceive(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
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
			selectConfirm(){
				this.$emit("selectConfirm",this.sels)
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
		    
		    //在下面添加其它组件
		},

		created() { 
			
			initSimpleDicts('all',[ 'amountType' ]).then(res=>this.dicts=res.data.data); 
			this.$nextTick(() => {
				this.getContractInvoicesReceive();
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