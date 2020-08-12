<template>
  <div class="buttongroup">
    <el-button :type="type" :size="size" :plain="plain">{{ label }}</el-button>
    <el-button :type="type" :size="size" :plain="plain">按钮</el-button>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',
  props: {
    label: {
      type: String,
      default: '按钮'
    },
    type: {
      type: String,
      default: 'primary'
    },
    plain: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'mini'
    }
  }
}
</script>

<style lang="scss" scoped>
.buttongroup {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 10px 0;

  button {
    margin: 5px 0;
  }
}
</style>