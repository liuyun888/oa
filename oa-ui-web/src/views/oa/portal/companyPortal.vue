<template>
  <div class="companyContainer">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left">
          <div class="item">
            <img src="../../../assets/image/portal_page.png" />
          </div>
          <!-- 新闻动态 -->
          <div class="dynamic">
            <div class="dynamic-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>新闻动态</span>
            </div>
            <div class="dynamic-content">
              <el-row :gutter="10" style="margin-bottom:10px" v-for="(news,index) in listNews" :key="index">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-carousel trigger="click" height="120px">
                      <el-carousel-item v-for="item in dataList1" :key="item">
                        <img
                          :src="item"
                          alt
                          width="100%"
                          height="100%"
                        />
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </el-col>
                <el-col :span="18">
                  <div class="grid-content bg-purple dynamic-font">
                    <div class="dynamic-title" v-text="news.archiveTitle"></div>
                    <div
                      class="dynamic-detail"
                      v-text="news.archiveAbstract"
                    ></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>

          <el-row :gutter="10">
            <el-col :span="12">
              <div class="sign">
                <div class="sign-header">
                  <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
                  <span>规章制度</span>
                </div>
                <div class="sign-content">
                  <ul>
                    <li class="sign-content-li">
                      <span>产品文档</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>啦啦啦啦</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>文档示范</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>时诵诗书所所所</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>测试</span>
                      <span>2020-07-07</span>
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
            <!-- 通知公告 -->
            <el-col :span="12">
              <div class="sign">
                <div class="sign-header">
                  <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
                  <span>通知公告</span>
                </div>
                <div class="sign-content">
                  <ul>
                    <li class="sign-content-li" v-for="(notification,index) in listNotification" :key="index">
                      <span v-text="notification.archiveTitle"></span>
                      <span v-text="notification.createDate"></span>
                    </li>
                    <!-- <li class="sign-content-li">
                      <span>tgttt</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>手动蝶阀</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>测试</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>测试</span>
                      <span>2020-07-07</span>
                    </li> -->
                  </ul>
                </div>
              </div>
            </el-col>
            <!-- 签约新闻 -->
            <el-col :span="12">
              <div class="sign">
                <div class="sign-header">
                  <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
                  <span>签约新闻</span>
                </div>
                <div class="sign-content">
                  <ul>
                    <li class="sign-content-li">
                      <span>电子商务——薛海英成功签约上海众旦信息公司</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>金属行业——陆敏成功签约中铝中州铝业有限公司</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>建材行业——张益锴成功签约江苏磊达股份有限公司</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>制鞋行业——陈琦成功签约莆田市新协胜鞋业公司</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>科研院所——张勇军成功签约安徽省长江计量所</span>
                      <span>2020-07-07</span>
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
            <!-- 协作交流 -->
            <el-col :span="12">
              <div class="sign">
                <div class="sign-header">
                  <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
                  <span>协作交流</span>
                </div>
                <div class="sign-content">
                  <ul>
                    <li class="sign-content-li">
                      <span>项目经验分享</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>2018年羽毛球赛交流</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>市场宣传资料分享</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>新员工培训资料分享</span>
                      <span>2020-07-07</span>
                    </li>
                    <li class="sign-content-li">
                      <span>营销经验分享</span>
                      <span>2020-07-07</span>
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right">
          <!-- 企业文化 -->
          <div class="culture">
            <div class="culture-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>企业文化</span>
            </div>
            <div class="culture-content">
              <div
                class="wea-temp14-pieChart wea-temp-shodow"
                style="border-color: #2F9FF8 #68CFFB #2F9FF8 #68CFFB"
              >
                <a class="wea-temp14-circle hover1">四心</a>
                <a class="wea-temp14-left hover1">创新心</a>
                <a class="wea-temp14-top hover1">责任心</a>
                <a class="wea-temp14-right hover1">主动心</a>
                <a class="wea-temp14-bottom hover1">专业心</a>
              </div>
            </div>
          </div>
          <!-- 新员工入职 -->
          <div class="new-employee">
            <div class="new-employee-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>新员工入职</span>
            </div>
            <div class="new-employee-content">
              <div class="flowChart">
                <div class="flowChart-left">
                  <div class="dashed"></div>
                </div>
                <div class="flowChart-right">
                  <div class="oneNode" v-for="user in newWorkers" :key="user.userid">
                    <div class="timediv">
                      <div class="timeday" v-text="user.day">16</div>
                      <div class="timemon" v-text="getMonth(user.month)">四月</div>
                    </div>
                    <div class="tag-boder"></div>
                    <div class="NodeDetail">
                      <div class="NodeDetail-title">
                        <div class="NodeDetail-title-circle" v-text="user.username">甘露</div>
                        <div class="NodeDetail-title-details">
                          <h4 v-text="user.username">甘露</h4>
                          <p v-text="user.deptName">项目工程部</p>
                        </div>
                      </div>
                      <div
                        class="NodeDetail-content"
                      >我很荣幸能够加入维森大家庭，希望自己能尽快掌握产品知识，在未来的工作中我会更加积极努力的完善自己，更完美的展现自身价值。</div>
                      <div class="NodeDetail-footer">
                        <span v-text="user.entryTime">2019-04-16</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {listNewWorker} from '@/api/oa/hr/user/hrUserBaseInfo'
