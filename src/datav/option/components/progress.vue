<!-- 进度条配置 -->
<template>
  <div>
    <el-form-item label="类型">
      <avue-radio v-model="main.activeOption.type"
                  :dic="dicOption.line">
      </avue-radio>
    </el-form-item>
    <el-form-item label="宽度">
      <avue-input-number v-model="main.activeOption.strokeWidth"
                         :max="50"></avue-input-number>
    </el-form-item>
    <el-form-item label="颜色">
      <avue-input-color v-model="main.activeOption.borderColor"></avue-input-color>
    </el-form-item>
    <el-form-item label="背景颜色">
      <avue-input-color v-model="main.activeOption.defineBackColor"></avue-input-color>
    </el-form-item>
    <el-form-item label="字体大小">
      <avue-input-number v-model="main.activeOption.fontSize"
                         :max="200"></avue-input-number>
    </el-form-item>
    <el-form-item label="字体颜色">
      <avue-input-color v-model="main.activeOption.color"></avue-input-color>
    </el-form-item>
    <el-form-item label="文字粗细">
      <avue-select v-model="main.activeOption.FontWeight"
                   :dic="dicOption.fontWeight">
      </avue-select>
    </el-form-item>
    <el-form-item label="前缀字体大小">
      <avue-input-number v-model="main.activeOption.suffixFontSize"
                         :max="200"></avue-input-number>
    </el-form-item>
    <el-form-item label="前缀字体颜色">
      <avue-input-color v-model="main.activeOption.suffixColor"></avue-input-color>
    </el-form-item>
    <el-form-item label="前缀文字粗细">
      <avue-select v-model="main.activeOption.suffixFontWeight"
                   :dic="dicOption.fontWeight">
      </avue-select>
    </el-form-item>
  </div>
</template>

<script>
import { dicOption } from '@/datav/option/config'
export default {
  name: 'progress',
  data () {
    return {
      dicOption: dicOption
    }
  },
  inject: ["main"]
}
</script>

<style>
</style>