<template>
  <section>
    <el-dialog append-to-body title="选择供应商" :visible.sync="visible" width="60%" :before-close="handleCancel">
      <counterparty-components @row-click="rowClick"></counterparty-components>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import {listSupplier, delSupplier, batchDelSupplier} from '@/api/oa/erp/pur/supplier';
import {mapGetters} from 'vuex';
//import Sticky from '@/components/Sticky' // 粘性header组件
import CounterpartyComponents from '@/views/oa/ht/components/CounterpartyComponents.vue'

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: ['purRequire', 'visible'],
  data() {
    return {}
  },//end data
  methods: {

    handleCancel() {
      this.$emit('closePopWin')
    },

    rowClick(data) {
      this.$emit('row-click', data);
    },

  },//end methods
  components: {
    CounterpartyComponents,
  },

  mounted() {
  }
}

</script>

<style scoped>

</style>
