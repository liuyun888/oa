<template>
	<section class="page-container border padding">
		<el-row class="page-main padding-top">
			<!--列表 HrUserRecord hr_user_record-->
			<el-table :data="hrUserRecords" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="startTime" label="开始时间" min-width="80" >
          <template slot-scope="scope">
            {{scope.row.startTime?scope.row.startTime.substring(0,10):''}}
          </template>
        </el-table-column>
				<el-table-column prop="endTime" label="结束时间" min-width="80" >
          <template slot-scope="scope">
            {{scope.row.endTime?scope.row.endTime.substring(0,10):''}}
          </template>
        </el-table-column>
				<el-table-column prop="duty" label="职务" min-width="80" >
          <template slot-scope="scope">
            {{scope.row.duty||'无'}}
          </template>
        </el-table-column>
				<el-table-column prop="deptName" label="部门" min-width="80" >
          <template slot-scope="scope">
            {{scope.row.deptName||'无'}}
          </template>
        </el-table-column>
				<el-table-column prop="postName" label="岗位" min-width="80" >
          <template slot-scope="scope">
            {{scope.row.postName||'无'}}
          </template>
        </el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" >
          <template slot-scope="scope">
            {{scope.row.remark||'无'}}
          </template>
        </el-table-column>
				<el-table-column label="操作" width="180" fixed="right"  >
					<template slot-scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="primary" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

			<!--编辑 HrUserRecord hr_user_record界面-->
			<el-dialog title="编辑任职记录" :visible.sync="editFormVisible"  width="60%"  :close-on-click-modal="false">
				  <hr-user-record-edit :hr-user-record="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></hr-user-record-edit>
			</el-dialog>

			<!--新增 HrUserRecord hr_user_record界面-->
			<el-dialog title="新增任职记录" :visible.sync="addFormVisible"  width="60%"  :close-on-click-modal="false">
				<hr-user-record-add :hr-user-record="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></hr-user-record-add>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listHrUserRecord, delHrUserRecord, batchDelHrUserRecord } from '@/api/oa/hr/user/hrUserRecord';
	import  HrUserRecordAdd from './HrUserRecordAdd';//新增界面
	import  HrUserRecordEdit from './HrUserRecordEdit';//修改界面
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:["userid"],
		data() {
			return {
				filters: {
					key: ''
				},
				hrUserRecords: [],//查询结果
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

				addFormVisible: false,//新增hrUserRecord界面是否显示
				//新增hrUserRecord界面初始化数据
				addForm: {
					id:'',userid:'',duty:'',deptid:'',deptName:'',remark:'',startTime:'',endTime:'',postName:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑hrUserRecord界面初始化数据
				editForm: {
					id:'',userid:'',duty:'',deptid:'',deptName:'',remark:'',startTime:'',endTime:'',postName:''
				}
				/**begin 自定义属性请在下面加 请加备注**/

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getHrUserRecords();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getHrUserRecords();
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
				this.getHrUserRecords();
			},
			searchHrUserRecords(){
				 this.pageInfo.count=true;
				 this.getHrUserRecords();
			},
			//获取列表 HrUserRecord hr_user_record
			getHrUserRecords() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					userid:this.userid
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
				listHrUserRecord(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.hrUserRecords = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 HrUserRecord hr_user_record
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 HrUserRecord hr_user_record
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getHrUserRecords();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getHrUserRecords();
			},
			//选择行hrUserRecord
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除hrUserRecord
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delHrUserRecord(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getHrUserRecords();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除hrUserRecord
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelHrUserRecord(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getHrUserRecords();
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
		    'hr-user-record-add':HrUserRecordAdd,
		    'hr-user-record-edit':HrUserRecordEdit,

		    //在下面添加其它组件
		},
		mounted() {
			this.addForm.userid = this.userid;
   			this.editForm.userid = this.userid;
			this.$nextTick(() => {
				this.getHrUserRecords();
        	});
		}
	}

</script>

<style scoped>
.app-container{
	padding: 0px!important;
}
</style>
