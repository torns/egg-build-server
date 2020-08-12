<template>
  <div class="color" :style="{'background': value}">
    <span class="color-title" :style="{'color': font}">{{ title }}</span>
    <span class="color-value" :style="{'color': font}">{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'Color',
  props: {
    title: {
      type: String,
      default: '颜色'
    },
    value: {
      type: String,
      default: '#ffffff'
    },
    font: {
      type: String,
      default: '#ffffff'
    }
  }
}
</script>

<style lang="scss" scoped>
.color {
  width: 150px;
  height: 75px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 15px 20px 15px 0;
  padding: 15px 0 15px 20px;
  font-size: 14px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .color-title {
    font-size: 1.2em;
    font-weight: bold;
  }

  .color-value {
    font-size: 1em;
    font-weight: normal;
    opacity: 0.87;
  }
}
</style>