<template>
    <div class="continer">

        <div class="header">
            <div class="top">
                <div class="left">
                    <i class="el-icon-tickets"></i>
                </div>

                <div class="title">
                    <span>合同统计类</span>
                </div>
            </div>
            
            <div class="slide">
                <ul>
                    <li class="active">销售类合同</li>
                    <li>采购类合同</li>
                </ul>
            </div>
        </div>

        <div class="content">
            <el-col :span="9" class="left">
                <div class="showbox">
                    <div class="t-box">
                        <p>合同销售类总金额</p>
                        <p>63,233.122万元</p>
                        <i class="el-icon-coin"></i>
                    </div>

                    <div class="b-box">
                        <div class="l">
                            <p>本月销售总金额</p>
                            <p>7,233.122万元</p>
                        </div>

                        <div class="r">
                            <p>本月合同总数</p>
                            <p>320个</p>
                        </div>
                    </div>
                </div>

                <div class="chart2">
                    <p style="font-size:12px;">合同类型</p>
                    <div id="myChart2" :style="{width: '100%', height: '350px'}"></div>
                </div>

                <div class="status">
                    <p style="font-size:12px;">合同状态</p>
                    <div id="myChart4" :style="{width: '100%', height: '320px'}"></div>
                </div>

            </el-col>

            <el-col :span="15" class="right">

                <div class="year">
                   <p style="font-size:12px; margin: 10px 0 0 10px">月度数量</p>
                   <div id="myChart1" :style="{width: '100%', height: '240px'}"></div>
                </div>

                <div class="amount">
                    <p style="font-size:12px;">月度收款</p>
                    <div id="myChart3" :style="{width: '100%', height: '320px'}"></div>
                </div>

                <div class="region">
                    <p style="font-size:12px;">各区域销售额</p>
                    <div id="myChart5" :style="{width: '100%', height: '320px'}"></div>
                </div>

            </el-col>
        </div>

    </div>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import { mapGetters } from 'vuex'



export default {
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    props: [],
    data() {
        return {
           
        }
    },

    methods: {
        
        //月度数量
        drawLine1(){
             // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById("myChart1"));
            let option = {
                grid: {
                  y: '-46',
                },
                legend: {
                    
                },
                xAxis: {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type : 'value',
                    scale : true,
                    min : 0,
                    // max : 1000,
                    splitNumber : 2,
                },
                series: [{
                    data: [399, 405, 368, 384, 367, 421, 421, 391, 427, 320, 0, 0],
                    type: 'bar'
                }]
            }
            // 绘制图表
            myChart.setOption(option);
        },

        //合同类型
        drawLine2(){
            // 基于准备好的dom，初始化echarts实例
            let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: ['产品销售合同', '升级服务合同', '常规二次销售合同', '售后服务合同', '咨询服务合同']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 335, name: '产品销售合同'},
                            {value: 310, name: '升级服务合同'},
                            {value: 234, name: '常规二次销售合同'},
                            {value: 135, name: '售后服务合同'},
                            {value: 1548, name: '咨询服务合同'}
                        ]
                    }
                ]
            }
            // 绘制图表
            myChart2.setOption(option);
        },

        //月度收款
        drawLine3(){
             // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById("myChart3"));
            let option = {
                grid: {
                },
                legend: {
                    
                },
                xAxis: {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type : 'value',
                    scale : true,
                    min : 0,
                    // max : 1000,
                    splitNumber : 2,
                },
                series: [{
                    data: [399, 405, 368, 384, 367, 421, 421, 391, 427, 320, 0, 0],
                    type: 'bar'
                }]
            }
            // 绘制图表
            myChart.setOption(option);
        },

        drawLine4() {
            let myChart4 = this.$echarts.init(document.getElementById("myChart4"));
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['未激活', '履行中', '变更', '暂停', '终止', '解除']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 335, name: '未激活'},
                            {value: 310, name: '履行中'},
                            {value: 234, name: '变更'},
                            {value: 135, name: '暂停'},
                            {value: 1548, name: '终止'},
                            {value: 1548, name: '解除'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            // 绘制图表
            myChart4.setOption(option);
        },

         //月度收款
        drawLine5(){
             // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById("myChart5"));
            let option = {
                grid: {
                },
                legend: {
                    
                },
                xAxis: {
                    type: 'category',
                    data: ['上海大区', '江西大区', '苏皖大区', '西南大区', '重庆大区', '湖南大区']
                },
                yAxis: {
                    type : 'value',
                    scale : true,
                    min : 0,
                    // max : 1000,
                    splitNumber : 2,
                },
                series: [{
                    data: [399, 405, 368, 384, 367, 421],
                    type: 'bar'
                }]
            }
            // 绘制图表
            myChart.setOption(option);
        },


    },

    components: {

    },

    mounted() {
        this.drawLine1();
        this.drawLine2();
        this.drawLine3();
        this.drawLine4();
        this.drawLine5();
    }
    
}

</script>

<style scoped>

ul {
    margin: 0;
    padding: 0;
}

ul li {
    margin: 0;
    padding: 0;
    list-style: none;
}

p {
    margin: 0;
    padding: 0;
}

