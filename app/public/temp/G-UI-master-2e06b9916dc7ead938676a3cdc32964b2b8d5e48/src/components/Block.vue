<template>
  <div class="block">
    <div class="block-title">
      {{ title }}
      <span>{{ subtitle }}</span>
    </div>
    <div class="block-container">
      <slot text="模块内容"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Block',
  props: {
    title: {
      type: String,
      default: '模块标题'
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  width: 100%;
  height: auto;
  margin: 40px 0;

  .block-title {
    width: 100%;
    height: auto;
    margin: 10px 0;
    text-align: left;
    color: #333333;
    font-size: 1.6em;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    span {
      margin-left: 10px;
      color: #ff3b3b;
      font-size: 0.5em;
      font-weight: light;
      text-shadow: none;
    }
  }

  .block-container {
    width: 100%;
    height: auto;
    padding-left: 50px;
  }
}
</style>