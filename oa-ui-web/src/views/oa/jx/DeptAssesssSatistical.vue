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
          <div class="right-content" v-loading="load.list">
            <div v-if="jxAssessSchemes.length>0">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="scheme.name" :name="''+index" v-for="(scheme,index) in jxAssessSchemes"
                             :key="index">
                  <el-table :data="assessData" style="width: 100%" v-if="scheme.schemeType=='0'" @row-click="rowClick">
                    <el-table-column prop="assDeptName" label="部门" min-width="140"></el-table-column>
                    <el-table-column label="1月" min-width="60">
                      <el-table-column prop="1TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="1AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="1ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['1ClassType1']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType1"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['1ClassType2']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType2"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['1ClassType3']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType3"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['1ClassType4']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType4"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['1ClassType4']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType4"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="2月" min-width="60">
                      <el-table-column prop="2TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="2AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="2ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['2ClassType1']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType1"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['2ClassType2']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType2"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['2ClassType3']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType3"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['2ClassType4']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType4"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['2ClassType4']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType4"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="3月" min-width="60">
                      <el-table-column prop="3TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="3AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="3IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="3IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="3IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="3ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['3ClassType1']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType1"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="3ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['3ClassType2']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType2"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="3ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['3ClassType3']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType3"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="3ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['3ClassType4']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType4"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="3ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['3ClassType4']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType4"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="4月" min-width="60">
                      <el-table-column prop="4TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="4AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="4IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="4IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="4IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="4ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['4ClassType1']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType1"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="4ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['4ClassType2']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType2"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="4ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['4ClassType3']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType3"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="4ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['4ClassType4']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType4"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="4ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['4ClassType4']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType4"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="5月" min-width="60">
                      <el-table-column prop="5TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="5AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="5IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="5IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="5IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="5ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["5ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['5ClassType1']>0">{{ scope.row["5AssCstatus"] ? parseInt(scope.row["5ClassType1"] / parseInt(scope.row["5TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="5ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["5ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['5ClassType2']>0">{{ scope.row["5AssCstatus"] ? parseInt(scope.row["5ClassType2"] / parseInt(scope.row["5TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="5ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["5ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['5ClassType3']>0">{{ scope.row["5AssCstatus"] ? parseInt(scope.row["5ClassType3"] / parseInt(scope.row["5TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="5ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["5ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['5ClassType4']>0">{{ scope.row["5AssCstatus"] ? parseInt(scope.row["5ClassType4"] / parseInt(scope.row["5TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="5ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["5ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['5ClassType4']>0">{{ scope.row["5AssCstatus"] ? parseInt(scope.row["5ClassType4"] / parseInt(scope.row["5TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="6月" min-width="60">
                      <el-table-column prop="6TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="6AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="6IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="6IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="6IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="6ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["6ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['6ClassType1']>0">{{ scope.row["6AssCstatus"] ? parseInt(scope.row["6ClassType1"] / parseInt(scope.row["6TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="6ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["6ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['6ClassType2']>0">{{ scope.row["6AssCstatus"] ? parseInt(scope.row["6ClassType2"] / parseInt(scope.row["6TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="6ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["6ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['6ClassType3']>0">{{ scope.row["6AssCstatus"] ? parseInt(scope.row["6ClassType3"] / parseInt(scope.row["6TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="6ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["6ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['6ClassType4']>0">{{ scope.row["6AssCstatus"] ? parseInt(scope.row["6ClassType4"] / parseInt(scope.row["6TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="6ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["6ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['6ClassType4']>0">{{ scope.row["6AssCstatus"] ? parseInt(scope.row["6ClassType4"] / parseInt(scope.row["6TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="7月" min-width="60">
                      <el-table-column prop="7TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="7AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="7IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="7IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="7IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="7ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["7ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['7ClassType1']>0">{{ scope.row["7AssCstatus"] ? parseInt(scope.row["7ClassType1"] / parseInt(scope.row["7TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="7ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["7ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['7ClassType2']>0">{{ scope.row["7AssCstatus"] ? parseInt(scope.row["7ClassType2"] / parseInt(scope.row["7TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="7ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["7ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['7ClassType3']>0">{{ scope.row["7AssCstatus"] ? parseInt(scope.row["7ClassType3"] / parseInt(scope.row["7TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="7ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["7ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['7ClassType4']>0">{{ scope.row["7AssCstatus"] ? parseInt(scope.row["7ClassType4"] / parseInt(scope.row["7TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="7ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["7ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['7ClassType4']>0">{{ scope.row["7AssCstatus"] ? parseInt(scope.row["7ClassType4"] / parseInt(scope.row["7TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="8月" min-width="60">
                      <el-table-column prop="8TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="8AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="8IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="8IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="8IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="8ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["8ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['8ClassType1']>0">{{ scope.row["8AssCstatus"] ? parseInt(scope.row["8ClassType1"] / parseInt(scope.row["8TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="8ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["8ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['8ClassType2']>0">{{ scope.row["8AssCstatus"] ? parseInt(scope.row["8ClassType2"] / parseInt(scope.row["8TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="8ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["8ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['8ClassType3']>0">{{ scope.row["8AssCstatus"] ? parseInt(scope.row["8ClassType3"] / parseInt(scope.row["8TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="8ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["8ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['8ClassType4']>0">{{ scope.row["8AssCstatus"] ? parseInt(scope.row["8ClassType4"] / parseInt(scope.row["8TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="8ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["8ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['8ClassType4']>0">{{ scope.row["8AssCstatus"] ? parseInt(scope.row["8ClassType4"] / parseInt(scope.row["8TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="9月" min-width="60">
                      <el-table-column prop="9TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="9AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="9IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="9IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="9IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="9ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["9ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['9ClassType1']>0">{{ scope.row["9AssCstatus"] ? parseInt(scope.row["9ClassType1"] / parseInt(scope.row["9TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="9ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["9ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['9ClassType2']>0">{{ scope.row["9AssCstatus"] ? parseInt(scope.row["9ClassType2"] / parseInt(scope.row["9TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="9ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["9ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['9ClassType3']>0">{{ scope.row["9AssCstatus"] ? parseInt(scope.row["9ClassType3"] / parseInt(scope.row["9TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="9ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["9ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['9ClassType4']>0">{{ scope.row["9AssCstatus"] ? parseInt(scope.row["9ClassType4"] / parseInt(scope.row["9TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="9ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["9ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['9ClassType4']>0">{{ scope.row["9AssCstatus"] ? parseInt(scope.row["9ClassType4"] / parseInt(scope.row["9TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="10月" min-width="60">
                      <el-table-column prop="10TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="10AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="10IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="10IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="10IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="10ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["10ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['10ClassType1']>0">{{ scope.row["10AssCstatus"] ? parseInt(scope.row["10ClassType1"] / parseInt(scope.row["10TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="10ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["10ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['10ClassType2']>0">{{ scope.row["10AssCstatus"] ? parseInt(scope.row["10ClassType2"] / parseInt(scope.row["10TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="10ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["10ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['10ClassType3']>0">{{ scope.row["10AssCstatus"] ? parseInt(scope.row["10ClassType3"] / parseInt(scope.row["10TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="10ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["10ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['10ClassType4']>0">{{ scope.row["10AssCstatus"] ? parseInt(scope.row["10ClassType4"] / parseInt(scope.row["10TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="10ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["10ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['10ClassType4']>0">{{ scope.row["10AssCstatus"] ? parseInt(scope.row["10ClassType4"] / parseInt(scope.row["10TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="11月" min-width="60">
                      <el-table-column prop="11TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="11AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="11IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="11IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="11IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="11ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['11ClassType1']>0">{{ scope.row["11AssCstatus"] ? parseInt(scope.row["11ClassType1"] / parseInt(scope.row["11TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="11ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["11ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['11ClassType2']>0">{{ scope.row["11AssCstatus"] ? parseInt(scope.row["11ClassType2"] / parseInt(scope.row["11TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="11ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["11ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['11ClassType3']>0">{{ scope.row["11AssCstatus"] ? parseInt(scope.row["11ClassType3"] / parseInt(scope.row["11TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="11ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["11ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['11ClassType4']>0">{{ scope.row["11AssCstatus"] ? parseInt(scope.row["11ClassType4"] / parseInt(scope.row["11TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="11ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["11ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['11ClassType4']>0">{{ scope.row["11AssCstatus"] ? parseInt(scope.row["11ClassType4"] / parseInt(scope.row["11TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="12月" min-width="60">
                      <el-table-column prop="12TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="12AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="12IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="12IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="12IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="12ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["12ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['12ClassType1']>0">{{ scope.row["12AssCstatus"] ? parseInt(scope.row["12ClassType1"] / parseInt(scope.row["12TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="12ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["12ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['12ClassType2']>0">{{ scope.row["12AssCstatus"] ? parseInt(scope.row["12ClassType2"] / parseInt(scope.row["12TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="12ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["12ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['12ClassType3']>0">{{ scope.row["12AssCstatus"] ? parseInt(scope.row["12ClassType3"] / parseInt(scope.row["12TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="12ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["12ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['12ClassType4']>0">{{ scope.row["12AssCstatus"] ? parseInt(scope.row["12ClassType4"] / parseInt(scope.row["12TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="12ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["12ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['12ClassType4']>0">{{ scope.row["12AssCstatus"] ? parseInt(scope.row["12ClassType4"] / parseInt(scope.row["12TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                  <el-table :data="assessData" style="width: 100%" v-else-if="scheme.schemeType=='1'">
                    <el-table-column prop="assDeptName" label="部门" min-width="140"></el-table-column>
                    <el-table-column label="1季度" min-width="60">
                      <el-table-column prop="1TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="1AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="1ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['1ClassType1']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType1"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['1ClassType2']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType2"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['1ClassType3']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType3"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['1ClassType4']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType4"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['1ClassType4']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType4"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="2季度" min-width="60">
                      <el-table-column prop="2TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="2AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级">
                        <el-table-column prop="2ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['2ClassType1']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType1"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['2ClassType2']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType2"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['2ClassType3']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType3"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['2ClassType4']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType4"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['2ClassType4']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType4"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="3季度" min-width="60">
                      <el-table-column prop="3TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="3AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="3IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="3IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="3IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级">
                        <el-table-column prop="3ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['3ClassType1']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType1"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="3ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['3ClassType2']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType2"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="3ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['3ClassType3']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType3"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="3ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['3ClassType4']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType4"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="3ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["3ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['3ClassType4']>0">{{ scope.row["3AssCstatus"] ? parseInt(scope.row["3ClassType4"] / parseInt(scope.row["3TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="4季度" min-width="60">
                      <el-table-column prop="4TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="4AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="4IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="4IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="4IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级">
                        <el-table-column prop="4ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['4ClassType1']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType1"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="4ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['4ClassType2']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType2"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="4ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['4ClassType3']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType3"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="4ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['4ClassType4']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType4"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="4ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["4ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['4ClassType4']>0">{{ scope.row["4AssCstatus"] ? parseInt(scope.row["4ClassType4"] / parseInt(scope.row["4TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>
                  </el-table>

                  <el-table :data="assessData" style="width: 100%" v-else-if="scheme.schemeType=='2'">
                    <el-table-column prop="assDeptName" label="部门" min-width="140"></el-table-column>

                    <el-table-column label="上半年度" min-width="60">
                      <el-table-column prop="1TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="1AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="1ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['1ClassType1']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType1"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['1ClassType2']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType2"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['1ClassType3']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType3"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['1ClassType4']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType4"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['1ClassType4']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType4"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="下半年度" min-width="60">
                      <el-table-column prop="2TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="2AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="2IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级">
                        <el-table-column prop="2ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['2ClassType1']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType1"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['2ClassType2']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType2"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['2ClassType3']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType3"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['2ClassType4']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType4"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="2ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["2ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['2ClassType4']>0">{{ scope.row["2AssCstatus"] ? parseInt(scope.row["2ClassType4"] / parseInt(scope.row["2TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>
                  </el-table>

                  <el-table :data="assessData" style="width: 100%" v-else-if="scheme.schemeType=='3'">
                    <el-table-column prop="assDeptName" label="部门" min-width="160"></el-table-column>
                    <el-table-column label="全年" min-width="60">
                      <el-table-column prop="1TotalNum" label="总人数" min-width="60"></el-table-column>
                      <el-table-column prop="1AssCstatus" label="已签约" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsSelf" label="已自评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsReEval" label="已复评" min-width="60">

                      </el-table-column>
                      <el-table-column prop="1IsVouch" label="待奖励" min-width="60">

                      </el-table-column>
                      <el-table-column label="绩效等级" min-width="60">
                        <el-table-column prop="1ClassType1" label="优秀" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType1"] }}
                            <br>
                            <font color="green"
                                  v-if="scope.row['1ClassType1']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType1"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="green" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType2" label="良好" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType2"] }}
                            <br>
                            <font color="blue"
                                  v-if="scope.row['1ClassType2']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType2"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="blue" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType3" label="中等" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType3"] }}
                            <br>
                            <font color="gray"
                                  v-if="scope.row['1ClassType3']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType3"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="gray" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType4" label="及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType4"] }}
                            <br>
                            <font color="black"
                                  v-if="scope.row['1ClassType4']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType4"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="black" v-else>0%</font>
                          </template>
                        </el-table-column>
                        <el-table-column prop="1ClassType5" label="不及格" min-width="60">
                          <template slot-scope="scope">
                            {{ scope.row["1ClassType4"] }}
                            <br>
                            <font color="red"
                                  v-if="scope.row['1ClassType4']>0">{{ scope.row["1AssCstatus"] ? parseInt(scope.row["1ClassType4"] / parseInt(scope.row["1TotalNum"]) * 100) : '-' }}%</font>
                            <font color="red" v-else>0%</font>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>
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

    <el-drawer title="编辑考核总分表" :visible.sync="jxAssessGradeMngVisible" size="100%" append-to-body
               :close-on-click-modal="false">
      <jx-assess-grade-mng :jx-assess-scheme="jxAssessScheme" :year="filters.year+''"
                           :ass-deptid="deptJxGrade?deptJxGrade.assDeptid:''" :visible="jxAssessGradeMngVisible"
                           @cancel="jxAssessGradeMngVisible=false" @submit="afterEditSubmit"></jx-assess-grade-mng>
    </el-drawer>
  </section>
</template>
<script>
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import {listDeptAssessStatistics} from "@/api/oa/jx/jxAssessGrade";
import {listJxAssessScheme} from '@/api/oa/jx/jxAssessScheme';

import JxAssessGradeMng from '@/views/oa/jx/jxAssessGrade/JxAssessGradeMng';//新增修改界面
import {mapGetters} from "vuex";

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
        schemeId: "", //所属考核方案
        assDeptid: ""
      },
      load: {list: false, edit: false, del: false, add: false, derive: false}, //查询中...,
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
      jxAssessSchemes: [],
      jxAssessScheme: null,
      jxAssessGradeMngVisible: false,
      deptJxGrade: null,

    };
  },
  watch: {
    "filters.year": {
      handler: function (a, b) {
        this.listJxAssessScheme();
      }
    },
    "filters.key"(val) {
      this.getDeptAssessGrade();
    },
    activeName(val) {
      this.jxAssessScheme = this.jxAssessSchemes[val]
      this.getDeptAssessGrade();
    }
  },
  methods: {
    handleClick() {
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.count = true;
      this.getDeptAssessGrade();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getDeptAssessGrade();
    },
    handleLeftDeptNodeClick(data, checked, comp) {
      this.filters.assDeptid = "";
      if (checked == true) {
        this.filters.assDeptid = data.deptid;
      }
      this.getDeptAssessGrade();
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
    getDeptAssessGrade() {
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
      if (this.filters.assDeptid) {
        params.assDeptid = this.filters.assDeptid
      }
      if (this.jxAssessScheme) {
        params.schemeId = this.jxAssessScheme.id
        params.schemeType = this.jxAssessScheme.schemeType
      } else {
        return;
      }
      this.load.list = true;
      listDeptAssessStatistics(params)
          .then(res => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.assessData = res.data.data;
            } else {
              this.$message({message: tips.msg, type: "error"});
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
              this.$message({message: "导出数据失败", type: "error"});
            }
          })
          .catch(() => {
            this.load.derive = false;
            this.$message({message: "导出数据失败", type: "error"});
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
    listJxAssessScheme() {
      var params = {
        year: this.filters.year,
      }

      params.orderBy = 'scheme_type asc'
      this.load.list = true;
      listJxAssessScheme(params).then(res => {
        this.load.list = false;
        var tips = res.data.tips;
        console.info(res);
        if (tips.isOk) {
          this.jxAssessSchemes = res.data.data
          if (this.jxAssessSchemes && this.jxAssessSchemes.length > 0) {
            this.jxAssessScheme = this.jxAssessSchemes[0]
            this.getDeptAssessGrade();
          }
        } else {
          this.$message({message: tips.isOk, type: "error"});
        }
      })
    },

    rowClick: function (row, event, column) {
      this.deptJxGrade = row
      this.jxAssessGradeMngVisible = true;
    },
    afterEditSubmit() {
      this.getDeptAssessGrade();
    }
  },
  mounted() {
    this.yearData();
    this.listJxAssessScheme();
    //this.getDeptAssessGrade();
  },
  components: {
    "dept-tree": DeptTree,
    JxAssessGradeMng,
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
