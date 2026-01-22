<template>
   <section>
		<el-row class="page-container border padding"> <el-form :model="param" label-width="100px" :rules="paramRules" ref="param">
                <el-row>
					<el-col :span="12">
						<el-form-item label="任务名称" prop="name">
							<el-input v-model="param.name" placeholder="事项名称" ></el-input>
						</el-form-item> 
					</el-col>
                    <el-col :span="12">
						<el-form-item label="督办字号" prop="dubanId">
							<el-input v-model="param.dubanId" placeholder="督办字号" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>
				<el-row>
                    <el-col :span="12">
						<el-form-item style="display:none" label="责任人id" prop="dutyId">
							<el-input v-model="param.dutyId" placeholder="责任人id" ></el-input>
						</el-form-item> 
						<el-form-item label="责任人" prop="dutyName">
							<el-input v-model="param.dutyName" placeholder="责任人" >
								<el-button slot="append" @click="openSelectUser('item','dutyName')" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="12">
						<el-form-item style="display:none" label="牵头人id" prop="betweenId">
							<el-input v-model="param.betweenId" placeholder="牵头人id" ></el-input>
						</el-form-item> 
						<el-form-item label="牵头人" prop="betweenName">
							<el-input v-model="param.betweenName" placeholder="牵头人" >
								<el-button slot="append" @click="openSelectUser('item','betweenName')"  icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item> 
					</el-col>
				</el-row>
				<el-row>
					<el-form-item style="display:none" label="归属机构" prop="branchId">
						<el-input v-model="param.branchId" placeholder="归属机构" ></el-input>
					</el-form-item> 
					<el-col  :span="12">
						<el-form-item label="计划开始日期" prop="startTime">
							<el-date-picker
								v-model="rangeStartDay"
								type="daterange"
								align="right"
								unlink-panels
								range-separator="~"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								:picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item> 
					</el-col>
					<el-col  :span="12">
						<el-form-item label="计划结束日期" prop="startTime">
							<el-date-picker
								v-model="rangeEndDay"
								type="daterange"
								align="right"
								unlink-panels
								range-separator="~"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								:picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item> 
					</el-col>
				</el-row>
				<el-row>

				</el-row>
				<el-row>
					<!-- <el-col :span="12">
						<el-form-item style="display:none" label="主办单位id" prop="hostDeptId">
							<el-input v-model="param.hostDeptId" placeholder="主办单位id" ></el-input>
						</el-form-item> 
						<el-form-item label="主办单位" prop="hostDeptName">
							<el-input v-model="param.hostDeptName" placeholder="主办单位">
								<el-button slot="append" @click="openSelectDept('item','hostDeptName')" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item> 
					</el-col> -->
					<el-col :span="12">
						<el-form-item style="display:none" label="主办id" prop="hostId">
							<el-input v-model="param.hostId" placeholder="主办id" ></el-input>
						</el-form-item> 
						<el-form-item label="主办" prop="hostName">
							<el-input v-model="param.hostName" placeholder="主办" >
								<el-button slot="append" @click="openSelectUser('item','hostName')" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item> 
					</el-col>
                    <el-col :span="12">
						<el-form-item label="协办" prop="coopUser">
							<el-button type="text" @click="openSelectUser('item','coopUser')" icon="el-icon-search">选择协办</el-button><br/>
							<el-tag v-for="(item,index) in param.coopUser" :key="index" @close="handleClose(item , 'item','coopUser')" closable>{{item.username}}</el-tag>
						</el-form-item> 
					</el-col>
				</el-row>
                <el-row>
					<el-form-item>
						<el-col :span="24" :offset="8"> 
							<el-button @click.native="handleCancel">取消</el-button>  
							<el-button type="primary" @click="search">搜索</el-button>  
							<el-button type="danger" @click="onReset">重置</el-button>  
						</el-col>
					</el-form-item> 
				</el-row>
            </el-form>
            <el-dialog append-to-body title="选择申请人" :visible.sync="selectUserFormVisible" width="80%">
                <users-select v-if="selectUserFormVisible" :is-single-user='isSingleUser' @confirm="onUserSelected">
                </users-select>
            </el-dialog>
		</el-row>
   </section>
</template>

