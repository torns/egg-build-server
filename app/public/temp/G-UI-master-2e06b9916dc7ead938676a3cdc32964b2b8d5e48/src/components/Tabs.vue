<template>
  <div class="tabs">
    <div class="demo-item el-tabs el-tabs--top">
      <div class="el-tabs__header is-top">
        <div class="el-tabs__nav-wrap is-top">
          <div class="el-tabs__nav-scroll">
            <div
              role="tablist"
              class="el-tabs__nav is-top"
              style="transform: translateX(0px);"
            >
              <div
                class="el-tabs__active-bar is-top"
                style="width: 30px; transform: translateX(0px);"
              ></div>
              <div
                id="tab-first"
                aria-controls="pane-first"
                role="tab"
                tabindex="0"
                class="el-tabs__item is-top is-active"
                aria-selected="true"
              >
                User
              </div>
              <div
                id="tab-second"
                aria-controls="pane-second"
                role="tab"
                tabindex="-1"
                class="el-tabs__item is-top"
              >
                Config
              </div>
              <div
                id="tab-third"
                aria-controls="pane-third"
                role="tab"
                tabindex="-1"
                class="el-tabs__item is-top"
              >
                Role
              </div>
              <div
                id="tab-fourth"
                aria-controls="pane-fourth"
                role="tab"
                tabindex="-1"
                class="el-tabs__item is-top"
              >
                Task
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="el-tabs__content">
        <div
          role="tabpanel"
          id="pane-first"
          aria-labelledby="tab-first"
          class="el-tab-pane"
          style=""
        >
          User
        </div>
        <div
          role="tabpanel"
          id="pane-second"
          aria-labelledby="tab-second"
          class="el-tab-pane"
          style="display: none;"
          aria-hidden="true"
        >
          Config
        </div>
        <div
          role="tabpanel"
          id="pane-third"
          aria-labelledby="tab-third"
          class="el-tab-pane"
          style="display: none;"
          aria-hidden="true"
        >
          Role
        </div>
        <div
          role="tabpanel"
          id="pane-fourth"
          aria-labelledby="tab-fourth"
          class="el-tab-pane"
          style="display: none;"
          aria-hidden="true"
        >
          Task
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs'
}
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  height: auto;
}
</style>
