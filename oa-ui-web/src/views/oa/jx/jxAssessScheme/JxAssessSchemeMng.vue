<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchJxAssessSchemes" icon="el-icon-search">查询</el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		</el-row>
		<el-row class="padding-top">
			<!--列表 JxAssessScheme 考核方案-->
			<el-table ref="jxAssessSchemeTable" :data="jxAssessSchemes" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column prop="id" label="id" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="schemeType" label="所属考核方案" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planStartDay" label="计划开始天数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planStartType" label="计划开始类型（1-之前；2-之后）" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="说明" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planEndDay" label="计划结束天数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planEndType" label="计划结束类型（1-之前；2-之后）" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="branchId" label="组织机构号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planIsUseed" label="是否启动方案（1-启动；0-不启动）" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planIsRemind" label="是否提醒考核（1-提醒；0-不提醒）" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createdAt" label="创建时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updatedAt" label="更新时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="120" fixed="right">
				    <template slot="header">
                        <el-button @click="showAdd" icon="el-icon-plus" circle> </el-button>
                    </template>
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 JxAssessScheme 考核方案界面-->
			<el-drawer title="编辑考核方案" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <jx-assess-scheme-edit op-type="edit" :jx-assess-scheme="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></jx-assess-scheme-edit>
			</el-drawer>

			<!--新增 JxAssessScheme 考核方案界面-->
			<el-drawer title="新增考核方案" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<jx-assess-scheme-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></jx-assess-scheme-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listJxAssessScheme, delJxAssessScheme, batchDelJxAssessScheme } from '@/api/oa/jx/jxAssessScheme';
	import  JxAssessSchemeEdit from './JxAssessSchemeEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
		components: {
		    JxAssessSchemeEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchJxAssessSchemes()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				jxAssessSchemes: [],//查询结果
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
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增jxAssessScheme界面是否显示
				//新增jxAssessScheme界面初始化数据
				addForm: {
					id:'',schemeType:'',planStartDay:'',planStartType:'',remark:'',planEndDay:'',planEndType:'',branchId:'',status:'',remindStatus:'',createdAt:'',updatedAt:'',name:'',templateId:'',templateName:'',autoInit:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑jxAssessScheme界面初始化数据
				editForm: {
					id:'',schemeType:'',planStartDay:'',planStartType:'',remark:'',planEndDay:'',planEndType:'',branchId:'',status:'',remindStatus:'',createdAt:'',updatedAt:'',name:'',templateId:'',templateName:'',autoInit:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getJxAssessSchemes();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getJxAssessSchemes();
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
				this.getJxAssessSchemes();
			},
			searchJxAssessSchemes(){
				 this.pageInfo.count=true; 
				 this.getJxAssessSchemes();
			},
			//获取列表 JxAssessScheme 考核方案
			getJxAssessSchemes() {
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

				this.load.list = true;
				listJxAssessScheme(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.jxAssessSchemes = res.data.data;
					}else{
						this.$message({ showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 JxAssessScheme 考核方案
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 JxAssessScheme 考核方案
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getJxAssessSchemes();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行jxAssessScheme
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除jxAssessScheme
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delJxAssessScheme(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getJxAssessSchemes();
						}
						this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除jxAssessScheme
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelJxAssessScheme(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getJxAssessSchemes(); 
						}
						this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			/**begin 自定义函数请在下面加**/
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				this.searchJxAssessSchemes();
				if(this.$refs.jxAssessSchemeTable){
				    var clientRect=this.$refs.jxAssessSchemeTable.$el.getBoundingClientRect();
                    var subHeight=70/1000 * window.innerHeight;
                    this.maxTableHeight =  window.innerHeight -clientRect.y - this.$refs.jxAssessSchemeTable.$el.offsetTop-subHeight;
				}

        	});
		}
	}

</script>

<style scoped>
</style>