<template>
	<section>
    <el-row class="page-container border padding">
        <el-row class="page-header">
			<el-select v-model="filters.categoryId" clearable>
				<el-option :label="item.name" :value="item.id" :key="index" v-for="(item,index) in omCategorys"></el-option>
			</el-select>
          <el-input v-model="filters.key" style="width: 20%;" placeholder="名称 模糊查询" clearable
                    @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
          <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchOmAppliances" icon="el-icon-search">查询</el-button>
          <el-button @click="showAdd">+ 添加办公用品</el-button>
          <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete">批量删除</el-button>
          <el-button class="hidden-sm-and-down" @click='deriveExcel(omAppliances)' icon="el-icon-download">导出</el-button>
        </el-row>
          <el-row>
            <!--列表 OmAppliance om_appliance-->
            <el-table ref="requireTable" :height="tableHeight" :data="omAppliances" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
              <el-table-column show-overflow-tooltip sortable type="selection" width="40"></el-table-column>
              <el-table-column show-overflow-tooltip sortable type="index" width="40"></el-table-column>
              <!-- <el-table-column prop="id" label="主键" min-width="80" ></el-table-column> -->
              <el-table-column show-overflow-tooltip prop="name" label="名称" min-width="80" ></el-table-column>
              <el-table-column show-overflow-tooltip prop="standard" label="规格" min-width="80" ></el-table-column>
              <!-- <el-table-column prop="categoryId" label="分类id" min-width="80" ></el-table-column> -->
              <el-table-column show-overflow-tooltip prop="categoryName" label="分类名称" min-width="80" ></el-table-column>
              <el-table-column show-overflow-tooltip prop="stock" label="库存量" min-width="80" ></el-table-column>
              <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="80" >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status  == '1'">启用</el-tag>
                  <el-tag v-else>禁用</el-tag>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="unit" label="单位" min-width="80" ></el-table-column>
              <el-table-column show-overflow-tooltip prop="isWarn" label="是否警示" min-width="80" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.isWarn == '1'">是</span>
                  <span v-else-if="scope.row.isWarn == '0'">否</span>
                </template>
              </el-table-column>

              <!--					<el-table-column prop="highWarn" label="最高警示数量" min-width="80" ></el-table-column>-->
              <el-table-column show-overflow-tooltip prop="lowWarn" label="最低警示数量" min-width="80" ></el-table-column>
              <el-table-column show-overflow-tooltip prop="highPurchase" label="最高采购数量" min-width="80" ></el-table-column>
              <el-table-column show-overflow-tooltip prop="lowPurchase" label="最低采购数量" min-width="80" ></el-table-column>
              <el-table-column show-overflow-tooltip prop="price" label="单价" min-width="80" ></el-table-column>
              <!--					<el-table-column prop="highPrice" label="最高单价" min-width="80" ></el-table-column>
                        <el-table-column prop="lowPrice" label="最低单价" min-width="80" ></el-table-column>-->
              <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="80" ></el-table-column>
              <!-- <el-table-column prop="branchId" label="机构号" min-width="80" ></el-table-column> -->
              <el-table-column show-overflow-tooltip label="操作" width="250" fixed="right"  >
                <template slot-scope="scope">
					<el-button type="text" @click="showPurchaseList( scope.row,scope.$index)" >采购记录</el-button>
					<el-button type="text" @click="showRequireList( scope.row,scope.$index)">领用记录</el-button>
                  <el-button type="text" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
                  <el-button type="text"  @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
            </el-pagination>
    </el-row>

    <!--编辑 OmAppliance om_appliance界面-->
    <el-dialog title="编辑办公用品" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
      <om-appliance-edit :om-appliance="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></om-appliance-edit>
    </el-dialog>

    <!--新增 OmAppliance om_appliance界面-->
    <el-dialog title="新增办公用品" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
      <om-appliance-add :om-appliance="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></om-appliance-add>
    </el-dialog>

    <el-dialog title="采购记录" :visible.sync="purchaseVisible"  fullscreen  :close-on-click-modal="false">
       <om-appliance-purchase-mng :appliance-id="editForm.id"></om-appliance-purchase-mng>
    </el-dialog>

    <el-dialog title="领用记录" :visible.sync="requireVisible"  fullscreen  :close-on-click-modal="false">
       <om-appliance-require-mng :appliance-id="editForm.id"></om-appliance-require-mng>
    </el-dialog>
	</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listOmAppliance, delOmAppliance, batchDelOmAppliance } from '@/api/oa/om/omAppliance';
	import  OmApplianceAdd from './OmApplianceAdd';//新增界面
	import  OmApplianceEdit from './OmApplianceEdit';//修改界面
	import  OmAppliancePurchaseMng from '../omAppliancePurchase/OmAppliancePurchaseMng';
	import  OmApplianceRequireMng from '../omApplianceRequire/OmApplianceRequireMng';
	import { listOmCategory } from '@/api/oa/om/omCategory';
	import { mapGetters } from 'vuex'
  import config from '@/common/config';//全局公共库

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
					key: '',
					categoryId:'',
				},
				omAppliances: [],//查询结果
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

				addFormVisible: false,//新增omAppliance界面是否显示
				//新增omAppliance界面初始化数据
				addForm: {
					id:'',name:'',standard:'',categoryId:'',categoryName:'',remark:'',stock:'',status:'',unit:'',isWarn:'',highWarn:'',lowWarn:'',highPurchase:'',lowPurchase:'',price:'',highPrice:'',lowPrice:'',branchId:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑omAppliance界面初始化数据
				editForm: {
					id:'',name:'',standard:'',categoryId:'',categoryName:'',remark:'',stock:'',status:'',unit:'',isWarn:'',highWarn:'',lowWarn:'',highPurchase:'',lowPurchase:'',price:'',highPrice:'',lowPrice:'',branchId:''
				},
				/**begin 自定义属性请在下面加 请加备注**/

				//侧面抽屉
				itemSpan: 21,
				menuSpan: 3,
				//是否展示右侧内容
				isShowNav: true,
				omCategorys:[],
				purchaseVisible:false,
				requireVisible:false,
        		tableHeight: 300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
      handleClear() {
        this.searchOmAppliances();
      },
      searchOnEnter() {
        this.searchOmAppliances();
      },
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getOmAppliances();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getOmAppliances();
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
				this.getOmAppliances();
			},
			searchOmAppliances(){
				 this.pageInfo.count=true;
				 this.getOmAppliances();
			},
			//获取列表 OmAppliance om_appliance
			getOmAppliances() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					categoryId: this.categoryId,
					branchId:this.userInfo.branchId
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key='%'+this.filters.key+'%'
				}
				if(this.filters.categoryId){
					params.categoryId=this.filters.categoryId
				}
				this.load.list = true;
				listOmAppliance(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.omAppliances = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 OmAppliance om_appliance
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 OmAppliance om_appliance
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showPurchaseList(row){
				this.editForm=row
				this.purchaseVisible=true;
			},
			showRequireList(row){
				this.editForm=row
				this.requireVisible=true;
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getOmAppliances();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getOmAppliances();
			},
			//选择行omAppliance
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除omAppliance
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delOmAppliance(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getOmAppliances();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除omAppliance
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelOmAppliance(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getOmAppliances();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){

				if(event.label!='操作'&& event.type!='selection'){
					this.showEdit(row)
				}
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/

			//获取列表 OmCategory om_category
			getOmCategorys() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					branchId:this.userInfo.branchId
				};
				listOmCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.omCategorys=res.data.data
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
				}).catch( err => this.load.list = false );
			},
			//开启右侧抽屉
			openDrawer() {
				this.isShowNav = !this.isShowNav;
				this.isShowNav ? this.itemSpan = 21 : this.itemSpan = 24;
			},
			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},
			handleNodeClick(value){
				//console.log(value)
				this.categoryId = value.id
				this.$nextTick(() => {
					this.getOmAppliances();
				});
			},

			//导出
			deriveExcel(resData) {
				import("@/vendor/Export2Excel").then(excel => {
					const tHeader = [
						"主键",
						"名称",
						"规格",
						"分类名称",
						"库存",
						"状态",
						"单位",
						"是否警示",
						"最高警示数量",
						"最低警示数量",
						"最高采购数量",
						"最低采购数量",
						"最高单价",
						"最低单价",
						"备注",
					];
					const filterVal = [
						"id",
						"name",
						"standard",
						"categoryName",
						"stock",
						"status",
						"unit",
						"isWarn",
						"highWarn",
						"lowWarn",
						"highPurchase",
						"lowPurchase",
						"highPrice",
						"lowPrice",
						"remark",
					];
					const list = resData;
					const data = this.formatJson(filterVal, list);
					var filename = "用品表";
					if (this.formDefSelected) {
					filename = this.formDefSelected.formName
						? this.formDefSelected.formName
						: this.formDefSelected.id + "用品表";
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

			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'om-appliance-add':OmApplianceAdd,
		    'om-appliance-edit':OmApplianceEdit,
			OmAppliancePurchaseMng,OmApplianceRequireMng,
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.getOmCategorys();
				this.getOmAppliances();
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
