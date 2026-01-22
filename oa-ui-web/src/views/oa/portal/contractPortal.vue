<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="top-box1">
          <div class="title">本年合同数量</div>
          <div class="info" v-text="contractNum">35</div>
          <div class="icon" :style="'background-image: url('+require('../../../assets/image/portal-icon19.png')+')'"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="top-box1">
          <div class="title">本年付款金额</div>
          <div class="info" v-text="paymentAmount"></div>
          <div class="icon" :style="'background-image: url('+require('../../../assets/image/portal-icon19.png')+')'"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="top-box1">
          <div class="title">本年收款金额</div>
          <div class="info" v-text="receivableAmount"></div>
          <div class="icon" :style="'background-image: url('+require('../../../assets/image/portal-icon19.png')+')'"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="content-left">
          <div class="content-left-header">
            <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
            <span>应收应付统计（万元）</span>
          </div>
          <div class="content-left-content">
            <div id="histogram" style="height:350px;width:800px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="content-right">
          <div class="content-right-header">
            <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
            <span>合同金额统计（万元）</span>
          </div>
          <div class="content-right-content">
            <div id="barPattern" style="height:350px;width:420px"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="footer">
          <div class="footer-header">
            <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
            <span>合同状态统计</span>
          </div>
          <div class="footer-content">
            <div id="footer-pie-chart1" style="height:350px;width:420px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="footer">
          <div class="footer-header">
            <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
            <span>合同类型统计</span>
          </div>
          <div class="footer-content">
            <div id="footer-pie-chart2" style="height:350px;width:420px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="footer">
          <div class="footer-header">
            <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
            <span>开票金额统计（万元）</span>
          </div>
          <div class="footer-content">
            <div id="stackedBar1" style="height:350px;width:420px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="footer">
          <div class="footer-header">
            <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
            <span>实际收款统计（万元）</span>
          </div>
          <div class="footer-content">
            <div id="stackedBar2" style="height:350px;width:420px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="footer">
          <div class="footer-header">
            <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
            <span>实际付款统计（万元)</span>
          </div>
          <div class="footer-content">
            <div id="stackedBar3" style="height:350px;width:420px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="footer">
          <div class="footer-header">
            <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
            <span>开票金额统计（万元）</span>
          </div>
          <div class="footer-content">
            <div id="stackedBar4" style="height:350px;width:420px"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import walden from "@/assets/echars-theme/theme.js";
