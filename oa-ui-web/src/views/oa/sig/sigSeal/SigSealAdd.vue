<template>
  <section>
    <el-row class="page-container border padding">
      <div class="physice">
        <div class="form">
          <el-form label-width="100px" :model="formLabelAlign">
            <el-form-item label="申请单编号">
              <el-input v-model="formLabelAlign.id" disabled></el-input>
            </el-form-item>

            <el-form-item label="联系电话">
              <el-input v-model="formLabelAlign.sealPhoneno"></el-input>
            </el-form-item>

            <el-form-item label="申请人">
              <el-button type="primary" @click="userSelectVisible = true">选择</el-button>
              <el-input v-model="formLabelAlign.sealUsername" disabled style="width:68%"></el-input>
            </el-form-item>

            <el-form-item label="申请部门">
              <el-button type="primary" @click="deptSelectVisible = true">选择</el-button>
              <el-input v-model="formLabelAlign.sealDeptName" disabled style="width:68%"></el-input>
            </el-form-item>

            <el-form-item label="申请时间">
              <el-input v-model="formLabelAlign.reqTime" disabled></el-input>
              <!-- <el-date-picker v-model="formLabelAlign.reqTime" type="date" placeholder="选择日期"></el-date-picker> -->
            </el-form-item>

            <el-form-item label="用印开始时间">
              <el-date-picker v-model="formLabelAlign.startTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>

            <el-form-item label="用印结束时间">
              <el-date-picker v-model="formLabelAlign.endTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>

            <div class="detail_splitter">用印文件及份数</div>
            <div class="detail_button">
              <el-button type="primary" @click="openAddRowdialogVisible">添加材料</el-button>
            </div>
            <el-table highlight-current-row border :data="formLabelAlign.sigSealSignets">
              <el-table-column sortable type="selection" width="40"></el-table-column>
              <el-table-column sortable type="index" width="40"></el-table-column>
              <el-table-column prop="docName" label="用印材料名称" min-width="80" ></el-table-column>
              <el-table-column prop="signetType" label="印章类型" min-width="80" ></el-table-column>
              <el-table-column
                prop="signetBranchName"
                label="印章所属主体"
                min-width="80"
                
              ></el-table-column>
              <el-table-column
                prop="signetSimpleName"
                label="印章简称"
                min-width="80"
                
              ></el-table-column>
              <el-table-column
                prop="sealCount"
                label="单份文件用印次数"
                min-width="80"
                
              ></el-table-column>
              <el-table-column prop="docFileUrl" label="用印文件" min-width="80" ></el-table-column>
              <el-table-column prop="pageSeal" label="是否加盖骑缝章" min-width="80" ></el-table-column>
              <el-table-column label="操作" width="180" fixed="right" >
                <template slot-scope="scope">
                  <el-button @click="editbtn(scope.row)">改</el-button>
                  <el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-form-item label="用印事由" style="margin-top:20px">
              <el-input type="textarea" v-model="formLabelAlign.sealReason"></el-input>
            </el-form-item>
            <el-form-item label="其他说明材料" style="margin-top:20px">
              <attachment-upload
                @on-change="onUpload2"
                :archiveId="formLabelAlign.id"
                :categoryId="seal_signet"
              ></attachment-upload>
            </el-form-item>
            <el-form-item style="margin-top:20px">
              <el-col :span="24" :offset="8">
                <el-button @click.native="addSubmit" v-loading="load.add">提交</el-button>
                <el-button @click.native="handleCancel">取消</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-row>
    <el-dialog append-to-body title="操作" :visible.sync="addRowdialogVisible" width="60%">
      <el-row class="page-container border padding">
        <!--新增界面 SigSealSignet sig_seal_signet-->
        <el-form :model="addForm" label-width="150px" ref="addForm">
          <el-form-item label="用印材料名称	" prop="docName">
            <el-input v-model="addForm.docName" placeholder="用印材料名称	"></el-input>
          </el-form-item>
          <el-form-item label="印章类型" prop="signetType">
            <el-select v-model="addForm.signetType" placeholder="请选择" @change="selectSignetType">
              <el-option
                v-for="item in signetType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="印章简称" prop="signetSimpleName">
            <el-select
              v-model="addForm.signetId"
              placeholder="请选择"
              @change="selectSignetBranchId"
              v-loading="loadSignet.signet"
            >
              <el-option
                v-for="signet in signets"
                :key="signet.value"
                :label="signet.signetSimpleName"
                :value="signet.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="印章所属主体" prop="signetBranchId">
            <el-input v-model="addForm.signetBranchName" placeholder="印章所属主体" disabled></el-input>
          </el-form-item>

          <el-form-item label="单份文件用印次数" prop="sealCount">
            <el-input-number v-model="addForm.sealCount" :min="0" :max="200"></el-input-number>
          </el-form-item>
          <el-form-item label="用印文件" prop="docFileUrl">
            <!-- <el-input v-model="addForm.docFileUrl" placeholder="用印文件"></el-input> -->
            <attachment-upload
              @on-change="onUpload"
              :archiveId="addForm.id"
              :categoryId="seal_signet"
            ></attachment-upload>
          </el-form-item>
          <el-form-item label="是否加盖骑缝章" prop="pageSeal">
            <el-radio v-model="addForm.pageSeal" label="1">是</el-radio>
            <el-radio v-model="addForm.pageSeal" label="0">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-col :span="24" :offset="8">
              <el-button @click="addRowCancel">取消</el-button>
              <el-button type="primary" @click="addRowdSubmit">添加</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
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
  </section>
