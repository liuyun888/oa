<template> 
<section class="page-container padding border">
    <el-row v-if="showType=='select'">
      <el-col :span="20">
        <div class="left">
          <div class="left-header">
            <el-input
              placeholder="查询模板"
              suffix-icon="el-icon-search"
              v-model="key"
              style="width:50%"
            ></el-input> 
          </div>
          <div class="left-content" v-loading="load.list">
            <div v-for="(item,index) in templateListCpd" :key="index">
              <div class="left-contetn-title" v-text="item.name+'('+item.templates.length+')'"></div>
              <ul>
                <li
                  v-for="(i,index) in item.templates"
                  :key="index"
                  :class="{clickli:i.id == clickli}" 
                >
                  <span v-text="i.name"></span>
                  <div class="record-button">
                    <el-button
                      type="text"
                      style="font-size:12px"
                      @click.stop="selectTemplate(i)"
                    >选择</el-button> 
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="6">
        <div class="left">
          <div class="left-header">
            <el-input
              placeholder="查询模板"
              suffix-icon="el-icon-search"
              v-model="key"
              style="width:50%"
            ></el-input>
            <el-button @click="addClick">新建</el-button>
          </div>
          <div class="left-content" v-loading="load.list">
            <div v-for="(item,index) in templateListCpd" :key="index">
              <div class="left-contetn-title" v-text="item.name+'('+item.templates.length+')'"></div>
              <ul>
                <li
                  v-for="(i,index) in item.templates"
                  :key="index"
                  :class="{clickli:i.id == clickli}"
                  @click="showTemplate(i.id)"
                >
                  <span v-text="i.name"></span>
                  <div class="record-button">
                    <el-button
                      type="text"
                      style="font-size:12px"
                      @click.stop="copyTemplate(i.id)"
                    >复制</el-button>
                    <el-button type="text" style="font-size:12px" @click.stop="delTemplate(i.id)">删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18" class="border" >
        <div class="right">
          <div class="right-header">
            <div class="right-title" v-text="title"></div>
            <div class="right-operation">
              <el-button
                type="primary"
                style="float:right"
                v-loading="load.add"
                @click.native="saveBtn"
                :disabled="load.add==true"
              >提交</el-button>
            </div>
          </div>
          <div class="right-content" v-loading="load.show">
            <el-form ref="addForm" :model="addForm" size="small" label-width="150px" :rules="addFormRules">
              <el-form-item label="考核模板名称" prop="name">
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>
              <el-form-item label="考核类型" prop="schemeType">
                <el-select v-model="addForm.schemeType" placeholder="请选择" style="width:100%" @change="onSchemeTypeChange">
                  <el-option
                    v-for="item in dicts.jxSchemeType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考核模板总分" prop="totalPoints">
                <el-input type="number" min=5 max=200 v-model="addForm.totalPoints"></el-input>
              </el-form-item>
              <el-form-item label="模板适用对象">
                <el-row>
                <el-tag
                  class="empty-tag el-icon-delete-solid"
                  v-if="linksUser.length > 0"
                  @click="emptyLinks('0')"
                >清空个人</el-tag>
                <el-divider direction="vertical" class="left-frame" v-if="linksUser.length > 0"></el-divider>
                <el-tag
                  type="info"
                  class="border-tag"
                  v-for="item in linksUser"
                  :key="item.linkPkId"
                  style="margin-right:20px"
                  closable
                  @close="handleClose(item.linkPkId,item.linkType)"
                >{{item.linkPkName}}</el-tag>
                <i @click="userSelectVisible = true" class="el-icon-circle-plus-outline selectUser">个人</i> 
                </el-row>
                <el-row>
                  <el-tag
                    class="empty-tag el-icon-delete-solid"
                    v-if="linksDept.length > 0"
                    @click="emptyLinks('1')"
                  >清空部门</el-tag>
                  <el-divider direction="vertical" class="left-frame" v-if="linksDept.length > 0"></el-divider>
                  <el-tag
                    type="info"
                    class="border-tag"
                    v-for="item in linksDept"
                    :key="item.linkPkId"
                    style="margin-right:20px"
                    closable
                    @close="handleClose(item.linkPkId,item.linkType)"
                  >{{item.linkPkName}}</el-tag>
                  <i @click="deptSelectVisible = true" class="el-icon-circle-plus-outline selectUser">部门</i> 
                </el-row>
                <el-row>
                <el-tag
                  class="empty-tag el-icon-delete-solid"
                  v-if="linksBranch.length > 0"
                  @click="emptyLinks('2')"
                >清空机构</el-tag>
                <el-divider direction="vertical" class="left-frame" v-if="linksBranch.length > 0"></el-divider>
                <el-tag
                  type="info"
                  class="border-tag"
                  v-for="item in linksBranch"
                  :key="item.linkPkId"
                  style="margin-right:20px"
                  closable
                  @close="handleClose(item.linkPkId,item.linkType)"
                >{{item.linkPkName}}</el-tag>
                <i @click="links.push({linkType:'2',linkPkId:userInfo.branchId,linkPkName:userInfo.branchName})" class="el-icon-circle-plus-outline selectUser">全体员工</i> 
                </el-row>
                <el-row>
                <el-tag
                  class="empty-tag el-icon-delete-solid"
                  v-if="linksPost.length > 0"
                  @click="emptyLinks('4')"
                >清空岗位</el-tag>
                <el-divider direction="vertical" class="left-frame" v-if="linksPost.length > 0"></el-divider>
                <el-tag
                  type="info"
                  class="border-tag"
                  v-for="item in linksPost"
                  :key="item.linkPkId"
                  style="margin-right:20px"
                  closable
                  @close="handleClose(item.linkPkId,item.linkType)"
                >{{item.linkPkName}}</el-tag> 
                <i @click="postSelectVisible = true" class="el-icon-circle-plus-outline selectUser">岗位</i>                 
                </el-row>
              </el-form-item>
              <el-row class="row-label">考核模板内容</el-row>
              <el-table :data="addForm.accessContents" style="width: 100%;margin-bottom:20px">
                 <el-table-column prop="seqNum" label="序号" width="100">
                  <template slot-scope="scope">
                    <el-input  size="small" type="number" v-model="scope.row.seqNum" placeholder></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="指标分类" width="150">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.categoryName" placeholder></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="指标名称" min-width="180">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.name" placeholder></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="weight" label="分值%" width="100">
                  <template slot-scope="scope">
                    <el-input type="number" min=0 max=100  size="small" v-model="scope.row.weight" placeholder></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="指标说明" min-width="200">
                  <template slot-scope="scope">
                    <el-input  type="textarea" rows=2  size="small" v-model="scope.row.remark" placeholder></el-input>
                  </template>
                </el-table-column> 
                <el-table-column prop="icon" width="80">
                  <template slot="header">
                    <i class="el-icon-circle-plus-outline" style="font-size:30px" @click="addRow"></i>
                  </template>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-circle-close"
                      style="font-size:30px"
                      @click="delRow(scope.$index)"
                    ></i>
                  </template>
                </el-table-column>
              </el-table>
              <el-form-item label="考核模板说明" prop="remark">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="addForm.remark"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog append-to-body title="用户选择" :visible.sync="userSelectVisible" width="80%">
      <users-select @confirm="onUserSelected"></users-select>
    </el-dialog>
    
    <!-- 选择部门 -->
    <el-dialog append-to-body title="选择部门" :visible.sync="deptSelectVisible" width="60%">
      <dept-tree show-root default-expand-all show-checkbox :show-confirm="true" :expand-on-click-node="false"
        @confirm="onDeptsSelected" multiple></dept-tree>
    </el-dialog>

    <el-dialog append-to-body title="岗位选择" :visible.sync="postSelectVisible" width="80%">
      <post-select-common @select="onPostsSelected"></post-select-common>
    </el-dialog> 
