<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="editForm.deviceName" placeholder="设备名称" style="width:70%"></el-input>
        </el-form-item>
         <el-form-item label="归属部门" prop="deptName">
          <el-button type="text" style="margin-right:50px" @click.native="selectDept(1)">请选择归属部门</el-button>
          <el-tag v-text="'已选择:' + editForm.deptName"></el-tag>
        </el-form-item>
        <el-form-item label="归属机构名称" prop="branchName">
          <el-input v-model="editForm.branchName" placeholder="归属机构名称" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="设备标识码" prop="deviceSn">
          <el-input v-model="editForm.deviceSn" placeholder="设备标识码" style="width:70%"></el-input>
        </el-form-item>
         <el-form-item label="品牌名称" prop="brandName" style="width:70%">
         <el-button type="text" style="margin-right:50px" @click="brandSelectVisible = true" >请选择品牌</el-button>
         <el-tag v-text="'已选择:' + editForm.brandName"></el-tag>
        </el-form-item>
        <el-form-item label="启用时间" prop="startTime">
          <el-date-picker
          style="width:70%"
            type="date"
            placeholder="选择日期"
            v-model="editForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="停用时间" prop="endTime">
          <el-date-picker
          style="width:70%"
            type="date"
            placeholder="选择日期"
            v-model="editForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="editForm.status" label="0">停用</el-radio>
          <el-radio v-model="editForm.status" label="1">启动</el-radio>
        </el-form-item>
        <el-form-item label="保管地址" prop="address">
          <el-input v-model="editForm.address" placeholder="保管地址" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="地址定位" prop="addressGps">
          <el-input v-model="editForm.addressGps" placeholder="地址定位" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-radio v-model="editForm.deviceType" label="0">便携机</el-radio>
          <el-radio v-model="editForm.deviceType" label="1">台式机</el-radio>
          <el-radio v-model="editForm.deviceType" label="2">普通印章</el-radio>
        </el-form-item>
        <el-form-item label="管理员姓名" prop="admUsername">  
           <el-button type="text" @click.native="userSelectVisible = true" style="margin-right:50px">请选择管理员姓名</el-button>
          <el-tag v-text="'已选择:' + editForm.admUsername"></el-tag>
        </el-form-item>
        <el-form-item label="管理部门名称" prop="admDeptName">
          <el-button type="text"  style="margin-right:50px" @click.native="selectDept(2)">请选择管理部门</el-button>
          <el-tag v-text="'已选择:' + editForm.admDeptName"></el-tag>
        </el-form-item>
        <el-form-item>
          <el-col :span="24" :offset="8">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button
              v-loading="load.edit"
              type="primary"
              @click.native="editSubmit"
              :disabled="load.edit==true"
            >提交</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 选择用户 -->
    <el-dialog append-to-body title="选择员工" :visible.sync="userSelectVisible" width="60%">
      <users-select @confirm="onUserSelected"></users-select>
    </el-dialog>
    <!-- 选择部门 -->
    <el-dialog append-to-body title="选择部门" :visible.sync="deptSelectVisible" width="60%">
      <dept-tree
        show-root
        default-expand-all
        show-checkbox
        :expand-on-click-node="false"
        @node-click="handleLeftDeptNodeClick"
      ></dept-tree>
    </el-dialog>
    <!-- 选择品牌 -->
    <el-dialog append-to-body title="选择品牌"  :visible.sync="brandSelectVisible" width="60%">
      <brand-component @selectBrand="selectBrand" ></brand-component>
    </el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { editSigDevice } from "@/api/oa/sig/sigDevice";
import { mapGetters } from "vuex";
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import BrandComponent from "@/views/oa/erp/pur/brand/BrandComponent"
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["sigDevice", "visible"],
  watch: {
    sigDevice: function(sigDevice) {
      this.editForm = sigDevice;
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
        id: [
          //{ required: true, message: '印章设备编号不能为空', trigger: 'change' }
        ]
      },
      //编辑界面数据  SigDevice sig_device
      editForm: {
        id: "",
        deviceName: "",
        branchId: "",
        deptid: "",
        deptName: "",
        branchName: "",
        deviceSn: "",
        brandId: "",
        brandName: "",
        startTime: "",
        endTime: "",
        status: "",
        address: "",
        addressGps: "",
        deviceType: "",
        bizFlowState: "",
        bizProcInstId: "",
        admUserid: "",
        admUsername: "",
        admDeptid: "",
        admDeptName: "",
        admBranchId: ""
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      userSelectVisible: false,
      deptSelectVisible: false,
      selectType: "", //控制选择部门 1-归属部门 2-管理部门
      brandSelectVisible:false
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    },
    //编辑提交SigDevice sig_device父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      if (this.editForm.deviceName == "") {
        this.$message.error("设备名称不能为空");
        return;
      }
      if (this.editForm.deptName == "") {
        this.$message.error("归属部门不能为空");
        return;
      }
      if (this.editForm.deviceSn == "") {
        this.$message.error("设备标识码不能为空");
        return;
      }
      if (this.editForm.brandId == "") {
        this.$message.error("品牌编号不能为空");
        return;
      }
      if (this.editForm.brandName == "") {
        this.$message.error("品牌名称不能为空");
        return;
      }
      if (this.editForm.startTime == "" || this.editForm.startTime == null) {
        this.$message.error("请选择启用时间");
        return;
      }
      if (this.editForm.endTime == "" || this.editForm.endTime == null) {
        this.$message.error("请选择停用时间");
        return;
      }else{
        let start = new Date(this.editForm.startTime).getTime();
        let end =  new Date(this.editForm.endTime).getTime();
        if(start > end){
          this.$message.error("停用时间不能早于启用时间！");
          return;
        }
      }
      if (this.editForm.address == "") {
        this.$message.error("保管地址不能为空");
        return;
      }
      if (this.editForm.addressGps == "") {
        this.$message.error("地址定位不能为空");
        return;
      }
      if (this.editForm.admUsername == "") {
        this.$message.error("请选择管理员姓名");
        return;
      }
      if (this.editForm.admDeptName == "") {
        this.$message.error("请选择管理部门名称");
        return;
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            editSigDevice(params)
              .then(res => {
                this.load.edit = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.$refs["editForm"].resetFields();
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
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/
    onUserSelected: function(users) {
      console.log(JSON.stringify(users));
      this.editForm.admUserid = users[0].userid;
      this.editForm.admUsername = users[0].username;
      this.userSelectVisible = false;
    },
    handleLeftDeptNodeClick(data, node, comp) {
      if (this.selectType == 1) {
        //选择归属部门
        this.editForm.deptid = data.deptid;
        this.editForm.deptName = data.deptName;
      } else {
        //选择管理部门
        this.editForm.admDeptid = data.deptid;
        this.editForm.admDeptName = data.deptName;
        this.editForm.admBranchId = data.branchId;
      }
      this.deptSelectVisible = false;
    },
    selectDept(index) {
      this.deptSelectVisible = true;
      this.selectType = index;
    },
    //选择品牌
    selectBrand(brand){
      this.editForm.brandId = brand.id;
      this.editForm.brandName = brand.brandName;
      this.brandSelectVisible = false;
    }
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'sig-device-edit':SigDeviceEdit
    "users-select": UsersSelect,
    "brand-component":BrandComponent,
    DeptTree
  },
  mounted() {
    this.editForm = Object.assign(this.editForm, this.sigDevice);
  }
};
</script>

<style scoped>
</style>