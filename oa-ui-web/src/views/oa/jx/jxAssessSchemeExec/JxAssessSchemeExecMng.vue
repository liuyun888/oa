<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchJxAssessSchemeExecs" icon="el-icon-search">查询</el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus">创建执行计划</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		</el-row>
		<el-row class="padding-top">
			<!--列表 JxAssessSchemeExec 考核方案-->
			<el-table ref="jxAssessSchemeExecTable" :data="jxAssessSchemeExecs" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="schemeType" label="类型" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<div v-if="scope.row.schemeType=='0'">月度</div>
						<div v-if="scope.row.schemeType=='1'">季度</div>
						<div v-if="scope.row.schemeType=='2'">半年</div>
						<div v-if="scope.row.schemeType=='3'">年度</div> 
					</template>
				</el-table-column> 
				<el-table-column prop="execStatus" label="状态" min-width="80" show-overflow-tooltip> 
					 <template slot-scope="scope"> 
						  <div v-if="scope.row.status=='0'">
							<font  color="blue"> 初始  </font>
						  </div>
						  <div v-else-if="scope.row.status=='1'">
							<font  color="green"> 执行中  </font>
						  </div>
						  <div v-else-if="scope.row.status=='2'">
							<font  color="gray"> 已结束  </font> 
						  </div> 
						  <div v-else-if="scope.row.status=='3'">
							<font  color="gray"> 已暂停  </font> 
						  </div> 
						  <div v-else-if="scope.row.status=='4'">
							<font  color="gray"> 已关闭  </font> 
						  </div> 
					</template>
				</el-table-column>
 				<el-table-column   label="考核区间" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<div v-if="scope.row.schemeType=='0'">{{scope.row.year}}&nbsp;&nbsp;{{scope.row.month}}月</div>
						<div v-if="scope.row.schemeType=='1'">{{scope.row.year}}&nbsp;&nbsp;{{scope.row.quarter}}季度</div>
						<div v-if="scope.row.schemeType=='2'">{{scope.row.year}}&nbsp;&nbsp;{{scope.row.semiAnnual=='1'?'上半年':'下半年'}}</div>
						<div v-if="scope.row.schemeType=='3'">{{scope.row.year}}</div> 
					</template>
				</el-table-column>
				<el-table-column  label="自评提交时间" min-width="150" show-overflow-tooltip> 
					<template slot-scope="scope">
						 {{scope.row.startDate}}~{{scope.row.endDate}}
					</template>
				</el-table-column>
				<el-table-column prop="execUserNum" label="考核人数" min-width="80" show-overflow-tooltip></el-table-column>  
				<el-table-column prop="selfUserNum" label="自评人数" min-width="80" show-overflow-tooltip></el-table-column>  
				<el-table-column prop="reUserNum" label="复评人数" min-width="80" show-overflow-tooltip></el-table-column> 
				<el-table-column prop="vouchUserNum" label="核定人数" min-width="80" show-overflow-tooltip></el-table-column> 	 
				<el-table-column label="操作" width="180" fixed="right"> 
					<template scope="scope">
						<el-link v-if="scope.row.status=='0'" @click="startExec(scope.row)">开启</el-link> 
						<el-link v-if="scope.row.status=='1'" @click="closeExec(scope.row)">关闭</el-link>
						<el-link v-if="scope.row.status=='1'" @click="suspendExec(scope.row)">暂停</el-link>
						<el-link v-if="scope.row.status=='3'" @click="restartExec(scope.row)">启动</el-link>
						<el-link v-if="scope.row.status=='2'" @click="suspendExec(scope.row)">关闭</el-link>
						<el-link @click="batchSetJxAssessGrade(scope.row)">批量设置员工</el-link>
						<br>
						<el-button type="text" @click="showJxAssessGradeMng(scope.row,scope.$index)" icon="el-icon-search">员工列表</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 JxAssessSchemeExec 考核方案界面-->
			<el-drawer title="编辑考核执行计划" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <jx-assess-scheme-exec-edit op-type="edit" :jx-assess-scheme-exec="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></jx-assess-scheme-exec-edit>
			</el-drawer>

			<!--新增 JxAssessSchemeExec 考核方案界面-->
			<el-drawer title="新增执行计划" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<jx-assess-scheme-exec-edit op-type="add" :jx-assess-scheme="jxAssessScheme" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></jx-assess-scheme-exec-edit>
			</el-drawer>
			<el-drawer title="绩效管理" :visible.sync="gradeMngVisible"  size="100%"  append-to-body  :close-on-click-modal="false">
				<jx-assess-grade-mng :visible="gradeMngVisible" :jx-assess-scheme-exec="editForm"></jx-assess-grade-mng>
			</el-drawer>
	    </el-row>
	</section>
