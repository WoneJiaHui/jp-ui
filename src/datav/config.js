
export default {
  COMPNAME: 'avue-echart-',
  NAME: 'list',
  DEAFNAME: 'item'
}
export const website = window.$website
export const url = website.url
export const tip = `
//data为返回的数据
/**
 * 说明：只有样式编辑、数据处理、组件事件、请求头、请求参数方法需要返回函数
 * 静态数据或者配置数据直接返回JSON对象即可
 * 不写的话采用默认加载
*/
#样式编辑、数据处理、组件事件、请求头、请求参数
(data)=>{
  //处理数据逻辑
  return {
    //返回图表的标准数据结构体
  }
}

#事件处理
({name,type,value,data})=>{
  //直接写执行的逻辑即可
  alert(data,name)
}

#提示处理
(name,data) => {
  return 返回需要展示的文本
}

#文本框/图片框/Iframe框等通用数据格式
{
  value:'xxxxx'
}

#柱状图数据格式
{
  "categories": [
    "苹果",
  ],
  "series": [{
    "name": "手机品牌",
    "data": [
      1000879,
    ]
  }]
}

#折线图数据格式
{
  "categories": [
    "苹果",
  ],
  "series": [{
    "name": "手机品牌",
    "data": [
      1000879,
    ]
  }]
}

#饼图数据格式
[{
    "name": "PC",
    "value": 97,
    "url": "http://www.baidu.com"
},{
    "name": "PC",
    "value": 97,
    "url": "http://www.baidu.com"
}]

#象型图数据格式
{
  "categories": [
    "苹果",
  ],
    "series": [{
      "name": "手机品牌",
      "data": [
        1000879,
      ]
    }]
}
#雷达图数据格式
{
  indicator: [{
    name: '销售',
    max: 6500
  }],
  series: [{
    data: [{
      value: [4300, 10000, 28000, 35000, 50000, 19000],
      name: '预算分配（Allocated Budget）'
    }]
  }]
}
#散点图数据格式
[{
  data: [
    [1, 8.04],
    [2, 6.95]
  ]
},
{
  data: [
    [1, 4.04],
    [2, 3.95]
  ]
}]
#漏斗图数据格式
[{
  value: 335,
  name: '直接访问'
},
{
  value: 310,
  name: '邮件营销'
},
{
  value: 234,
  name: '联盟广告'
}]

#轮播图数据格式
[{
  value: '图片地址'
},
{
  value: '图片地址2'
}]

#地图数据格式
[{
  "name": "测试坐标1",
  "value": 1,
  "lng": 118.30078125,
  "lat": 36.91915611148194,
  "zoom": 1
},
{
  "name": "测试坐标2",
  "value": 1,
  "lng": 112.21435546875,
  "lat": 37.965854128749434,
  "zoom": 1
}]
 `