</section>
</template>
<script>
import {
  addJxAssessTemplate, 
  addAccessTemplate,
  listJxAssessTemplate,
  getJxAssessTemplate,
  editAccessTemplate,
  delJxAssessTemplate,
  copyAccessTemplate
} from "@/api/oa/jx/jxAssessTemplate";
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import { sn } from "@/common/js/sequence"; //id生成器

import { listJxAssessScheme} from '@/api/oa/jx/jxAssessScheme';
import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import { mapGetters } from "vuex";
import PostSelectCommon from '../../mdp/sys/post/PostSelectCommon.vue';
export default {
  props:['showType','schemeType'],
  computed: {
    ...mapGetters(["userInfo"]),
    linksUser(){
      return this.links.filter(i=>i.linkType=='0')
    },
    linksDept(){
      return this.links.filter(i=>i.linkType=='1')
    },
    linksBranch(){
      return this.links.filter(i=>i.linkType=='2')
    },
    linksProject(){
      return this.links.filter(i=>i.linkType=='3')
    },
    linksPost(){
      return this.links.filter(i=>i.linkType=='4')
    },
    templateListCpd(){
      var templates=this.jxAssessTemplateList;
      var schemeTypes=this.dicts.jxSchemeType;
      schemeTypes.forEach(i=>{
        i.templates=templates.filter(k=>k.schemeType==i.id)
      })
      if(this.schemeType){
         return schemeTypes.filter(i=>i.id==this.schemeType);
      }else{
        return schemeTypes
      }
     
    }
  },
  data() {
    return {
      input: "",
      title: "新建考核模板",
      value: "", 
      addForm: {
        id: "",
        branchId: "",
        name: "",
        schemeType: "",
        totalPoints: 100,
        remark: "",
        tstatus:'',
        accessContents: [
          {
            id: "",
            name: "",
            categoryName: "",
            weight: "",
            remark: "",
            templateId: "",
            branchId: "",
            seqNum: ""
          }
        ]
      },
      addFormRules: {
        name: [
          { required: true, message: "考核模板名称不能为空", trigger: "blur" }
        ],
        totalPoints: [
          { required: true, message: "考考核模板总分不能为空", trigger: "blur" }
        ]
      },
      load: { list: false, edit: false, del: false, add: false, show: false }, //查询中...
      AllUserList: [],
      state: "",
      timeout: null,
      flag: true,
      userSelectVisible: false,
      jxAssessTemplateList: [],
      key: "",
      operation: 1, //1-新建，2-编辑
      title: "新建考核模板",
      clickli: "",
      links:[],
      deptSelectVisible:false,
      postSelectVisible:false,
      dicts:{
        jxSchemeType:[],
      }
    };
  },
  watch: {
    links(val) {
      if (this.links.length > 0) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    },
    key(val) {
      this.getJxAssessTemplateList();
    },
    schemeType(){
      this.getJxAssessTemplateList();
    }
  },
  methods: { 
    //添加一行数据
    addRow() {
      let accessContent = {
        id: "",
        name: this.addForm.accessContents.length+1,
        categoryName: "",
        weight: "",
        remark: "",
        templateId: "",
        branchId: "",
        seqNum: this.addForm.accessContents.length+1
      };
      this.addForm.accessContents.push(accessContent);
    },
    //删除一行
    delRow(index) {
      this.addForm.accessContents.splice(index, 1);
    },
    //新增按钮
    addClick() {
      this.operation = 1;
      this.title = "新建考核模板";
      this.$refs["addForm"].resetFields();
      this.links = [];
      this.addForm.accessContents = [
        {
          id: "",
          name: "",
          categoryName: "",
          weight: "",
          remark: "",
          templateId: "",
          branchId: "",
          seqNum: this.addForm.accessContents.length+1
        }
      ];
    },
    //保存按钮
    saveBtn() {
      if (this.operation == 1) {
        this.addSubmin();
      } else {
        this.editSubmin();
      }
    },
    //新建模板
    addSubmin() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let weightSum = 0;
          this.addForm.accessContents.forEach((item, index) => {
            weightSum += parseInt(item.weight);
          });
          if (weightSum != 100) {
            this.$message({
              message: "分值之和必须等于100",
              type: "error"
            });
            return;
          }
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true; 
            let params = Object.assign({}, this.addForm);
            params.links = this.links;
            addAccessTemplate(params)
              .then(res => {
                this.load.add = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.$refs["addForm"].resetFields();
                  this.links = [];
                  this.addForm.accessContents = [
                    {
                      id: "",
                      name: "",
                      remark: "",
                      weight: "",
                      remark: "",
                      templateId: "",
                      branchId: "",
                      seqNum: ""
                    }
                  ];
                  this.getJxAssessTemplateList();
                }
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? "success" : "error"
                });
              })
              .catch(err => (this.load.add = false));
          });
        }
      });
    },
    //选择后回调
    onUserSelected(users) {
      users.forEach(i=>{
        if(!this.links.some(i=>i.linkType=='0' && i.linkPkId==i.userid)){
           this.links.push({linkType:'0',linkPkId:i.userid,linkPkName:i.username});
        } 
      }) 
      this.userSelectVisible=false;
    },
    //删除一个
    handleClose(linkPkId,linkType) {
      this.links=this.links.filter(i=>!(i.linkType==linkType && i.linkPkId==linkPkId)) 
    }, 
    //获取模板列表
    getJxAssessTemplateList() {
      let params = {
        branchId: this.userInfo.branchId
      };
      if (this.key != "") {
        params.key = this.key;
      }
      if(this.schemeType){
        params.schemeType=this.schemeType
      }
      this.load.list = true;
      listJxAssessTemplate(params).then(res => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.load.list = false;
          this.jxAssessTemplateList = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: "error"
          });
        }
      });
    },
    //回显
    showTemplate(templateId) {
      this.clickli = templateId;
      this.operation = 2;
      this.title = "编辑考核模板";
      let params = {
        id: templateId,
        branchId: this.userInfo.branchId
      };
      this.load.show = true;
      getJxAssessTemplate(params).then(res => {
        this.load.show = false;
        let tips = res.data.tips;
        if (tips.isOk) {
          this.addForm = res.data.data;
          this.links = res.data.data.links;
        } else {
          this.$message({
            message: tips.msg,
            type: "error"
          });
        }
      });
    },
    //修改模板
    editSubmin() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let weightSum = 0;
          this.addForm.accessContents.forEach((item, index) => {
            weightSum += parseInt(item.weight);
          });
          if (weightSum != 100) {
            this.$message({
              message: "权重之和必须等于100",
              type: "error"
            });
            return;
          }
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true; 
            let params = Object.assign({}, this.addForm);
            params.links = this.links;
            editAccessTemplate(params)
              .then(res => {
                this.load.add = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.getJxAssessTemplateList();
                }
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? "success" : "error"
                });
              })
              .catch(err => (this.load.add = false));
          });
        }
      });
    },
    //删除模板
    delTemplate(id) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        let params = { id: id };
        delJxAssessTemplate(params)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.$refs["addForm"].resetFields();
              this.links = [];
              this.addForm.accessContents = [];
              this.title =  "新建考核模板",
              this.getJxAssessTemplateList();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    selectTemplate(template){
      this.$emit('select',template)

    },
    //复制模板
    copyTemplate(id) {
      let params = {
        id: id
      };
      copyAccessTemplate(params).then(res => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.getJxAssessTemplateList();
        }
        this.$message({
          message: tips.msg,
          type: tips.isOk ? "success" : "error"
        });
      });
    },
    emptyLinks(linkType){
      this.links=this.links.filter(i=>i.linkType!=linkType)
    }, 
    onDeptsSelected(depts){ 
      depts.forEach(i=>{
        if(!this.links.some(k=>k.linkType=='1' && k.linkPkId==i.deptid)){
          this.links.push({linkType:'1',linkPkId:i.deptid,linkPkName:i.deptName});
        }
      })
      this.deptSelectVisible=false;
    },
    onPostsSelected(posts){ 
      posts.forEach(i=>{
        if(!this.links.some(k=>k.linkType=='4' && k.linkPkId==i.id)){
          this.links.push({linkType:'4',linkPkId:i.id,linkPkName:i.postName});
        }
      })
      this.postSelectVisible=false;
    },
     
      onSchemeTypeChange(){
        var scheme=this.dicts.jxSchemeType.find(i=>i.id==this.addForm.schemeType)
        this.addForm.name=scheme.name+"指标模板"
      }
  },
  mounted() {
    initSimpleDicts('all',['jxSchemeType']).then(res=>this.dicts=res.data.data);
     this.getJxAssessTemplateList();
     document.addEventListener("click", e => {
      if (
        e.target.className != "el-input__inner" &&
        e.target.className != "el-icon-circle-plus-outline selectUser"
      ) {
        if (this.links.length > 0) {
          this.flag = false;
        }
      }
    });
  },
  components: {
    "users-select": UsersSelect,
    DeptTree,
    PostSelectCommon,
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 15px;
  background: rgba(0, 0, 0, 0.1);
}
.left {
  background-color: #ffffff;
  height: 50rem;
  border-radius: 2px;
  overflow: hidden;
  .left-header {
    height: 3rem;
    background: #fafbfc;
    border-bottom: 1px solid #efefef;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .left-title {
      padding-left: 15px;
      font-size: 14px;
      padding-top: 1rem;
    }
  }
  .left-content {
    color: #666666;
    height: 47rem;
    font-size: 12px;
    .left-contetn-title {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
    }
    .left-contetn-title:hover {
      background: #ecf0f1;
    }
    ul {
      padding: 0px;
      margin: 0px;
    }
    li {
      color: #666666;
      height: 40px;
      line-height: 40px;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0px;
      list-style-type: none;
    }
    li:hover {
      background: #e7ecf6;
    }
    .clickli {
      background: #e7ecf6;
    }
    .record-button {
      display: none;
    }
    li:hover .record-button {
      display: block;
    }
  }
}
.right {
  background-color: #ffffff;
  height: 50rem;
  border-radius: 2px;
  overflow: hidden;
  .right-header {
    height: 3rem;
    background: #fafbfc;
    border-bottom: 1px solid #efefef;
    display: flex;
    justify-content: space-between;
    align-content: center;
    .right-title {
      padding-top: 1rem;
      font-size: 14px;
      padding-left: 15px;
    }
    .right-operation {
      padding-right: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .right-content {
    color: #666666!important;
    height: 47rem;
    padding: 15px;
    overflow: auto;
  }
  .empty-tag {
    padding-left: 13px;
    padding-right: 13px;
    line-height: 24px;
    background-color: transparent;
    border: 2px solid #e8e8e8;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 50px;
    color: #333333;
    font-size: 14px;
  }
  .empty-tag:hover {
    border: 2px solid #00a8ff;
    color: #00a8ff;
  }
  .left-frame {
    height: 2em !important;
  }
  .border-tag {
    border-radius: 50px;
    color: #333333;
    font-size: 14px;
  }
  .row-label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #909399;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: 700;
  }
  .right-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #d1d1d1;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .right-content::-webkit-scrollbar-thumb {
    background-color: #d1d1d1;
    height: 50px;
    outline-offset: -1px;
    outline: 1px solid #fff;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    border-right: 1px solid #fff;
    border-left: 1px solid #fff;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .right-content::-webkit-scrollbar-track {
    background-color: #fff;
  }
}
</style>