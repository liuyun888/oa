<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="left">
          <div class="contract-amount">
            <div class="title">合同金额</div>
            <div class="info" v-text="contractMoney"></div>
            <div class="icon"></div>
          </div>
          <div class="left-box">
            <div class="contract-num">
              <div class="title">合同数量</div>
              <div class="info" v-text="contractNum"></div>
              <div class="icon"></div>
            </div>
            <div class="client-num">
              <div class="title">客户数量</div>
              <div class="info" v-text="clientNum"></div>
              <div class="icon"></div>
            </div>
          </div>
          <div class="contract-type">
            <div class="contract-type-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>合同类型统计</span>
            </div>
            <div class="contract-type-content">
              <div id="barPattern" style="height:240px;width:420px"></div>
            </div>
          </div>
          <div class="contract-status">
            <div class="contract-status-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>合同状态分析</span>
            </div>
            <div class="contract-status-content">
              <div id="pieChart" style="height:400px;width:420px"></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="right">
          <!-- 全国客户分布 -->
          <div class="distribution">
            <div class="distribution-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>全国客户分布</span>
            </div>
            <div class="distribution-content">
              <div id="mapOfChina" style="height:460px;width:830px"></div>
            </div>
          </div>
          <!-- 财务账款统计 -->
          <div class="finance">
            <div class="finance-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>财务账款统计</span>
            </div>
            <div class="finance-content">
              <div id="histogram" style="height:350px;width:800px"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import walden from "@/assets/echars-theme/theme.js";