</template>

<script>
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import { listSigSignetBySignetType } from "@/api/oa/sig/sigSignet";
import { addSigSealAndSealSigne } from "@/api/oa/sig/sigSeal";
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import qs from "qs";
import { sn } from "@/common/js/sequence"; //id生成器
import util from "@/common/js/util"; //全局公共库

export default {
  props: ["sealId", "reqTime"],
  data() {
    return {
      activeName: "second",
      addRowdialogVisible: false,
      load: { list: false, add: false, del: false, add: false }, //查询中...
      loadSignet: { list: false, signet: false, del: false, add: false }, //查询中...
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
      remarkFile: [], //其他说明材料
      //添加一行
      addForm: {
        sealId: "",
        id: "",
        docName: "",
        docFileUrl: "",
        signetId: "",
        signetType: "",
        signetBranchId: "",
        signetBranchName: "",
        sealCount: "",
        pageSeal: "1",
        signetSimpleName: "" //印章简称
      },
      seal_signet: "seal_signet",
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
      signets: [], //印章
      userSelectVisible: false,
      deptSelectVisible: false,
      submitType: ""
    };
  },
  watch: {
    sealId: function(val) {
      this.formLabelAlign.id = val;
    },
    reqTime: function(val) {
      this.formLabelAlign.reqTime = val;
    }
  },
  created() {
    this.formLabelAlign.id = new Date().getTime(); //申请单编号为当前时间戳
    var date = new Date(); //实例一个时间对象；
    this.formLabelAlign.reqTime = util.formatDate(
      date,
      "yyyy-MM-dd HH:mm:ss"
    );
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },

    //取消添加用印文件
    addRowCancel() {
      this.addRowdialogVisible = false;
    },
    openAddRowdialogVisible() {
      this.addForm.id = sn();
      this.submitType = 1;
      this.addRowdialogVisible = true;
      
    },
    //操作用印文件
    addRowdSubmit() {
      if (this.addForm.docName == "") {
        this.$message.error("用印材料名称不能为空！");
        return;
      }
      if (this.signetType == "") {
        this.$message.error("请选择印章类型！");
        return;
      }
      if (this.addForm.signetSimpleName == "") {
        this.$message.error("印章简称不能为空！");
        return;
      }
      if (this.addForm.signetBranchName == "") {
        this.$message.error("印章所属主体不能为空！");
        return;
      }
      if (this.addForm.sealCount <= 0) {
        this.$message.error("文件用印次数要大于0！");
        return;
      }
      if (this.addForm.docFileUrl == "") {
        this.$message.error("请上传用印文件！");
        return;
      }
      if (this.submitType == 1) {
        let sigSealSignet = {
          id: this.addForm.id,
          docName: this.addForm.docName,
          signetId: this.addForm.signetId,
          signetType: this.addForm.signetType,
          signetBranchName: this.addForm.signetBranchName,
          signetBranchId: this.addForm.signetBranchId,
          signetSimpleName: this.addForm.signetSimpleName,
          sealCount: this.addForm.sealCount,
          pageSeal: this.addForm.pageSeal,
          docFileUrl: this.addForm.docFileUrl
        };
        this.formLabelAlign.sigSealSignets.push(sigSealSignet);
        this.addRowdialogVisible = false;
      }else{
         this.formLabelAlign.sigSealSignets.forEach((s, i) => {
          if (s.id == this.addForm.id) {
            this.formLabelAlign.sigSealSignets[i].id = this.addForm.id;
            this.formLabelAlign.sigSealSignets[i].docName = this.addForm.docName;
            this.formLabelAlign.sigSealSignets[i].signetId = this.addForm.signetId;
            this.formLabelAlign.sigSealSignets[i].signetType = this.addForm.signetType;
            this.formLabelAlign.sigSealSignets[i].signetBranchName = this.addForm.signetBranchName;
            this.formLabelAlign.sigSealSignets[i].signetBranchId = this.addForm.signetBranchId;
            this.formLabelAlign.sigSealSignets[i].signetSimpleName = this.addForm.signetSimpleName;
            this.formLabelAlign.sigSealSignets[i].sealCount = this.addForm.sealCount;
            this.formLabelAlign.sigSealSignets[i].pageSeal = this.addForm.pageSeal;
            this.formLabelAlign.sigSealSignets[i].docFileUrl = this.addForm.docFileUrl;
          }
        });
        this.addRowdialogVisible = false;
        this.addForm.id = "";
        this.addForm.docName = "";
        this.addForm.signetId = "";
        this.addForm.signetType = "";
        this.addForm.signetBranchName = "";
        this.addForm.signetBranchId = "";
        this.addForm.signetSimpleName = "";
        this.addForm.sealCount = "";
        this.addForm.pageSeal = "";
        this.addForm.docFileUrl = "";
      }
    },
    //用印文件
    onUpload(file, fileList) {
      console.log("file" + file.url);
      console.log("file.url" + file.url);
      this.addForm.docFileUrl = file.url;
    },
    //其他说明材料
    onUpload2(file, fileList) {
      this.remarkFile = fileList;
    },
    //根据印章类型查询印章
    selectSignetType(value) {
      let params = {
        signetType: value
      };
      this.loadSignet.signet = true;
      listSigSignetBySignetType(params).then(res => {
        var tips = res.data.tips;
        this.loadSignet.signet = false;
        if (tips.isOk) {
          this.signets = res.data.data;
          this.addForm.signetBranchId = "";
        }
      });
    },
    selectSignetBranchId(value) {
      console.log("value" + value);
      console.log(this.signets);
      for (let i = 0; i < this.signets.length; i++) {
        if (this.signets[i].id == value) {
          this.addForm.signetBranchName = this.signets[i].signetBranchName;
          this.addForm.signetSimpleName = this.signets[i].signetSimpleName;
          this.addForm.signetBranchId = this.signets[i].signetBranchId;
          this.addForm.signetId = this.signets[i].id;
        }
      }
    },
    //选择申请人
    onUserSelected: function(users) {
      this.formLabelAlign.sealUserid = users[0].userid;
      this.formLabelAlign.sealUsername = users[0].username;
      this.userSelectVisible = false;
    },
    //申请部门
    handleLeftDeptNodeClick(data, node, comp) {
      this.formLabelAlign.sealDeptid = data.deptid;
      this.formLabelAlign.sealDeptName = data.deptName;
      this.deptSelectVisible = false;
    },
    //取消
    handleCancel() {},
    //提交
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
      }
      if (this.formLabelAlign.sigSealSignets.length == 0) {
        this.$message.error("请填写用印文件！");
        return;
      }
      this.formLabelAlign.startTime = util.formatDate(
        this.formLabelAlign.startTime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.formLabelAlign.endTime = util.formatDate(
        this.formLabelAlign.endTime,
        "yyyy-MM-dd HH:mm:ss"
      );

      for (let i = 0; i < this.remarkFile.length; i++) {
        console.log(this.remarkFile[i].cdnUrl);
        if (i != 0) {
          this.formLabelAlign.remark += ",";
        }
        this.formLabelAlign.remark += this.remarkFile[i].cdnUrl;
      }
      this.load.add = true;
      let params = this.formLabelAlign;
      addSigSealAndSealSigne(params)
        .then(res => {
          this.load.add = false;
          let tips = res.data.tips;
          if (tips.isOk) {
            this.$message({
              message: "添加数据成功",
              type: "success"
            });
            this.formLabelAlign.id = this.formLabelAlign.sealUsername = this.formLabelAlign.sealDeptName = this.formLabelAlign.sealDeptid = this.formLabelAlign.sealPhoneno = this.formLabelAlign.reqTime = this.formLabelAlign.startTime = this.formLabelAlign.endTime = this.formLabelAlign.sealReason = this.formLabelAlign.remark =
              "";
            this.formLabelAlign.sigSealSignets = [];
            this.$emit("submit");
          }
        })
        .catch(err => (this.load.add = false));
    },
    //删除材料
    handleDel(row, index) {
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        let sigSealSignets = this.formLabelAlign.sigSealSignets;
        sigSealSignets.forEach((s, i) => {
          if (s.id == row.id) {
            this.formLabelAlign.sigSealSignets.splice(i, 1);
          }
        });
      });
    },
    //点击 改 按钮
    editbtn(row) {
      this.addForm = Object.assign({}, row);
      this.addRowdialogVisible = true;
      this.submitType = 2;
    }
  },
  components: {
    "attachment-upload": AttachmentUpload,
    "users-select": UsersSelect,
    "dept-tree": DeptTree
  }
};
</script>

<style scoped lang="scss">
.physice {
  .physice-header {
    height: auto;
    line-height: 20px;
    color: #4285f4;
    font-size: 16px;
    font-weight: normal;
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
}
</style>