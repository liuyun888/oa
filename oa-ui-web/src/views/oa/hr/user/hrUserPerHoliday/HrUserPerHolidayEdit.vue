<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm" size="mini">
				<el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年份" prop="year" style="width:60%">
              <el-date-picker v-model="editForm.year" type="year" placeholder="选择年" style="width:100%" maxlength="8"  clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余带薪年假" prop="annualLeave">
              <el-input-number v-model="editForm.annualLeave"  :min="num"  label="剩余带薪年假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="剩余调休假期" prop="paidLeave">
              <el-input-number v-model="editForm.paidLeave"  :min="num"  label="剩余调休假期" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余带薪病假" prop="paidSickLeave">
              <el-input-number v-model="editForm.paidSickLeave"  :min="num"  label="剩余带薪病假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="剩余调休假" prop="leaveInLieu">
              <el-input-number v-model="editForm.leaveInLieu"  :min="num"  label="剩余调休假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余婚假" prop="marriageLeave">
              <el-input-number v-model="editForm.marriageLeave" :min="num"  label="剩余婚假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="剩余年假" prop="annualVacation">
              <el-input-number v-model="editForm.annualVacation"  :min="num"  label="剩余年假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余病假" prop="sickLeave">
              <el-input-number v-model="editForm.sickLeave"  :min="num"  label="剩余病假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="剩余总天数" prop="totalDays" >
              <el-input-number v-model="editForm.totalDays"  :min="num"  :disabled="true" label="剩余总天数" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editHrUserPerHoliday } from '@/api/oa/hr/user/hrUserPerHoliday';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['hrUserPerHoliday','visible'],
		watch: {
	      'hrUserPerHoliday':function( hrUserPerHoliday ) {
	        this.editForm = hrUserPerHoliday;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
		  },
		   "editForm.annualLeave"() {
      this.editForm.totalDays = 0;

      if (this.editForm.annualLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualLeave);
      }
      if (this.editForm.paidLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidLeave);
      }
      if (this.editForm.paidSickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidSickLeave);
      }
      if (this.editForm.leaveInLieu != "") {
        this.editForm.totalDays += parseInt(this.editForm.leaveInLieu);
      }
      if (this.editForm.marriageLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.marriageLeave);
      }
      if (this.editForm.annualVacation != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualVacation);
      }
      if (this.editForm.sickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.sickLeave);
      }
    },
    "editForm.paidLeave"() {
      this.editForm.totalDays = 0;

      if (this.editForm.annualLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualLeave);
      }
      if (this.editForm.paidLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidLeave);
      }
      if (this.editForm.paidSickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidSickLeave);
      }
      if (this.editForm.leaveInLieu != "") {
        this.editForm.totalDays += parseInt(this.editForm.leaveInLieu);
      }
      if (this.editForm.marriageLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.marriageLeave);
      }
      if (this.editForm.annualVacation != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualVacation);
      }
      if (this.editForm.sickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.sickLeave);
      }
    },
    "editForm.paidSickLeave"() {
      this.editForm.totalDays = 0;

      if (this.editForm.annualLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualLeave);
      }
      if (this.editForm.paidLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidLeave);
      }
      if (this.editForm.paidSickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidSickLeave);
      }
      if (this.editForm.leaveInLieu != "") {
        this.editForm.totalDays += parseInt(this.editForm.leaveInLieu);
      }
      if (this.editForm.marriageLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.marriageLeave);
      }
      if (this.editForm.annualVacation != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualVacation);
      }
      if (this.editForm.sickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.sickLeave);
      }
    },
    "editForm.leaveInLieu"() {
      this.editForm.totalDays = 0;

      if (this.editForm.annualLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualLeave);
      }
      if (this.editForm.paidLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidLeave);
      }
      if (this.editForm.paidSickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidSickLeave);
      }
      if (this.editForm.leaveInLieu != "") {
        this.editForm.totalDays += parseInt(this.editForm.leaveInLieu);
      }
      if (this.editForm.marriageLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.marriageLeave);
      }
      if (this.editForm.annualVacation != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualVacation);
      }
      if (this.editForm.sickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.sickLeave);
      }
    },
    "editForm.marriageLeave"() {
      this.editForm.totalDays = 0;

      if (this.editForm.annualLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualLeave);
      }
      if (this.editForm.paidLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidLeave);
      }
      if (this.editForm.paidSickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidSickLeave);
      }
      if (this.editForm.leaveInLieu != "") {
        this.editForm.totalDays += parseInt(this.editForm.leaveInLieu);
      }
      if (this.editForm.marriageLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.marriageLeave);
      }
      if (this.editForm.annualVacation != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualVacation);
      }
      if (this.editForm.sickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.sickLeave);
      }
    },
    "editForm.annualVacation"() {
      this.editForm.totalDays = 0;

      if (this.editForm.annualLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualLeave);
      }
      if (this.editForm.paidLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidLeave);
      }
      if (this.editForm.paidSickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidSickLeave);
      }
      if (this.editForm.leaveInLieu != "") {
        this.editForm.totalDays += parseInt(this.editForm.leaveInLieu);
      }
      if (this.editForm.marriageLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.marriageLeave);
      }
      if (this.editForm.annualVacation != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualVacation);
      }
      if (this.editForm.sickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.sickLeave);
      }
    },
    "editForm.sickLeave"() {
      this.editForm.totalDays = 0;

      if (this.editForm.annualLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualLeave);
      }
      if (this.editForm.paidLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidLeave);
      }
      if (this.editForm.paidSickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.paidSickLeave);
      }
      if (this.editForm.leaveInLieu != "") {
        this.editForm.totalDays += parseInt(this.editForm.leaveInLieu);
      }
      if (this.editForm.marriageLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.marriageLeave);
      }
      if (this.editForm.annualVacation != "") {
        this.editForm.totalDays += parseInt(this.editForm.annualVacation);
      }
      if (this.editForm.sickLeave != "") {
        this.editForm.totalDays += parseInt(this.editForm.sickLeave);
      }
    } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: 'id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  HrUserPerHoliday hr_user_per_holiday
				editForm: {
					id:'',userid:'',year:'',annualLeave:'',paidLeave:'',paidSickLeave:'',leaveInLieu:'',marriageLeave:'',annualVacation:'',sickLeave:'',totalDays:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				num:0
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交HrUserPerHoliday hr_user_per_holiday父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editHrUserPerHoliday(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'hr-user-per-holiday-edit':HrUserPerHolidayEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.hrUserPerHoliday);  
		}
	}

</script>

<style scoped>

</style>