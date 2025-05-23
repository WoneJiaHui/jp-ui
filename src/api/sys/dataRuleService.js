import request from '@/utils/httpRequest'

export default {
  save: function (inputForm) {
    return request({
      url: '/sys/dataRule/save',
      method: 'post',
      data: inputForm
    })
  },

  delete: function (id) {
    return request({
      url: '/sys/dataRule/delete',
      method: 'delete',
      params: { id: id }
    })
  },

  queryById: function (id) {
    return request({
      url: '/sys/dataRule/queryById',
      method: 'get',
      params: { id: id }
    })
  },

  list: function (params) {
    return request({
      url: '/sys/dataRule/list',
      method: 'get',
      params: params
    })
  },
  treeData: function () {
    return request({
      url: '/sys/dataRule/treeData',
      method: 'get'
    })
  }
}
