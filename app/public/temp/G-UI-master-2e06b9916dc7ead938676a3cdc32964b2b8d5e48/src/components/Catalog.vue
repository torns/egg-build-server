<template>
  <div class="catalog">
    <div class="catalog-box">
      <router-link
        :class="[{ 'active': item.active }]"
        :to="item.path"
        v-for="(item, index) in data"
        :key="index"
        >{{ item.name }}
      </router-link>
    </div>
    <div class="catalog-subbox">
      <a
        :class="[{ 'active': item.active, 'subbox-item': true }]"
        v-for="(item, index) in data"
        :key="index"
        >{{ item.name }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Catalog',
  data() {
    return {
      data: [
        {
          name: '导航一',
          path: '/',
          active: true
        },
        {
          name: '导航二',
          path: '/about',
          active: false
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.catalog {
  width: 100%;
  height: auto;
  margin: 30px 0 0 0;
  box-shadow: 0 2px 12px 0 $theme-color-shadow !important;

  .catalog-box {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    font-size: 0.875em;
    background: #fff;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;

    a {
      margin-left: 10px;
      color: #333;
      padding: 4px 10px;
    }

    a.active {
      color: $theme-color-white;
      background: rgba(29, 180, 172, 1);
      border-radius: 3px;
    }
  }

  .catalog-subbox {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20px;
    background: $bg-color;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;

    .subbox-item {
      margin: 0 15px;
      color: #999999;
      font-size: 0.75em;
    }

    a.active {
      color: $theme-color;
    }
  }
}
</style>
