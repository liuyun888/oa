<template>
  <div class="container">
    <div>
      <el-row>
        <!--新增/编辑界面 SigSeal 用印申请表-->
        <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
          <el-col :span="12">
            <el-form-item label="申请单编号" prop="id">
              <el-input v-model="editForm.id" placeholder="申请单编号" :maxlength="50" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间" prop="reqTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.reqTime"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人姓名" prop="sealUserid">
              <mdp-select-user v-model="editForm.sealUserid" placeholder="申请人姓名" :maxlength="50"
                               @change2="(option)=>{
                                        editSomeFields(editForm,'sealUsername',option.name);
                                        editSomeFields(editForm,'sealUserid',option.id); }"
                               :disabled="  disabledJudge('sealUserid')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请部门" prop="sealDeptid">
              <mdp-select-dept v-model="editForm.sealDeptid" placeholder="申请部门" :maxlength="50"
                               @change2="(option)=>{
                                        editSomeFields(editForm,'sealDeptid',option.id);
                                        editSomeFields(editForm,'sealDeptName',option.name);}"
                               :disabled="  disabledJudge('sealDeptid')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="sealPhoneno">
              <el-input v-model="editForm.sealPhoneno" placeholder="联系电话" :maxlength="50"
                        @change="editSomeFields(editForm,'sealPhoneno',$event)"
                        :disabled="  disabledJudge('sealPhoneno')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用印开始时间" prop="startTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="  disabledJudge('startTime')"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用印结束时间" prop="endTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="  disabledJudge('endTime')"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="detail_splitter">用印文件及份数</div>
      <div class="detail_button">
        <el-button type="primary" @click="clickAddDoc">添加用印文件</el-button>
      </div>
      <el-row>
        <el-table :data="editForm.sigSealSignets" border style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="docName" label="用印材料名称" width="150"></el-table-column>
          <el-table-column prop="signetType" :formatter="sgType" label="印章类型" width="150"></el-table-column>
          <el-table-column prop="signetBranchName" label="印章所属主体" width="200"></el-table-column>
          <el-table-column prop="signetSimpleName" label="印章简称" width="100"></el-table-column>
          <el-table-column prop="sealCount" label="单份文件用印次数" width="150"></el-table-column>
          <el-table-column prop="pageSeal" :formatter="psType" label="是否加盖骑缝章" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <!--              报错 -->
              <el-button @click="dowmload(scope.row.id)">下载</el-button>
              <el-button @click="editbtn(scope.row)">改</el-button>
              <el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <el-form ref="editForm" :model="editForm" label-width="120px">
          <el-form-item label="用印事由" style="margin-top:20px">
            <el-input type="textarea" v-model="editForm.sealReason"></el-input>
          </el-form-item>
          <el-form-item label="其他说明材料" style="margin-top:20px">
            <el-button type="text" style="margin-right:50px" @click="downFileList">下载文件</el-button>
                        <attachment-upload @on-change="onUpload2" @on-remove="getRemoveMsg2"
                                           :archiveId="editForm.id" :branchId="branchId" :categoryId="categoryId"
                                           :eliminate="eliminate2" :limit="3"></attachment-upload>
          </el-form-item>
        </el-form>
      </el-row>

      <!--      Form 按钮-->
      <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
          <el-button @click.native="close">关闭</el-button>
          <el-button v-if="currOpType=='add' || currOpType=='edit'" v-loading="load.edit" type="primary"
                     @click.native="addSubmit"
                     :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
          </el-button>
        </el-row>
      </slot>

      <!-- 修改用印文件弹框 -->
      <el-dialog append-to-body title="修改用印材料" :visible.sync="editDialogVisible" width="60%">
        <el-form :model="docObj" label-width="150px" ref="docObj">
          <el-form-item label="用印材料名称	" prop="docName">
            <el-input v-model="docObj.docName" placeholder="用印材料名称" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="印章" prop="signetSimpleName">
            <el-button type="text" style="margin-right:50px" @click="selectSignetDialogVisible =true">请选择
            </el-button>
            <el-tag v-text="'已选择:' + docObj.signetSimpleName"></el-tag>
          </el-form-item>
          <el-form-item label="印章所属主体" prop="signetBranchId">
            <el-input v-model="docObj.signetBranchName" placeholder="印章所属主体" disabled
                      style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="单份文件用印次数" prop="sealCount">
            <el-input-number v-model="docObj.sealCount" :min="0" :max="200"></el-input-number>
          </el-form-item>
          <el-form-item label="用印文件" prop="docFileUrl">
            <attachment-upload @on-change="onUpload" @on-remove="getRemoveMsg" :archiveId="docObj.id"
                               :categoryId="categoryId" :eliminate="eliminate" :branchId="branchId"
                               :limit="1"></attachment-upload>
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

      <!-- 添加用印文件弹框 -->
      <el-dialog append-to-body title="添加用印材料" :visible.sync="addDialogVisible" width="60%">
        <el-form :model="docObj" label-width="150px" ref="docObj">
          <el-form-item label="用印材料名称	" prop="docName">
            <el-input v-model="docObj.docName" placeholder="用印材料名称" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="印章" prop="signetSimpleName">
            <el-button type="text" style="margin-right:50px" @click="selectSignetDialogVisible =true">请选择</el-button>
            <el-tag v-text="'已选择:' + docObj.signetSimpleName"></el-tag>
          </el-form-item>
          <el-form-item label="印章所属主体" prop="signetBranchId" style="width:60%">
            <el-input v-model="docObj.signetBranchName" placeholder="印章所属主体" disabled></el-input>
          </el-form-item>

          <el-form-item label="单份文件用印次数" prop="sealCount">
            <el-input-number v-model="docObj.sealCount" :min="0" :max="200"></el-input-number>
          </el-form-item>
          <el-form-item label="用印文件" prop="docFileUrl">
            <attachment-upload @on-change="onUpload" @on-remove="getRemoveMsg" :archiveId="docObj.id"
                               :categoryId="categoryId" :branchId="branchId" :eliminate="eliminate"
                               limit=1></attachment-upload>
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

      <!--印章选择弹出框 -->
      <el-dialog append-to-body title="选择印章" :visible.sync="selectSignetDialogVisible" width="60%">
        <sig-signet-component @selsChange="selsChange"></sig-signet-component>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import SigSignetComponent from "@/views/oa/sig/sigSignet/SigSignetComponent";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import * as SigSealApi from '@/api/oa/sig/sigSeal';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import config from "@/common/config"; //全局公共库import
