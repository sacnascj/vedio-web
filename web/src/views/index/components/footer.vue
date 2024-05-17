<template>
  <div class="footer-view">
<!--    <div class="foot-link-box flex-view">-->
<!--      <a href="https://github.com/geeeeeeeek/python_video" class="foot-link" target="_blank">系统文档</a>-->
<!--      <div class="link-split"></div>-->
<!--      <a href="/admin" class="foot-link" target="_blank">后台管理</a>-->
<!--      <div class="link-split"></div>-->
<!--      <a href="" class="foot-link" target="_blank">关于我们</a>-->
<!--    </div>-->
    <div class="footer-infos">
      <span>
        <a style="color: rgb(174, 174, 174);">本站声明：本站资源全部来自第三方网站，本站不存储任何资源。如果浏览过程中发现侵权的视频，请发邮件到1378167643@qq.com，我们会及时删除。</a>
      </span>
    </div>
    <div class="address">2023-2024 © xlx毕业设计 · All Rights Reserved</div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="less">
.flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.footer-view {
  width: 100%;
  margin: 0 auto;

  .foot-link-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    overflow: hidden;
    margin: 24px auto 16px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    .foot-link {
      margin: 0 16px;
      color: #2a4f88;
    }
    a {
      background-color: transparent;
      text-decoration: none;
      color: var(--mid-blue);
    }
  }

  .footer-infos {
    font-size: 12px;
    color: #aeaeae;
    margin-top: 16px;
    margin-left: 16px;
    margin-right: 16px;
    text-align: center;
  }
  .address {
    text-align: center;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #aeaeae;
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>