import {getStatisticalStatement} from '@/api/oa/ht/contractCard'
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      contractNum:"", //本年合同数量
      paymentAmount:"",//本年付款金额
      receivableAmount:"",//本年收款金额
      receivables:[],// 应收金额
      accountsPayables:[],// 应收金额
      incomeContractMoneys:[],//收入合同金额
      expenditureContractMoneys:"",//支出合同金额
      contratStatus:[], //合同状态分析
      contractTypes:[] , //合同类型
      // 开票
      kaipiao:{
        marketContractInvoiceaMount:[],//销售开票合同金额
        purchaseContractInvoiceaMount:[],//采购开票合同金额
        otherContractInvoiceaMount:[],//其他开票合同金额
      },
      //实际收款
      actualPayment:{
        marketContractActualPayment:[], //销售合同实际收款
        purchaseContractActualPayment:[], //采购合同实际收款
        otherContractActualPayment:[], //其他合同实际收款
      },
       //实际付款
      shiJiFuKuan:{
        marketContractShiJiFuKuan:[], //销售合同实际付款
        purchaseContractShiJiFuKuan:[], //采购合同实际付款
        otherContractShiJiFuKuan:[], //其他合同实际付款
      }
    };
  },
  methods: {
    //柱状图
    getHistogram() {
      let myChart = this.$echarts.init(
        document.getElementById("histogram"),
        "walden"
      );
      // let option = {
      //   legend: {
      //     data: ["应付账款", "应收账款"],
      //     top: 30,
      //     selected:{'应付账款':true,'应收账款':true}
      //   },
      //   // X轴
      //   xAxis: {
      //     data: [
      //       "1月",
      //       "2月",
      //       "3月",
      //       "4月",
      //       "5月",
      //       "6月",
      //       "7月",
      //       "8月",
      //       "9月",
      //       "10月",
      //       "11月",
      //       "12月"
      //     ],
      //   },
      //   // Y轴
      //   yAxis: {
      //     axisLabel:{formatter:'{value} 万元'}
      //   },
      //   // 数据
      //   series: [
      //     {
      //       name: "应付账款",
      //       type: "bar",
      //       data: this.receivables
      //       // data: [120, 100, 440, 320, 150, 120, 100, 440, 320, 150]
      //     },
      //     {
      //       name: "应收账款",
      //       type: "bar",
      //       data: this.accountsPayables
      //       // data: [200, 120, 240, 330, 170, 200, 120, 240, 330, 170]
      //     }
      //   ]
      // };
      let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ["应付账款", "应收账款"]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '应付账款',
                            type: 'bar',
                            data: this.receivables
                        },
                        {
                            name: '应收账款',
                            type: 'bar',
                            data: this.accountsPayables
                        }
                    ]
                }
      // 绘制图表
      myChart.setOption(option);
    },
    //正负图形
    getBarPattern() {
      let myChart = this.$echarts.init(
        document.getElementById("barPattern"),
        "walden"
      );
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["支出合同", "收入合同"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "value",

          }
        ],
        yAxis: [
          {
            type: "category",
            axisTick: {
              show: false
            },
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        series: [
          {
            name: "收入合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true
            },
            data: this.incomeContractMoneys
            // data: [320, 302, 341, 374, 390, 450, 420, 390, 450]
          },
          {
            name: "支出合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "left"
            },
            data: this.expenditureContractMoneys
            // data: [-120, -132, -101, -134, -190, -230, -210, -190, -230]
          }
        ]
      };
      option.legend.selected = false;
      // 绘制图表
      myChart.setOption(option);
    },
    //饼状图1
    getPieChart1() {
      let myChart = this.$echarts.init(
        document.getElementById("footer-pie-chart1"),
        "walden"
      );
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
          {
            name: "合同状态",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.contratStatus,
            // data: [
            //   { value: 335, name: "解除" },
            //   { value: 310, name: "终止" },
            //   { value: 234, name: "暂停" },
            //   { value: 135, name: "完成" },
            //   { value: 1548, name: "正常" }
            // ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };

      // 绘制图表
      myChart.setOption(option);
    },
    //饼状图2
    getPieChart2() {
      let myChart = this.$echarts.init(
        document.getElementById("footer-pie-chart2"),
        "walden"
      );
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["销售合同", "采购合同", "其他"]
        },
        series: [
          {
            name: "合同类型",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: this.contractTypes
            // data: [
            //   { value: 335, name: "销售合同" },
            //   { value: 310, name: "采购合同" },
            //   { value: 234, name: "工程合同" },
            //   { value: 135, name: "合作协议" },
            //   { value: 1548, name: "外包合同" }
            // ]
          }
        ]
      };

      // 绘制图表
      myChart.setOption(option);
    },
    //堆叠条形1
    getStackedBar1() {
      let myChart = this.$echarts.init(
        document.getElementById("stackedBar1"),
        "walden"
      );
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["销售合同", "采购合同", "其他合同"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月","10月", "11月", "12月"]
        },
        series: [
          {
            name: "销售合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.kaipiao.marketContractInvoiceaMount
            // data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: "采购合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data: this.kaipiao.purchaseContractInvoiceaMount
            // data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "其他合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.kaipiao.otherContractInvoiceaMount
            // data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    //堆叠条形2
    getStackedBar2() {
      let myChart = this.$echarts.init(
        document.getElementById("stackedBar2"),
        "walden"
      );
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["销售合同", "采购合同", "其他合同"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        },
        series: [
          {
            name: "销售合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.actualPayment.marketContractActualPayment
            // data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: "采购合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.actualPayment.purchaseContractActualPayment
            // data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "其他合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.actualPayment.otherContractActualPayment
           // data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    //堆叠条形3
    getStackedBar3() {
      let myChart = this.$echarts.init(
        document.getElementById("stackedBar3"),
        "walden"
      );
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["销售合同", "采购合同", "资产采购合同"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        },
        series: [
          {
            name: "销售合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.shiJiFuKuan.marketContractShiJiFuKuan
            //data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: "采购合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.shiJiFuKuan.purchaseContractShiJiFuKuan
           // data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "其他合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.shiJiFuKuan.otherContractShiJiFuKuan
            //data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    //堆叠条形4
    getStackedBar4() {
      let myChart = this.$echarts.init(
        document.getElementById("stackedBar4"),
        "walden"
      );
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["销售合同", "采购合同", "其他合同"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月","10月", "11月", "12月"]
        },
        series: [
          {
            name: "销售合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.kaipiao.marketContractInvoiceaMount
            // data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: "采购合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data: this.kaipiao.purchaseContractInvoiceaMount
            // data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "其他合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data:this.kaipiao.otherContractInvoiceaMount
            // data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    //获取图表数据
    getContractData(){
      let params = {
        branchId:this.userInfo.branchId
      }
      getStatisticalStatement(params).then(res =>{
        let tips = res.data.tips;
        if(tips.isOk){
          let data = res.data.data;
          this.contractNum = data.contractNum;
          this.paymentAmount = data.paymentAmount;
          this.receivableAmount = data.receivableAmount;
          this.receivables = data.receivables;
          this.accountsPayables = data.accountsPayables;
          this.incomeContractMoneys = data.incomeContractMoneys;
          this.expenditureContractMoneys = data.expenditureContractMoneys;
          this.contratStatus = data.contratStatus;
          this.contractTypes = data.contractTypes;
          this.kaipiao.marketContractInvoiceaMount = data.marketContractInvoiceaMount;
          this.kaipiao.purchaseContractInvoiceaMount = data.purchaseContractInvoiceaMount;
          this.kaipiao.otherContractInvoiceaMount = data.otherContractInvoiceaMount;

          this.actualPayment.marketContractActualPayment = data.marketContractActualPayment;
          this.actualPayment.purchaseContractActualPayment = data.purchaseContractActualPayment;
          this.actualPayment.otherContractActualPayment = data.otherContractActualPayment;

          this.shiJiFuKuan.marketContractShiJiFuKuan = data.marketContractShiJiFuKuan;
          this.shiJiFuKuan.purchaseContractShiJiFuKuan = data.purchaseContractShiJiFuKuan;
          this.shiJiFuKuan.otherContractShiJiFuKuan = data.otherContractShiJiFuKuan;
          for(let i = 0; i < this.expenditureContractMoneys.length; i++){
            this.expenditureContractMoneys[i] = this.expenditureContractMoneys[i] *-1;
          }

          this.getHistogram();

          this.getBarPattern();
          this.getPieChart1();
          this.getPieChart2();
          this.getStackedBar1();
          this.getStackedBar2();
          this.getStackedBar3();
          this.getStackedBar4();
        }
        this.$message({
          message: tips.msg,
          type: tips.isOk ? "success" : "error"
        });
      }).catch(err =>{
          this.$message({
            message: "加载数据失败",
            type:  "error"
          });
      });
    }
  },
  mounted() {
    this.$echarts.registerTheme("walden", walden); // 注册主题
    this.getContractData();

  }
};
</script>

<style lang="scss" scoped>
* {
  padding: 0px;
  margin: 0px;
  list-style: none;
  color: #606266;
  font-size: 14px;
}
.container {
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  .top-box1 {
    min-height: 100px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    color: #fff;
    box-shadow: 1px 1px 0 0 #fff, inset 1px 1px 3px 0 rgba(0, 0, 0, 0.2);
    padding-left: 20px;
    position: relative;
    cursor: pointer;
    background-color: rgb(55, 162, 218);
  }
  .title {
    line-height: 55px;
    height: 75px;
    font-weight: bold;
    font-size: 14px;
    position: absolute;
    z-index: 23;
    color: white;
  }
  .info {
    font-size: 18px;
    z-index: 2;
    position: absolute;
    bottom: 20px;
    font-weight: bold;
    color: white;
  }
  .icon {
    width: 40px;
    height: 40px;
    right: 20px;
    position: absolute;
    bottom: 20px;
    background-repeat: no-repeat;
    background-size: 40px;
    background-position: center;
  }
  .content-left {
    margin-top: 10px;
    background: white;
    width: 100%;
    .content-left-header {
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
      border-bottom: 1px solid rgb(243, 243, 243);
    }
  }
  .content-right {
    margin-top: 10px;
    background: white;
    width: 100%;
    .content-right-header {
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
      border-bottom: 1px solid rgb(243, 243, 243);
    }
  }
  .footer {
    margin-top: 10px;
    background: white;
    width: 100%;
    .footer-header {
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
      border-bottom: 1px solid rgb(243, 243, 243);
    }
  }
}
</style>
