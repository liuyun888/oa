<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchOmAppliancePurchases">查询</el-button>
			<el-button @click="handConfig" :disabled="this.sels.length===0 || load.config==true" type="primary">确定</el-button>
			<el-button @click="handCnacel">取消</el-button>
		</el-row>
		<el-row class="page-main padding-top"> 
			<!--列表 OmAppliancePurchase om_appliance_purchase-->
			<el-table :data="omAppliancePurchases" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<!-- <el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="applianceId" label="用品id" min-width="80" ></el-table-column>-->
				<el-table-column prop="applianceName" label="用品名称" min-width="80" ></el-table-column>
				<el-table-column prop="standard" label="规格" min-width="80" ></el-table-column>
				<el-table-column prop="price" label="单价" min-width="80" ></el-table-column>
				<el-table-column prop="num" label="采购数量" min-width="80" ></el-table-column>
				<el-table-column prop="totalPrice" label="金额" min-width="80" ></el-table-column>
				<el-table-column prop="stock" label="库存量" min-width="80" ></el-table-column>
				<!-- <el-table-column prop="userid" label="操作人id" min-width="80" ></el-table-column> -->
				<el-table-column prop="username" label="操作人" min-width="80" ></el-table-column>
				<el-table-column prop="createTime" label="入库日期" min-width="80" ></el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" ></el-table-column>
				<!-- <el-table-column prop="supplierId" label="供应商id" min-width="80" ></el-table-column> -->
				<el-table-column prop="supplierName" label="供应商" min-width="80" ></el-table-column>
				<el-table-column prop="isStorage" label="是否入库" min-width="80" >
					<template slot-scope="scope">
						<el-tag  v-if="scope.row.isStorage == '1'">已入库</el-tag>
						<el-tag  v-else>未入库</el-tag>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="branchId" label="机构号" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="180" fixed="right"  >
					<template slot-scope="scope">
						 <el-button :disabled="scope.row.isStorage == '1'" @click="pushStorage( scope.row,scope.$index)">入库</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listOmAppliancePurchase, pushStorageOmAppliancePurchase, delOmAppliancePurchase, batchDelOmAppliancePurchase } from '@/api/oa/om/omAppliancePurchase';
	import { mapGetters } from 'vuex'

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
				omAppliancePurchases: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false, config:false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增omAppliancePurchase界面是否显示
				//新增omAppliancePurchase界面初始化数据
				addForm: {
					id:'',applianceId:'',applianceName:'',standard:'',price:'',num:'',totalPrice:'',stock:'',userid:'',username:'',createTime:'',remark:'',supplierId:'',supplierName:'',branchId:'',isStorage:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑omAppliancePurchase界面初始化数据
				editForm: {
					id:'',applianceId:'',applianceName:'',standard:'',price:'',num:'',totalPrice:'',stock:'',userid:'',username:'',createTime:'',remark:'',supplierId:'',supplierName:'',branchId:'',isStorage:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getOmAppliancePurchases();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getOmAppliancePurchases();
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
				this.getOmAppliancePurchases();
			},
			searchOmAppliancePurchases(){
				 this.pageInfo.count=true;
				 this.getOmAppliancePurchases();
			},
			//获取列表 OmAppliancePurchase om_appliance_purchase
			getOmAppliancePurchases() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					branchId: this.userInfo.branchId,
					isStorage: '2',
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key= '%' + this.filters.key + '%'
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listOmAppliancePurchase(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.omAppliancePurchases = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			//显示编辑界面 OmAppliancePurchase om_appliance_purchase
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//修改为入库
			pushStorage( row,index ){
				row.isStorage = '1'
				//console.log(row)
				this.$confirm('确认提交入库吗？', '提示', {}).then(() => {
					let params = Object.assign({}, row);
					pushStorageOmAppliancePurchase(params).then((res) => {
						var tips=res.data.tips;
						if(tips.isOk){
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( );
				});
			},
			//显示新增界面 OmAppliancePurchase om_appliance_purchase
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getOmAppliancePurchases();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行omAppliancePurchase
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除omAppliancePurchase
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delOmAppliancePurchase(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getOmAppliancePurchases();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除omAppliancePurchase
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelOmAppliancePurchase(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getOmAppliancePurchases();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			handConfig(){
				this.$emit("onPushStorage",this.sels)
			},
			handCnacel(){
				this.$emit("cancel",'')
			},

			/**end 自定义函数请在上面加**/

		},//end methods
		components: {

		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.getOmAppliancePurchases();
        	});
		}
	}

</script>

<style scoped>

</style>
