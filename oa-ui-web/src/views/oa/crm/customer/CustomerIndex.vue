<template>
	<section>
        <el-row :span="24" class="page-container border padding">
            <el-col class="nav-left" :span="16">
                <el-row>
                    
                    <div class="banner">
                    </div>

                    <div class="tabs">
                        <ul class="tabs-header">
                            <li>全部</li>
                            <li>待办</li>
                            <li>已办</li>
                            <li>办结</li>
                        </ul>

                        <div class="tabs-nav ">
                            <div class="tab1 ">
                                <ul>
                                    <li>
                                        <span>加班申请历程-谢家豪</span>
                                        <span class="right">2020-05-28</span>
                                    </li>
                                    <li>
                                        <span>产品销售合同-谢家豪</span>   
                                        <span class="right">2020-05-28</span>    
                                    </li>
                                    <li>
                                        <span>新建合同范本流程-谢家豪</span>
                                        <span class="right">2020-05-28</span>   
                                    </li>
                                    <li>
                                        <span>日常报销-谢家豪</span>
                                        <span class="right">2020-05-28</span>
                                    </li>
                                    <li>
                                        <span>日常报销费用-谢家豪</span>
                                        <span class="right">2020-05-28</span>
                                    </li>
                                </ul>
                            </div>
                           
                        </div>
                    </div>

                    <!-- 销售合同列表 -->
                    <div class="xshtList">
                        <div class="top">
                            <div class="iBox">
                                <span class="el-icon-discount"></span>
                            </div>
                            <span class="title">销售合同列表</span>
                        </div>

                        <div class="xshtList-nav">
                            <el-table :data="tableData" row-class-name="rowMyClass" header-cell-class-name="handlemyclass"  
                                style="width: 100%">
                                    <el-table-column align="left" prop="id" label="合同编号" width="180"> </el-table-column>
                                    <el-table-column align="left" prop="name" label="合同名称" width="180"> </el-table-column>
                                    <el-table-column align="left" prop="date" label="签订日期"></el-table-column>
                                    <el-table-column align="left" prop="amount" label="合同金额"></el-table-column>
                                    <el-table-column align="left" prop="status"  label="签署状态"> </el-table-column>
                            </el-table>                          
                        </div>
                    </div>

                    <!--最新客户 -->
                    <div class="zuiXinKeHu">
                        <div class="top">
                            <div class="iBox">
                                <span class="el-icon-discount"></span>
                            </div>
                            <span class="title">最新客户</span>
                        </div>
                        <div class="zuiXinKeHu-nav">
                            <div class="tab1">
                                <ul>
                                    <li v-for="(item) in customerData" :key="item.customerId">
                                        <span style="float:left">{{item.createTime}}</span>
                                        <span>{{item.customerName}}</span>
                                        <span>{{item.managerUserName}}</span>
                                    </li>
                                </ul>
                            </div>               
                        </div>
                    </div>

                </el-row>
            </el-col>

            <el-col class="nav-right" :span="8">
               
                <div class="rightOne">
                    <div class="top">
                        <div class="iBox">
                            <span class="el-icon-discount"></span>
                        </div>
                        <span class="title">数据统计</span>
                    </div>

                    <div class="rightOne-nav">
                       <div class="menu clearfix">
                            <div class="menu-nav">
                                <img class="menu-img" src="./img/menu1.png" />
                                <div class="content">
                                    <div class="data">
                                        <span>
                                            <a>20</a>
                                        </span>
                                    </div>
                                    <div class="title">客户数量</div>
                                </div>
                            </div>
                        </div>
                        <div class="menu clearfix">
                            <div class="menu-nav">
                                <img class="menu-img" src="./img/menu2.png" />
                                <div class="content">
                                    <div class="data">
                                        <span>
                                            <a>15</a>
                                        </span>
                                    </div>
                                    <div class="title">商机数量</div>
                                </div>
                            </div>
                        </div>
                        <div class="menu clearfix">
                            <div class="menu-nav">
                                <img class="menu-img" src="./img/menu3.png" />
                                <div class="content">
                                    <div class="data">
                                        <span>
                                            <a>5</a>
                                        </span>
                                    </div>
                                    <div class="title">合同数量</div>
                                </div>
                            </div>
                        </div>
                        <div class="menu clearfix">
                            <div class="menu-nav">
                                <img class="menu-img"  src="./img/menu4.png" />
                                <div class="content">
                                    <div class="data">
                                        <span>
                                            <a>120</a>
                                        </span>
                                    </div>
                                    <div class="title">客户联系</div>
                                </div>
                            </div>
                        </div>
                </div>

                <div class="rightTwo">
                    <div class="top">
                        <div class="iBox">
                            <span class="el-icon-discount"></span>
                        </div>
                        <span class="title">常用功能</span>
                    </div>

                    <div class="rightTwo-nav">
                        <div class="menu">
                            <img src="./img/item1.png" />
                            <span>我的客户</span>
                        </div>

                        <div class="menu">
                            <img src="./img/item2.png" />
                            <span>查询客户</span>
                        </div>

                        <div class="menu">
                            <img src="./img/item3.png" />
                            <span>客户联系</span>
                        </div>

                        <div class="menu">
                            <img src="./img/item4.png" />
                            <span>商机查询</span>
                        </div>

                        <div class="menu">
                            <img src="./img/item5.png" />
                            <span>合同查询</span>
                        </div>

                        <div class="menu">
                            <img src="./img/item6.png" />
                            <span>服务查询</span>
                        </div>

                        <div class="menu">
                            <img src="./img/item7.png" />
                            <span>印章管理</span>
                        </div>

                        <div class="menu">
                            <img src="./img/item8.png" />
                            <span>统计报表</span>
                        </div>
                    </div>
                </div>


                <div class="rightThree">
                    <div class="top">
                        <div class="iBox">
                            <span class="el-icon-discount"></span>
                        </div>
                        <span class="title">客户提醒</span>
                    </div>

                    <div class="rightThree-nav">
                        <ul class="main">
                           <li>
                                <div class="tImg tImg1">
                                </div>
                                <div class="content">
                                    <div class="text1">微博</div>
                                    <div class="text ">
                                        <a>您有三个微博提醒</a>
                                    </div>
                                    <div class="text">
                                        <a>本月更新10个微博</a>
                                    </div>
                                </div>
                           </li>

                            <li>
                                <div class="tImg tImg2">
                                </div>
                                <div class="content">
                                    <div class="text1">客户</div>
                                    <div class="text ">
                                        <a>您有3个微博提醒</a>
                                    </div>
                                    <div class="text">
                                        <a>本月更新10个微博</a>
                                    </div>
                                </div>
                           </li>

                           <li>
                                <div class="tImg tImg2">
                                </div>
                                <div class="content">
                                    <div class="text1">人脉</div>
                                    <div class="text ">
                                        <a>您有5个客户未联系</a>
                                    </div>
                                    <div class="text">
                                        <a>本月新增2个客户</a>
                                    </div>
                                </div>
                           </li>

                           <li>
                                <div class="tImg tImg4">
                                </div>
                                <div class="content">
                                    <div class="text1">商机</div>
                                    <div class="text ">
                                        <a>您有3个人脉未添加</a>
                                    </div>
                                    <div class="text">
                                        <a>本月新增5个人脉</a>
                                    </div>
                                </div>
                           </li>

                           <li>
                                <div class="tImg tImg5">
                                </div>
                                <div class="content">
                                    <div class="text1">会议</div>
                                    <div class="text ">
                                        <a>您有2个商机为跟进</a>
                                    </div>
                                    <div class="text">
                                        <a>本月新增3个商机</a>
                                    </div>
                                </div>
                           </li>

                           <li>
                                <div class="tImg tImg6">
                                </div>
                                <div class="content">
                                    <div class="text1">风险</div>
                                    <div class="text ">
                                        <a>您有5个风险未处理</a>
                                    </div>
                                    <div class="text">
                                        <a>本月新增3个风险</a>
                                    </div>
                                </div>
                           </li>
                        </ul>
                    </div>
                </div>
               </div>
            </el-col>
        </el-row>

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex';
    import config from "@/common/config"; //全局公共库import
    import {getNewestCustomer} from '@/api/oa/crm/customer';
    
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},

		watch: {
		},

		data() {
			return {
                tableData: [
                    {
                        id: 'XSHT201933221552',
                        name: '销售合同',
                        date: '2019-03-29',
                        amount: '1,988.00',
                        status: '已签署'        
                    },
                    {
                        id: 'XSHT201933221552',
                        name: '销售合同',
                        date: '2019-03-29',
                        amount: '1,231,988.00',
                        status: '已签署'        
                    },
                    {
                        id: 'XSHT201933221552',
                        name: '销售合同',
                        date: '2019-03-29',
                        amount: '1,988.00',
                        status: '已签署'        
                    },{
                        id: 'XSHT201933221552',
                        name: '销售合同',
                        date: '2019-03-29',
                        amount: '1,988.00',
                        status: '已签署'        
                    }
                    ,{
                        id: 'XSHT201933221552',
                        name: '销售合同',
                        date: '2019-03-29',
                        amount: '988.00',
                        status: '已签署'        
                    }
                    ,{
                        id: 'XSHT201933221552',
                        name: '销售合同',
                        date: '2019-03-29',
                        amount: '21,988.00',
                        status: '已签署'        
                    }
                ],

                customerData: [],

			}
		},//end data
		methods: { 
            
            //表格表头样式
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'color: rgb(123,122,123); font-size:14px; '
                }
            },


                        //查询最新录入客户
            getBestNewCurstorm() {
                let params = {}
                getNewestCustomer(params).then((res) => {
                    var tips=res.data.tips;
                    if(tips.isOk){ 
                        this.customerData = res.data.data;
                    }
                    this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => {});
            }


			
		},//end methods
		components: {

		},
		mounted() { 
            this.getBestNewCurstorm();
		}
	}