import {loadChartData} from '@/api/oa/ht/contractCard'
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      contractMoney:"", //合同金额
      contractNum:"", //合同数量
      clientNum:"", //客户数量
      incomeContracts:"",//收入合同
      expenditureContracts:"",//支出合同
      contratStatus:{}, //合同状态分析
      distribution:{}, //客户分布
      receivables:"" ,//应收账款
      accountsPayables:"", //应付账款
    };
  },
  methods: {
    //正负图形
    getBarPattern() {
      this.$echarts.registerTheme("walden", walden); // 注册主题
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
            type: "value"
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
            // data: [320, 302, 341, 374, 390, 450, 420, 390, 450]
            data: this.incomeContracts
          },
          {
            name: "支出合同",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "left"
            },
           // data: [-120, -132, -101, -134, -190, -230, -210, -190, -230]
            data: this.expenditureContracts
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    //饼状图
    getPieChart() {
      this.$echarts.registerTheme("walden", walden); // 注册主题
      let myChart = this.$echarts.init(
        document.getElementById("pieChart"),
        "walden"
      );
      let option = (option = {
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
            // data: [
            //   { value: 335, name: "解除" },
            //   { value: 310, name: "终止" },
            //   { value: 234, name: "暂停" },
            //   { value: 135, name: "完成" },
            //   { value: 1548, name: "正常" }
            // ],
            data:this.contratStatus,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });

      // 绘制图表
      myChart.setOption(option);
    },
    //中国地图
    getMapOfChina() {
      this.$echarts.registerTheme("walden", walden); // 注册主题
      let myChart = this.$echarts.init(
        document.getElementById("mapOfChina"),
        "walden"
      );
      myChart.setOption({
        // 进行相关配置
        // backgroundColor: "#02AFDB",
        tooltip: {}, // 鼠标移到图里面的浮动提示框
        dataRange: {
          show: false,
          min: 0,
          max: 1000,
          text: ["High", "Low"],
          realtime: true,
          calculable: true,
          color: ["orangered", "yellow", "lightskyblue"]
        },
        geo: {
          // 这个是重点配置区
          map: "china", // 表示中国地图
          roam: true,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: "rgba(0,0,0,0.4)"
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo" // 对应上方配置
          },
          {
            name: "客户数量", // 浮动框的标题
            type: "map",
            geoIndex: 0,
            data:this.distribution
            // data:[
            //   {
            //     name: "广东",
            //     value: 599
            //   }
            // ]
            // data: [
            //   {
            //     name: "北京",
            //     value: 599
            //   },
            //   {
            //     name: "上海",
            //     value: 142
            //   },
            //   {
            //     name: "黑龙江",
            //     value: 44
            //   },
            //   {
            //     name: "深圳",
            //     value: 92
            //   },
            //   {
            //     name: "湖北",
            //     value: 810
            //   },
            //   {
            //     name: "四川",
            //     value: 453
            //   }
            // ]
          }
        ]
      });
    },
    //柱状图
    getHistogram() {
       this.$echarts.registerTheme("walden", walden); // 注册主题
      let myChart = this.$echarts.init(
        document.getElementById("histogram"),
        "walden"
      );
      // let option = {
      //   legend: {
      //     data: ["应付账款", "应收账款"],
      //     top: 30
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
      //     ]
      //   },
      //   // Y轴
      //   yAxis: {},
      //   // 数据
      //   series: [
      //     {
      //       name: "应付账款",
      //       type: "bar",
      //       // data: [122.55, 100, 440, 320, 150, 120, 100, 440, 320, 150]
      //       data: this.accountsPayables
      //     },
      //     {
      //       name: "应收账款",
      //       type: "bar",
      //      // data: [220.98, 120, 240, 330, 170, 200, 120, 240, 330, 170]
      //       data: this.receivables
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
                            data: this.accountsPayables
                        },
                        {
                            name: '应收账款',
                            type: 'bar',
                            data: this.receivables
                        }
                    ]
                }
      // 绘制图表
      myChart.setOption(option);
    },
    //获取图表数据
    getContractData(){
      let params = {
        branchId:this.userInfo.branchId
      }
      loadChartData(params).then(res => {
        let tips = res.data.tips;
        if(tips.isOk){
          let data = res.data.data;
          this.contractMoney = data.contractMoney; //合同金额
          this.contractNum = data.contractNum; //合同金额
          this.clientNum = data.clientNum;
          this.incomeContracts = data.incomeContracts;
          this.expenditureContracts = data.expenditureContracts;
          this.contratStatus = data.contratStatus;
          this.distribution = data.distribution;
          this.receivables = data.receivables;
          this.accountsPayables = data.accountsPayables;
          for(let i = 0; i <this.incomeContracts.length ; i++){
            this.expenditureContracts[i] = this.expenditureContracts[i] * -1
          }
          this.getBarPattern();
          this.getPieChart();
          this.getMapOfChina();
          this.getHistogram();
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
    this.getContractData();
    //this.getBarPattern();
    // this.getPieChart();
    // this.getMapOfChina();
    // this.getHistogram();
    // this.getContractData();
    
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
  .left {
    .contract-amount {
      min-height: 100px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      color: #fff;
      box-shadow: 1px 1px 0 0 #fff, inset 1px 1px 3px 0 rgba(0, 0, 0, 0.2);
      padding-left: 20px;
      position: relative;
      cursor: pointer;
      background: #2b3647;
    }
    .left-box {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .contract-num {
        flex: 1;
        min-height: 100px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        color: #fff;
        box-shadow: 1px 1px 0 0 #fff, inset 1px 1px 3px 0 rgba(0, 0, 0, 0.2);
        padding-left: 20px;
        position: relative;
        cursor: pointer;
        background: #2b3647;
        margin-right: 20px;
      }
      .client-num {
        flex: 1;
        min-height: 100px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        color: #fff;
        box-shadow: 1px 1px 0 0 #fff, inset 1px 1px 3px 0 rgba(0, 0, 0, 0.2);
        padding-left: 20px;
        position: relative;
        cursor: pointer;
        background: #2b3647;
      }
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
      background-image: url("../../../assets/image/portal-icon19.png");
    }
    .contract-type {
      margin-top: 10px;
      background: white;
      width: 100%;
      .contract-type-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .contract-type-content {
        width: 100%;
        canvas {
          width: 100%;
        }
      }
    }
    .contract-status {
      margin-top: 10px;
      background: white;
      width: 100%;
      .contract-status-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .contract-status-content {
        width: 100%;
        canvas {
          width: 100%;
        }
      }
    }
  }
  .right {
    .distribution {
      background: white;
      height: 500px;
      .distribution-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .distribution-content {
      }
    }
    .finance {
      background: white;
      margin-top: 10px;
      height: 440px;
      .finance-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .finance-content {
      }
    }
  }
}
</style>