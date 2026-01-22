<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 KqVacationType 请假类型表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef"> 
				<el-form-item label="请假类型" prop="vacationType">
					<el-select v-model="editForm.vacationType" @change="onVacationTypeChange">
						<el-option v-for="(item,index) in dicts.leaveType" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="假期名称" prop="name">
					<el-input v-model="editForm.name" placeholder="假期名称"></el-input>
				</el-form-item> 
				<el-form-item label="总时长（小时）" prop="totalHours">
				<el-input-number
					v-model="editForm.totalHours"
					:min="1"
					label="总天数"
				></el-input-number>
				</el-form-item>
				<el-form-item label="性别要求" prop="sexRule">
					<el-radio v-model="editForm.sexRule" label="2">全部</el-radio>
					<el-radio v-model="editForm.sexRule" label="0">男性可请类型</el-radio>
					<el-radio v-model="editForm.sexRule" label="1">女性可请类型</el-radio>
				</el-form-item>
				<el-form-item label="请假规则" prop="vacationRule">
				<el-input
					v-model="editForm.vacationRule"
					placeholder="请假规则：比如妇乳期只能女员工享有"
					type="textarea"
					:rows="3"
				></el-input>
				</el-form-item>       
				<el-form-item label="入职(月)" prop="beginEmpMonths">
					<el-input type="number" size="small" v-model="editForm.beginEmpMonths" :min="0" :max="200" style="width:40%;"></el-input>&nbsp;月&nbsp;~&nbsp;<el-input size="small" type="number" v-model="editForm.endEmpMonths" :min="0" :max="200"  style="width:40%;"></el-input>&nbsp;月
					<br><font color="red">在本公司持续任职月数区间</font>
				</el-form-item>  
				<el-form-item label="工龄(月)" prop="beginWorkingMonths">
					<el-input type="number" size="small"  v-model="editForm.beginWorkingMonths" :min="0" :max="200"  style="width:40%;"></el-input>&nbsp;月&nbsp;~&nbsp;<el-input  type="number" size="small"  v-model="editForm.endWorkingMonths" :min="0" :max="200"  style="width:40%;"></el-input>&nbsp;月
					<br><font color="red">参加工作以来的月数区间</font>
				</el-form-item> 
				<el-form-item label="启用" prop="status">
					<el-checkbox  v-model="editForm.status" true-label="1" false-label="0" placeholder="启用"></el-checkbox>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addKqVacationType,editKqVacationType } from '@/api/oa/kq/kqVacationType';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //KqVacationTypeEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['kqVacationType','visible','opType'],

		watch: {
	      'kqVacationType':function( kqVacationType ) {
	        if(kqVacationType){
	            this.editForm = kqVacationType;
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{leaveType:[]},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: 'ID不能为空', trigger: 'blur' }
					]
				},

				//编辑界面数据  KqVacationType 请假类型表
				editForm: {
					id:'',vacationType:'',vacationRule:'',branchId:'',totalHours:'',sexRule:'2',name:'',beginEmpMonths:'',endEmpMonths:'',beginWorkingMonths:'',endWorkingMonths:'',status:'1'
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交KqVacationType 请假类型表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.currOpType=='edit'){
							    editKqVacationType(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addKqVacationType(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.editForm=res.data.data
                                        this.initData()
                                        this.currOpType="edit";
                                        this.$emit('submit');//  @submit="afterAddSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}
						});
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.kqVacationType){
                    this.editForm = Object.assign({},this.kqVacationType);
                }

                if(this.opType=='edit'){

                }else{

                }
            },
			
			onVacationTypeChange(val){
				var vacationType=this.dicts.leaveType.find(i=>i.id==val)
				if(!this.editForm.name && vacationType){
					this.editForm.name=vacationType.name
				} 
			}
			/**begin 在下面加自定义方法**/

		},//end method
		mounted() {
		    this.$nextTick(() => {
                initSimpleDicts('all',['leaveType']).then(res=>this.dicts=res.data.data);
                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>