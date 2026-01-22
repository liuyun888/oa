<template>
  <section>
    <el-row>
      <el-input style="width: 20%;" placeholder="模糊查询" v-model="groupName"></el-input>
      <el-checkbox>按部门-{{this.deptTree.deptNodeSelected.deptName}}查</el-checkbox>
      <el-button type="primary" v-loading="load.list" @click="getGroupByPage">查询</el-button>
      <el-button type="primary" @click="selectGroup">确定</el-button>
    </el-row>
    <el-row class="selected-tag">
      已选择：
      <el-tag v-for="sel in sels" :key="sel.id" closable @close="closeGroup(sel)">{{sel.groupName}}</el-tag>
    </el-row>
		<el-row class="page-main padding-top"> 
      <el-col :span="6" style=" overflow-x:auto; height:600px;">
        <dept-tree
          show-root
          default-expand-all
          show-checkbox
          :expand-on-click-node="false"
          @node-click="handleLeftDeptNodeClick"
        ></dept-tree>
      </el-col>
      <el-col :span="18">
        <!--列表 User sys_user-->
        <el-table
          border
          ref="multipleTable"
          style="width: 100%;"
          :data="groupList"
          v-loading="load.list"
          @selection-change="selsChange"
        >
          <el-table-column type="selection" width="65"></el-table-column>
          <el-table-column type="index" width="65"></el-table-column>
          <el-table-column
            prop="groupName"
            sortable
            label="考勤组名称"
            min-width="120"
            
          ></el-table-column>
        </el-table>
        <el-pagination
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10,20, 50, 100, 500]"
          :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          style="float:right;"
        ></el-pagination>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import { mapGetters } from "vuex";
import md5 from "js-md5";
import { listGroupByPage } from "@/api/oa/kq/attendance";

export default {
  data() {
    return {
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },

      load: { list: false, edit: false, del: false, add: false }, //查询中...

      /**begin 自定义属性请在下面加 请加备注**/
      deptTree: {
        //部门树相关参数设置
        deptNodeSelected: {} //部门树被选中的节点数据
      },
      sels: [], //列表选中数据
      groupList: [], //考勤组
      deptid: "" ,//部门ID
      groupName:"" //考勤组名称
      /**end 自定义属性请 在上面加 请加备注**/
    };
  }, //end data
  mounted: function() {
    
    this.getGroupByPage();
  },
  methods: {
    /**begin 自定义函数请在下面加**/
    handleLeftDeptNodeClick(data, node, comp) {
      this.deptTree.deptNodeSelected = data;
      this.deptid = data.deptid;
      this.pageInfo.pageNum=1;
      this.getGroupByPage();
    },
    getGroupByPage() {
      let params = {
        pageno: this.pageInfo.pageNum,
        pagesize: this.pageInfo.pageSize
      };
      if(this.groupName.trim() !=''){
        params.groupName = this.groupName;
      }
      if(this.deptid !=''){
        params.deptid = this.deptid;
      }
      this.load.list = true;
      listGroupByPage(params).then(res => {
        if (res.data.tips.isOk) {
          this.groupList = res.data.groupList;
          this.pageInfo.pageNum = res.data.pageNum;
          this.pageInfo.pageSize = res.data.pageSize;
          this.pageInfo.total = res.data.total;
          this.load.list = false;
        }
      });
    },
    handleSizeChange(val) {
      // let params = {
      //   pageno: 1,
      //   pagesize: val
      // };
      console.log("sss");
      this.pageInfo.pageSize = val;

      this.getGroupByPage();
    },
    handleCurrentChange(val) {
      // let params = {
      //   pageno: val,
      //   pagesize: this.pageInfo.pageSize
      // };
       console.log("bbbb");
      this.pageInfo.pageNum = val
      this.getGroupByPage();
    },
    //选择行user
    selsChange: function(sels) {
      this.sels = sels;

      
    },
    closeGroup: function(sel) {
      this.sels.forEach((v, i) => {
         this.$nextTick(()=>{
            this.groupList.forEach((_v, _i) => {
            if(sel.id === _v.id){
              this.$refs.multipleTable.toggleRowSelection(_v,false);
            }
          });
         })
        });
      this.sels = this.sels.filter(i => i.id != sel.id);
      
    },
    selectGroup(){
      if(this.sels.length<1){
					this.$message({ message: "请选择一个考勤组", type: 'error' });
					return;
				}
       this.$emit('selectGroup',this.sels);
       
    }
    /**end 自定义函数请在上面加**/
  }, //end methodss
  components: {
    "dept-tree": DeptTree
    //在下面添加其它组件
  }
};
</script>

<style scoped>
.selected-tag {
  margin-top: 14px;
  margin-left: 14px;
}
</style>