<template>
  <section class="page-container border padding">
    	<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 270px;" placeholder="模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchCustomers" icon="el-icon-search">查询</el-button>
			<el-button @click="gotoAdd" icon="el-icon-plus" style="margin-right: 13px;">添加客户</el-button>
			<!-- <el-button type="primary" @click="importVisibled = true">导入</el-button> -->

      <el-badge :value="birthdayCount" class="item" style="margin-right: 13px;">
        <el-button @click="birthdayRemind" icon="el-icon-alarm-clock" >生日提醒</el-button>
      </el-badge>

			<!-- <el-button type="primary" >({{}})</el-button> -->
			<el-button icon="el-icon-alarm-clock" style="margin-right: 13px;">联系提醒</el-button>
			<!-- <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>  -->
		</el-row>

		<el-row style="margin: 0 0 0 20px">
			<el-select v-model="currentPage">
				<el-option
					v-for="item in pageOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>

			<el-select @change="getStatusChange" v-model="currentStatus">
				<el-option
					v-for="item in statusOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>

			<el-cascader @change="getIndustryChange" v-model="currentIndustry" :options="industryOptions" :show-all-levels="false" :props="{label: 'name', value: 'id'}"></el-cascader>
		</el-row>


		<el-row class="page-main padding-top">
			<!--列表 Customer crm_customer-->
			<el-col  class="leftTable" :span="leftSpan">
				<el-table :height="tableHeight"  ref="leftTable" :data="customers" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column>
					<el-table-column prop="customerName" show-overflow-tooltip label="客户名称" width="300" >
						<template slot-scope="scope">
							<span @click="showEdit(scope.row)" class="custimerName">{{scope.row.customerName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="lastContactDay" label="未联系" width="80"></el-table-column>
					<el-table-column prop="managerUserName" show-overflow-tooltip label="客户经理" min-width="80" ></el-table-column>
					<el-table-column prop="isAttention" label="关注">
						<template slot-scope="scope">
							<i @click="setAttention(scope.row)" :class="scope.row.isAttention === '0' ? 'el-icon-star-off' : 'el-icon-star-on'"></i>
						</template>
					</el-table-column>
				</el-table>

				<el-row>
					<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
				</el-row>

				<div v-show="isShowRightMenu" :style="{'top': menuTop}" class="rightMenu" @click="openRightDrawer">
				</div>
			</el-col>

			<el-col v-if="isShowRightNav" class="rightNav" :span="rightSpan">
				<right-drawer-components :isShowAll="isShowAll" :visible="isShowRightNav" :customerName="currentCustomerName" :customerManagerUserName="currentCustomerManagerUserName" :customerId="currentCustomerId"></right-drawer-components>
			</el-col>

			<!--新增客户界面-->
			<el-dialog
				title="新建客户"
				:visible.sync="createCustomerBefore"
				width="50%"
			>
				<span style="color: red;"><a>*</a>请输入客户名称,系统将查询是否具有重复客户</span>
				<el-form style="margin-top:20px" label-width="80px" :model="searchCustomerFrom">
					<el-form-item label="类型:">
						<el-select @change="changeType" v-model="searchCustomerFrom.customerTypeName" placeholder="请选择">
							<el-option
								v-for="item in customerTypeArr"
								:key="item.optionValue"
								:label="item.optionName"
								:value="{value:item.optionValue, label:item.optionName}">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="名称:">
						<el-input v-model="searchCustomerFrom.customerName"></el-input>
					</el-form-item>
				</el-form>

				<el-row>
					<el-button v-loading="load.add" @click="createCustomerSearch" style="float:right" type="primary" size="small">搜索<i class="el-icon-right"></i></el-button>
				</el-row>
			</el-dialog>

			<!--编辑 Customer crm_customer界面-->
			<!-- <div class="editDialog">
				<el-dialog :fullscreen="true" :visible.sync="editFormVisible" :close-on-click-modal="false">
					<customer-edit :customer="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></customer-edit>
				</el-dialog>
			</div> -->

			<div class="editDialog">
				<el-dialog :fullscreen="true" :visible.sync="editFormVisible" :close-on-click-modal="false">
					<customer-detail :customer="editForm" :visible="editFormVisible" @cancel="customerCancel" @submit="afterEditSubmit"></customer-detail>
				</el-dialog>
			</div>

			<!--新增 Customer crm_customer界面-->
			<el-dialog title="新建客户"  :fullscreen="true" :visible.sync="addFormVisible" :close-on-click-modal="false">
				<customer-add :customer="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></customer-add>
			</el-dialog>

			<excel-load @update:show="closeImport" :show="importVisibled"
				:header="header"
				:validator="validator"
				:upload-api="uploadApi"
				 result-type="html"
				@onSucess="importVisibled = false;"
				:download-function="downloadTemplate"
			>
			</excel-load>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listCustomer, delCustomer, batchDelCustomer, getExitCustomerCount, isAttention} from '@/api/oa/crm/customer';
	import  CustomerAdd from './CustomerAdd';//新增界面
	import  CustomerEdit from './CustomerEdit';//修改界面
	import  CustomerDetail from './CustomerDetail';//信息界面
	import { mapGetters } from 'vuex';
	import RightDrawerComponents from '../components/RightDrawerComponents';
	import { listCustomerBaseData } from '@/api/oa/crm/customerBaseData';
	import {listCustomerIndustry} from '@/api/oa/crm/customerIndustry';
	import { getContacterBirthdayCount } from '@/api/oa/crm/customerContacter';
	import ExcelLoad from '@/components/importData/excelLoad';
	import config from "@/common/config"; //全局公共库import

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				customers: [],//查询结果
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

				addFormVisible: false,//新增customer界面是否显示
				//新增customer界面初始化数据
				addForm: {
					customerId:'',customerName:'',customerCode:'',customerEngName:'',address:'',addressGps:'',zipCode:'',country:'',province:'',provinceCode:'',city:'',cityCode:'',district:'',districtCode:'',language:'', languageName: '', phone:'',fax:'',email:'',website:'',introduction:'',customerStatus:'',customerStatusName:'',customerType:'',customerTypeName:'',description:'',descriptionName:'',size:'',sizeName:'',source:'',sourceName:'',sectorId:'',sectorName:'',managerUserId:'',managerUserName:'',agentId:'',agentName:'',parentId:'',parentName:'',customerDocId:'',customerDocName:'',customerIntroductiondocId:'',customerIntroductiondocName:'',securityLevel:'', securityLevelName: '', evaluation:'',rating:'',portalStatus:'',creditAmount:'',creditTime:'',bankName:'',accountName:'',accounts:'',totalContractAmount:'',isAttention:'',createTime:'',createUserId:'',createUserName:'',updateTime:'',updateUserId:'',updateUserName:'',lastContactTime:'',branchId:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑customer界面初始化数据
				editForm: {
					customerId:'',customerName:'',customerCode:'',customerEngName:'',address:'',addressGps:'',zipCode:'',country:'',province:'',provinceCode:'',city:'',cityCode:'',district:'',districtCode:'',language:'', languageName: '', phone:'',fax:'',email:'',website:'',introduction:'',customerStatus:'',customerStatusName:'',customerType:'',customerTypeName:'',description:'',descriptionName:'',size:'',sizeName:'',source:'',sourceName:'',sectorId:'',sectorName:'',managerUserId:'',managerUserName:'',agentId:'',agentName:'',parentId:'',parentName:'',customerDocId:'',customerDocName:'',customerIntroductiondocId:'',customerIntroductiondocName:'',securityLevel:'', securityLevelName: '', evaluation:'',rating:'',portalStatus:'',creditAmount:'',creditTime:'',bankName:'',accountName:'',accounts:'',totalContractAmount:'',isAttention:'',createTime:'',createUserId:'',createUserName:'',updateTime:'',updateUserId:'',updateUserName:'',lastContactTime:'',branchId:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				//查询用户表单
				searchCustomerFrom: {
					customerType: '',
					customerTypeName: '',
					customerName: ''
				},
				//侧面抽屉
				leftSpan: 24,
				rightSpan: 9,
				//是否展示右侧内容
				isShowRightNav: false,
				createCustomerBefore: false,
				//客户类型数组
				customerTypeArr: [],

				//是否展示右侧显示的按钮
				isShowRightMenu: false,
				menuTop: "0px",

				//当前选中的客户id
				currentCustomerId: '',
				currentCustomerName: '',
				currentCustomerManagerUserName: '',

				//是否展示全部
				isShowAll: 'all',

				//当前页面
				currentPage: '我的客户',
				pageOptions: [
					{
						label: '我的客户',
						value: '我的客户',
					},
					{
						label: '全部客户',
						value: '全部客户',
					},
					{
						label: '关注客户',
						value: '关注客户',
					}
				],
				currentStatus: null,
				statusOptions: [
					{
						label: '全部状态',
						value: null
					}
				],
				currentIndustry: [null],
				industryOptions: [
					{
						name: '全部行业',
						id: null
					}
				],
				birthdayCount: 0,

				//导入数据
				importVisibled: false,
				header: [
					'123'
				],
				uploadApi: config.getExcelUploadBasePath() + "/oa/erp/ass/assetCard/importAssetCard",
        tableHeight: 300



				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
      handleClear() {
        this.searchCustomers();
      },
      searchOnEnter() {
        this.searchCustomers();
      },
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getCustomers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getCustomers();
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
				this.getCustomers();
			},
			searchCustomers(){
				 this.pageInfo.count=true;
				 this.getCustomers();
			},
			//获取列表 Customer crm_customer
			getCustomers() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
				};

				//客户状态
				params.customerStatus = this.currentStatus;
				//客户行业
				params.sectorId = this.currentIndustry[this.currentIndustry.length-1];

				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}

				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}

				this.load.list = true;
				listCustomer(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.customers = res.data.data;
						this.customers.forEach(p => {
							// p.lastContactTime
							p.lastContactDay = this.getDaysBetween(p.lastContactTime, new Date()) + "天";
						})
						console.log(this.customers, "this.customers");
						if(this.customers.length > 0) {
							this.showMenu();
							this.currentCustomerId = this.customers[0].customerId;
							this.currentCustomerName = this.customers[0].customerName;
							this.currentCustomerManagerUserName = this.customers[0].managerUserName;
						}
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			getDaysBetween(dateString1,dateString2){
				let startDate = Date.parse(dateString1);
				let endDate = Date.parse(dateString2);
				let days=Math.floor((endDate - startDate)/(1*24*60*60*1000));
				return days;
			},

			//展示右侧按钮
			showMenu() {
				this.$nextTick(() => {
					this.isShowRightMenu = true;
					this.menuTop = (this.$refs.leftTable.$el.clientHeight / 2 - 10) + "px";
				})
			},

			//显示编辑界面 Customer crm_customer
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Customer crm_customer
			showAdd: function () {
				this.isShowRightMenu = false;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getCustomers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行customer
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除customer
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { customerId: row.customerId };
					delCustomer(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getCustomers();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除customer
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelCustomer(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getCustomers();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},

			rowClick: function(row, event, column){
				this.currentCustomerId = row.customerId;
				this.currentCustomerName = row.customerName;
				this.currentCustomerManagerUserName = row.managerUserName;

				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},

			gotoAdd() {
				this.$nextTick(() => {
					this.getOption();
        		});
				this.createCustomerBefore = true
			},

			createCustomerSearch () {
				//查询当前是否存在该数据
				if(this.isNull(this.searchCustomerFrom.customerType) || this.isNull(this.searchCustomerFrom.customerTypeName)
					|| this.isNull(this.searchCustomerFrom.customerName)) {
					this.$message.error("必须先填写数据");
					return;
				}

				let params = {
					customerType: this.searchCustomerFrom.customerType,
					customerName: this.searchCustomerFrom.customerName
				}

				//查询数据
				this.load.add = true;
				getExitCustomerCount(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						if(res.data.data === 0) {
							this.addForm = Object.assign(this.addForm, this.searchCustomerFrom);
							this.createCustomerBefore = false;
							this.showAdd();
							this.clearSearchForm();
						}else {
							this.$message({ message: "当前存在该客户名称", type: 'error' });
						}
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.add = false;
				}).catch( err => this.load.add = false );
			},

			//清理查询表单
			clearSearchForm() {
				this.searchCustomerFrom = {
					customerType: '',
					customerTypeName: '',
					customerName: ''
				}
			},

			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
            },

			/**begin 自定义函数请在下面加**/
			//开启右侧抽屉
			openRightDrawer() {
				this.isShowRightNav = !this.isShowRightNav;
				this.isShowRightNav ? this.leftSpan = 15 : this.leftSpan = 24;
			},

			getOption() {
                let params = [
                    { categoryId: "all", itemCode: "customerType" },
                ];
                listOption(params).then(res => {
					this.customerTypeArr = res.data.data.customerType;
					if(this.customerTypeArr.length > 0) {
						this.customerTypeArr.forEach(item => {
							if(item.isDefault === '1') {
								this.searchCustomerFrom.customerType = item.optionValue;
								this.searchCustomerFrom.customerTypeName = item.optionName;
							}
						})
					}
                });
			},

			setAttention(row) {
				let params = {
					customerId: row.customerId,
					isAttention: row.isAttention === '0' ? '1' : '0'
				}
				isAttention(params).then(res => {
					var tips=res.data.tips;
					if(tips.isOk){
						row.isAttention = row.isAttention === '0' ? '1' : '0';
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
				})
			},

			//选择客户类型改变
			changeType(data) {
				this.searchCustomerFrom.customerType = data.value;
				this.searchCustomerFrom.customerTypeName = data.label;
			},

			customerCancel() {
				this.editFormVisible=false;
				this.getCustomers();
			},

			getStatusData() {
                let params = {
                    type: 'status'
                };
				listCustomerBaseData(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						res.data.data.forEach(param => {
							let data = {
								label: param.text,
								value: param.id
							}
							this.statusOptions.push(data);
						})
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}

				}).catch( err =>{} );
			},


			//获取分类树列表
			getTree(refresh) {
				let id='0';
				if(this.rootKey!='' && this.rootKey!=null){
					id=this.rootKey;
				}
				let params = {
					id: id
				};
 				if(refresh){
 					params.refresh=true;
 				}
				this.listLoading = true;
				listCustomerIndustry(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk==true){
						if(res.data.data.length > 0) {
							res.data.data.forEach((i, index) => {
								if(i.children.length !== 0) {
									i.children.forEach(p => {
										if(p.children.length === 0) {
											delete p.children;
										}
									})
								}else {
									delete i.children;
								}
								this.industryOptions.push(i);
							})
						}
					}else{
						this.$message({ message: tips.msg, type: 'error'});
					}
				}).catch(() => {
				});
			},

			getIndustryChange(data) {
				this.getCustomers();
			},

			getStatusChange() {
				this.getCustomers();
			},

			getContacterBirthday() {

				let params = {
					beginDay: util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss").substring(0, 8) + "01",
					endDay:  util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss").substring(0, 8) + "31",
				}

				getContacterBirthdayCount(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk==true){
						if(this.isNull(res.data.data[0].total)) {
							this.birthdayCount = 0;
						}else {
							this.birthdayCount = res.data.data[0].total;
						}

					}

				}).catch(() => {

				});
			},

			birthdayRemind() {
				//跳转
				this.$router.push({
					name: '客户生日',
				})
			},

			//导入数据
			closeImport(){
				this.importVisibled = false;
			},

			//下载模板
			downloadTemplate() {
			},

			validator(row, arr, i) {

			},

			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'customer-add':CustomerAdd,
		    'customer-edit':CustomerEdit,

			'right-drawer-components' : RightDrawerComponents,
			'customer-detail' : CustomerDetail,
			'excel-load' : ExcelLoad,
		    //在下面添加其它组件
		},

		mounted() {
			this.$nextTick(() => {
				this.getCustomers();
				this.getStatusData();
				this.getTree();
				//获取客户当前月的生日数量
				this.getContacterBirthday();

        var clientRect = this.$refs.leftTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.leftTable.$el.offsetTop - subHeight;
			});
		}
	}

</script>

<style scoped>

.app-container {
	padding-right: 20px;
  padding-bottom: 15px;
}

.el-icon-star-off, .el-icon-star-on {
	font-size: 24px;
	cursor: pointer;
	padding: 5px;
}

.el-icon-star-off {
	color: rgb(233, 233, 233);
}

.el-icon-star-on {
	color: rgb(245, 166, 35);
}

.leftTable {
	position: relative;
}

.rightMenu {
	font-size: 40px;
	color: royalblue;
	position: absolute;
	cursor: pointer;
	z-index: 2;
	right: -2px;
	height: 58px;
	padding: 10px;
	background: url('./img/show-hover.png') -2px 0px no-repeat;
}

.custimerName:hover {
	text-decoration: underline;
	color: royalblue;
	cursor: pointer !important;
}

</style>

<style>

.editDialog .el-dialog {
	width: 100%;
	height: 100%;
	-webkit-box-shadow: none !important;
	margin-top: 0 !important;
	position: relative;
	margin: 0 auto 0px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}

.editDialog .el-dialog__header {
	padding: 0;
	margin: 0;
	height: 0px;
}

.editDialog .el-dialog__body {
	padding: 0;
	margin: 0;
	height: 100%;
}







</style>
