<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchMeetMeetings">查询</el-button>
			<el-button type="primary" @click="showAdd">+添加会议</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="page-main padding-top"> 

			<el-row>
				 <el-table
					:data="tableData"
					style="width: 100%">
						<el-table-column
							type="index"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							prop="date"
							label="会议室名称"
							min-width="180">
						</el-table-column>
				</el-table>
			</el-row>
			<el-row>
				<!--列表 MeetMeeting meet_meeting-->
				<el-table :data="meetMeetings" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column>
					<el-table-column sortable type="index" width="40"></el-table-column>
					<!-- <el-table-column prop="id" label="主键" min-width="80" ></el-table-column> -->
					<el-table-column prop="name" label="会议名称" min-width="80" ></el-table-column>
					<!-- <el-table-column prop="categoryId" label="会议分类id" min-width="80" ></el-table-column> -->
					<el-table-column prop="categoryName" label="会议分类" min-width="80" ></el-table-column>
					<!-- <el-table-column prop="requireUserid" label="申请人id" min-width="80" ></el-table-column>
					<el-table-column prop="requireUsername" label="申请人" min-width="80" ></el-table-column>
					<el-table-column prop="roomId" label="会议室id" min-width="80" ></el-table-column> -->
					<el-table-column prop="roomName" label="会议室名称" min-width="80" ></el-table-column>
					<!-- <el-table-column prop="customRoomName" label="自定义会议地点" min-width="80" ></el-table-column> -->
					<el-table-column prop="startTime" label="开始时间" min-width="80" ></el-table-column>
					<el-table-column prop="endTime" label="结束时间" min-width="80" ></el-table-column>
					<!--<el-table-column prop="reminders" label="提醒方式" min-width="80" ></el-table-column> 
					<el-table-column prop="remindersImmediate" label="立刻提醒" min-width="80" ></el-table-column>
					<el-table-column prop="remindersBeforeStart" label="开始前提醒" min-width="80" ></el-table-column>
					<el-table-column prop="remindersBeforeEnd" label="结束前提醒" min-width="80" ></el-table-column>
					<el-table-column prop="otherAttender" label="其他参加" min-width="80" ></el-table-column>
					<el-table-column prop="attenderNum" label="参会人数" min-width="80" ></el-table-column>
					<el-table-column prop="customerNum" label="参会客户数" min-width="80" ></el-table-column>
					<el-table-column prop="isUsingReturn" label="是否启用回执,0否1是,会议参与人手动参加回执" min-width="80" ></el-table-column>
					<el-table-column prop="isUsingSingin" label="是否启用会议签到,0否1是" min-width="80" ></el-table-column>
					<el-table-column prop="singinMode" label="签到模式：0-人员签到,1-扫码签到,2-WIFI签到" min-width="80" ></el-table-column>
					<el-table-column prop="singinUserid" label="签到模式1：签到人员,所选人员为统一签到人员！默认为会议申请人！" min-width="80" ></el-table-column>
					<el-table-column prop="singinUsername" label="签到模式1：签到人员" min-width="80" ></el-table-column>
					<el-table-column prop="singinWifi" label="签到模式2：签到WIFI" min-width="80" ></el-table-column>
					<el-table-column prop="branchId" label="归属机构" min-width="80" ></el-table-column>
					<el-table-column prop="deptId" label="单位id" min-width="80" ></el-table-column>
					<el-table-column prop="deptName" label="单位" min-width="80" ></el-table-column>
					<el-table-column prop="requireRemark" label="申请备注" min-width="80" ></el-table-column>
					<el-table-column prop="startRemark" label="会议开始备注" min-width="80" ></el-table-column>
					<el-table-column prop="createTime" label="创建时间" min-width="80" ></el-table-column> -->
					<el-table-column prop="status" label="状态" min-width="80" >
						<template slot-scope="scope">
							<el-tag v-if="scope.row.status == 0" type="primary">待审批</el-tag>
							<el-tag v-if="scope.row.status == 1" type="primary">审批中</el-tag>
							<el-tag v-if="scope.row.status == 2" type="primary">已批准</el-tag>
							<el-tag v-if="scope.row.status == 3" type="damager">已拒绝</el-tag>
							<el-tag v-if="scope.row.status == 4" type="primary">已开始</el-tag>
							<el-tag v-if="scope.row.status == 5" type="damager">已结束</el-tag>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="approveSuggestion" label="审批意见" min-width="80" ></el-table-column> -->
					<el-table-column label="操作" width="180" fixed="right"  >
						<template slot-scope="scope">
							<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
							<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
			</el-row>

			<!--编辑 MeetMeeting meet_meeting界面-->
			<el-dialog title="编辑申请" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <meet-meeting-edit :meet-meeting="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></meet-meeting-edit>
			</el-dialog>
	
			<!--新增 MeetMeeting meet_meeting界面-->
			<el-dialog title="新建申请" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<meet-meeting-add :meet-meeting="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></meet-meeting-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listMeetMeeting, delMeetMeeting, batchDelMeetMeeting } from '@/api/oa/meet/meetMeeting';
	import  MeetMeetingAdd from './MeetMeetingRequire';//新增界面
	import  MeetMeetingEdit from './MeetMeetingEdit';//修改界面
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
				meetMeetings: [],//查询结果
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
				
				addFormVisible: false,//新增meetMeeting界面是否显示
				//新增meetMeeting界面初始化数据
				addForm: {
					id:'',name:'',categoryId:'',categoryName:'',requireUserid:'',requireUsername:'',roomId:'',roomName:'',customRoomName:'',startTime:'',endTime:'',reminders:'',remindersImmediate:'',remindersBeforeStart:'',remindersBeforeEnd:'',otherAttender:'',attenderNum:'',customerNum:'',isUsingReturn:'',isUsingSingin:'',singinMode:'',singinUserid:'',singinUsername:'',singinWifi:'',branchId:'',deptId:'',deptName:'',requireRemark:'',startRemark:'',createTime:'',status:'',approveSuggestion:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑meetMeeting界面初始化数据
				editForm: {
					id:'',name:'',categoryId:'',categoryName:'',requireUserid:'',requireUsername:'',roomId:'',roomName:'',customRoomName:'',startTime:'',endTime:'',reminders:'',remindersImmediate:'',remindersBeforeStart:'',remindersBeforeEnd:'',otherAttender:'',attenderNum:'',customerNum:'',isUsingReturn:'',isUsingSingin:'',singinMode:'',singinUserid:'',singinUsername:'',singinWifi:'',branchId:'',deptId:'',deptName:'',requireRemark:'',startRemark:'',createTime:'',status:'',approveSuggestion:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				tadayArr:[]

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getMeetMeetings();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMeetMeetings();
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
				this.getMeetMeetings();
			},
			searchMeetMeetings(){
				 this.pageInfo.count=true; 
				 this.getMeetMeetings();
			},
			//获取列表 MeetMeeting meet_meeting
			getMeetMeetings() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					branchId : this.userInfo.branchId
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listMeetMeeting(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.meetMeetings = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 MeetMeeting meet_meeting
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MeetMeeting meet_meeting
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getMeetMeetings();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行meetMeeting
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除meetMeeting
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delMeetMeeting(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getMeetMeetings();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除meetMeeting
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelMeetMeeting(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getMeetMeetings(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			getToday() {
			    let date = new Date();
			    let year = date.getFullYear();
			    let month = date.getMonth() + 1;
			    let lastDay = new Date(year, month, 0).getDate();
			    let num = 0;
			
				console.log(date.getDate() + "today")
				console.log(year + 'year')
				console.log(month + 'month')
				console.log(lastDay + 'lastDay')
			
				this.tadayArr = []
			    for (let i = 1; i <= lastDay; i++) {
			        let dateStr = year + "-" + (month < 10 ? "0" + month : month);
			        if (i < 10) {
			          dateStr += "-0" + i;
			        } else {
			          dateStr += "-" + i;
			        }
					this.tadayArr.push( new Date(dateStr))
					
			        //var day = new Date(dateStr).getDay();
			        //if (day != 0 && day != 6) {
			        //  num += 1;
			        //}
			    }
				console.log(this.tadayArr)
			},
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'meet-meeting-add':MeetMeetingAdd,
		    'meet-meeting-edit':MeetMeetingEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getMeetMeetings();
        	}); 
		}
	}

</script>

<style scoped>

</style>