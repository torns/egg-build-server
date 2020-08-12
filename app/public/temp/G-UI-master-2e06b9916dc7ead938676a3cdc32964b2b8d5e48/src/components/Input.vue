<template>
  <div class="input">
    <el-input
      v-model="inputContent"
      :type="type"
      placeholder="输入框示例"
      :size="size"
      :readonly="readonly"
    ></el-input>
    <span class="input-info">{{ info }}</span>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'mini'
    },
    info: {
      type: String,
      default: '杭州广电云网络科技有限公司'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputContent: this.readonly ? '这是只读输入框' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 15px 20px 15px 0;
  font-size: 14px;

  .el-input {
    width: 200px;
    height: auto;
  }

  .input-info {
    flex-grow: 1;
    padding: 0 0 0 60px;
    color: #333333;
    font-size: 1em;
    font-weight: normal;
    text-align: left;
  }
}
</style>
