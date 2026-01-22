<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchOmAppliances">查询</el-button>
			<el-button type="primary" v-loading="load.config" v-on:click="handConfig" :disabled="this.sels.length===0 || load.config==true">确定</el-button>
			<el-button @click="handCancel">取消</el-button> 
		</el-row>
		<el-row class="page-main padding-top"> 

			<el-col v-show="isShowNav" class="menuNav" :span="menuSpan">
				<el-tree :data="treeData" :highlight-current='true' :props="defaultProps" :default-expand-all="true"  @node-click="handleNodeClick"></el-tree>
			</el-col>
			<el-col class="itemTable" :span="itemSpan">

				<div :style="{'top': Number(menuTop / 3 - 100) + 'px'}" class="showMenuIcon" @click="openDrawer">
				</div>

				<!--列表 OmAppliance om_appliance-->
				<el-table :data="omAppliances" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column>
					<el-table-column sortable type="index" width="40"></el-table-column>
					<!-- <el-table-column prop="id" label="主键" min-width="80" ></el-table-column> -->
					<el-table-column prop="name" label="名称" min-width="80" ></el-table-column>
					<el-table-column prop="standard" label="规格" min-width="80" ></el-table-column>
					<!-- <el-table-column prop="categoryId" label="分类id" min-width="80" ></el-table-column> -->
					<el-table-column prop="categoryName" label="分类名称" min-width="80" ></el-table-column>
					<el-table-column prop="stock" label="库存量" min-width="80" ></el-table-column>
					<el-table-column prop="imageUrl" label="用品图片" width="140">
						<template slot-scope="scope">            
							<el-popover
								placement="top-start"
								title=""
								trigger="hover">
								<img style="width: 400px; height: auto" :src="baseImageUrl + scope.row.imageUrl"/>
								<img style="width: 120px; height: 80px" slot="reference" :src="baseImageUrl + scope.row.imageUrl" :alt="baseImageUrl + scope.row.imageUrl" >
							</el-popover>  
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" min-width="80" >
						<template slot-scope="scope">
							<el-tag v-if="scope.row.status  == '1'">启用</el-tag>
							<el-tag v-else>禁用</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="unit" label="单位" min-width="80" ></el-table-column>
					<!-- <el-table-column prop="isWarn" label="是否警示" min-width="80" ></el-table-column>
					<el-table-column prop="highWarn" label="最高警示数量" min-width="80" ></el-table-column>
					<el-table-column prop="lowWarn" label="最低警示数量" min-width="80" ></el-table-column>
					<el-table-column prop="highPurchase" label="最高采购数量" min-width="80" ></el-table-column>
					<el-table-column prop="lowPurchase" label="最低采购数量" min-width="80" ></el-table-column>
					<el-table-column prop="price" label="单价" min-width="80" ></el-table-column>
					<el-table-column prop="highPrice" label="最高单价" min-width="80" ></el-table-column>
					<el-table-column prop="lowPrice" label="最低单价" min-width="80" ></el-table-column>
					<el-table-column prop="remark" label="备注" min-width="80" ></el-table-column> -->
					<!-- <el-table-column prop="branchId" label="机构号" min-width="80" ></el-table-column> -->
					<!-- <el-table-column label="操作" width="180" fixed="right"  >
						<template slot-scope="scope">
							<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
							<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
						</template>
					</el-table-column> -->
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			</el-col>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listOmAppliance, delOmAppliance, batchDelOmAppliance } from '@/api/oa/om/omAppliance';
	import { mapGetters } from 'vuex'
	import { listOmCategory } from '@/api/oa/om/omCategory';
	import config from '@/common/config'

	
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
				omAppliances: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false ,config: false},//查询中...
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
				
				baseImageUrl: config.getArcFileUploadBasePath() + '/',		
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
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
					status: '1',
					categoryId: this.categoryId
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
				}else{
					//params.xxx=xxxxx
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
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			handConfig(){
				if(this.sels.length > 1){
					this.$message({ message: "只能选择一个用品", type: 'error'});
					return true;
				}
				this.$emit("onSelectAppliance",this.sels[0])
			},
			handCancel(){
				this.$emit("cancel","")
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
						this.treeData[0].children = JSON.parse(JSON.stringify(res.data.data)) 
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch( err => this.load.list = false );
			},
			//开启右侧抽屉
			openDrawer() {
				this.isShowNav = !this.isShowNav;
				this.isShowNav ? this.itemSpan = 20 : this.itemSpan = 24;
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
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getOmCategorys();
				this.getOmAppliances();
        	}); 
		}
	}

</script>

<style scoped>

</style>