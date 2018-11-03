import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/api/jobexecutor/index',
    method: 'get',
    params: query
  })
}
export function fetchOptions() {
  return request({
    url: '/api/jobexecutor/options',
    method: 'get'
  })
}
export function fetchHandlerOptions(executorId) {
  return request({
    url: '/api/jobexecutor/handleroptions',
    method: 'get',
    params: {
      executorId
    }
  })
}
export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: {
      pv
    }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
