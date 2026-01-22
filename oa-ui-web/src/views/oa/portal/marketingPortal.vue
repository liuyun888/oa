<template>
  <div class="marketingContainer">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left">
          <div class="item">
            <img src="../../../assets/image/portal_page.png" />
          </div>
          <!-- 知识地图 -->
          <div class="knowledge">
            <div class="knowledge-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>知识地图</span>
            </div>
            <div class="knowledge-content">
              <el-row>
                <el-col :span="6">
                  <div class="knowledge-content-box">
                    <div class="item-area">
                      <img src="../../../assets/image/portal-1.jpg" alt class="block-item-bg" />
                      <img src="../../../assets/image/portal-icon9.png" alt class="block-item-icon" />
                      <div class="item-bg-div"></div>
                    </div>
                    <div class="block-item-title">运营体系知识地图</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="knowledge-content-box">
                    <div class="item-area">
                      <img src="../../../assets/image/portal-2.jpg" alt class="block-item-bg" />
                      <img src="../../../assets/image/portal-icon10.png" alt class="block-item-icon" />
                      <div class="item-bg-div"></div>
                    </div>
                    <div class="block-item-title">运营体系知识地图</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="knowledge-content-box">
                    <div class="item-area">
                      <img src="../../../assets/image/portal-3.jpg" alt class="block-item-bg" />
                      <img src="../../../assets/image/portal-icon11.png" alt class="block-item-icon" />
                      <div class="item-bg-div"></div>
                    </div>
                    <div class="block-item-title">运营体系知识地图</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="knowledge-content-box">
                    <div class="item-area">
                      <img src="../../../assets/image/portal-4.jpg" alt class="block-item-bg" />
                      <img src="../../../assets/image/portal-icon12.png" alt class="block-item-icon" />
                      <div class="item-bg-div"></div>
                    </div>
                    <div class="block-item-title">运营体系知识地图</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-row :gutter="10">
            <!-- 签约新闻 -->
            <el-col :span="12">
              <div class="dynamic">
                <div class="dynamic-header">
                  <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
                  <span>签约新闻</span>
                </div>
                <div class="dynamic-content">
                  <ul>
                    <li>
                      <span>电子商务——恭喜薛海英成功签约上海众旦信息科技有限公司</span>
                      <span>2018-12-14</span>
                    </li>
                    <li>
                      <span>金属行业——恭喜陆敏成功签约中铝中州铝业有限公司</span>
                      <span>2018-12-14</span>
                    </li>
                    <li>
                      <span>制鞋行业——恭喜陈琦成功签约莆田市新协胜鞋业有限公司</span>
                      <span>2018-12-14</span>
                    </li>
                    <li>
                      <span>科研院所——恭喜张勇军成功签约安徽省长江计量所</span>
                      <span>2018-12-14</span>
                    </li>
                    <li>
                      <span>电子商务——恭喜薛海英成功签约上海</span>
                      <span>2018-12-14</span>
                    </li>
                    <li>
                      <span>建材行业——恭喜张益锴成功签约江苏磊达股份有限公司</span>
                      <span>2018-12-14</span>
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
            <!-- 通知公告 -->
            <el-col :span="12">
              <div class="dynamic">
                <div class="dynamic-header">
                  <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
                  <span>通知公告</span>
                </div>
                <div class="dynamic-content">
                  <ul>
                    <li v-for="(notification,index) in listNotification" :key="index">
                      <span v-text="notification.archiveTitle"></span>
                      <span v-text="notification.createDate"></span>
                    </li>
                    <!-- <li>
                      <span>维森集团奖惩管理制度</span>
                      <span>2018-12-14</span>
                    </li>
                    <li>
                      <span>啦啦啦啦</span>
                      <span>2018-12-14</span>
                    </li>
                    <li>
                      <span>2222</span>
                      <span>2018-12-14</span>
                    </li>
                    <li>
                      <span>薛海英成功签约上海</span>
                      <span>2018-12-14</span>
                    </li> -->
                  </ul>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right">
          <div class="maindiv">
            <div class="maindiv-up">
              <img src="../../../assets/image/portal-icon14.png" alt />
              <div style="color:white">行业方案</div>
              <div class="maindiv-up-div"></div>
            </div>
            <div class="maindiv-below">
              <div class="maindiv-below-left">
                <img src="../../../assets/image/portal-icon14.png" alt />
                <div style="color:white">客户案例</div>
                <div class="maindiv-below-left-div"></div>
              </div>
              <div class="maindiv-below-right">
                <img src="../../../assets/image/portal-icon14.png" alt />
                <div style="color:white">产品体系</div>
                <div class="maindiv-below-right-div"></div>
              </div>
            </div>
          </div>
          <!-- 业绩排名 -->
          <div class="ranking">
            <div class="ranking-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>业绩排名</span>
            </div>
            <div class="ranking-content">
              <ul>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">倪云</div>
                    <div class="li-box-beload">集团总经办</div>
                  </div>
                  <div class="li-box3">
                    <div>2018-09-05</div>
                  </div>
                  <div class="li-box4">
                    <div>1040361</div>
                  </div>
                  <div class="li-box5">
                    <div>1</div>
                  </div>
                </li>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">杨梅琳</div>
                    <div class="li-box-beload">集团总经办</div>
                  </div>
                  <div class="li-box3">
                    <div>2018-09-05</div>
                  </div>
                  <div class="li-box4">
                    <div>1387148</div>
                  </div>
                  <div class="li-box5">
                    <div>2</div>
                  </div>
                </li>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">徐平</div>
                    <div class="li-box-beload">行政部</div>
                  </div>
                  <div class="li-box3">
                    <div>2018-09-05</div>
                  </div>
                  <div class="li-box4">
                    <div>1733935</div>
                  </div>
                  <div class="li-box5">
                    <div>3</div>
                  </div>
                </li>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">吴璇</div>
                    <div class="li-box-beload">采购部</div>
                  </div>
                  <div class="li-box3">
                    <div>2018-09-05</div>
                  </div>
                  <div class="li-box4">
                    <div>2080722</div>
                  </div>
                  <div class="li-box5">
                    <div>4</div>
                  </div>
                </li>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">朱雄文 </div>
                    <div class="li-box-beload">经销商</div>
                  </div>
                  <div class="li-box3">2018-09-05</div>
                  <div class="li-box4">1040361</div>
                  <div class="li-box5">5</div>
                </li>
                 <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">倪云</div>
                    <div class="li-box-beload">集团总经办</div>
                  </div>
                  <div class="li-box3">
                    <div>2018-09-05</div>
                  </div>
                  <div class="li-box4">
                    <div>1040361</div>
                  </div>
                  <div class="li-box5">
                    <div>6</div>
                  </div>
                </li>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">杨梅琳</div>
                    <div class="li-box-beload">集团总经办</div>
                  </div>
                  <div class="li-box3">
                    <div>2018-09-05</div>
                  </div>
                  <div class="li-box4">
                    <div>1387148</div>
                  </div>
                  <div class="li-box5">
                    <div>7</div>
                  </div>
                </li>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">徐平</div>
                    <div class="li-box-beload">行政部</div>
                  </div>
                  <div class="li-box3">
                    <div>2018-09-05</div>
                  </div>
                  <div class="li-box4">
                    <div>1733935</div>
                  </div>
                  <div class="li-box5">
                    <div>8</div>
                  </div>
                </li>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">吴璇</div>
                    <div class="li-box-beload">采购部</div>
                  </div>
                  <div class="li-box3">
                    <div>2018-09-05</div>
                  </div>
                  <div class="li-box4">
                    <div>2080722</div>
                  </div>
                  <div class="li-box5">
                    <div>9</div>
                  </div>
                </li>
                <li>
                  <div class="li-box1">
                    <img src="../../../assets/image/portal-5.jpg" alt />
                  </div>
                  <div class="li-box2">
                    <div class="li-box-up">朱雄文 </div>
                    <div class="li-box-beload">经销商</div>
                  </div>
                  <div class="li-box3">2018-09-05</div>
                  <div class="li-box4">1040361</div>
                  <div class="li-box5">10</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listArchive } from "@/api/mdp/arc/archive";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      activeName: "first",
      showHeader: false,
      value: "",
      calendar: new Date(),
      listNews:[],
      listNotification:[],
    };
  },
  methods:{
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
          console.log(this.listNews);
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
    this.getNotification();
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
.marketingContainer {
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
    .knowledge {
      margin-top: 10px;
      background: white;
      .knowledge-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .knowledge-content {
        padding: 10px;
        .knowledge-content-box {
          width: 100%;
          height: 240px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;

          .item-area {
            width: 150px;
            height: 200px;
            position: relative;
            .block-item-bg {
              width: 150px;
              height: 200px;
            }
            .block-item-icon {
              position: absolute;
              width: 45px;
              height: 45px;
              left: 52.5px;
              top: 77.5px;
            }
            .item-bg-div {
              position: absolute;
              background: #ffffff;
              opacity: 0.4;
              height: 100%;
              width: 100%;
              left: 0px;
              top: 0px;
              display: none;
            }
          }
          .item-area:hover .item-bg-div {
            display: block;
          }
          .block-item-title {
            color: #242424;
            font-size: 12px;
            text-align: center;
            height: 20px;
            line-height: 20px;
          }
        }
      }
    }
    .dynamic {
      background: #ffffff;
      margin-top: 10px;
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
        li {
          padding: 0px 10px;
          list-style: none;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          height: 30px;
          line-height: 30px;
        }
        li span {
          font-size: 12px;
        }
        li:hover {
          background: #2db7f5;
        }
        li:hover span {
          color: #fff;
        }
      }
    }
  }
  .right {
    .maindiv {
      background: white;
      padding: 5px;
      .maindiv-up {
        background-color: rgb(48, 163, 255);
        opacity: 1;
        height: 90px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        position: relative;
        border: 1px solid white;
        .maindiv-up-div {
          position: absolute;
          background: #ffffff;
          opacity: 0.4;
          height: 100%;
          width: 100%;
          left: 0px;
          top: 0px;
          display: none;
        }
      }
      .maindiv-up:hover .maindiv-up-div {
        display: block;
      }
      .maindiv-below {
        display: flex;
        justify-content: space-between;
        .maindiv-below-left {
          width: 50%;
          background-color: #68cffb;
          opacity: 1;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          position: relative;
          .maindiv-below-left-div {
            position: absolute;
            background: #ffffff;
            opacity: 0.4;
            height: 100%;
            width: 100%;
            left: 0px;
            top: 0px;
            display: none;
          }
        }
        .maindiv-below-left:hover .maindiv-below-left-div {
          display: block;
        }
        .maindiv-below-right {
          width: 50%;
          background-color: #66bb6a;
          opacity: 1;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          position: relative;
          .maindiv-below-right-div {
            position: absolute;
            background: #ffffff;
            opacity: 0.4;
            height: 100%;
            width: 100%;
            left: 0px;
            top: 0px;
            display: none;
          }
        }
        .maindiv-below-right:hover .maindiv-below-right-div {
          display: block;
        }
      }
    }
    .ranking {
      margin-top: 10px;
      background: white;
      .ranking-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .ranking-content {
        padding: 5px;
        min-height: 520px;
        li {
          height: 45px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #f3f3f3;
          .li-box1 {
            width: 10%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            align-items: center;
            img {
              width: 30px;
              height: 30px;
            }
          }
          .li-box2 {
            width: 20%;
            height: 100%;
            padding-top: 12px;
            display: flex;
            flex-direction: column;
            align-content: center;
            align-items: center;
            justify-content: flex-start;
            .li-box-up {
              height: 50%;
              line-height: 50%;
              font-size: 12px;
              color: #be1b1b;
            }
            .li-box-beload {
              height: 50%;
              line-height: 50%;
              font-size: 12px;
            }
          }
          .li-box3 {
            width: 30%;
            height: 100%;
            padding-bottom: 5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            text-align: center;
          }
          .li-box4 {
            width: 30%;
            height: 100%;
            padding-bottom: 5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            text-align: center;
          }
          .li-box5 {
            width: 10%;
            height: 100%;
            padding-bottom: 5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            text-align: center;
          }
        }
        li:hover {
          background: #f3f3f3;
        }
      }
    }
  }
}
</style>