</script>


<style scoped>

.clearfix:after { content:"."; clear: both; height: 0; overflow: hidden; visibility: hidden; display: block; }


.app-container {
    background-color: rgb(237, 240, 246);
    margin: 0;
    padding: 10px;
}

ul {
    margin: 0;
    padding: 0;
}

ul li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.banner {
    width: 100%;
    height: 200px;
    padding: 20px;
    /* background: url("./img/crm01.jpg") center center / cover no-repeat; */
    border: 4px solid rgb(255, 255, 255);
}

.tabs {
    height: 210px;
    width: 100%;
    background-color: rgb(255, 255, 255);
    margin-top: 10px;
}

.tabs .tabs-header {
    width: 45%;
    height: 40px;
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    color: rgb(189,189,189);
    font-size: 12px;
    line-height: 40px;
}

.tabs .tabs-header li {
    flex: 1;
    text-align: center;
    cursor: pointer;
}

.tabs-nav {
    width: 100%;
    border-top: 1px solid rgb(237, 240, 246);
}

.tab1 ul {
    padding-left: 10px;
    font-size: 12px;
    color: rgb(123,122,123);
    height: 30px;
    line-height: 30px;
}

.tab1 ul li .right {
    float: right;
    margin-right: 20px;
}


.tab1 ul li:hover {
    background: rgb(233, 247, 255);
    cursor: pointer;
}