</template> 
<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listJxAssessSchemeExec, delJxAssessSchemeExec, batchDelJxAssessSchemeExec,batchSetJxAssessGrade,startExec,stopExec,restartExec,closeExec,suspendExec, } from '@/api/oa/jx/jxAssessSchemeExec';
	import  JxAssessSchemeExecEdit from './JxAssessSchemeExecEdit';//新增修改界面 
	
	import { mapGetters } from 'vuex'
	
	export default {
		name:'JxAssessSchemeExecMng',
		components: {
		    JxAssessSchemeExecEdit,'jx-assess-grade-mng':()=>import('../jxAssessGrade/JxAssessGradeMng')
		},
		props:['visible','jxAssessScheme'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchJxAssessSchemeExecs()
                }
            },
			'jxAssessScheme.id':function(val){
				this.searchJxAssessSchemeExecs();
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				jxAssessSchemeExecs: [],//查询结果
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
				addFormVisible: false,//新增jxAssessSchemeExec界面是否显示
				//新增jxAssessSchemeExec界面初始化数据
				addForm: {
					id:'',schemeType:'',planStartDay:'',planStartType:'',remark:'',planEndDay:'',planEndType:'',branchId:'',status:'',remindStatus:'',createdAt:'',updatedAt:'',schemeId:'',startDate:'',endDate:'',initStatus:'',execStatus:'',initDate:'',year:'',month:'',quarter:'',semiAnnual:'',annual:'',name:'',execUserNum:'',vouchUserNum:'',selfUserNum:'',reUserNum:'',templateId:'',templateName:'',autoInit:'',selfCnum:'',reCnum:'',vouchCnum:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑jxAssessSchemeExec界面初始化数据
				editForm: {
					id:'',schemeType:'',planStartDay:'',planStartType:'',remark:'',planEndDay:'',planEndType:'',branchId:'',status:'',remindStatus:'',createdAt:'',updatedAt:'',schemeId:'',startDate:'',endDate:'',initStatus:'',execStatus:'',initDate:'',year:'',month:'',quarter:'',semiAnnual:'',annual:'',name:'',execUserNum:'',vouchUserNum:'',selfUserNum:'',reUserNum:'',templateId:'',templateName:'',autoInit:'',selfCnum:'',reCnum:'',vouchCnum:''
				},
				maxTableHeight:350,
				gradeMngVisible:false,
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getJxAssessSchemeExecs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getJxAssessSchemeExecs();
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
				this.getJxAssessSchemeExecs();
			},
			searchJxAssessSchemeExecs(){
				 this.pageInfo.count=true; 
				 this.getJxAssessSchemeExecs();
			},
			//获取列表 JxAssessSchemeExec 考核方案
			getJxAssessSchemeExecs() {
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
				if(this.jxAssessScheme&&this.jxAssessScheme.id){
					params.schemeId=this.jxAssessScheme.id
				}else{
					return;
				}

				this.load.list = true;
				listJxAssessSchemeExec(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.jxAssessSchemeExecs = res.data.data;
					}else{
						this.$message({ showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 JxAssessSchemeExec 考核方案
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 JxAssessSchemeExec 考核方案
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getJxAssessSchemeExecs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行jxAssessSchemeExec
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除jxAssessSchemeExec
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delJxAssessSchemeExec(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getJxAssessSchemeExecs();
						}
						this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除jxAssessSchemeExec
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelJxAssessSchemeExec(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getJxAssessSchemeExecs(); 
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
			showJxAssessGradeMng(row){
				this.gradeMngVisible=true;
				this.editForm=row
			},
			batchSetJxAssessGrade(row){
				this.editForm=row;
				var params={
					id:this.editForm.id
				}
				this.load.edit=true;
				batchSetJxAssessGrade(params).then(res=>{
					this.load.edit=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.getJxAssessSchemeExecs();
					}
					this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			},  
			startExec(row){
				this.editForm=row;
				var params={
					id:this.editForm.id
				}
				this.load.edit=true;
				startExec(params).then(res=>{
					this.load.edit=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.getJxAssessSchemeExecs();
					}
					this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			},
			closeExec(row){
				this.editForm=row;
				var params={
					id:this.editForm.id
				}
				this.load.edit=true;
				closeExec(params).then(res=>{
					this.load.edit=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.getJxAssessSchemeExecs();
					}
					this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			},
			stopExec(row){
				this.editForm=row;
				var params={
					id:this.editForm.id
				}
				this.load.edit=true;
				stopExec(params).then(res=>{
					this.load.edit=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.getJxAssessSchemeExecs();
					}
					this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			},
			suspendExec(row){
				this.editForm=row;
				var params={
					id:this.editForm.id
				}
				this.load.edit=true;
				suspendExec(params).then(res=>{
					this.load.edit=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.getJxAssessSchemeExecs();
					}
					this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			},
			restartExec(row){
				this.editForm=row;
				var params={
					id:this.editForm.id
				}
				this.load.edit=true;
				restartExec(params).then(res=>{
					this.load.edit=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.getJxAssessSchemeExecs();
					}
					this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			}
			/**begin 自定义函数请在下面加**/
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				this.searchJxAssessSchemeExecs(); 

        	});
		}
	}

</script>

<style scoped>
</style>