import { listArchive } from "@/api/mdp/arc/archive";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      dataList1: [
        require("../../../assets/image/daily_work2.png"),
        require("../../../assets/image/daily_work1.jpg"),
        require("../../../assets/image/daily_work4.png"),
        require("../../../assets/image/daily_work3.jpg"),
      ],
      dataList2: [
        require("../../../assets/image/daily_work1.jpg"),
        require("../../../assets/image/daily_work2.png"),
        require("../../../assets/image/daily_work3.jpg"),
        require("../../../assets/image/daily_work4.png")
      ],
      activeName: "first",
      showHeader: false,
      value: "",
      calendar: new Date(),
      newWorkers:[],
      listNews:[],
      listNotification:[],
    };
  },
  methods:{
    //获取新员工，最近十条
    getNewWorker(){
      let params = {
        branchId: this.userInfo.branchId,
        pageNum:1,
        pageSize:10,
      }
      listNewWorker(params).then(res => {
        let tips = res.data.tips;
        if(tips.isOk){
          console.log(res.data.data);
          for(let i =0 ; i< res.data.data.length; i++){
            let user =  res.data.data[i];
            let date = new Date(res.data.data[i].entryTime);
            let month = date.getMonth()+1;
            let entryTime = user.entryTime.split(" ")[0];
            let day =  date.getDate();
            let data = {
              userid:user.userid,
              username:user.username,
              deptName:user.deptName,
              month:month,
              day:day,
              entryTime:entryTime
            }
            this.newWorkers.push(data);
          }
        }
        this.$message({
          message: tips.msg,
          type: tips.isOk ? "success" : "error"
        });
      })
    },
    getMonth(month){
      if(month == '1'){
        return "一月"
      }
      if(month == '2'){
        return "二月"
      }
      if(month == '3'){
        return "三月"
      }
      if(month == '4'){
        return "四月"
      }
      if(month == '5'){
        return "五月"
      }
      if(month == '6'){
        return "六月"
      }
      if(month == '7'){
        return "七月"
      }
      if(month == '8'){
        return "八月"
      }
      if(month == '9'){
        return "九月"
      }
      if(month == '10'){
        return "十月"
      }
      if(month == '11'){
        return "十一月"
      }
      if(month == '12'){
        return "十二月"
      }
    },
     //获取新闻
    getNews(){
      let orderBys = [];
      //降序
      orderBys.push("create_date" + " " + "desc");
      let params = {
        branchId:this.userInfo.branchId,
        status:"1", //发布
        archiveType:"0", //新闻
        pageSize: 2,
        pageNum: 1,
        orderBy: orderBys.join(","),
      }
      listArchive(params).then(res => {
        let tips = res.data.tips;
        if(tips.isOk){
          this.listNews = res.data.data;
          //this.listNews[0].dataList =this.dataList1
          //this.listNews[1].dataList = this.dataList2
        }
      })
    },
    //重要通知
    getNotification(){
      let orderBys = [];
      //降序
      orderBys.push("create_date" + " " + "desc");
      let params = {
        branchId:this.userInfo.branchId,
        status:"1", //发布
        archiveType:"2", //通知
        pageSize: 5,
        pageNum: 1,
        orderBy: orderBys.join(","),
      }
      listArchive(params).then(res => {
        let tips = res.data.tips;
        if(tips.isOk){
          this.listNotification = res.data.data;
          console.log(this.listNotification);
        }
      })
    }

  },
  mounted(){
    this.getNewWorker();
    this.getNews();
    this.getNotification();
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
.companyContainer {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 15px;
  .left {
    .item {
      height: 200px;
      width: 100%;
      background: white;
      padding: 5px;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .dynamic {
      margin-top: 10px;
      background: white;
      min-height: 250px;
      .dynamic-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .dynamic-content {
        padding: 10px;
        .dynamic-title {
          line-height: 32px;
          font-size: 14px;
          font-weight: bold;
          color: rgb(102, 102, 102);
          cursor: pointer;
        }
        .dynamic-detail {
          line-height: 24px;
          font-size: 12px;
        }
      }
    }
    .sign {
      margin-top: 10px;
      background: white;
      .sign-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .sign-content {
        padding: 10px;
        min-height: 200px;
        .sign-content-li {
          padding: 0px 10px;
          list-style: none;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          height: 30px;
          line-height: 30px;
        }
        .sign-content-li span {
          font-size: 12px;
        }
        .sign-content-li:hover {
          background: #2db7f5;
        }
        .sign-content-li:hover span {
          color: #fff;
        }
      }
    }
  }
  .right {
    .culture {
      background: white;
      .culture-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .culture-content {
        padding: 10px;
        .wea-temp14-pieChart {
          position: relative;
          width: 0;
          height: 0;
          border-radius: 100px;
          margin: auto;
          border-width: 100px;
          border-style: solid;
          border-color: #329aff #ffc446 #c4161e #000;
        }
        .wea-temp-shodow {
          box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
            0px 1px 1px 0px rgba(0, 0, 0, 0.14),
            0px 1px 3px 0px rgba(0, 0, 0, 0.12);
        }
        .wea-temp14-circle {
          display: inline-block;
          text-decoration: none;
          width: 100px;
          height: 100px;
          color: #000;
          background-color: #ccc;
          position: relative;
          top: -50px;
          left: -50px;
          border-radius: 50px;
          text-align: center;
          vertical-align: middle;
          line-height: 100px;
          font-size: 16px;
        }
        .wea-temp14-left {
          position: absolute;
          width: 20px;
          top: -30px;
          left: -78px;
          text-decoration: none;
          color: #fff !important;
        }
        .wea-temp14-top {
          position: absolute;
          width: 80px;
          top: -80px;
          text-decoration: none;
          left: -40px;
          color: #fff !important;
          text-align: center;
        }
        .wea-temp14-right {
          position: absolute;
          width: 20px;
          top: -30px;
          left: 67px;
          text-decoration: none;
          color: #fff !important;
        }
        .wea-temp14-bottom {
          position: absolute;
          width: 80px;
          top: 60px;
          left: -40px;
          text-decoration: none;
          color: #fff !important;
          text-align: center;
        }
        .hover1:hover {
          color: #0984e3;
        }
      }
    }
    .new-employee {
      background: white;
      margin-top: 10px;
      .new-employee-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .new-employee-content {
        padding: 10px;
        height: 720px;
        overflow: auto;
        .flowChart {
          padding: 12px;
          display: flex;
          .flowChart-left {
            width: 50px;
            flex-shrink: 0;
            .dashed {
              width: 0px;
              height: 100%;
              margin-left: 50%;
              border-left-style: dashed;
              border-left-color: darkgray;
              border-left-width: 2px;
            }
          }
          .flowChart-right {
            flex-grow: 1;
            .oneNode {
              display: flex;
              align-items: center;
              width: 100%;
              margin-bottom: 14px;
              .timediv {
                left: -49px;
                position: relative;
                .timeday {
                  height: 25px;
                  width: 50px;
                  border-top-right-radius: 25px;
                  border-top-left-radius: 25px;
                  background: #4978ae;
                  color: #ffffff;
                  text-align: center;
                  line-height: 25px;
                  font-size: 12px;
                }
                .timemon {
                  height: 25px;
                  width: 50px;
                  border-bottom-right-radius: 25px;
                  border-bottom-left-radius: 25px;
                  background: #aaaaaa;
                  color: #ffffff;
                  text-align: center;
                  line-height: 25px;
                  font-size: 12px !important;
                }
              }
              .tag-boder {
                width: 0;
                height: 0;
                border: 12px solid;
                border-style: dashed;
                border-color: transparent gainsboro transparent transparent;
                position: relative;
                left: -59px;
              }
              .NodeDetail {
                background-color: white;
                margin-left: -60px;
                flex-grow: 1;
                border: 1px solid gainsboro;
                border-radius: 3px;
                padding: 14px;
                display: flex;
                flex-direction: column;
                box-shadow: 1px 1px 3px gainsboro;
                .NodeDetail-title {
                  display: flex;
                  margin-bottom: 10px;
                  .NodeDetail-title-circle {
                    width: 50px;
                    height: 50px;
                    background: #6495e6;
                    border-radius: 50px;
                    line-height: 50px;
                    text-align: center;
                    color: white;
                  }
                  .NodeDetail-title-details {
                    flex-grow: 1;
                    padding-left: 8px;
                    margin-left: 8px;
                    border-left: 4px solid rgb(72, 108, 160);
                    p {
                      color: #9a9a9a;
                      margin-top: 5px;
                    }
                  }
                }
                .NodeDetail-content {
                  flex-grow: 1;
                  color: #4d4d4d;
                  font-size: 12px;
                  line-height: 20px;
                }
                .NodeDetail-footer {
                  margin-top: 10px;
                  span {
                    float: right;
                  }
                }
              }
            }
          }
        }
      }
      .new-employee-content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: #d1d1d1;
        -webkit-transition: background-color 0.3s ease-in-out;
        transition: background-color 0.3s ease-in-out;
      }
      .new-employee-content::-webkit-scrollbar-thumb {
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
      .new-employee-content::-webkit-scrollbar-track {
        background-color: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.dynamic{
  .el-carousel__button {
    width: 10px !important;
  }
}

</style>
