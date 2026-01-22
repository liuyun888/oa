<template>
  <section>
    <el-row class="page-container border padding">
      <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        v-loading="load.list"
        :disabled="load.list==true"
        v-on:click="searchSigSignets"
      >查询</el-button>
    </el-row>
		<el-row class="page-main padding-top"> 
      <!--列表 SigSignet sig_signet-->
      <el-table
        :data="sigSignets"
        @sort-change="sortChange"
        highlight-current-row
        v-loading="load.list"
        border
        style="width: 100%;"
        @row-click="selsChange"
      >
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="signetSimpleName" label="印章简称" min-width="80" ></el-table-column>
        <el-table-column prop="signetName" label="印章全称" min-width="80" ></el-table-column>
        <el-table-column prop="keepRecordId" label="备案编号" min-width="80" ></el-table-column>
        <el-table-column prop="signetContext" label="章面信息" min-width="80" ></el-table-column>
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
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { listSigSignet } from "@/api/oa/sig/sigSignet";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      filters: {
        key: ""
      },
      sigSignets: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      /**begin 自定义属性请在下面加 请加备注**/
      options: [
        {
          value: "0",
          label: "公章"
        },
        {
          value: "1",
          label: "法人代表章"
        }
      ],
      value: "0"
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getSigSignets();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getSigSignets();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      var dir = "asc";
      if (obj.order == "ascending") {
        dir = "asc";
      } else {
        dir = "desc";
      }
      if (obj.prop == "xxx") {
        this.pageInfo.orderFields = ["xxx"];
        this.pageInfo.orderDirs = [dir];
      }
      this.getSigSignets();
    },
    searchSigSignets() {
      this.pageInfo.count = true;
      this.getSigSignets(this.value);
    },
    //获取列表 SigSignet sig_signet
    getSigSignets(signetType = "0") {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        signetType: signetType,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        signetStatus: "0"
      };
      if (
        this.pageInfo.orderFields != null &&
        this.pageInfo.orderFields.length > 0
      ) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(
            this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
          );
        }
        params.orderBy = orderBys.join(",");
      }
      if (this.filters.key !== "") {
        params.key = this.filters.key;
      }
      this.load.list = true;
      listSigSignet(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            console.log(JSON.stringify(res.data.data));
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.sigSignets = res.data.data;
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch(err => (this.load.list = false));
    },

    //选择行sigSignet
    selsChange: function(sels) {
      console.log(JSON.stringify(sels));
      this.sels = sels;
      this.$emit("selsChange", this.sels);
    },
    /**begin 自定义函数请在下面加**/
    formatSignetType: function(row) {
      let type = row.signetType;
      if (type == 0) return "公章";
      if (type == 1) return "法人代表章";
    },
    formatSignetStatus: function(row) {
      let type = row.signetStatus;
      if (type == 0) return "启用";
      if (type == 1) return "停用";
    },
    formatSignetForm: function(row) {
      let type = row.signetForm;
      if (type == 0) return "电子印章";
      if (type == 1) return "物理印章";
    }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getSigSignets();
    });
  }
};
</script>

<style scoped>
</style>