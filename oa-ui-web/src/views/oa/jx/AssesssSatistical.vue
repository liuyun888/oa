<template>
  <section>
    <el-row class="border">
      <el-col :span="6">
        <div class="left">
          <div class="left-header">
            <div class="left-title">全部部门</div>
          </div>
          <div class="left-content">
            <dept-tree ref="deptTreeRef"
              show-root
              default-expand-all
              show-checkbox
              :expand-on-click-node="false"
              @check-change="handleLeftDeptNodeClick"
            ></dept-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="18" class="border">
        <div class="right">
          <div class="right-header">
            <div class="right-title">考核统计</div>
            <div class="right-operation">
              <el-select size="small"
                v-model="filters.year"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input size="small"
                placeholder="查询用户"
                v-model="filters.key"
                clearable
              ></el-input>
              <el-button size="small" plain @click="deriveBtn" v-loading="load.derive">导出</el-button>
            </div>
          </div>
          <div class="right-content"  v-loading="load.list">
            <div v-if="jxAssessSchemes.length>0">
            <el-tabs v-model="activeName" @tab-click="handleClick" >
              <el-tab-pane :label="scheme.name" :name="''+index" v-for="(scheme,index) in jxAssessSchemes" :key="index">
                <el-table :data="assessData" style="width: 100%" v-if="scheme.schemeType=='0'" @cell-click="cellClick">
                  <el-table-column prop="assUsername" label="姓名" min-width="140"></el-table-column>
                  <el-table-column prop="1" label="1月" min-width="60"></el-table-column>
                  <el-table-column prop="2" label="2月" min-width="60"></el-table-column>
                  <el-table-column prop="3" label="3月" min-width="60"></el-table-column>
                  <el-table-column prop="4" label="4月" min-width="60"></el-table-column>
                  <el-table-column prop="5" label="5月" min-width="60"></el-table-column>
                  <el-table-column prop="6" label="6月" min-width="60"></el-table-column>
                  <el-table-column prop="7" label="7月" min-width="60"></el-table-column>
                  <el-table-column prop="8" label="8月" min-width="60"></el-table-column>
                  <el-table-column prop="9" label="9月" min-width="60"></el-table-column>
                  <el-table-column prop="10" label="10月" min-width="60"></el-table-column>
                  <el-table-column prop="11" label="11月" min-width="60"></el-table-column>
                  <el-table-column prop="12" label="12月" min-width="60"></el-table-column>
                  <el-table-column prop="annualMean" label="年平均" min-width="80"></el-table-column>
                </el-table>
                <el-table :data="assessData" style="width: 100%" v-else-if="scheme.schemeType=='1'"  @cell-click="cellClick">
                  <el-table-column prop="assUsername" label="姓名" min-width="140"></el-table-column>
                  <el-table-column prop="1" label="第一季度" min-width="180"></el-table-column>
                  <el-table-column prop="2" label="第二季度" min-width="180"></el-table-column>
                  <el-table-column prop="3" label="第三季度" min-width="180"></el-table-column>
                  <el-table-column prop="4" label="第四季度" min-width="180"></el-table-column>
                  <el-table-column prop="annualMean" label="年平均" min-width="80"></el-table-column>
                </el-table>

                <el-table :data="assessData" style="width: 100%"  v-else-if="scheme.schemeType=='2'"  @cell-click="cellClick">
                  <el-table-column prop="assUsername" label="姓名" min-width="140"></el-table-column>
                  <el-table-column prop="1" label="上半年度" min-width="360"></el-table-column>
                  <el-table-column prop="2" label="下半年度" min-width="360"></el-table-column>
                  <el-table-column prop="annualMean" label="年平均" min-width="80"></el-table-column>
                </el-table>

                <el-table :data="assessData" style="width: 100%"  v-else-if="scheme.schemeType=='3'"  @cell-click="cellClick">
                  <el-table-column prop="assUsername" label="姓名" min-width="160"></el-table-column>
                  <el-table-column prop="annualMean" label="年考核成绩" min-width="780"></el-table-column>
                </el-table>
                <el-pagination
                  layout="total, sizes, prev, pager, next"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  :page-sizes="[10,20, 50, 100, 500]"
                  :current-page="pageInfo.pageNum"
                  :page-size="pageInfo.pageSize"
                  :total="pageInfo.total"
                  style="float:right;"
                ></el-pagination>
              </el-tab-pane>
            </el-tabs>
            </div>
            <div v-else>
               <font color="red">没有查到数据</font>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

			<el-drawer title="编辑考核总分表" :visible.sync="jxAssessGradeEditVisible"  size="100%"  append-to-body   :close-on-click-modal="false">
				  <jx-assess-grade-edit op-type="edit" :jx-assess-grade="jxAssessGrade" :visible="jxAssessGradeEditVisible" @cancel="jxAssessGradeEditVisible=false" @submit="afterEditSubmit"></jx-assess-grade-edit>
			</el-drawer>
  </section>