import {sn} from "@/common/js/sequence"; //id生成器
import {listArchiveAttachment} from "@/api/mdp/arc/archiveAttachment";
import {editSigSealAndSigSealSignet} from "@/api/oa/sig/sigSeal";

export default {
  name: 'sigSealForm',
  mixins: [MdpFormMixin],
  components: {
    "attachment-upload": AttachmentUpload,
    "sig-signet-component": SigSignetComponent
  },
  computed: {},
  props: {},
  watch: {
    // docObj: {
    //   deep: true,
    //   handler(newV, oldV) {
    //     console.log("docObj", newV)
    //   },
    // },
    // 'editForm.sigSealSignets'(newV, oldV) {
    //   console.log("editForm.sigSealSignets", newV)
    // }
  },
  data() {
    return {
      remarkFile: [], //其他说明材料
      eliminate2: false, // 其他材料说明
      eliminate: false, //传给上传文件的组件，true-清空filelist
      branchId: "", //机构号
      categoryId: "sig_seal_Signet", //上传文件分类
      editDialogVisible: false, //控制修改用印文件弹框
      selectSignetDialogVisible: false, //控制印章选择弹出框
      addDialogVisible: false, //控制添加用印文件弹框
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
      editFormRules: {
        id: [
          //{ required: true, message: '此项必填', trigger: 'change' },
          //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
        ],
        sealUsername: [
          {required: true, message: '请选择申请人！', trigger: 'blur'},
        ],
        sealDeptName: [
          {required: true, message: '请选择申请部门！', trigger: 'blur'},
        ],
        sealPhoneno: [
          {required: true, message: '联系电话不能为空！', trigger: 'blur'},
          {
            pattern: '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$',
            message: '联系电话格式不正确！',
            trigger: 'blur'
          }
        ],
        startTime: [
          {required: true, message: '用印开始时间不能为空！', trigger: 'blur'},
        ],
        endTime: [
          {required: true, message: '用印结束时间不能为空！', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              let start = new Date(this.editForm.startTime).getTime();
              let end = new Date(value).getTime();
              if (start > end) {
                callback(new Error('用印结束时间不能早于开始时间！'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        sigSealSignets: [
          {required: true, message: '请填写用印文件！', trigger: 'blur'},
        ],
        sealReason: [
          {required: true, message: '请填写用印事由！', trigger: 'blur'},
        ]
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
      editForm: {
        id: '',
        sealUserid: '',
        sealUsername: '',
        sealDeptid: '',
        sealDeptName: '',
        sealPhoneno: '',
        reqTime: '',
        startTime: '',
        endTime: '',
        sealBranchId: '',
        sealBranchName: '',
        bizFlowState: '',
        bizProcInstId: '',
        sealStatus: '',
        sealReason: '',
        remark: '',
        sigSealSignets: [] //要添加的用印文件
      },
      //增删改查(含批量)接口
      apis: {
        queryById: SigSealApi.querySigSealById,
        add: SigSealApi.addSigSeal,
        edit: SigSealApi.editSigSeal,
        editSomeFields: SigSealApi.editSomeFieldsSigSeal,
        editSealSignet: SigSealApi.editSigSealAndSigSealSignet
      },
      editable: true,//是否可编辑模式
    }
  },
  methods: {
    // test(option) {
    //   console.log("test", option)
    // },
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
    //批量下载文件
    downFileList() {
      listArchiveAttachment({archiveId: this.editForm.id}).then(res => {
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

    //修改用印文件
    editSigSealSignet() {
      let flog = this.verificationDocObj();
      let arr = []
      if (flog == true) {
        this.editForm.sigSealSignets.forEach((s, i) => {
          if (s.id == this.docObj.id) {
            arr.push(this.docObj);
          } else {
            arr.push(this.editForm.sigSealSignets[i])
          }
        });
        this.editForm.sigSealSignets = arr
        this.editDialogVisible = false;
      }
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
        this.editForm.sigSealSignets.push(sigSealSignet);
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
    //选择的公章
    selsChange(signet) {
      console.log(JSON.stringify(signet));
      this.selectSignetDialogVisible = false;
      this.docObj.signetId = signet.id;
      this.docObj.signetBranchId = signet.signetBranchId;
      this.docObj.signetBranchName = signet.signetBranchName;
      this.docObj.signetSimpleName = signet.signetSimpleName;
      this.docObj.signetType = signet.signetType;
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
    //其他说明材料
    onUpload2(file, fileList) {
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
    cloneObjectFn(obj) {
      // 对象复制
      return JSON.parse(JSON.stringify(obj));
    },
    //点击 改 按钮
    editbtn(row) {
      this.editDialogVisible = true;
      // this.selectSignetType(row.signetType);
      // this.docObj.signetId = row.signetId;
      // this.docObj = row;
      this.docObj = this.cloneObjectFn(row);
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
    //点击删除用印文件
    handleDel(row, index) {
      this.editForm.sigSealSignets.splice(index, 1);
    },
    //表格印章类型 0 -公章 1-法人代表章
    sgType(row) {
      return row.signetType == 0 ? "公章" : "法人代表章";
    },
    //表格是否加盖骑缝章
    psType(row) {
      return row.pageSeal == 0 ? "否" : "是";
    },
    //修改用印申请
    addSubmit() {
      for (let i = 0; i < this.remarkFile.length; i++) {
        if (i != 0) {
          this.editForm.remark += ",";
        }
        this.editForm.remark += this.remarkFile[i].cdnUrl;
      }

      var form = this.$refs['editFormRef'];
      if (!form) {
        form = this.$refs['editForm'];
      }
      form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.load.edit = true
            let params = Object.assign({}, this.editForm);
            this.stringOfExpand(params, this.expandFieldName)
            if (!this.preParamCheck(params)) {
              this.load.edit = false
              return;
            }
            var func = this.apis.add
            if (this.currOpType == 'edit') {
              func = this.apis.editSealSignet
            }
            func(params).then((res) => {
              this.load.edit = false
              var tips = res.data.tips;
              if (tips.isOk) {
                this.afterSubmit(res, tips.isOk, this.currOpType);
              }
              this.$notify({
                position: 'bottom-left',
                showClose: true,
                message: tips.msg,
                type: tips.isOk ? 'success' : 'error'
              });
            }).catch(err => this.load.edit = false);
          });
        } else {
          this.$notify({showClose: true, message: "表单验证不通过，请修改表单数据再提交", type: 'error'});
        }
      });
    },

    //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
    initCurrData() {

    },
    /**
     * 检查参数是否满足调用后台接口的条件
     * @returns true / false
     */
    preParamCheck(params) {
      return true;
    },
    /**
     * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
     * @param {*} row 当前选中的行
     * @param {*} fieldName 修改的字段名
     * @param {*} $event 修改后的值
     * @param {*} params 将要提交服务器的参数
     * @returns true/false 返回false ,将取消更新数据库
     */
    editSomeFieldsCheck(row, fieldName, $event, params) {
      if (this.editable == false) {
        return false;
      }
      params[fieldName] = $event
      return true;
    },
  },
  mounted() {

  }
}

</script>

<style scoped>

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