html, body {
    height: 100%;
    margin: 0;
    padding: 0;
}

.continer {
    width: 100%;
	height: 100%;
}

.continer .header {
    width: 100%;
    border-bottom: 1px solid rgb(241, 241, 241);
    height: 100px;
    position: relative;
    background: #f9f9f9;
}

.continer .header .top {
    height: 50px;
}

.continer .header .left {
   height: 100%;
   width: 50px;
   margin-left: 20px;
   float: left;
}

.continer .header i {
   width: 100%;
   text-align: center;
   font-size: 28px;
   line-height: 50px;
}

.continer .header .title {
    float: left;
    font-size: 14px;
    margin-left: 20px;
    line-height: 50px;
}

.continer .slide {
    height: 50px;
    background: #fff;
    border-bottom: 1px solid rgb(241, 241, 241);
    font-size: 12px;
}

.continer .slide ul {
    height: 100%;
    margin-left: 15px;
}

.continer .slide ul li{
    display: inline-block;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    position: relative;
}

.continer .slide ul li.active:before {
    content: '';
    height: 3px;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -1px;
    background: #409EFF;
}

.continer .content {
    height: 100%;
    width: 100%;
}

.content .showbox {
    width: 100%;
    height: 260px;
    overflow:hidden;
    border-bottom: 1px solid rgb(241, 241, 241);
}

.content .showbox .t-box {
    height: 100px;
    margin: 20px 10px;
    border: 1px solid #35505a;
    border-radius: 5px;
    background-color: #35505a;
    position: relative;
}

.el-icon-coin {
    font-size: 48px;
    position: absolute;
    right: 40px;
    top: 30px;
}

.content .showbox .t-box p {
    margin-left: 14px;
}

.content .showbox .t-box p:nth-child(1) {
    font-size: 12px;
    margin-top: 30px;
    color: rgb(255,255,255,0.6);
}

.content .showbox .t-box p:nth-child(2) {
    font-size: 14px;
    margin-top: 10px;
    color: #fff;
}

.content .showbox .b-box {
    width: 100%;
    height: 130px;
    display: flex;
    justify-content: center;
    
}

.content .showbox .b-box .l {
    margin: 0 10px;
    height: 100px;
    border: 1px solid #35505a;
    border-radius: 5px;
    background-color: #35505a;
    flex: 1;
}

.content .showbox .b-box .r {
    height: 100px;
    margin-right: 10px;
    border: 1px solid #35505a;
    border-radius: 5px;
    background-color: #35505a;
    flex: 1;
}

.content .showbox .b-box .l p {
    margin-left: 14px;
}

.content .showbox .b-box .r p {
    margin-left: 14px;
}

.content .showbox .b-box .l p:nth-child(1) {
    margin-top: 30px;
    font-size: 12px;
    color: rgb(255,255,255,0.6);
}

.content .showbox .b-box .r p:nth-child(1) {
    margin-top: 30px;
    font-size: 12px;
    color: rgb(255,255,255,0.6);
}

.content .showbox .b-box .l p:nth-child(2) {
    font-size: 14px;
    margin-top: 10px;
    color: #fff;
}

.content .showbox .b-box .r p:nth-child(2) {
    font-size: 14px;
    margin-top: 10px;
    color: #fff;
}

.right {
    border-left: 1px solid rgb(241, 241, 241);
}

.right .year {
    width: 100%;
    height: 260px;
    overflow:hidden;
    /* margin-left: 10px; */
    border-bottom: 1px solid rgb(241, 241, 241);
    position: relative;
}

.right .year h5 {
    font-size: 14px;
    color: #333;
    font-weight: normal;
    padding: 20px 20px 12px;
}

#myChart1 {
    margin-top: 34px;
    margin-left: -4%;
    position: relative;
}

.content .chart2 {
    width: 100%;
    height: 350px;
    border-bottom: 1px solid rgb(241, 241, 241);
    border-right: 1px solid rgb(241, 241, 241);
    position: relative;
}

.content .chart2 p {
    padding: 10px;
    padding-bottom: 20px;
}

.right .amount {
    width: 100%;
    height: 350px;
    border-bottom: 1px solid rgb(241, 241, 241);
    position: relative;
    overflow:hidden;
}

.right .amount p{
    padding: 10px;
    padding-bottom: 0px;
}

.right .region {
    width: 100%;
    height: 350px;
    border-bottom: 1px solid rgb(241, 241, 241);
    position: relative;
    overflow:hidden;
}

.right .region p{
    padding: 10px;
    padding-bottom: 0px;
}

.content .status {
    width: 100%;
    height: 350px;
    border-bottom: 1px solid rgb(241, 241, 241);
    border-right: 1px solid rgb(241, 241, 241);
    position: relative;
}

.content .status p {
    padding: 10px;
    padding-bottom: 20px;
}

#myChart2 {
    margin-top: 10px;
    margin-left: -2%;
    position: relative;
}

#myChart3 {
    margin-top: 10px;
    margin-left: -2%;
    position: relative;
}

#myChart5 {
    margin-top: 10px;
    margin-left: -2%;
    position: relative;
}

</style>