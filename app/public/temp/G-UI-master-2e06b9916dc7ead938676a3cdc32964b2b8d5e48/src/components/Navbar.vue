<template>
  <div class="navbar">
    <div class="navbar-brand">
      <img draggable="false" src="@/assets/images/logo.png" />
    </div>
    <div class="navbar-link">
      <span class="iconfont icon-git"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 70px;
  padding: 10px 20px;
  background: transparent;

  .navbar-brand {
    float: left;
    width: auto;
    height: 100%;
    padding: 10px;

    img {
      width: auto;
      height: 100%;
    }
  }

  .navbar-link {
    float: right;
    width: auto;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;

    .iconfont {
      width: auto;
      height: 100%;
      display: inline-block;
      margin: 0 0 0 10px;
      font-size: 24px;
    }
  }
}
</style>