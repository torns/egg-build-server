<template>
  <div class="dialog">
    <div class="dialog-item el-message-box">
      <div class="el-message-box__header">
        <div class="el-message-box__title"><span>Warning</span></div>
        <button
          type="button"
          aria-label="Close"
          class="el-message-box__headerbtn"
        >
          <i class="el-message-box__close el-icon-close"></i>
        </button>
      </div>
      <div class="el-message-box__content">
        <div class="el-message-box__status el-icon-warning"></div>
        <div class="el-message-box__message">
          <p>This will permanently delete the file. Continue?</p>
        </div>
        <div class="el-message-box__input" style="display: none;">
          <div class="el-input">
            <input
              type="text"
              autocomplete="off"
              placeholder=""
              class="el-input__inner"
            />
          </div>
          <div
            class="el-message-box__errormsg"
            style="visibility: hidden;"
          ></div>
        </div>
      </div>
      <div class="el-message-box__btns">
        <button
          type="button"
          class="el-button el-button--default el-button--mini"
        >
          <span>
            Cancel
          </span></button
        ><button
          type="button"
          class="el-button el-button--default el-button--mini el-button--primary "
        >
          <span>
            OK
          </span>
        </button>
      </div>
    </div>
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tips"
      class="dialog-item el-dialog"
      style="margin: 0px;"
    >
      <div class="el-dialog__header">
        <span class="el-dialog__title">Tips</span
        ><button type="button" aria-label="Close" class="el-dialog__headerbtn">
          <i class="el-dialog__close el-icon el-icon-close"></i>
        </button>
      </div>
      <div class="el-dialog__body"><span>This is a message</span></div>
      <div class="el-dialog__footer">
        <span class="dialog-footer"
          ><button type="button" class="el-button el-button--mini el-button--default">
            <span>Cancel</span></button
          ><button type="button" class="el-button el-button--default el-button--mini el-button--primary">
            <span>Confirm</span>
          </button></span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog'
}
</script>

<style lang="scss" scoped>
.dialog {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .dialog-item {
    margin: 30px 0 30px 0;
  }
}
</style>
