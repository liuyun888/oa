<template>
	<section class="page-container border padding">
		<el-row class="page-main padding-top">
			<!--列表 RcScheduleRecord rc_schedule_record-->
			<el-table :data="rcScheduleRecords" :header-cell-style="{background:'#f7fbfe'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" @row-click="rowClick" style="width: 100%;">
				<el-table-column prop="operationTime" label="操作时间" min-width="80" ></el-table-column>
				<el-table-column prop="operatorName" label="操作者" min-width="80" ></el-table-column>
				<el-table-column prop="modules" label="模块" min-width="80" ></el-table-column>
				<el-table-column prop="operationType" label="操作类型" min-width="80" ></el-table-column>
				<el-table-column prop="recordProject" label="项目" min-width="80" ></el-table-column>
				<el-table-column prop="rcTitle" label="对象" min-width="80" ></el-table-column>
				<el-table-column label="修改详情" min-width="80"  >
					<template slot-scope="scope"><el-button type="text" @click="showDetail(scope.$index,rcScheduleRecords)" >查看详情</el-button></template>
				</el-table-column>
				<el-table-column prop="operatorIp" label="客户端ip" min-width="80" ></el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
		<!-- <el-dialog :title="this.record.operationType+' - '+this.record.modules+' : '+this.record.rcTitle" :visible.sync="recordVisible" width="80%" :close-on-click-modal="false" append-to-body> -->
		<el-dialog v-if="recordVisible" :title="Title" :visible.sync="recordVisible" width="80%" :close-on-click-modal="false" append-to-body>
			<div>
				<p v-for="item in record.detailobj" :key="item">
					{{item}}
				</p>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listRcScheduleRecord } from '@/api/oa/rc/rcScheduleRecord';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
				]),
				Title(){
					// return "";
					return this.record.operationType+' - '+this.record.modules+' : '+this.record.rcTitle;
				}
		},
		props:['rcScheduleId','visible'],
		watch: {
			'rcScheduleId': function(rcScheduleId) {
				this.rcScheduleId = rcScheduleId;
				this.$nextTick(() => {
					this.getRcScheduleRecords();
				}); 
			},
			'visible': function(visible) {
				if(visible == true){
					this.$nextTick(() => {
						this.getRcScheduleRecords();
					});
				}
			},
		},
		data() {
			return {
				filters: {
					key: ''
				},
				rcScheduleRecords: [],//查询结果
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
				recordVisible: false,
				// record_detail: {},
				record: {
					id:'',operatorId:'',operatorName:'',operationTime:'',modules:'',operationType:'',recordProject:'',rcTitle:'',operatorIp:'',scheduleId:'',operationDetail: '',detailobj: {},
				},
				/**begin 自定义属性请在下面加 请加备注**/
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getRcScheduleRecords();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getRcScheduleRecords();
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
				this.getRcScheduleRecords();
			},
			searchRcScheduleRecords(){
				 this.pageInfo.count=true; 
				 this.getRcScheduleRecords();
			},
			//获取列表 RcScheduleRecord rc_schedule_record
			getRcScheduleRecords() {
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
				params.scheduleId = this.rcScheduleId;
				listRcScheduleRecord(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.rcScheduleRecords = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			showDetail(index,rcScheduleRecords){
				let detail = {};
				this.record = rcScheduleRecords[index];
				let s = JSON.parse(this.record.operationDetail);
				let n = 0;
				for(let i in s){
					// console.log(i);
					detail[n++] = "["+i+"]：\""+s[i]+"\"";
				}
				this.record.detailobj = detail;
				console.log(this.record);
				this.recordVisible = true;	
			},
			
			//选择行rcScheduleRecord
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
			 /* 
			  'rc-schedule-record-add':RcScheduleRecordAdd,
				'rc-schedule-record-edit':RcScheduleRecordEdit,
				*/
		    
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.getRcScheduleRecords();
			}); 
		}
	}

</script>

<style scoped>
.el-table{
	font-size: 14px;
}
</style>