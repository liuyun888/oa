<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchMeetBoardroomAppendixs">查询</el-button>
			<el-button type="primary" @click="showAdd">+meet_boardroom_appendix</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="page-main padding-top"> 
			<!--列表 MeetBoardroomAppendix meet_boardroom_appendix-->
			<el-table :data="meetBoardroomAppendixs" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="meetBoardroomId" label="会议室id" min-width="80" ></el-table-column>
				<el-table-column prop="name" label="附件名字" min-width="80" ></el-table-column>
				<el-table-column prop="addr" label="附件地址" min-width="80" ></el-table-column>
				<el-table-column prop="type" label="附件类型" min-width="80" ></el-table-column>
				<el-table-column prop="remark" label="备注说明" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="180" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 MeetBoardroomAppendix meet_boardroom_appendix界面-->
			<el-dialog title="编辑meet_boardroom_appendix" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <meet-boardroom-appendix-edit :meet-boardroom-appendix="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></meet-boardroom-appendix-edit>
			</el-dialog>
	
			<!--新增 MeetBoardroomAppendix meet_boardroom_appendix界面-->
			<el-dialog title="新增meet_boardroom_appendix" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<meet-boardroom-appendix-add :meet-boardroom-appendix="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></meet-boardroom-appendix-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listMeetBoardroomAppendix, delMeetBoardroomAppendix, batchDelMeetBoardroomAppendix } from '@/api/oa/meet/meetBoardroomAppendix';
	import  MeetBoardroomAppendixAdd from './MeetBoardroomAppendixAdd';//新增界面
	import  MeetBoardroomAppendixEdit from './MeetBoardroomAppendixEdit';//修改界面
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
				meetBoardroomAppendixs: [],//查询结果
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
				
				addFormVisible: false,//新增meetBoardroomAppendix界面是否显示
				//新增meetBoardroomAppendix界面初始化数据
				addForm: {
					id:'',meetBoardroomId:'',name:'',addr:'',type:'',remark:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑meetBoardroomAppendix界面初始化数据
				editForm: {
					id:'',meetBoardroomId:'',name:'',addr:'',type:'',remark:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getMeetBoardroomAppendixs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMeetBoardroomAppendixs();
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
				this.getMeetBoardroomAppendixs();
			},
			searchMeetBoardroomAppendixs(){
				 this.pageInfo.count=true; 
				 this.getMeetBoardroomAppendixs();
			},
			//获取列表 MeetBoardroomAppendix meet_boardroom_appendix
			getMeetBoardroomAppendixs() {
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
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listMeetBoardroomAppendix(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.meetBoardroomAppendixs = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 MeetBoardroomAppendix meet_boardroom_appendix
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MeetBoardroomAppendix meet_boardroom_appendix
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getMeetBoardroomAppendixs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行meetBoardroomAppendix
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除meetBoardroomAppendix
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delMeetBoardroomAppendix(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getMeetBoardroomAppendixs();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除meetBoardroomAppendix
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelMeetBoardroomAppendix(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getMeetBoardroomAppendixs(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'meet-boardroom-appendix-add':MeetBoardroomAppendixAdd,
		    'meet-boardroom-appendix-edit':MeetBoardroomAppendixEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getMeetBoardroomAppendixs();
        	}); 
		}
	}

</script>

<style scoped>

</style>