import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

export const listAttendanceMonth = params => {
  return axios.get(`${base}/kq/attendance/checkWorkAttendance`,
    { params: params })
}
export const listGroupByPage = params => {
  return axios.get(`${base}/kq/group/getGroupByPage`,
    { params: params })
}
export const insertAttendance = params => {
  return axios.get(`${base}/kq/attendance/insertAttendance`,
    { params: params })
}

export const getUserVeryDaySchedule = params => {
  return axios.get(`${base}/kq/attendance/getUserVeryDaySchedule`,
    { params: params })
}

