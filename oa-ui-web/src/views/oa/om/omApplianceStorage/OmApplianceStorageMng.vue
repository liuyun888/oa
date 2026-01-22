<template>
	<section>
    <el-row class="page-container border padding">
      <el-col class="hidden-sm-and-down" :span="5">
        <el-tree :data="treeData" :highlight-current='true' :props="defaultProps" :default-expand-all="true"
                 @node-click="handleNodeClick" ref="tree"></el-tree>
      </el-col>
      <el-col :span="19">
        <el-row  class="page-header">
          <el-input v-model="filters.key" style="width: 20%;" placeholder="用品名称 模糊查询" clearable
                    @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
          <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchOmApplianceStorages" icon="el-icon-search">查询</el-button>
          <el-button v-loading="load.push" @click="pusStorage">+ 入库</el-button>
          <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete">批量删除</el-button>
        </el-row>
        <el-row>
          <!--列表 OmApplianceStorage om_appliance_storage-->
          <el-table ref="requireTable" :height="tableHeight" :data="omApplianceStorages" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
            <el-table-column show-overflow-tooltip sortable type="selection" width="40"></el-table-column>
            <el-table-column show-overflow-tooltip sortable type="index" width="40"></el-table-column>
            <el-table-column show-overflow-tooltip prop="applianceName" label="用品名称" min-width="80" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="standard" label="规格" min-width="80" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="price" label="单价" min-width="80" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="num" label="入库数量" min-width="80" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="totalPrice" label="金额" min-width="80" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="stock" label="总库存量" min-width="80" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="username" label="操作人" min-width="80" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="createTime" label="入库日期" min-width="80" ></el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="80" ></el-table-column>
            <!-- <el-table-column prop="supplierId" label="供应商id" min-width="80" ></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="supplierName" label="供应商" min-width="80" ></el-table-column>
            <!-- <el-table-column prop="branchId" label="机构号" min-width="80" ></el-table-column> -->
            <el-table-column show-overflow-tooltip label="操作" width="80" fixed="right"  >
              <template slot-scope="scope">
                <!-- <el-button  @click="showEdit( scope.row,scope.$index)">改</el-button> -->
                <el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
        </el-row>
      </el-col>
    </el-row>

			<el-dialog title="待入库的商品" :visible.sync="pushStorageVisible"  width="60%"  :close-on-click-modal="false">
				<om-appliance-purchase-components v-if="pushStorageVisible" @onPushStorage='onPushStorage'  @cancel="pushStorageVisible=false" ></om-appliance-purchase-components>
			</el-dialog>

			<!--编辑 OmApplianceStorage om_appliance_storage界面-->
			<el-dialog title="编辑入库" :visible.sync="editFormVisible"  width="60%"  :close-on-click-modal="false">
				  <om-appliance-storage-edit :om-appliance-storage="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></om-appliance-storage-edit>
			</el-dialog>

			<!--新增 OmApplianceStorage om_appliance_storage界面-->
			<el-dialog title="入库商品" :visible.sync="addFormVisible"  width="60%"  :close-on-click-modal="false">
				<om-appliance-storage-add :om-appliance-storage="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></om-appliance-storage-add>
			</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listOmApplianceStorage, delOmApplianceStorage, batchDelOmApplianceStorage } from '@/api/oa/om/omApplianceStorage';
	import  OmApplianceStorageAdd from './OmApplianceStorageAdd';//新增界面
	import  OmApplianceStorageEdit from './OmApplianceStorageEdit';//修改界面
	import 	OmAppliancePurchaseComponents from '../components/OmAppliancePurchaseComponents';
	import { batPushStorageOmAppliancePurchase } from '@/api/oa/om/omAppliancePurchase';
	import { mapGetters } from 'vuex'
	import { getAllOmAppliance } from '@/api/oa/om/omCategory';

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			'menuTop': function(){
				return screen.height
			},
		},
		data() {
			return {
				filters: {
					key: ''
				},
				omApplianceStorages: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false, push:false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增omApplianceStorage界面是否显示
				//新增omApplianceStorage界面初始化数据
				addForm: {
					id:'',applianceId:'',applianceName:'',standard:'',price:'',num:'',totalPrice:'',stock:'',userid:'',username:'',createTime:'',remark:'',supplierId:'',supplierName:'',branchId:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑omApplianceStorage界面初始化数据
				editForm: {
					id:'',applianceId:'',applianceName:'',standard:'',price:'',num:'',totalPrice:'',stock:'',userid:'',username:'',createTime:'',remark:'',supplierId:'',supplierName:'',branchId:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				pushStorageVisible:false,

				//侧面抽屉
				itemSpan: 20,
				menuSpan: 4,
				//是否展示右侧内容
				isShowNav: true,
				//事项分类的id
				categoryId:'',
				treeData: [{
                    name: '默认分类',
                    children: []
                }],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
				applianceId : '',
        tableHeight: 300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
      handleClear() {
        this.searchOmApplianceStorages();
      },
      searchOnEnter() {
        this.searchOmApplianceStorages();
      },
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getOmApplianceStorages();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getOmApplianceStorages();
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
				this.getOmApplianceStorages();
			},
			searchOmApplianceStorages(){
				 this.pageInfo.count=true;
				 this.getOmApplianceStorages();
			},
			//获取列表 OmApplianceStorage om_appliance_storage
			getOmApplianceStorages() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					branchId:this.userInfo.branchId,
					categoryId: this.categoryId,
					applianceId:this.applianceId
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
				listOmApplianceStorage(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.omApplianceStorages = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 OmApplianceStorage om_appliance_storage
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 OmApplianceStorage om_appliance_storage
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getOmApplianceStorages();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行omApplianceStorage
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除omApplianceStorage
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delOmApplianceStorage(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getOmApplianceStorages();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除omApplianceStorage
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelOmApplianceStorage(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getOmApplianceStorages();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){

				if(event.label!='操作'&& event.type!='selection'&& event.label!='状态'){
					this.showEdit(row)
				}
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			pusStorage(){
				this.pushStorageVisible = true;
			},
			onPushStorage(sels){
				//console.log(sels)
				this.pushStorageVisible = false;
				//入库
				this.load.push=true;
				batPushStorageOmAppliancePurchase(sels).then((res) => {
					this.load.push=false;
					var tips=res.data.tips;
					if( tips.isOk ){
						this.getOmApplianceStorages();
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
				}).catch( err  => this.load.push=false );
			},
			openDrawer() {
				this.isShowNav = !this.isShowNav;
				this.isShowNav ? this.itemSpan = 20 : this.itemSpan = 24;
			},
			handleNodeClick(value){
				this.applianceId = ''
				this.categoryId = ''
				if(value.id != null){
					this.applianceId = value.id
					this.$nextTick(() => {
						this.getOmApplianceStorages();
					});
				}else{
					this.categoryId = value.categoryId
					this.$nextTick(() => {
						this.getOmApplianceStorages();
					});
				}
			},
			getAllOmAppliance(){
				let params = {
					branchId: this.userInfo.branchId,
				};
				getAllOmAppliance(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.treeData = res.data.data;
						//console.log(res.data.data)
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
				}).catch( err => this.getAllOmAppliance() );
			},

			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'om-appliance-storage-add':OmApplianceStorageAdd,
			'om-appliance-storage-edit':OmApplianceStorageEdit,
			'om-appliance-purchase-components':OmAppliancePurchaseComponents,

		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.getAllOmAppliance();
				this.getOmApplianceStorages();
        var clientRect = this.$refs.requireTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.requireTable.$el.offsetTop - subHeight;
        	});
		}
	}

</script>

<style scoped>

.itemTable {
	position: relative;
}
.showMenuIcon {
	font-size: 40px;
	/* color: royalblue; */
	position: absolute;
	cursor: pointer;
	left: -15px;
	height: 58px;
	padding: 10px;
	background: url('../../../../assets/image/show-drawer.png') -2px 0px no-repeat;
}

</style>
