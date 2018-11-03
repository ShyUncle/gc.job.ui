import request from '@/utils/request'

export function loginByUsername(account, password) {
  const data = {
    account,
    password
  }
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token }
  })
}