<script>
    import util from '@/common/js/util';//全局公共库
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; //选择用户
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:[],
		watch: {
	     
	    },
		data() {
			return {
                paramRules: {
					dubanId: [
						//{ required: true, message: '督办字号不能为空', trigger: 'change' }
					]
				},
				//新加条件
				param: {
					dubanId:'',name:'',dutyId:'',dutyName:'',betweenDeptid:'',betweenDeptName:'',betweenId:'',betweenName:'',branchId:'',
					startTimeSelectStart:'',startTimeSelectEnd:'',endTimeSelectStart:'',endTimeSelectEnd:'',hostDeptId:'',hostDeptName:'',hostId:'',hostName:'',remark:'',status:'',createTime:'',progress:'',
					coopUser: [],
				},
				rangeEndTime: [new Date(2020, 9, 10), new Date(2020, 9, 10, 10, 0, 0)],
				rangeStartTime: [new Date(2020, 9, 10), new Date(2020, 9, 10, 10, 0, 0)],
				rangeEndDay:'',
				rangeStartDay:'',
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近半年',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
						picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一年',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
						picker.$emit('pick', [start, end]);
						}
					}]
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectUserFormVisible:  false,
				mark1: '',
				mark2: '',
				deptMark1: '',
				deptMark2: '',
				isSingleUser: true,
				selectDeptFormVisible: false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="paramVisible=false" 监听
			handleCancel:function(){
				//this.$refs['param'].resetFields();
				this.$emit('cancel');
			},
			onReset(){
				this.$refs['param'].resetFields();
				this.rangeStartDay = ''
				this.rangeEndDay = ''
				this.param.coopUser = []
			},
            search(){
				console.log(this.rangeStartDay)
				if(this.rangeStartDay != null && this.rangeStartDay != ''){
					this.param.startTimeSelectStart = this.rangeStartDay[0].getTime()
					this.param.startTimeSelectEnd = this.rangeStartDay[1].getTime()
				}else{
					this.param.startTimeSelectStart = ''
					this.param.startTimeSelectEnd = ''
				}
				if(this.rangeEndDay != null && this.rangeEndDay != ''){
					this.param.endTimeSelectStart = this.rangeEndDay[0].getTime()
					this.param.endTimeSelectEnd = this.rangeEndDay[1].getTime()
				}else{
					this.param.endTimeSelectStart = ''
					this.param.endTimeSelectEnd = ''
				}
                this.$emit("queryTop",this.param)
            },
			openSelectUser(mark1,mark2){
				this.mark1 = mark1
				this.mark2 = mark2

				if(this.mark1 == 'item'){
					if(this.mark2 == 'dutyName'){
						this.isSingleUser = true
					}else if(this.mark2 == 'betweenName'){
						this.isSingleUser = true
					}else if(this.mark2 == 'hostName'){
						this.isSingleUser = true
					}else {
						this.isSingleUser = false
					}
				}else {
					if(this.mark2 == 'hostName'){
						this.isSingleUser = true
					}else{
						this.isSingleUser = false
					}
				}
				this.selectUserFormVisible = true
            },
            onUserSelected: function(users) {
				if(this.mark1 == 'item'){
					if(this.mark2 == 'dutyName'){
						this.param.dutyId = users[0].userid
						this.param.dutyName = users[0].username
					}else if(this.mark2 == 'betweenName'){
						this.param.betweenId = users[0].userid
						this.param.betweenName = users[0].username
					}else if(this.mark2 == 'hostName'){
						this.param.hostId = users[0].userid
						this.param.hostName = users[0].username
					}else {
						users.forEach((user)=>{
							let params = {
								id:'',dubanItemId:'',userId: user.userid,username: user.username
                            }
                            if( JSON.stringify(this.param.coopUser).indexOf(JSON.stringify(params)) == -1 ){
                                this.param.coopUser.push(params)
                            }
						})
					}
				}else {
					if(this.param.tasks.length != null && this.param.tasks.length > 0){
						if(this.mark2 == 'hostName'){
							this.param.tasks[this.mark1].hostId = users[0].userid
							this.param.tasks[this.mark1].hostName = users[0].username
						}else{
							users.forEach((user)=>{
								let params = {
									id:'',dubanItemTaskId:'',userId: user.userid,username: user.username
								}
								this.param.tasks[this.mark1].coopUser.push(params)
							})
						}
					}	
				}
				//console.log(users)
				this.selectUserFormVisible = false
    		},
            handleClose(value,mark1,mark2){
				if(mark1 == 'item'){
					if(mark2 == 'coopUser'){
						this.param.coopUser.splice(this.param.coopUser.indexOf(value),1)
					}else {	
						this.param.coopDept.splice(this.param.coopDept.indexOf(value),1)
					}
				}else {
					if(this.param.tasks.length != null && this.param.tasks.length > 0){
						if(mark2 == 'coopUser'){
							this.param.tasks[mark1].coopUser.splice(this.param.tasks[mark1].coopUser.indexOf(value),1)
						}else{
							this.param.tasks[mark1].coopDept.splice(this.param.tasks[mark1].coopDept.indexOf(value),1)
						}
					}	
				}
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			"users-select" : UsersSelect,	
		},
		mounted() {
			/**在下面写其它函数***/
			
		}//end mounted
}

</script>

<style scoped>

    .text{
		font-size: 16px;
		color: #000;
		font-weight: 200;
		margin-top: 20px;
	}
	.vTip {
		color: red;
		display: block;
		position: absolute;
		left: 1px;
	}
	.relativeTip{
		position: relative;
		top: 5px;
		margin-right: 1px;
	}

</style>