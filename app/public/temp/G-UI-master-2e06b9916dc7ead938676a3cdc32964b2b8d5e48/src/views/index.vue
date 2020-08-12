<template>
  <div class="index">
    <header class="index-header">
      <img
        draggable="false"
        class="index-header-bg"
        src="@/assets/images/bg.png"
      />
      <img
        draggable="false"
        class="index-header-monitor"
        src="@/assets/images/monitor.png"
      />
      <div class="index-header-title">
        <h2>广电云 WEB 端 UI 规范</h2>
        <h5>基于 Element 开源组件库二次规范</h5>
      </div>
      <Navbar></Navbar>
    </header>
    <content class="index-content">
      <Block title="前言">
        <template>
          <ul class="index-content-tipslist">
            <li>
              <span>01.</span>本规范适用于云平台 WEB
              端软件系统开发大部分页面，需要特殊处理的不包含其中
            </li>
            <li><span>02.</span>本规范基于 1920*1080 的设计稿进行归纳总结</li>
            <li>
              <span>03.</span
              >本规范的字体为设计稿内使用字体，开发时可替换成相应浏览器默认字体
            </li>
          </ul>
        </template>
      </Block>
      <Block title="配色规范">
        <template>
          <ul class="index-content-colorlist">
            <li>
              <Color title="前景色" value="#FFFFFF" font="#333333"></Color>
            </li>
            <li>
              <Color title="背景色" value="#F6F7F9" font="#333333"></Color>
            </li>
          </ul>
          <ul class="index-content-colorlist">
            <li>
              <Color title="主色调（成功）" value="#2EC2B8"></Color>
            </li>
            <li>
              <Color title="主色调（警示）" value="#FF3B3B"></Color>
            </li>
            <li>
              <Color title="主色调（提醒）" value="#FEA634"></Color>
            </li>
          </ul>
          <ul class="index-content-colorlist">
            <li>
              <Color title="主要文字" value="#333333"></Color>
            </li>
            <li>
              <Color title="常规文字" value="#666666"></Color>
            </li>
            <li>
              <Color title="次要文字" value="#999999"></Color>
            </li>
            <li>
              <Color title="失效文字" value="#CCCCCC"></Color>
            </li>
          </ul>
        </template>
      </Block>
      <Block
        title="字体使用规范"
        subtitle="开发字体：Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, 微软雅黑, Arial, sans-serif"
      >
        <template>
          <ul class="index-content-textlist">
            <li v-for="(item, index) in textData" :key="index">
              <span
                class="title"
                :style="{
                  color: item.color,
                  'font-size': item.size,
                  'font-weight': item.weight
                }"
                >{{ item.title }}</span
              >
              <span
                class="example"
                :style="{
                  color: item.color,
                  'font-size': item.size,
                  'font-weight': item.weight
                }"
                >{{ item.example }}</span
              >
              <span
                class="size"
                :style="{
                  color: item.color,
                  'font-size': item.size,
                  'font-weight': item.weight
                }"
                >{{ item.size }}</span
              >
            </li>
          </ul>
        </template>
      </Block>
      <Block title="按钮">
        <ul class="index-content-btnlist">
          <li v-for="(item, index) in btnData" :key="index">
            <span>{{ item.groupTitle }}</span>
            <ButtonGroup
              v-for="(element, index) in item.units"
              :key="index"
              :label="element.label"
              :type="element.type"
              :plain="element.plain"
              :size="element.size"
            ></ButtonGroup>
          </li>
        </ul>
      </Block>
      <Block title="输入框">
        <ul class="index-content-inputlist">
          <li v-for="(item, index) in inputData" :key="index">
            <Input
              :info="item.info"
              :type="item.type"
              :size="item.size"
              :readonly="item.readonly"
            />
          </li>
        </ul>
      </Block>
      <Block title="下拉选框" subtitle="即将上线"></Block>
      <Block title="常规选择框" subtitle="即将上线"></Block>
      <Block title="表单控件">
        <Tabs></Tabs>
        <Catalog></Catalog>
      </Block>
      <Block title="弹窗组件">
        <Dialog></Dialog>
      </Block>
      <Block title="气泡组件">
        <Popover></Popover>
      </Block>
      <Block title="页面提示组件">
        <Alert></Alert>
      </Block>
    </content>
    <footer class="index-footer"></footer>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      colorData: [{ title: '', color: '', fontColor: '' }],
      textData: [
        {
          title: '主标题',
          example: '杭州广电云网络科技有限公司',
          color: '#333333',
          size: '16px',
          weight: 'bold'
        },
        {
          title: '次要标题',
          example: '杭州广电云网络科技有限公司',
          color: '#333333',
          size: '14px',
          weight: '500'
        },
        {
          title: '正文',
          example: '杭州广电云网络科技有限公司',
          color: '#666666',
          size: '14px',
          weight: 'normal'
        },
        {
          title: '小标题',
          example: '杭州广电云网络科技有限公司',
          color: '#999999',
          size: '12px',
          weight: 'normal'
        },

        {
          title: ' 辅助标题/失效文字',
          example: '杭州广电云网络科技有限公司',
          color: '#CCCCCC',
          size: '12px',
          weight: 'normal'
        }
      ],
      btnData: [
        {
          groupTitle: '按钮默认状态',
          units: [
            {
              label: '常规按钮',
              type: 'primary',
              plain: false,
              size: 'mini'
            },
            {
              label: '常规按钮',
              type: 'primary',
              plain: true,
              size: 'mini'
            },
            {
              label: '警告按钮',
              type: 'warning',
              plain: false,
              size: 'mini'
            },
            {
              label: '警告按钮',
              type: 'warning',
              plain: true,
              size: 'mini'
            },
            {
              label: '删除按钮',
              type: 'danger',
              plain: false,
              size: 'mini'
            },
            {
              label: '删除按钮',
              type: 'danger',
              plain: true,
              size: 'mini'
            }
          ]
        },
        {
          groupTitle: '其他按钮状态',
          units: [
            {
              label: '带图标按钮',
              type: 'primary',
              plain: false,
              size: 'mini'
            },
            {
              label: '带图标按钮',
              type: 'primary',
              plain: true,
              size: 'mini'
            },
            {
              label: '文件上传按钮',
              type: 'primary',
              plain: false,
              size: 'mini'
            },
            {
              label: '文件上传按钮',
              type: 'primary',
              plain: true,
              size: 'mini'
            },
            {
              label: '下拉菜单按钮',
              type: 'primary',
              plain: false,
              size: 'mini'
            },
            {
              label: '下拉菜单按钮',
              type: 'primary',
              plain: true,
              size: 'mini'
            }
          ]
        }
      ],
      inputData: [
        {
          type: 'default',
          size: 'mini',
          info: '默认文字：#999999',
          readonly: false
        },
        {
          type: 'default',
          size: 'mini',
          info: '默认文字：#999999',
          readonly: false
        },
        {
          type: 'default',
          size: 'mini',
          info: '默认文字：#666666',
          readonly: false
        },
        {
          type: 'default',
          size: 'mini',
          info: '默认文字：#666666',
          readonly: true
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .index-header {
    position: relative;
    width: 100%;
    height: auto;

    .index-header-title {
      position: absolute;
      left: 0;
      top: 20vw;
      width: 50%;
      height: auto;
      color: #fff;

      h2 {
        font-size: 3em;
        font-weight: bold;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      h5 {
        font-size: 1.8em;
        font-weight: normal;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    .index-header-bg {
      width: 100%;
      height: auto;
    }

    .index-header-monitor {
      position: absolute;
      right: 8vw;
      top: 8vw;
      width: 40vw;
      height: auto;
    }
  }

  .index-content {
    width: 1000px;
    height: auto;
    min-height: 200px;
    background: #fff;

    .index-content-tipslist {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      font-size: 1em;

      li {
        margin: 5px 0;
        font-size: 1em;

        span {
          margin-right: 5px;
          font-weight: bold;
        }
      }
    }

    .index-content-colorlist {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 1.2em;
    }

    .index-content-btnlist {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 0 100px 0 0;
        font-size: 1em;
      }
    }

    .index-content-textlist {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      li {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 10px 0;
        font-size: 1em;

        span {
          text-align: left;
        }

        .title {
          width: 200px;
        }

        .example {
          width: 400px;
        }

        .size {
          width: 200px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-table {
  &::before {
    height: 0 !important;
  }

  .el-table__header-wrapper {
    height: 0 !important;
  }

  thead {
    tr {
      th {
        border-bottom: 0 !important;
      }
    }
  }

  tbody {
    tr {
      td {
        border-bottom: 0 !important;
      }
    }
  }
}
</style>
