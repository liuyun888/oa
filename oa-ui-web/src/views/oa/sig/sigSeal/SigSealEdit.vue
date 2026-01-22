<template>
  <div class="container">
    <div>
      <el-row>
        <el-form ref="formLabelAlign" :model="formLabelAlign" label-width="120px">
          <el-col :span="12">
            <el-form-item label="申请单编号" style="100%">
              <el-input v-model="formLabelAlign.id" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="	申请时间" style="100%">
              <el-input v-model="formLabelAlign.reqTime" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" style="100%">
              <el-input
                  v-model="formLabelAlign.sealUsername"
                  placeholder="请选择申请人"
                  @click.native="selectApplicant"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请部门" style="100%">
              <el-input
                  v-model="formLabelAlign.sealDeptName"
                  placeholder="请选择申请部门"
                  @click.native="selectDept"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" style="100%">
              <el-input v-model="formLabelAlign.sealPhoneno" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用印开始时间" style="100%">
              <el-date-picker
                  v-model="formLabelAlign.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用印结束时间" style="100%">
              <el-date-picker
                  v-model="formLabelAlign.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="detail_splitter">用印文件及份数</div>
      <div class="detail_button">
        <el-button type="primary" @click="clickAddDoc">添加用印文件</el-button>
      </div>
      <el-row>
        <el-table :data="formLabelAlign.sigSealSignets" border style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="docName" label="用印材料名称" width="150"></el-table-column>
          <el-table-column prop="signetType" :formatter="sgType" label="印章类型" width="150"></el-table-column>
          <el-table-column prop="signetBranchName" label="印章所属主体" width="200"></el-table-column>
          <el-table-column prop="signetSimpleName" label="印章简称" width="100"></el-table-column>
          <el-table-column prop="sealCount" label="单份文件用印次数" width="150"></el-table-column>
          <el-table-column prop="pageSeal" :formatter="psType" label="是否加盖骑缝章" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <el-button @click="dowmload(scope.row.id)">下载</el-button>
              <el-button @click="editbtn(scope.row)">改</el-button>
              <el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>


      <el-row>
        <el-form ref="formLabelAlign" :model="formLabelAlign" label-width="120px">
          <el-form-item label="用印事由" style="margin-top:20px">
            <el-input type="textarea" v-model="formLabelAlign.sealReason"></el-input>
          </el-form-item>
          <el-form-item label="其他说明材料" style="margin-top:20px">
            <el-button type="text" style="margin-right:50px" @click="downFileList">下载文件</el-button>
            <attachment-upload
                @on-change="onUpload2"
                @on-remove="getRemoveMsg2"
                :archiveId="formLabelAlign.id"
                :branchId="branchId"
                :categoryId="categoryId"
                :eliminate="eliminate2"
                :limit="3"
            ></attachment-upload>
          </el-form-item>

          <el-form-item style="margin-top:20px; text-align: center">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button @click.native="addSubmit" v-loading="load.add">提交</el-button>
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

      <!-- 添加用印文件弹框 -->
      <el-dialog append-to-body title="添加用印材料" :visible.sync="addDialogVisible" width="60%">
        <el-form :model="docObj" label-width="150px" ref="docObj">
          <el-form-item label="用印材料名称	" prop="docName">
            <el-input v-model="docObj.docName" placeholder="用印材料名称" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="印章" prop="signetSimpleName">
            <el-button
                type="text"
                style="margin-right:50px"
                @click="selectSignetDialogVisible =true"
            >请选择
            </el-button>
            <el-tag v-text="'已选择:' + docObj.signetSimpleName"></el-tag>
          </el-form-item>
          <el-form-item label="印章所属主体" prop="signetBranchId" style="width:60%">
            <el-input v-model="docObj.signetBranchName" placeholder="印章所属主体" disabled></el-input>
          </el-form-item>

          <el-form-item label="单份文件用印次数" prop="sealCount">
            <el-input-number v-model="docObj.sealCount" :min="0" :max="200"></el-input-number>
          </el-form-item>
          <el-form-item label="用印文件" prop="docFileUrl">
            <attachment-upload
                @on-change="onUpload"
                @on-remove="getRemoveMsg"
                :archiveId="docObj.id"
                :categoryId="categoryId"
                :branchId="branchId"
                :eliminate="eliminate"
                :limit="1"
            ></attachment-upload>
          </el-form-item>
          <el-form-item label="是否加盖骑缝章" prop="pageSeal">
            <el-radio v-model="docObj.pageSeal" label="1">是</el-radio>
            <el-radio v-model="docObj.pageSeal" label="0">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-col :span="24" :offset="8">
              <el-button @click="cancelBtn">取消</el-button>
              <el-button type="primary" @click="addSigSealSignet">添加</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 修改用印文件弹框 -->
      <el-dialog append-to-body title="修改用印材料" :visible.sync="editDialogVisible" width="60%">
        <el-form :model="docObj" label-width="150px" ref="docObj">
          <el-form-item label="用印材料名称	" prop="docName">
            <el-input v-model="docObj.docName" placeholder="用印材料名称" style="width:60%"></el-input>
          </el-form-item>

          <el-form-item label="印章" prop="signetSimpleName">
            <el-button type="text"
                style="margin-right:50px"
                @click="selectSignetDialogVisible =true"
            >请选择
            </el-button>
            <el-tag v-text="'已选择:' + docObj.signetSimpleName"></el-tag>
          </el-form-item>
          <el-form-item label="印章所属主体" prop="signetBranchId">
            <el-input
                v-model="docObj.signetBranchName"
                placeholder="印章所属主体"
                disabled
                style="width:60%"
            ></el-input>
          </el-form-item>
          <el-form-item label="单份文件用印次数" prop="sealCount">
            <el-input-number v-model="docObj.sealCount" :min="0" :max="200"></el-input-number>
          </el-form-item>
          <el-form-item label="用印文件" prop="docFileUrl">
            <attachment-upload
                @on-change="onUpload"
                @on-remove="getRemoveMsg"
                :archiveId="docObj.id"
                :categoryId="categoryId"
                :eliminate="eliminate"
                :branchId="branchId"
                :limit="1"
            ></attachment-upload>
          </el-form-item>
          <el-form-item label="是否加盖骑缝章" prop="pageSeal">
            <el-radio v-model="docObj.pageSeal" label="1">是</el-radio>
            <el-radio v-model="docObj.pageSeal" label="0">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-col :span="24" :offset="8">
              <el-button @click="cancelBtn2">取消</el-button>
              <el-button type="primary" @click="editSigSealSignet">修改</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--印章选择弹出框 -->
      <el-dialog append-to-body title="选择印章" :visible.sync="selectSignetDialogVisible" width="60%">
        <sig-signet-component @selsChange="selsChange"></sig-signet-component>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import {listSigSignetBySignetType} from "@/api/oa/sig/sigSignet";
