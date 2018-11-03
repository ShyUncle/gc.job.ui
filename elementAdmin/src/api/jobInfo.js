import request from '@/utils/request'
export function fetchJobList(query) {
  return request({
    url: 'api/jobinfo/PageList',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createJob(data) {
  return request({
    url: 'api/jobinfo/add',
    method: 'post',
    data
  })
}
export function deleteJob(id) {
  return request({
    url: 'api/jobinfo/remove',
    method: 'delete',
    params: { id }
  })
}
export function triggerJob(id) {
  return request({
    url: 'api/jobinfo/TriggerJob',
    method: 'get',
    params: { id }
  })
}
export function updateJob(data) {
  return request({
    url: 'api/jobinfo/update',
    method: 'put',
    data
  })
}
// 暂停任务
export function pauseJob(id) {
  return request({
    url: 'api/jobinfo/Pause',
    method: 'put',
    params: { id }
  })
}
// 重启任务
export function resumeJob(id) {
  return request({
    url: 'api/jobinfo/Resume',
    method: 'put',
    params: { id }
  })
}
