<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item style="display:none" label="主键" prop="id">
          <el-input v-model="editForm.id" placeholder="主键"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNum">
          <el-input v-model="editForm.carNum" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item label="车名" prop="carName">
          <el-input v-model="editForm.carName" placeholder="车名"></el-input>
        </el-form-item>
        <el-form-item label="汽车品牌编号" prop="carBrandId">
          <el-input v-model="editForm.carBrandId" placeholder="汽车品牌编号"></el-input>
        </el-form-item>
        <el-form-item label="汽车品牌名称" prop="carBrandName">
          <el-input v-model="editForm.carBrandName" placeholder="汽车品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="汽车前照片" prop="carFrontImageUrl">
			    <el-image style="width: 250px; height: 200px" :src="baseImageUrl + this.editForm.carFrontImageUrl"></el-image>
        	<car-upload @getCarFrontImageUrl="getCarFrontImageUrl"></car-upload>
        </el-form-item>
        <el-form-item label="汽车后照片" prop="carBackImageUrl">
			<el-image style="width: 250px; height: 200px" :src="baseImageUrl +  this.editForm.carBackImageUrl"></el-image>
          <car-upload @getCarBackImageUrl="getCarBackImageUrl"></car-upload>
        </el-form-item>
        <el-form-item label="汽车内饰照片" prop="carInnerImageUrl">
			<el-image style="width: 250px; height: 200px" :src="baseImageUrl +  this.editForm.carInnerImageUrl"></el-image>
          <car-upload @getCarInnerImageUrl="getCarInnerImageUrl"></car-upload>
        </el-form-item>
        <el-form-item label="汽车类型" prop="carType">
          <!-- <el-input v-model="editForm.carType" placeholder="0小轿车1商务车2面包车3小货车4大货车"></el-input> -->
           <el-radio-group v-model="editForm.carType" size="medium">
            <el-radio-button v-for="(item,i) in this.carTypes" :key="i" :label="item.id">{{item.value}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="汽车状态" prop="carStatus">
            <!-- <el-input v-model="editForm.carStatus" placeholder="汽车状态1启用0禁用"></el-input> -->
            <el-radio-group v-model="editForm.carStatus" size="medium">
              <el-radio-button label="0">禁用</el-radio-button>
              <el-radio-button label="1">启用</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="选择部门" prop="carDeptid">
			
          <el-button type="text" @click="dialogFormVisible = true">选择部门</el-button>
		      <el-tag style="margin-left: 50px;" v-text='"已选择: " + editForm.carDeptName'></el-tag>

        </el-form-item>
        <el-form-item style="display:none" label="汽车归属机构" prop="carBranchId">
          <el-input v-model="editForm.carBranchId" placeholder="汽车归属机构"></el-input>
        </el-form-item>
        <!-- <el-form-item label="汽车归属部门名称" prop="carDeptName">
					<el-input v-model="editForm.carDeptName" placeholder="汽车归属部门名称" ></el-input>
					</el-form-item> 
					<el-form-item label="汽车归属机构名称" prop="carBranchName">
						<el-input v-model="editForm.carBranchName" placeholder="汽车归属机构名称" ></el-input>
					</el-form-item> 
        -->
        <el-form-item style="display:none" label="新增时间" prop="createTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="editForm.createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="汽车座位数" prop="carSeating">
          <el-input-number v-model="editForm.carSeating" :min="0" :max="50"></el-input-number>
        </el-form-item>
        <el-form-item label="汽车载重量(kg)" prop="carLoadWeight">
          <el-input-number v-model="editForm.carLoadWeight" :min="0" :max="200000"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-col>
            <el-button
              v-loading="load.edit"
              type="primary"
              @click.native="editSubmit"
              :disabled="load.edit==true"
            >提交</el-button>
            <el-button @click.native="handleCancel">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>

	<el-dialog append-to-body title="选择部门" :visible.sync="dialogFormVisible" width="60%">
		<dept-tree
			show-root
			default-expand-all
			show-checkbox
			:expand-on-click-node="false"
			@node-click="handleLeftDeptNodeClick"
		></dept-tree>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
		</div>
	</el-dialog>

  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { editCarOfficeCar } from "@/api/oa/car/carOfficeCar";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import DeptTree from "@/views/mdp/sys/dept/DeptTree"; //选择部门的
import { mapGetters } from "vuex";
import config from '@/common/config'
import { delArchiveAttachment } from "@/api/mdp/arc/archiveAttachment";

export default {
    computed: {
      ...mapGetters(["userInfo"])
    },
    props: ["carOfficeCar", "visible"],
    watch: {
      carOfficeCar: function(carOfficeCar) {
          this.editForm = carOfficeCar;
          this.carFrontImageUrl = this.editForm.carFrontImageUrl
          this.carBackImageUrl = this.editForm.carBackImageUrl
          this.carInnerImageUrl = this.editForm.carInnerImageUrl
         
      },
      visible: function(visible) {
        if (visible == true) {
          //从新打开页面时某些数据需要重新加载，可以在这里添加
        }
      }
    },
    data() {
      return {
        options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
        load: { list: false, edit: false, del: false, add: false }, //查询中...
        editFormRules: {
          carNum: [
            { required: true, message: '车牌号不能为空', trigger: 'change' }
          ],
          carName: [
            { required: true, message: '车名不能为空', trigger: 'change' }
          ],
          carType: [
            { required: true, message: '汽车类型不能为空', trigger: 'change' }
          ],
          carStatus: [
            { required: true, message: '汽车汽车状态不能为空', trigger: 'change' }
          ]
        },
        //编辑界面数据  CarOfficeCar car_office_car
        editForm: {
          id: "",
          carNum: "",
          carName: "",
          carBrandId: "",
          carBrandName: "",
          carFrontImageUrl: "",
          carBackImageUrl: "",
          carInnerImageUrl: "",
          carType: "",
          carStatus: "",
          carDeptid: "",
          carBranchId: "",
          carDeptName: "",
          carBranchName: "",
          createTime: "",
          carSeating: "",
          carLoadWeight: ""
        },
        /**begin 在下面加自定义属性,记得补上面的一个逗号**/
        dialogFormVisible: false,
        baseImageUrl: config.getArcFileUploadBasePath() + '/',
        //汽车类型选择
        carTypes:[
          {
            id: 0,
            value: '小轿车'
          },
          {
            id: 1,
            value: '商务车'
          },
          {
            id: 2,
            value: '面包车'
          },
          {
            id: 3,
            value: '小货车'
          },
          {
            id: 4,
            value: '大货车'
          },
        ],
        carFrontImageUrl:'',
        carBackImageUrl:'',
        carInnerImageUrl:'',
        /**end 在上面加自定义属性**/

      }; //end return
    }, //end data
    methods: {
        // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
        handleCancel: function() {
          this.$refs["editForm"].resetFields();
          this.$emit("cancel");
        },
        //编辑提交CarOfficeCar car_office_car父组件监听@submit="afterEditSubmit"
        editSubmit: function() {
          this.$refs.editForm.validate(valid => {
            if (valid) {
              this.$confirm("确认提交吗？", "提示", {}).then(() => {
                this.load.edit = true;
                let params = Object.assign({}, this.editForm);
                editCarOfficeCar(params)
                  .then(res => {
                    this.load.edit = false;
                    var tips = res.data.tips;
                    if (tips.isOk) {
                        this.$refs["editForm"].resetFields();
                        
                        if(res.data.data.carFrontImageUrl != this.carFrontImageUrl){
                            this.handleRemove(this.carFrontImageUrl)
                        }
                        if(res.data.data.carBackImageUrl != this.carBackImageUrl){
                            this.handleRemove(this.carBackImageUrl)
                        }
                        if(res.data.data.carInnerImageUrl != this.carInnerImageUrl){
                            this.handleRemove(this.carInnerImageUrl)
                        }
                        

                        this.$emit("submit"); //  @submit="afterEditSubmit"
                    }
                    this.$message({
                      message: tips.msg,
                      type: tips.isOk ? "success" : "error"
                    });
                  })
                  .catch(err => (this.load.edit = false));
              });
            }
          });
        },
        handleRemove(url) {

          let index1 = url.lastIndexOf('/')
          let index2 = url.lastIndexOf('.')
          let id = url.substring(index1+1,index2)
          
          let file = {
            id: id
				  };
          delArchiveAttachment(file)
            .then(res => {
              if (res.data.tips.isOk) {
                //this.$message("成功");
              } else {
                //this.$message("删除失败");
              }
            })
            .catch(() => {
              this.$message.warning("删除失败");
            });
        },
        /**begin 在下面加自定义方法,记得补上面的一个逗号**/
        //获取前面上传图片地址
        getCarFrontImageUrl(data) {
          this.editForm.carFrontImageUrl = data;
        },
        //获取后面上传图片地址
        getCarBackImageUrl(data) {
          this.editForm.carBackImageUrl = data;
        },
        //获取车内上传图片地址
        getCarInnerImageUrl(data) {
          this.editForm.carInnerImageUrl = data;
        },
        //获取选择的部门
        handleLeftDeptNodeClick(data, node, comp) {
          this.editForm.carDeptName = data.deptName;
          this.editForm.carDeptid = data.deptid;
        },

      /**end 在上面加自定义方法**/
    }, //end method
    components: {
    //在下面添加其它组件 'car-office-car-edit':CarOfficeCarEdit
      "car-upload": AttachmentUpload,
      "dept-tree": DeptTree
    },
    created(){
        this.editForm = Object.assign(this.editForm, this.carOfficeCar); 
        this.carFrontImageUrl = this.editForm.carFrontImageUrl
        this.carBackImageUrl = this.editForm.carBackImageUrl
        this.carInnerImageUrl = this.editForm.carInnerImageUrl
        
    },
    mounted() {
      
    }
};
</script>

<style scoped>
</style>