import {editSigSealAndSigSealSignet} from "@/api/oa/sig/sigSeal";
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import {sn} from "@/common/js/sequence"; //id生成器
import util from "@/common/js/util"; //全局公共库
import {mapGetters} from "vuex";
import config from "@/common/config"; //全局公共库import
import {listArchiveAttachment} from "@/api/mdp/arc/archiveAttachment";
import SigSignetComponent from "@/views/oa/sig/sigSignet/SigSignetComponent";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["sigSeal"],
  props: ["sigSeal", "visible"],
  watch: {
    sigSeal: function (sigSeal) {
      this.formLabelAlign = sigSeal;
    },
    visible: function (visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
      }
    }
  },
  data() {
    return {
      //给后端的数据
      formLabelAlign: {
        id: "",
        sealUserid: "",
        sealUsername: "",
        sealDeptName: "",
        sealDeptid: "",
        sealPhoneno: "",
        reqTime: "",
        startTime: "",
        endTime: "",
        sealReason: "",
        remark: "",
        sigSealSignets: [] //要添加的用印文件
      },
      //用印文件
      docObj: {
        sealId: "",
        id: "",
        docName: "",
        docFileUrl: "",
        signetId: "",
        signetType: "",
        signetBranchId: "",
        sealCount: "",
        pageSeal: "",
        signetBranchName: "", //印章所属主体名称
        signetName: "" //印章简称
      },
      //印章类型
      signetType: [
        {
          value: "0",
          label: "公章"
        },
        {
          value: "1",
          label: "法人代表章"
        }
      ],
      sigSealSignets: [], //用印文件表格数据
      categoryId: "sig_seal_Signet", //上传文件分类
      branchId: "", //机构号
      signets: [], //用于存放印章数据
      load: {list: false, add: false, del: false, add: false}, //查询中...
      loadSelect: {list: false, select: false, del: false, add: false}, //查询中...
      eliminate: false, //传给上传文件的组件，true-清空filelist
      eliminate2: false, // 其他材料说明
      remarkFile: [], //其他说明材料
      userSelectVisible: false,
      deptSelectVisible: false,
      addDialogVisible: false, //控制添加用印文件弹框
      editDialogVisible: false, //控制修改用印文件弹框
      selectSignetDialogVisible: false //控制印章选择弹出框
    };
  },
  created() {
    this.branchId = this.userInfo.branchId;
  },
  methods: {
    //选择申请人
    selectApplicant() {
      this.userSelectVisible = true;
    },
    //选择申请人后回调
    onUserSelected: function (users) {
      this.formLabelAlign.sealUserid = users[0].userid;
      this.formLabelAlign.sealUsername = users[0].username;
      this.userSelectVisible = false;
    },
    //选择申请部门
    selectDept() {
      this.deptSelectVisible = true;
    },
    //选择申请部门后回调
    handleLeftDeptNodeClick(data, node, comp) {
      this.formLabelAlign.sealDeptid = data.deptid;
      this.formLabelAlign.sealDeptName = data.deptName;
      this.deptSelectVisible = false;
    },
    //上传用印文件回调
    onUpload(file, fileList) {
      this.docObj.docFileUrl = file.url;
    },
    //删除文件时回调
    getRemoveMsg(file, fileList) {
      this.docObj.docFileUrl = "";
    },
    getRemoveMsg2(file, fileList) {
      this.remarkFile = fileList;
    },
    //点击添加用印文件
    clickAddDoc() {
      this.addDialogVisible = true;
      this.docObj.pageSeal = "1"; //是否加盖骑缝章
      this.docObj = this.cloneObjectFn(this.docObj);
      this.eliminateObj();
      this.docObj.id = sn();
    },
    //选择印章类型时,根据印章类型查询印章
    selectSignetType(type) {
      let params = {
        signetType: type
      };
      this.loadSelect.select = true;
      listSigSignetBySignetType(params).then(res => {
        var tips = res.data.tips;
        this.loadSelect.select = false;
        if (tips.isOk) {
          this.signets = res.data.data;
        }
      });
    },
    //选择印章简称
    selectSignet(signetId) {
      this.signets.forEach(s => {
        if (s.id == signetId) {
          this.docObj.signetId = s.id;
          this.docObj.signetBranchId = s.signetBranchId;
          this.docObj.signetBranchName = s.signetBranchName;
          this.docObj.signetSimpleName = s.signetSimpleName;
        }
      });
    },
    //添加用印文件到表格中
    addSigSealSignet() {
      let flog = this.verificationDocObj();
      if (flog == true) {
        let sigSealSignet = {
          id: this.docObj.id,
          docName: this.docObj.docName,
          signetId: this.docObj.signetId,
          signetType: this.docObj.signetType,
          signetBranchName: this.docObj.signetBranchName,
          signetBranchId: this.docObj.signetBranchId,
          signetSimpleName: this.docObj.signetSimpleName,
          sealCount: this.docObj.sealCount,
          pageSeal: this.docObj.pageSeal,
          docFileUrl: this.docObj.docFileUrl
        };
        this.formLabelAlign.sigSealSignets.push(sigSealSignet);
        this.eliminate = false;
        this.addDialogVisible = false;
      }
    },
    //取消添加用印文件
    cancelBtn() {
      this.addDialogVisible = false;
      this.editDialogVisible = false;
    },
    //取消修改用印文件
    cancelBtn2() {
      this.editDialogVisible = false;
    },
    //清除docObj的数据
    eliminateObj() {
      this.eliminate = true;
      this.docObj.docName = "";
      this.docObj.signetSimpleName = "";
      this.docObj.signetBranchName = "";
      this.docObj.sealCount = "";
      this.docObj.pageSeal = "";
      this.docObj.docFileUrl = "";
      this.docObj.signetId = "";
      this.docObj.signetBranchId = "";
      this.docObj.signetBranchName = "";
      this.docObj.pageSeal = "1";
      this.docObj.signetType = "";
    },

    //表格印章类型 0 -公章 1-法人代表章
    sgType(row) {
      return row.signetType == 0 ? "公章" : "法人代表章";
    },
    //表格是否加盖骑缝章
    psType(row) {
      return row.pageSeal == 0 ? "否" : "是";
    },
    //点击 改 按钮
    editbtn(row) {
      this.editDialogVisible = true;
      // this.selectSignetType(row.signetType);
      // this.docObj.signetId = row.signetId;
      this.docObj = row;
    },
    //修改用印文件
    editSigSealSignet() {
      let flog = this.verificationDocObj();
      if (flog == true) {
        this.formLabelAlign.sigSealSignets.forEach((s, i) => {
          if (s.id == this.docObj.id) {
            this.formLabelAlign.sigSealSignets[i] = this.docObj;
          }
        });
        this.editDialogVisible = false;
      }
    },
    //点击删除用印文件
    handleDel(row, index) {
      this.formLabelAlign.sigSealSignets.splice(index, 1);
    },
    //验证
    verificationDocObj() {
      if (this.docObj.docName == "") {
        this.$message.error("用印材料名称不能为空！");
        return false;
      }
      if (this.docObj.signetType == "") {
        this.$message.error("请选择印章类型！");
        return false;
      }
      if (this.docObj.signetSimpleName == "") {
        this.$message.error("印章简称不能为空！");
        return false;
      }
      if (this.docObj.signetBranchName == "") {
        this.$message.error("印章所属主体不能为空！");
        return false;
      }
      if (this.docObj.sealCount <= 0) {
        this.$message.error("文件用印次数要大于0！");
        return false;
      }
      if (this.docObj.docFileUrl == "") {
        this.$message.error("请上传用印文件！");
        return false;
      }
      return true;
    },
    //其他说明材料
    onUpload2(file, fileList) {
      this.remarkFile = fileList;
    },
    //修改用印申请
    addSubmit() {
      if (this.formLabelAlign.sealUsername == "") {
        this.$message.error("请选择申请人！");
        return;
      }
      if (this.formLabelAlign.sealDeptName == "") {
        this.$message.error("请选择申请部门！");
        return;
      }
      if (this.formLabelAlign.sealPhoneno == "") {
        this.$message.error("联系电话不能为空！");
        return;
      } else {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(this.formLabelAlign.sealPhoneno)) {
          this.$message.error("联系电话格式不正确！");
          return;
        }
      }
      if (this.formLabelAlign.startTime == "") {
        this.$message.error("用印开始时间！");
        return;
      }
      if (this.formLabelAlign.endTime == "") {
        this.$message.error("用印结束时间!");
        return;
      } else {
        let start = new Date(this.formLabelAlign.startTime).getTime();
        let end = new Date(this.formLabelAlign.endTime).getTime();
        if (start > end) {
          this.$message.error("用印结束时间不能早于开始时间！");
          return;
        }
      }
      if (this.formLabelAlign.sigSealSignets.length == 0) {
        this.$message.error("请填写用印文件！");
        return;
      }
      if (this.formLabelAlign.sealReason == "") {
        this.$message.error("请填写用印事由！");
        return;
      }
      for (let i = 0; i < this.remarkFile.length; i++) {
        if (i != 0) {
          this.formLabelAlign.remark += ",";
        }
        this.formLabelAlign.remark += this.remarkFile[i].cdnUrl;
      }

      let params = this.formLabelAlign;
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        editSigSealAndSigSealSignet(params)
            .then(res => {
              this.load.add = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                //this.$refs["editForm"].resetFields();
                this.$emit("submit");
              }

              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.add = false));
      });
    },
    //重置
    handleCancel: function () {
      this.$emit("cancel");
    },
    cloneObjectFn(obj) {
      // 对象复制
      return JSON.parse(JSON.stringify(obj));
    },
    //下载用印文件
    dowmload(archiveId) {
      listArchiveAttachment({archiveId: archiveId}).then(res => {
        let fileurl =
            config.getArcFileUploadBasePath() + "/" + res.data.data[0].url;
        console.log(fileurl);

        this.downloadFile(fileurl, res.data.data[0].name);
      });
    },
    //批量下载文件
    downFileList() {
      listArchiveAttachment({archiveId: this.formLabelAlign.id}).then(res => {
        //let fileurl =config.getArcFileUploadBasePath()  + "/" +res.data.data[0].url
        if (res.data.data.length == 0) {
          this.$message.error('没有可下载文件！');
        } else {
          for (var i = 0; i < res.data.data.length; i++) {
            let fileurl =
                config.getArcFileUploadBasePath() + "/" + res.data.data[i].url;
            let filename = res.data.data[i].name;
            this.downloadFile(fileurl, filename);
          }
        }
      });
    },
    //执行下载文件
    downloadFile(url, filename) {
      console.log(filename);
      let a = document.createElement("a"); // 创建a标签
      let e = document.createEvent("MouseEvents"); // 创建鼠标事件对象
      e.initEvent("click", false, false); // 初始化事件对象
      a.href = url; // 设置下载地址
      a.download = filename; // 设置下载文件名
      a.dispatchEvent(e);
    },
    //选择的公章
    selsChange(signet) {
      console.log(JSON.stringify(signet));
      this.selectSignetDialogVisible = false;
      this.docObj.signetId = signet.id;
      this.docObj.signetBranchId = signet.signetBranchId;
      this.docObj.signetBranchName = signet.signetBranchName;
      this.docObj.signetSimpleName = signet.signetSimpleName;
      this.docObj.signetType = signet.signetType;
    }
  },
  mounted() {
    this.formLabelAlign = Object.assign(this.formLabelAlign, this.sigSeal);
  },
  components: {
    "attachment-upload": AttachmentUpload,
    "users-select": UsersSelect,
    "dept-tree": DeptTree,
    "sig-signet-component": SigSignetComponent
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 15px;
}

.detail_splitter {
  color: #000;
  font-size: 16px;
  margin: 6px 0px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  background-color: rgba(242, 242, 242, 1);
  line-height: 36px;
}

.detail_button {
  margin-bottom: 10px;
}
</style>
