import request from '@/utils/httpRequest'

export default {
  save: function (inputForm) {
    return request({
      url: '/test/activiti/testActivitiAudit/save',
      method: 'post',
      data: inputForm
    })
  },

  delete: function (ids) {
    return request({
      url: '/test/activiti/testActivitiAudit/delete',
      method: 'delete',
      params: {ids: ids}
    })
  },

  queryById: function (id) {
    return request({
      url: '/test/activiti/testActivitiAudit/queryById',
      method: 'get',
      params: {id: id}
    })
  },

  list: function (params) {
    return request({
      url: '/test/activiti/testActivitiAudit/list',
      method: 'get',
      params: params
    })
  },

  exportTemplate: function () {
    return request({
      url: '/test/activiti/testActivitiAudit/import/template',
      method: 'get',
      responseType: 'blob'
    })
  },

  exportExcel: function (params) {
    return request({
      url: '/test/activiti/testActivitiAudit/export',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },

  importExcel: function (data) {
    return request({
      url: '/test/activiti/testActivitiAudit/import',
      method: 'post',
      data: data
    })
  }
}