.tab1 ul li span:nth-child(2) {
    margin-left: 68px;
    color:rgb(51, 147, 252);
}

.tab1 ul li span:nth-child(3) {
    float: right;
    margin-right: 20px;
}


/*销售合同列表 **/
.xshtList {
    height: 310px;
    width: 100%;
    background-color: rgb(255, 255, 255);
    margin-top: 10px;
}


/* .el-icon-price-tag  */
.top {
    height: 40px;
}

.top .iBox{
    width: 26px;
    height: 26px;
    display: inline-block;
    background-color: rgb(51, 147, 252);
    border-radius: 10% 10% 10% 10%;
    margin: 8px 0 0 10px;
}

.top .iBox .el-icon-discount{
    color: rgb(255, 255, 255);
    line-height: 26px;
    margin-left: 5px;
}


.top .title {
    font-size: 12px;
    margin-left: 2px;
}

.xshtList .xshtList-nav {
    width: 100%;
    border-top: 1px solid rgb(237, 240, 246);
}

.zuiXinKeHu {
    height: 310px;
    width: 100%;
    background-color: rgb(255, 255, 255);
    margin-top: 40px;
}


.zuiXinKeHu .zuiXinKeHu-nav {
    width: 100%;
    border-top: 1px solid rgb(237, 240, 246);
}

