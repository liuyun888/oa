<template>
	<section>
		 <el-row class="page-container border padding">
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-row>
					<el-col :span="24">
						<el-form-item label="事项名称" prop="name">
							<el-input v-model="editForm.name" placeholder="事项名称" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="督办字号" prop="id">
							<el-input :disabled="true" v-model="editForm.id" placeholder="督办字号" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item style="display:none" label="责任人id" prop="dutyId">
							<el-input v-model="editForm.dutyId" placeholder="责任人id" ></el-input>
						</el-form-item>
						<el-form-item label="责任人" prop="dutyName">
							<el-input v-model="editForm.dutyName" placeholder="责任人" >
								<el-button slot="append" @click="openSelectUser('item','dutyName')" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item style="display:none" label="牵头部门id" prop="betweenDeptid">
							<el-input v-model="editForm.betweenDeptid" placeholder="牵头部门id" ></el-input>
						</el-form-item>
						<el-form-item label="牵头部门" prop="betweenDeptName">
							<el-input v-model="editForm.betweenDeptName" placeholder="牵头部门" >
								<el-button slot="append" @click="openSelectDept('item','betweenDeptName')" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item style="display:none" label="牵头人id" prop="betweenId">
							<el-input v-model="editForm.betweenId" placeholder="牵头人id" ></el-input>
						</el-form-item>
						<el-form-item label="牵头人" prop="betweenName">
							<el-input v-model="editForm.betweenName" placeholder="牵头人" >
								<el-button slot="append" @click="openSelectUser('item','betweenName')"  icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item style="display:none" label="归属机构" prop="branchId">
						<el-input v-model="editForm.branchId" placeholder="归属机构" ></el-input>
					</el-form-item>
					<el-col  :span="12">
						<el-form-item label="计划开始时间" prop="startTime">
							<!-- <el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker> -->
							<el-date-picker
								v-model="editForm.startTime"
								type="datetime"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期时间">
							</el-date-picker>

						</el-form-item>
					</el-col>
					<el-col  :span="12">
						<el-form-item label="计划结束时间" prop="endTime">
							<!-- <el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker> -->
							<el-date-picker
								v-model="editForm.endTime"
								type="datetime"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item style="display:none" label="主办单位id" prop="hostDeptId">
							<el-input v-model="editForm.hostDeptId" placeholder="主办单位id" ></el-input>
						</el-form-item>
						<el-form-item label="主办单位" prop="hostDeptName">
							<el-input v-model="editForm.hostDeptName" placeholder="主办单位">
								<el-button slot="append" @click="openSelectDept('item','hostDeptName')" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item style="display:none" label="主办id" prop="hostId">
							<el-input v-model="editForm.hostId" placeholder="主办id" ></el-input>
						</el-form-item>
						<el-form-item label="主办" prop="hostName">
							<el-input v-model="editForm.hostName" placeholder="主办" >
								<el-button slot="append" @click="openSelectUser('item','hostName')" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="协办单位" prop="coopDept">
							<el-button type="text" @click="openSelectDept('item','')" icon="el-icon-search">选择协办单位</el-button><br/>
							<el-tag v-for="(item,index) in editForm.coopDept" @close="handleClose(item , 'item','coopDept')" closable>{{item.deptName}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="协办" prop="coopUser">
							<el-button type="text" @click="openSelectUser('item','coopUser')" icon="el-icon-search">选择协办</el-button><br/>
							<el-tag v-for="(item,index) in editForm.coopUser" @close="handleClose(item , 'item','coopUser')" closable>{{item.username}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-form-item label="任务描述" prop="remark">
						<!-- <el-input v-model="editForm.remark" placeholder="任务描述" ></el-input> -->
						<vue-editor :id="'remark'" :branch-id="userInfo.branchId" v-model="editForm.remark"></vue-editor>
					</el-form-item>
				</el-row>


				<el-row>
					<el-col :offset="1" class="text" :span="20" ><span>任务阶段</span></el-col>
					<el-col :span="3">
						<el-button @click="addRow" icon="el-icon-circle-plus-outline">添加任务</el-button>
					</el-col>
				</el-row>
				<el-row>
					<hr/>
				</el-row>
				<br/>

				<el-row class="row" v-for="(obj,key) in editForm.tasks">
					<el-form :model="editForm.tasks[key]"  label-width="120px">
						<el-row>
							<el-col :span="1"><el-tag style="font-size:25">{{key + 1}}</el-tag></el-col>
						</el-row>
						<el-row>
							<el-col :span="22">
								<el-form-item label="任务名称" prop="name">
									<span class="vTip">*</span>
									<el-input v-model="editForm.tasks[key].name" placeholder="任务名称" ></el-input>
								</el-form-item>
							</el-col>
							<el-col :offset="1" :span="1">
								<el-button @click="delRow(key)" icon="el-icon-delete"></el-button>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
									<el-form-item label="任务开始时间" prop="startTime">
									<el-date-picker
										v-model="editForm.tasks[key].startTime"
										type="datetime"
										value-format="yyyy-MM-dd HH:mm:ss"
										placeholder="选择日期时间">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="任务结束时间" prop="endTime">
									<el-date-picker
										v-model="editForm.tasks[key].endTime"
										type="datetime"
										value-format="yyyy-MM-dd HH:mm:ss"
										placeholder="选择日期时间">
									</el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item style="display:none" label="主办单位id" prop="hostDeptId">
									<el-input v-model="editForm.tasks[key].hostDeptId" placeholder="主办单位id" ></el-input>
								</el-form-item>
								<el-form-item label="主办单位" prop="hostDeptName">
									<span class="vTip">*</span>
									<el-input v-model="editForm.tasks[key].hostDeptName" placeholder="主办单位" >
										<el-button slot="append" @click="openSelectDept(key,'hostDeptName')" icon="el-icon-search"></el-button>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item style="display:none" label="主办id" prop="hostId">
									<el-input v-model="editForm.tasks[key].hostId" placeholder="主办id" ></el-input>
								</el-form-item>
								<el-form-item label="主办" prop="hostName">
									<span class="vTip">*</span>
									<el-input v-model="editForm.tasks[key].hostName" placeholder="主办" >
										<el-button slot="append" @click="openSelectUser(key,'hostName')" icon="el-icon-search"></el-button>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="协办单位" prop="coopDeptName">
									<el-button type="text" @click="openSelectDept(key,'')" icon="el-icon-search">选择协办单位</el-button><br/>
									<el-tag v-for="(item,index) in editForm.tasks[key].coopDept" @close="handleClose(item ,key,'coopDept')" :key="index" closable>{{item.deptName}}</el-tag>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="协办" prop="coopUser">
									<el-button type="text" @click="openSelectUser(key,'coopUser')" icon="el-icon-search">选择协办</el-button><br/>
									<el-tag v-for="(item,index) in editForm.tasks[key].coopUser" @close="handleClose(item ,key,'coopUser')" :key="index" closable>{{item.username}}</el-tag>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-form-item label="任务描述" prop="remark">
								<!-- <el-input v-model="editForm.tasks[key].remark" placeholder="任务描述" ></el-input> -->
								<vue-editor :id=" 'remark' + key" :value="editForm.tasks[key].remark"  :branch-id="userInfo.branchId" v-model="editForm.tasks[key].remark"></vue-editor>
							</el-form-item>
						</el-row>
					</el-form>
					<el-row>
						<br/>
					</el-row>
				</el-row>

				<!-- <el-row>
					<el-form-item label="状态0已申报1进行中2已完成3已超时" prop="status">
						<el-input v-model="editForm.status" placeholder="状态0已申报1进行中2已完成3已超时" ></el-input>
					</el-form-item>
					<el-form-item label="创建时间" prop="createTime">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
				</el-row> -->

				<el-row>
					<el-form-item>
						<el-col :span="24" :offset="8">
							<el-button @click.native="handleCancel">取消</el-button>
							<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
						</el-col>
					</el-form-item>
				</el-row>
			</el-form>
		</el-row>
		<el-dialog append-to-body title="选择申请人" :visible.sync="selectUserFormVisible" width="80%">
		    <users-select v-if="selectUserFormVisible" :is-single-user='isSingleUser' @confirm="onUserSelected">
			</users-select>
		</el-dialog>
		<el-dialog append-to-body title="选择部门" :visible.sync="selectDeptFormVisible" width="60%">
			<dept-tree
				show-root
				default-expand-all
				show-checkbox
				:expand-on-click-node="false"
				@node-click="onDeptSelected"
			></dept-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click="selectDeptFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="selectDeptFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editDubanItem,getMessages } from '@/api/oa/duban/dubanItem';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; //选择用户
	import DeptTree from "@/views/mdp/sys/dept/DeptTree"; //选择用户

	import VueEditor from '@/components/Tinymce/index' // 粘性header组件

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['category','visible','dubanItem'],
		watch: {
			'category':function( category ) {
				console.log(this.category)
			},
			'dubanItem':function( dubanItem ) {
				this.editForm=Object.assign(this.editForm, this.dubanItem);
				this.editForm.coopDept = []
				this.editForm.coopUser = []
				this.editForm.tasks = []
				this.onGetDubanMessage()
			},
			'visible':function(visible) {
				if(visible==true){
					//从新打开页面时某些数据需要重新加载，可以在这里添加
				}
			}
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '督办字号不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 duban_item
				editForm: {
					id:'',name:'',categoryId:'',categoryName:'',dutyId:'',dutyName:'',betweenDeptid:'',betweenDeptName:'',betweenId:'',betweenName:'',branchId:'',startTime:'',endTime:'',hostDeptId:'',hostDeptName:'',hostId:'',hostName:'',remark:'',status:'',createTime:'',progress:'',
					coopDept: [],
					coopUser: [],
					tasks: [],
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
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交DubanItem duban_item 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {

				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.editForm);

							editDubanItem(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.editForm.tasks = []
									this.$emit('submit'); //@submit="afterAddSubmit"

								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			addRow() {
				let params = {
					id:'',dubanId:'',name:'',startTime:'',endTime:'',hostDeptId:'',hostDeptName:'',hostId:'',hostName:'',
					coopUser: [],coopDept: [],
					remark:'',createTime:''
				}
				this.editForm.tasks.push(params);
			},
			delRow(index) {
				this.editForm.tasks.splice(index, 1);
			},
			onUserSelected: function(users) {
				if(this.mark1 == 'item'){
					if(this.mark2 == 'dutyName'){
						this.editForm.dutyId = users[0].userid
						this.editForm.dutyName = users[0].username
					}else if(this.mark2 == 'betweenName'){
						this.editForm.betweenId = users[0].userid
						this.editForm.betweenName = users[0].username
					}else if(this.mark2 == 'hostName'){
						this.editForm.hostId = users[0].userid
						this.editForm.hostName = users[0].username
					}else {
						users.forEach((user)=>{
							let params = {
								id:'',dubanItemId:'',userId: user.userid,username: user.username
							}
							this.editForm.coopUser.push(params)
						})
					}
				}else {
					if(this.editForm.tasks.length != null && this.editForm.tasks.length > 0){
						if(this.mark2 == 'hostName'){
							this.editForm.tasks[this.mark1].hostId = users[0].userid
							this.editForm.tasks[this.mark1].hostName = users[0].username
						}else{
							users.forEach((user)=>{
								let params = {
									id:'',dubanItemTaskId:'',userId: user.userid,username: user.username
								}
								this.editForm.tasks[this.mark1].coopUser.push(params)
							})
						}
					}
				}
				//console.log(users)
				this.selectUserFormVisible = false
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
			handleClose(value,mark1,mark2){
				if(mark1 == 'item'){
					if(mark2 == 'coopUser'){
						this.editForm.coopUser.splice(this.editForm.coopUser.indexOf(value),1)
					}else {
						this.editForm.coopDept.splice(this.editForm.coopDept.indexOf(value),1)
					}
				}else {
					if(this.editForm.tasks.length != null && this.editForm.tasks.length > 0){
						if(mark2 == 'coopUser'){
							this.editForm.tasks[mark1].coopUser.splice(this.editForm.tasks[mark1].coopUser.indexOf(value),1)
						}else{
							this.editForm.tasks[mark1].coopDept.splice(this.editForm.tasks[mark1].coopDept.indexOf(value),1)
						}
					}
				}
			},
			openSelectDept(mark1,mark2){
				this.deptMark1 = mark1
				this.deptMark2 = mark2

				this.selectDeptFormVisible = true
			},
			//获取选择的部门
			onDeptSelected(data, node, comp) {
				//console.log(data)
				this.selectDeptFormVisible = false
				if(this.deptMark1 == 'item'){
					if(this.deptMark2 == 'betweenDeptName'){
						this.editForm.betweenDeptid = data.deptid
						this.editForm.betweenDeptName = data.deptName
					}else if(this.deptMark2 == 'hostDeptName'){
						this.editForm.hostDeptId = data.deptid
						this.editForm.hostDeptName = data.deptName
					}else{
						let params = {
							id:'',dubanItemId: '',deptId: data.deptid,deptName: data.deptName
						}
						if( JSON.stringify(this.editForm.coopDept).indexOf(JSON.stringify(params)) == -1 ){
							this.editForm.coopDept.push(params)
						}
					}
				}else{
					if(this.deptMark2 == 'hostDeptName'){
						this.editForm.tasks[this.deptMark1].hostDeptId = data.deptid
						this.editForm.tasks[this.deptMark1].hostDeptName = data.deptName
					}else{
						if(this.editForm.tasks  != null && this.editForm.tasks.length > 0){
							let params = {
								id:'',dubanItemTaskId: '',deptId: data.deptid,deptName: data.deptName
							}
							if( JSON.stringify(this.editForm.tasks[this.deptMark1].coopDept).indexOf(JSON.stringify(params)) == -1){
								this.editForm.tasks[this.deptMark1].coopDept.push(params)
							}
						}
					}
				}
			},
			onGetDubanMessage(){
				let params = {
					id: this.editForm.id
				}
				getMessages(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						if(!this.isNull(res.data.data.coopDept)){
							this.editForm.coopDept = res.data.data.coopDept
						}
						if(!this.isNull(res.data.data.coopUser) ){
							this.editForm.coopUser = res.data.data.coopUser
						}
						if(!this.isNull(res.data.data.tasks)){
							this.editForm.tasks = res.data.data.tasks
						}

					}else{
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}
				}).catch( );
			},
			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'duban-item-edit':DubanItemEdit
			'vue-editor' :VueEditor,
			"users-select" : UsersSelect,
			'dept-tree': DeptTree,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.dubanItem);
			this.$nextTick(() => {
				this.onGetDubanMessage()
        	});

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
