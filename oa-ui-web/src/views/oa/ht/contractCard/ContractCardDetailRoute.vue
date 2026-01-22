<template>
  <section>
    <contract-card-detail v-if="detailFormVisible" :contract-card="detailForm" :visible="detailFormVisible"
                          @cancel="detailFormVisible=false" @submit="afterDetailSubmit"></contract-card-detail>
  </section>
</template>

<script>
import {mapGetters} from 'vuex';
import util from '@/common/js/util';//全局公共库
import {listContractCard} from '@/api/oa/ht/contractCard';

import ContractCardDetail from './ContractCardDetail'; //合同卡片明细
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    $route() {
      this.initData();
    },
  },
  data() {
    return {
      contractCard: null,
      detailFormVisible: false,
    }//end return
  },//end data
  methods: {
    initData() {
      var htId = this.$route.query.htId
      if (htId) {
        listContractCard({htId: htId}).then(res => {
          var tips = res.data.tips;
          if (tips.isOk && res.data.data.length > 0) {
            this.contractCard = res.data.data[0]
            this.detailFormVisible = true;
          } else if (tips.isOk) {
            this.contractCard = null;
            this.detailFormVisible = false;
          } else {
            this.detailFormVisible = false;
            this.$notify({showClose: true, message: tips.msg, type: 'error'})
          }
        })
      }
    },
    afterDetailSubmit(row) {
      this.$emit("submit", row);
    }

  },//end method
  components: {},
  mounted() {
    this.initData();
  }
}

</script>

<style scoped>

.app-container {
  margin: 0;
  padding: 0 40px;
}


</style>