</template>
<script>
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import { listUserAssessStatistics } from "@/api/oa/jx/jxAssessGrade";
import { listJxAssessScheme} from '@/api/oa/jx/jxAssessScheme';
import  JxAssessGradeEdit from '@/views/oa/jx/jxAssessGrade/JxAssessGradeEdit';//新增修改界面
import { listJxAssessGrade } from '@/api/oa/jx/jxAssessGrade';
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      key: "",
      options: [],
      value: "",
      activeName: "0",
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      filters: {
        year: "",
        branchId: "",
        scheme: 0, //所属考核方案
        deptid: ""
      },
      load: { list: false, edit: false, del: false, add: false, derive: false }, //查询中...,
      assessData: [],
      monthly: [
        "姓名",
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
        "年平均"
      ],
      quarter: [
        "姓名",
        "第一季度",
        "第二季度",
        "第三季度",
        "第四季度",
        "年平均"
      ],
      semiAnnual: ["姓名", "上半年度", "下半年度", "年平均"],
      annual: ["姓名", "年考核成绩"],
      monthlyProp: [
        "assUsername",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "annualMean"
      ],
      quarterProp: ["assUsername", "1", "2", "3", "4", "annualMean"],
      semiAnnualProp: ["assUsername", "1", "2", "annualMean"],
      annualProp: ["assUsername", "annualMean"],
      jxAssessSchemes:[],
      jxAssessScheme:null,
      jxAssessGrade:null,
      jxAssessGradeEditVisible:false,

    };
  },
  watch: {
    "filters.year": {
      handler: function(a, b) {
        this.listJxAssessScheme();
      }
    },
    "filters.key"(val) {
      this.getUserAssessGrade();
    },
    activeName(val) {
      this.jxAssessScheme=this.jxAssessSchemes[val]
      this.getUserAssessGrade();
    }
  },
  methods: {
    handleClick() {},
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.count = true;
      this.getUserAssessGrade();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getUserAssessGrade();
    },
    handleLeftDeptNodeClick(data, checked, comp) {
      this.filters.assDeptid = "";
      if(checked==true){
          this.filters.assDeptid = data.deptid;
      }
      this.getUserAssessGrade();
    },
    //年份
    yearData() {
      let year = new Date().getFullYear();
      this.filters.year = year;
      for (let i = 0; i < 5; i++) {
        let yeardata = {
          value: year - i,
          label: year - i
        };
        this.options.push(yeardata);
      }
    },
    getUserAssessGrade() {
      let params = {
        year: this.filters.year,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count
      };
      if (this.filters.key) {
        params.key = this.filters.key;
      }
      if(this.filters.assDeptid){
        params.assDeptid=this.filters.assDeptid
      }
      if(this.jxAssessScheme){
        params.schemeId=this.jxAssessScheme.id
        params.schemeType=this.jxAssessScheme.schemeType
      }else{
        return;
      }
      this.load.list = true;
      listUserAssessStatistics(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.assessData = res.data.data;
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch(() => {
          this.load.list = false;
          //this.$message({ message: '通讯错误', type: 'error' });
        });
    },
    //导出
    deriveBtn() {
      let params = {
        branchId: this.userInfo.branchId,
        scheme: this.filters.scheme,
        deptid: this.filters.deptid,
        year: this.filters.year
      };
      this.load.derive = true;
      listUserAssessStatistics(params)
        .then(res => {
          this.load.derive = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.deriveExcel(res.data.data);
          } else {
            this.$message({ message: "导出数据失败", type: "error" });
          }
        })
        .catch(() => {
          this.load.derive = false;
          this.$message({ message: "导出数据失败", type: "error" });
        });
    },
    deriveExcel(resData) {
      import("@/vendor/Export2Excel").then(excel => {
        let tHeader = [];
        let filterVal = [];
        let name = "";
        if (this.activeName == "first") {
          tHeader = this.monthly;
          filterVal = this.monthlyProp;
          name = "月度考核统计";
        }
        if (this.activeName == "second") {
          tHeader = this.quarter;
          filterVal = this.quarterProp;
          name = "季度考核统计";
        }
        if (this.activeName == "third") {
          tHeader = this.semiAnnual;
          filterVal = this.semiAnnualProp;
          name = "半年度考核统计";
        }
        if (this.activeName == "fourth") {
          tHeader = this.annual;
          filterVal = this.annualProp;
          name = "年度考核统计";
        }
        const list = resData;
        const data = this.formatJson(filterVal, list);
        var filename = name;
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + name;
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: "xlsx"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    listJxAssessScheme(){
      var params={
        year:this.filters.year,
      }

			params.orderBy='scheme_type asc'
      this.load.list=true;
      listJxAssessScheme(params).then(res=>{
        this.load.list=false;
        var tips = res.data.tips;
        if(tips.isOk){
          this.jxAssessSchemes=res.data.data
          if(this.jxAssessSchemes && this.jxAssessSchemes.length>0){
            this.jxAssessScheme=this.jxAssessSchemes[0]
            this.getUserAssessGrade();
          }
        }else{
          this.$message({ message: tips.isOk, type: "error" });
        }
      })
    },

    cellClick(row, column, cell, event){
      if(column.property!='assUsername' && column.property!='annualMean'){
          var params={
             schemeType:this.jxAssessScheme.schemeType,
             schemeId:this.jxAssessScheme.id,
             assUserid:row.assUserid
           }
         if(this.jxAssessScheme.schemeType=='0'){
           params.month=column.property;
         }else if(this.jxAssessScheme.schemeType=='1'){
           params.quarter=column.property;
         }else if(this.jxAssessScheme.schemeType=='2'){
           params.semiAnnual=column.property;
         }else if(this.jxAssessScheme.schemeType=='3'){
           params.annual=column.property;
         }
           this.load.list=true;
           listJxAssessGrade(params).then(res=>{
            this.load.list=false;
             var tips = res.data.tips;
             if(tips.isOk){
               var jxAssessGrades=res.data.data;
               if(jxAssessGrades.length>0){
                 this.jxAssessGrade=jxAssessGrades[0]
                 this.jxAssessGradeEditVisible=true;
               }else{
                  this.$message({ message: '未查到该员工'+column.label+'的绩效数据', type: "info" });
               }
             }
           })
      }
    },
    afterEditSubmit(){
      this.jxAssessGradeEditVisible =false;
      this.listJxAssessScheme();
    }
  },
  mounted() {
    this.yearData();
    this.listJxAssessScheme();
    //this.getUserAssessGrade();
  },
  components: {
    "dept-tree": DeptTree,
    JxAssessGradeEdit,
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
      font-size: 14px;
      padding-top: 1rem;
    }
  }
  .left-content {
    height: 47rem;
    padding: 10px;
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
    justify-content: flex-start;
    align-content: center;
    .right-title {
      padding-top: 1rem;
      font-size: 14px;
      width: 60%;
      padding-left: 15px;
    }
    .right-operation {
      width: 40%;
      padding-right: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .right-content {
    height: 47rem;
    padding: 15px;
    overflow: auto;
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
</style>
