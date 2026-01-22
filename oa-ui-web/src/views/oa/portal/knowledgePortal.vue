<template>
  <div class="knowledgeContainer">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left">
          <div class="left-top">
            <div class="item1">
              <div class="item-box1">
                <img src="../../../assets/image/portal-icon14.png" alt />
                <div style="color:white">新员工学习库</div>
                <div class="item-box1-div"></div>
              </div>
              <div class="item-box2">
                <div class="item-box2-left">
                  <img src="../../../assets/image/portal-icon14.png" alt />
                  <div style="color:white">行业方案库</div>
                  <div class="item-box2-left-div"></div>
                </div>
                <div class="item-box2-right">
                  <img src="../../../assets/image/portal-icon14.png" alt />
                  <div style="color:white">竞争对手库</div>
                  <div class="item-box2-right-div"></div>
                </div>
              </div>
            </div>
            <div class="item2">
              <div class="item-box3">
                <div class="item-box3-left">
                  <img src="../../../assets/image/portal-icon14.png" alt />
                  <div style="color:white">销售工具库</div>
                  <div class="item-box3-left-div"></div>
                </div>
                <div class="item-box3-right">
                  <img src="../../../assets/image/portal-icon14.png" alt />
                  <div style="color:white">产品技术库</div>
                  <div class="item-box3-right-div"></div>
                </div>
              </div>
              <div class="item-box4">
                <img src="../../../assets/image/portal-icon14.png" alt />
                <div style="color:white">客户案例库</div>
                <div class="item-box4-div"></div>
              </div>
            </div>
          </div>
          <!-- 知识推荐 -->
          <div class="recommend">
            <div class="recommend-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>知识推荐</span>
            </div>
            <div class="recommend-content">
              <el-row>
                <el-col :span="6">
                  <div class="swiper-slide">
                    <div class="wea-temp-box">
                      <img src="../../../assets/image/portal-1.jpg" alt class="wea-temp-box-img" />
                      <div style="padding:10px">
                        <h3>匠人精神</h3>
                        <p>淬炼心性，养成自己 以孝育人的成功实践</p>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="swiper-slide">
                    <div class="wea-temp-box">
                      <img src="../../../assets/image/portal-10.jpg" alt class="wea-temp-box-img" />
                      <div style="padding:10px">
                        <h3>穿透财报，发现企业的秘密</h3>
                        <p>本书从超过3000家A股上市公司中精选15家热门、争议大...</p>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="swiper-slide">
                    <div class="wea-temp-box">
                      <img src="../../../assets/image/portal-9.jpg" alt class="wea-temp-box-img" />
                      <div style="padding:10px">
                        <h3>竞争战略</h3>
                        <p>《竞争战略》是由当今全球战略权威、“竞争战略之父”、美国...</p>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="swiper-slide">
                    <div class="wea-temp-box">
                      <img src="../../../assets/image/portal-1.jpg" alt class="wea-temp-box-img" />
                      <div style="padding:10px">
                        <h3>华为公司管理内训书系</h3>
                        <p>企业的长期战略本质上是围绕怎么成为行业领导者、怎么作行业...</p>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 知识体系 -->
          <div class="hierarchy">
            <div class="hierarchy-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>知识体系</span>
            </div>
            <div class="hierarchy-content">
              <div class="wea-temp-box">
                <div class="wea-temp-box-header">
                  <img
                    src="../../../assets/image/portal-icon15.png"
                    alt
                    class="wea-temp-box-header-img"
                  />
                  <h2 class="wea-temp-box-title">产品知识体系</h2>
                </div>
                <div class="wea-temp-box-list">
                  <ul class="wea-temp-box-list-ul">
                    <li class="wea-temp-box-list-li">产品功能介绍</li>
                    <li class="wea-temp-box-list-li">数据字典下载</li>
                    <li class="wea-temp-box-list-li">技术培训资料</li>
                    <li class="wea-temp-box-list-li">产品开发规范</li>
                  </ul>
                </div>
              </div>
              <div class="wea-temp-box">
                <div class="wea-temp-box-header">
                  <img
                    src="../../../assets/image/portal-icon15.png"
                    alt
                    class="wea-temp-box-header-img"
                  />
                  <h2 class="wea-temp-box-title">市场知识体系</h2>
                </div>
                <div class="wea-temp-box-list">
                  <ul class="wea-temp-box-list-ul">
                    <li class="wea-temp-box-list-li">成功客户案例</li>
                    <li class="wea-temp-box-list-li">市场活动分享</li>
                    <li class="wea-temp-box-list-li">印刷资料下载</li>
                    <li class="wea-temp-box-list-li">品牌活动推广</li>
                  </ul>
                </div>
              </div>
              <div class="wea-temp-box">
                <div class="wea-temp-box-header">
                  <img
                    src="../../../assets/image/portal-icon15.png"
                    alt
                    class="wea-temp-box-header-img"
                  />
                  <h2 class="wea-temp-box-title">项目知识体系</h2>
                </div>
                <div class="wea-temp-box-list">
                  <ul class="wea-temp-box-list-ul">
                    <li class="wea-temp-box-list-li">项目实施方法</li>
                    <li class="wea-temp-box-list-li">项目场景分享</li>
                    <li class="wea-temp-box-list-li">项目构件库</li>
                    <li class="wea-temp-box-list-li">项目经验分享</li>
                  </ul>
                </div>
              </div>
              <div class="wea-temp-box noborder">
                <div class="wea-temp-box-header">
                  <img
                    src="../../../assets/image/portal-icon15.png"
                    alt
                    class="wea-temp-box-header-img"
                  />
                  <h2 class="wea-temp-box-title">销售知识体系</h2>
                </div>
                <div class="wea-temp-box-list">
                  <ul class="wea-temp-box-list-ul">
                    <li class="wea-temp-box-list-li">典型客户案例</li>
                    <li class="wea-temp-box-list-li">行业解决方案</li>
                    <li class="wea-temp-box-list-li">竞争对手分析</li>
                    <li class="wea-temp-box-list-li">销售合同模板</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right">
          <!-- 知识阅读排名 -->
          <div class="in-reading">
            <div class="in-reading-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>知识阅读排名</span>
            </div>
            <div class="in-reading-content">
              <div class="in-reading-content-header">阅读热度前15名</div>
              <div class="TopViewPostsBlock">
                <ul>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">1、</span>
                      E9-产品销售合同范本V2.0
                    </div>
                    <div class="numClass">(19)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">2、</span>
                      销售合同范本
                    </div>
                    <div class="numClass">(16)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">3、</span>
                      诺基亚贝尔E9协同办公平台销售合同
                    </div>
                    <div class="numClass">(28)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">4、</span>
                      湖南省国资委E9协同办公平台销售合同
                    </div>
                    <div class="numClass">(50)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">5、</span>
                      上海地产E9销售合同0920-1
                    </div>
                    <div class="numClass">(38)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">7、</span>
                      上海纺织E9协同办公平台销售合同
                    </div>
                    <div class="numClass">(20)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">8、</span>
                      上海莱士血液制品协同办公平台销售合同
                    </div>
                    <div class="numClass">(11)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">9、</span>
                      上海华谊协同办公项目第三方RTX采购合同
                    </div>
                    <div class="numClass">(38)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">10、</span>
                      上海华谊E9销售合同
                    </div>
                    <div class="numClass">(38)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">11、</span>
                      E9-第三方产品采购合同范本V1.0
                    </div>
                    <div class="numClass">(38)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">12、</span>
                      钢银电子商务E9产品销售合同
                    </div>
                    <div class="numClass">(32)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">13、</span>
                      中化集团协同办公平台销售合同
                    </div>
                    <div class="numClass">(18)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">14、</span>
                      上海莱士血液制品协同办公平台销售合同
                    </div>
                    <div class="numClass">(38)</div>
                  </li>
                  <li>
                    <div style="font-size:12px" class="TopViewPostsBlock-div">
                      <span style="font-size:12px">15、</span>
                      上海纺织E9协同办公平台销售合同
                    </div>
                    <div class="numClass">(38)</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 专家介绍 -->
          <div class="specialist">
            <div class="specialist-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>专家介绍</span>
            </div>
            <div class="specialist-content">
              <ul class="specialist-content-ul">
                <li class="specialist-content-li">
                  <div class="specialist-content-li-left">
                    <img
                      src="../../../assets/image/portal-5.jpg"
                      alt
                      class="specialist-content-li-left-img"
                    />
                  </div>
                  <div class="specialist-content-li-right">
                    <div class="specialist-content-li-right-box1">杨梅琳</div>
                    <div class="specialist-content-li-right-box2">男 | 集团总经办</div>
                    <div
                      class="specialist-content-li-right-box3"
                    >专注于协同管理，提供管理、业务、财务一体化解决方案；专注于集团管理，提供集团企业在不同发展阶段的管理方案 专注...</div>
                  </div>
                </li>
                <li class="specialist-content-li">
                  <div class="specialist-content-li-left">
                    <img
                      src="../../../assets/image/portal-5.jpg"
                      alt
                      class="specialist-content-li-left-img"
                    />
                  </div>
                  <div class="specialist-content-li-right">
                    <div class="specialist-content-li-right-box1">徐平</div>
                    <div class="specialist-content-li-right-box2">男 | 行政部</div>
                    <div
                      class="specialist-content-li-right-box3"
                    >专注于协同管理，提供管理、业务、财务一体化解决方案；专注于集团管理，提供集团企业在不同发展阶段的管理方案 专注...</div>
                  </div>
                </li>
                <li class="specialist-content-li">
                  <div class="specialist-content-li-left">
                    <img
                      src="../../../assets/image/portal-5.jpg"
                      alt
                      class="specialist-content-li-left-img"
                    />
                  </div>
                  <div class="specialist-content-li-right">
                    <div class="specialist-content-li-right-box1">吴璇</div>
                    <div class="specialist-content-li-right-box2">男 | 采购部</div>
                    <div
                      class="specialist-content-li-right-box3"
                    >专注于协同管理，提供管理、业务、财务一体化解决方案；专注于集团管理，提供集团企业在不同发展阶段的管理方案 专注...</div>
                  </div>
                </li>
                <li class="specialist-content-li">
                  <div class="specialist-content-li-left">
                    <img
                      src="../../../assets/image/portal-5.jpg"
                      alt
                      class="specialist-content-li-left-img"
                    />
                  </div>
                  <div class="specialist-content-li-right">
                    <div class="specialist-content-li-right-box1">	张腾</div>
                    <div class="specialist-content-li-right-box2">男 | 经销商</div>
                    <div
                      class="specialist-content-li-right-box3"
                    >专注于协同管理，提供管理、业务、财务一体化解决方案；专注于集团管理，提供集团企业在不同发展阶段的管理方案 专注...</div>
                  </div>
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
export default {
  data() {
    return {};
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
.knowledgeContainer {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 15px;
  .left {
    .left-top {
      height: 210px;
      width: 100%;
      background: white;
      padding: 5px;
      .item1 {
        height: 100px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        border-bottom: 1px solid white;
        .item-box1 {
          background-color: rgb(48, 163, 255);
          flex: 1;
          opacity: 1;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          position: relative;
          .item-box1-div {
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
        .item-box1:hover .item-box1-div {
          display: block;
        }
        .item-box2 {
          height: 100px;
          flex: 1;
          display: flex;
          justify-content: space-between;
          .item-box2-left {
            background: #aeb6cf;
            flex: 1;
            opacity: 1;
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-content: center;
            position: relative;
            .item-box2-left-div {
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
          .item-box2-left:hover .item-box2-left-div {
            display: block;
          }
          .item-box2-right {
            background: #0059b2;
            flex: 1;
            opacity: 1;
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-content: center;
            position: relative;
            .item-box2-right-div {
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
          .item-box2-right:hover .item-box2-right-div {
            display: block;
          }
        }
      }
      .item2 {
        height: 100px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        .item-box3 {
          height: 100px;
          flex: 1;
          display: flex;
          justify-content: space-between;
          .item-box3-left {
            background: #68cffb;
            flex: 1;
            opacity: 1;
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-content: center;
            position: relative;
            .item-box3-left-div {
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
          .item-box3-left:hover .item-box3-left-div {
            display: block;
          }
          .item-box3-right {
            background: #535195;
            flex: 1;
            opacity: 1;
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-content: center;
            position: relative;
            .item-box3-right-div {
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
          .item-box3-right:hover .item-box3-right-div {
            display: block;
          }
        }
        .item-box4 {
          background-color: #2bbe8b;
          flex: 1;
          opacity: 1;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          position: relative;
          .item-box4-div {
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
        .item-box4:hover .item-box4-div {
          display: block;
        }
      }
    }
    .recommend {
      margin-top: 10px;
      background: white;
      .recommend-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .recommend-content {
        padding: 5px;
        padding-bottom: 40px;
        .swiper-slide {
          height: 200px;
          display: flex;
          flex-direction: column;
          align-content: center;
          align-items: center;
          .wea-temp-box {
            width: 200px;
            height: 200px;
            box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.14),
              0px 1px 3px 0px rgba(0, 0, 0, 0.12);
            .wea-temp-box-img {
              height: 120px;
              width: 200px;
              border-radius: 2px;
            }
            h3 {
              font-size: 12px;
              color: #242424;
            }
            p {
              color: #9e9e9e;
              height: 20px;
              font-size: 12px;
              line-height: 20px;
            }
          }
        }
      }
    }
    .hierarchy {
      margin-top: 10px;
      background: white;
      height: 350px;
      .hierarchy-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .hierarchy-content {
        display: flex;
        justify-content: center;
        .wea-temp-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 170px;
          margin-top: 10px;
          text-decoration: none;
          border-right: 1px solid rgba(204, 204, 204, 0.383);
          .wea-temp-box-header {
            text-align: center;
            .wea-temp-box-header-img {
              width: 40px;
              height: 40px;
              margin-bottom: 20px;
            }
          }
          .wea-temp-box-list {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 10px;
            .wea-temp-box-list-ul {
              list-style: none;
              padding: 0 30px;
              margin: 0;
            }
            .wea-temp-box-list-li {
              list-style: n;
              height: 36px;
              line-height: 36px;
              text-align: center;
              color: #000000;
              font-size: 12px;
            }
            .wea-temp-box-list-li:hover {
              color: #2db7f5;
            }
          }
        }
        .noborder {
          border: 0px;
        }
      }
    }
  }
  .right {
    .in-reading {
      background: white;
      height: 505px;
      .in-reading-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .in-reading-content {
        padding: 20px;

        .in-reading-content-header {
          color: #008ff8;
          font-size: 18px;
          text-align: center;
          padding: 10px;
          border: 1px solid rgb(243, 243, 243);
        }
        .TopViewPostsBlock {
          ul {
            border: 1px solid rgb(243, 243, 243);
            li {
              height: 25px;
              font-size: 12px;
              color: #777777;
              line-height: 25px;
              padding: 0px 10px;
              display: flex;
              justify-content: space-between;

              .numClass {
                color: #ff0000;
                font-size: 12px;
              }
            }
            li:hover {
              background: #ebebeb;
              cursor: pointer;
            }
            li:hover .TopViewPostsBlock-div {
              background: #ebebeb;
              color: #008ff8 !important;
            }
          }
        }
      }
    }
    .specialist {
      background: white;
      margin-top: 10px;
      height: 350px;

      .specialist-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .specialist-content {
        padding: 20px;
        overflow: auto;
        height: 310px;
        .specialist-content-ul {
          padding: 0px;
          .specialist-content-li {
            height: 100px;
            display: flex;
            justify-content: flex-start;
            border-bottom: 1px solid rgb(243, 243, 243);
            overflow: hidden;
            .specialist-content-li-left {
              width: 70px;
              height: 100px;
              display: flex;
              justify-content: center;
              align-items: center;
              .specialist-content-li-left-img {
                width: 36px;
                height: 36px;
              }
            }
            .specialist-content-li-right {
              height: 100px;
              flex: 1;

              .specialist-content-li-right-box1 {
                color: #242424;
                font-weight: bold;
                font-size: 12px;
                height: 24px;
                line-height: 24px;
              }
              .specialist-content-li-right-box1:hover {
                color: #008ff8;
              }
              .specialist-content-li-right-box2 {
                font-size: 12px;
                height: 24px;
                line-height: 24px;
              }
              .specialist-content-li-right-box3 {
                font-size: 12px;
                line-height: 24px;
              }
            }
          }
        }
      }
      .specialist-content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: #d1d1d1;
        -webkit-transition: background-color 0.3s ease-in-out;
        transition: background-color 0.3s ease-in-out;
      }
      .specialist-content::-webkit-scrollbar-thumb {
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
      .specialist-content::-webkit-scrollbar-track {
        background-color: #fff;
      }
    }
  }
}
</style>
