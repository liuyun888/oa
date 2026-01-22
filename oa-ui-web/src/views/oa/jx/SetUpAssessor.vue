<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="left">
          <div class="left-header">
            <div class="left-title">
              <el-button class="left-input" @click="userSelectVisible3 = true">全部人员</el-button>
            </div>
          </div>
          <div class="left-content">
            <div class="left-content-header">未设置考核人人员</div>
            <div class="left-content-ul">
              <ul>
                <li
                  v-for="(i,index) in noAssessors"
                  :key="index"
                  v-text="i.username"
                  @click="clickUser(i)"
                ></li>
              </ul>
            </div>
            <div style="text-align: center;margin:20px">
              <el-button
                class="left-content-button"
                @click="loadMore"
                v-loading="load.list"
                :disabled="load.list==true"
                v-show="isHide"
              >点击加载更多</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="right">
          <div class="right-header">
            <div class="right-title">设置考核人</div>
            <div class="right-operation">
              <el-button
                type="primary"
                style="float:right"
                v-loading="load.add"
                :disabled="load.add==true"
                @click="addJxAssessByPersion"
              >保存</el-button>
            </div>
          </div>
          <div class="right-content">
            <div class="right-content-row">
              <div class="row-left">当前人员</div>
              <div class="row-right" v-text="submitData.username"></div>
            </div>
            <div class="right-content-row">
              <div class="row-left">复评人</div>
              <div class="row-right">
                <el-tag
                  type="info"
                  class="border-tag"
                  style="margin-right:20px"
                  v-if="submitData.assUsername != '' && submitData.assUsername != null"
                  @close="closePeople"
                  closable
                >{{submitData.assUsername}}</el-tag>
                <el-button type="text" @click="userSelectVisible1 = true">选择复评人</el-button>
              </div>
            </div>
            <div class="right-content-row">
              <div class="row-left">核定人</div>
              <div class="row-right">
                <el-tag
                  type="info"
                  class="border-tag"
                  v-if="vouchName != '' && vouchName != null"
                  closable
                  @close="handleVouch"
                >{{vouchName}}</el-tag>
                <el-button type="text" @click="userSelectVisible4= true">选择被考核人</el-button>
              </div>
            </div>
            <div class="right-content-row">
              <div class="row-left">被考核人</div>
              <div class="row-right">
                <el-tag
                  class="empty-tag el-icon-delete-solid"
                  v-if="submitData.selectUsers!= null && submitData.selectUsers.length > 0"
                  @click="emptyUser"
                  style="margin-bottom:15px"
                >清空</el-tag>
                <el-tag
                  type="info"
                  class="border-tag"
                  v-for="item in submitData.selectUsers"
                  :key="item.userid"
                  style="margin-right:15px;margin-bottom:15px"
                  closable
                  @close="handleClose(item.userid)"
                >{{item.username}}</el-tag>
                <el-button type="text" @click="userSelectVisible2= true">选择被考核人</el-button>
              </div>
            </div>
            <div class="footer">注：考核人指对当前人员有考核权限的人,被考核人指当前人员有其考核权限的人</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 选择复评人 -->
    <el-dialog append-to-body title="用户选择" :visible.sync="userSelectVisible1" width="80%">
      <users-select1 @confirm="onUserSelected1" :is-single-user="true"></users-select1>
    </el-dialog>

    <!-- 选择被考核人 -->
    <el-dialog append-to-body title="用户选择" :visible.sync="userSelectVisible2" width="80%">
      <users-select2 @confirm="onUserSelected2"></users-select2>
    </el-dialog>

    <!-- 全部人员 -->
    <el-dialog append-to-body title="用户选择" :visible.sync="userSelectVisible3" width="80%">
      <users-select3 @confirm="onUserSelected3" :is-single-user="true"></users-select3>
    </el-dialog>
    <!-- 选择被核定人 -->
    <el-dialog append-to-body title="用户选择" :visible.sync="userSelectVisible4" width="80%">
      <users-select2 @confirm="onUserSelected4" :is-single-user="true"></users-select2>
    </el-dialog>
  </div>