.nav-right {
    padding-left: 10px;
}

.rightOne {
    height: 200px;
    width: 100%;
    background-color: rgb(255, 255, 255);
}

.rightOne-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(237, 240, 246);
}

.rightOne-nav .menu {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 80px;
    border: 1px dashed rgb(237, 240, 246);
}

.rightOne-nav .menu img {
   width: 32px;
   height: 32px;
   margin: 15px 0 0 10px;
}

.menu-nav {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
}

.menu-nav .content {
    margin: 10px 0 0 10px;
    font-size: 12px;
    margin-top: 20px;
}

.menu-nav a {
    font-size: 18px;
    color: rgb(101, 170, 77);
}

.menu-nav .title {
    margin-top: 8px;
    color: rgb(123,122,123);
}

.menu-nav:hover {
    cursor: pointer;
    background-color: rgb(245, 247, 250);
}


.rightTwo {
    height: 210px;
    width: 100%;
    background-color: rgb(255, 255, 255);
    margin-top: 8px;
}

.rightTwo .rightTwo-nav {
    width: 100%;
    border-top: 1px solid rgb(237, 240, 246);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.rightTwo .rightTwo-nav .menu {
    display: flex;
    flex-direction: column;
    width: 25%;
    height: 84px;
    font-size: 12px;
    border: 1px dashed rgb(237, 240, 246);
    border-bottom: 0,
}

.rightTwo .rightTwo-nav .menu:hover {
    cursor: pointer;
    background-color: rgb(245, 247, 250);
}

.rightTwo .rightTwo-nav .menu img {
   width: 24px;
   height: 24px;
   margin: 0 auto;
   margin-top: 15px;
}

.rightTwo .rightTwo-nav .menu span {
    margin: 0 auto;
    margin-top: 10px;
    color: rgb(123,122,123);
}

.rightTwo .rightTwo-nav .menu span:hover {
    color: rgb(51, 147, 252);
}


.rightThree {
    height: 660px;
    width: 100%;
    background-color: rgb(255, 255, 255);
    margin-top: 10px;
}

.rightThree-nav {
    width: 100%;
    border-top: 1px solid rgb(237, 240, 246);
}

.rightThree-nav .main {
    height: 100px;
    width: 100%;
    margin-top: 2px;
}


.rightThree-nav .main .tImg {
    width: 20%;
    height: 100px;
    margin: 0 auto;
    float: left;
}

.rightThree-nav .main .tImg1 {
    background: url('./img/t1.png') no-repeat center;
    background-size: 28px;
}

.rightThree-nav .main .tImg2 {
    background: url('./img/t2.png') no-repeat center;
    background-size: 28px;
}

.rightThree-nav .main .tImg3 {
    /* background: url('./img/td3.png') no-repeat center; */
    background-size: 28px;
}

.rightThree-nav .main .tImg4 {
    background: url('./img/t4.png') no-repeat center;
    background-size: 28px;
}

.rightThree-nav .main .tImg5 {
    background: url('./img/t5.png') no-repeat center;
    background-size: 28px;
}

.rightThree-nav .main .tImg6 {
    background: url('./img/t6.png') no-repeat center;
    background-size: 28px;
}


.rightThree-nav .main .content {
    width: 80%;
    float: right;
    font-size: 12px;
    margin-top: 20px;
}

.rightThree-nav .main li {
    height: 100px;
    border-bottom: 2px dashed rgb(237, 240, 246);
}

.rightThree-nav .main .content .text1 {
    font-size: 14px;
    color: black;
}

.rightThree-nav .main .content .text {
    font-size: 12px;
    color: rgb(123,122,123);
    margin-top: 6px;
}

.rightThree-nav .main .content .text:hover {
    color: rgb(51, 147, 252);
    cursor: pointer;
}

</style>

<style>
.handlemyclass {
    font-size: 12px !important;
    font-weight: normal !important;
}

.rowMyClass {
    font-size: 12px !important;
    font-weight: normal !important;
    height: 20px !important;
    line-height: 20px !important;
    cursor: pointer !important;
}

</style>
