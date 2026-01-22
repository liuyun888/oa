<template>
  <section>
    <attendance_mng></attendance_mng>
  </section>
</template>

<script>
  import AttendanceMng from './AttendanceMng'

  export default {
    name: 'AttendanceMonth',
    data() {
      return {
        filters: {
          key: ''
        }
      }
    },
    methods: {
    },
    components: {
      attendance_mng: AttendanceMng
    },
    mounted() {

    }
  }

</script>

<style scoped>

</style>
