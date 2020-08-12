<template>
  <div class="popover">
    <div
      role="tooltip"
      x-placement="top"
      id="el-popover-2936"
      aria-hidden="true"
      tabindex="0"
      class="el-popover el-popper el-popover--plain"
      style="width: 200px; position: relative;"
    >
      <div class="el-popover__title">Title</div>
      this is content, this is content, this is content
      <div x-arrow="" class="popper__arrow"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popover'
}
</script>

<style lang="scss" scoped>
.popover {
  width: 100%;
  height: auto;
}
</style>