</template>
<script>
import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 
import { listUser } from "@/api/mdp/sys/user";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      input: "",
      activeName: "first",
      userSelectVisible1: false,
      userSelectVisible2: false,
      userSelectVisible3: false,
      userSelectVisible4: false,
      submitData: {
        userid: "",
        username: "",
        assUserid: "",
        assUsername: "",
        vouchId: "",
        vouchName: "",
        selectUsers: [],
        branchId: ""
      },
      vouchId: "",
      vouchName: "",
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      isSingleUser: true,
      noAssessors: [],
      pageno: 1,
      pagesize: 10,
      flag: 1, // 1-选择考核人，2-选择被考核人
      isHide: true
    };
  },
  methods: {
    //选择考核人后回调
    onUserSelected1(users) {
      this.submitData.assUserid = users[0].userid;
      this.submitData.assUsername = users[0].username;
      this.userSelectVisible1 = false;
    },
    //选择被考核人后回调
    onUserSelected2(users) {
      this.submitData.selectUsers = this.submitData.selectUsers.concat(users);
      this.filterTransFer();
      this.userSelectVisible2 = false;
    },
    //全部人员
    onUserSelected3(users) {
      this.submitData.userid = users[0].userid;
      this.submitData.username = users[0].username;
      this.echoJxAssessByPersion();
    },
    //核定人员
    onUserSelected4(users) {
      this.vouchId = users[0].userid;
      this.vouchName = users[0].username;
      this.userSelectVisible4 = false;
    },
    //删除一个
    handleClose(userid) {
      this.submitData.selectUsers.forEach((i, index) => {
        if (i.userid == userid) {
          this.submitData.selectUsers.splice(index, 1);
        }
      });
    },
    closePeople() {
      this.submitData.assUserid = "";
      this.submitData.assUsername = "";
    },
    handleVouch() {
      this.vouchId = "";
      this.vouchName = "";
    },
    //清空
    emptyUser() {
      this.submitData.selectUsers = [];
    },
    //查询未设置考察人人员
    getNoassessor() { 
    },
    //保存
    addJxAssessByPersion() { 
    },
    //回显
    echoJxAssessByPersion() { 
    },
    loadMore() {
      this.pageno = this.pageno + 1;
      this.getNoassessor();
    },
    clickUser(user) {
      this.submitData.userid = user.userid;
      this.submitData.username = user.username;
      this.submitData.assUserid = "";
      this.submitData.assUsername = "";
      this.submitData.selectUsers = [];
      this.vouchId = "";
      this.vouchName = "";
      this.echoJxAssessByPersion();
    },
    verity() {
      if (this.submitData.userid == this.submitData.assUserid) {
        this.$message({
          message: "当前人员不能设置为考核人",
          type: "error"
        });
        return false;
      }
      if (
        this.submitData.selectUsers != null &&
        this.submitData.selectUsers != ""
      ) {
        for (let i = 0; i < this.submitData.selectUsers.length; i++) {
          if (this.submitData.selectUsers[i].userid == this.submitData.userid) {
            this.$message({
              message: "当前人员不能设置为被考核人",
              type: "error"
            });
            return false;
          }
        }
      }
      if (this.submitData.assUserid == "" || this.submitData.assUserid == null) {
        this.$message({
          message: "请设置复核人",
          type: "error"
        });
        return false;
      }
      if (this.vouchId == "" ||this.vouchId == null ) {
        this.$message({
          message: "请设置核定人",
          type: "error"
        });
        return false;
      }
      return true;
    },
    //过滤素组中重复的对象
    filterTransFer() {
      // arr:需要过滤排查的数组
      const hash = {};
      const newArr = this.submitData.selectUsers.reduceRight((item, next) => {
        console.log(next.username);
        hash[next.userid] // next.id只是其中一个条件
          ? ""
          : (hash[next.userid] = true && item.push(next));

        return item;
      }, []);
      this.submitData.selectUsers = newArr.reverse(); //newArr就是过滤后的数组，需要重新赋值

      console.log(this.submitData.selectUsers);
    }
  },
  mounted() {
    this.submitData.userid = this.userInfo.userid;
    this.submitData.username = this.userInfo.username;
    this.echoJxAssessByPersion();
    this.getNoassessor();
  },
  components: {
    "users-select1": UsersSelect,
    "users-select2": UsersSelect,
    "users-select3": UsersSelect
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

    .left-title {
      padding-left: 15px;
      padding-right: 15px;
      font-size: 14px;
      padding-top: 0.5rem;
      display: flex;
      justify-content: flex-end;
    }
  }
  .left-content {
    height: 47rem;
    .left-content-header {
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      font-size: 14px;
      border-bottom: 1px solid #efefef;
      background: #ecf0f1;
    }
    font-size: 12px;
    .left-content-ul {
      max-height: 550px;
      overflow: auto;
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
  }
  .left-content-ul::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #d1d1d1;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .left-content-ul::-webkit-scrollbar-thumb {
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
  .left-content-ul::-webkit-scrollbar-track {
    background-color: #fff;
  }
  .left-content-button {
    width: 200px;
    height: 54px;
    border: 2px solid #eaeaea;
    opacity: 1;
    border-radius: 6px;
    font-size: 14px;
    color: #333 !important;
  }
}

.right {
  background-color: #ffffff;
  height: 50rem;
  border-radius: 2px;
  overflow: hidden;
  font-size: 14px;
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
    height: 47rem;
    padding: 15px;
    color: #666666;
    .right-content-row {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .row-left {
        width: 20%;
      }
      .row-right {
        width: 80%;
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
    }
    .footer {
      border: 1px solid #f3f3f3;
      background: #f3f3f3;
      padding: 10px 20px;
    }
  }
}
</style>