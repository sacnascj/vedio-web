<template>
  <div class="content-list">
    <div class="list-title">我的评论</div>
    <div class="list-content">
      <div class="comment-view">
        <a-spin :spinning="loading" style="min-height: 200px;">
          <div class="comment-list">
            <div class="comment-item flex-view" v-for="item in commentData">
              <img :src="AvatarImg" class="avatar">
              <div class="infos">
                <div class="name flex-view">
                  <h3></h3>
                  <h3 @click="handleClickTitle(item)">《{{item.title}}》</h3>
                </div>
                <div class="time">{{ getFormatTime(item.commentTime, true)}}</div>
                <div class="content">{{item.content}}</div>
              </div>
            </div>
            <template v-if="!commentData || commentData.length <= 0">
              <a-empty style="width: 100%;margin-top: 200px;"/>
            </template>
          </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入头像图片
import AvatarImg from '/@/assets/images/avatar.jpg';

// 导入用户存储库
import { useUserStore } from "/@/store";

// 导入评论列表 API 方法和常量 BASE_URL
import { listUserCommentsApi } from '/@/api/index/comment';
import { BASE_URL } from "/@/store/constants";

// 导入格式化时间函数
import { getFormatTime } from '/@/utils';

// 创建加载状态的响应式引用
const loading = ref(false);

// 创建评论数据的响应式引用
const commentData = ref([]);

// 获取用户存储库实例
const userStore = useUserStore();

// 获取路由实例
const router = useRouter();

// 组件挂载时获取评论列表
onMounted(() => {
  getCommentList(); // 获取评论列表
});

// 处理点击标题事件
const handleClickTitle = (record) => {
  // 解析路由，打开详情页面
  let text = router.resolve({ name: 'detail', params: { id: record.thing } });
  window.open(text.href, '_blank');
};

// 获取评论列表函数
const getCommentList = () => {
  loading.value = true; // 设置加载状态为 true
  let userId = userStore.user_id; // 获取用户ID
  // 调用列表用户评论 API 方法
  listUserCommentsApi({ userId: userId }).then(res => {
    // 遍历评论数据，更新封面链接
    res.data.forEach(item => {
      item.cover = BASE_URL + item.cover;
    });
    commentData.value = res.data; // 更新评论数据
    loading.value = false; // 设置加载状态为 false
  }).catch(err => {
    // 打印错误消息
    message.error(err.msg || '网络异常');
    loading.value = false; // 设置加载状态为 false
  });
};

</script>
<style scoped lang="less">
.flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.content-list {
  flex: 1;

  .list-title {
    color: #152844;
    font-weight: 600;
    font-size: 18px;
    //line-height: 24px;
    height: 48px;
    margin-bottom: 4px;
    border-bottom: 1px solid #cedce4;
  }
}

.comment-view {
  overflow: hidden;

  .comment-list {
    margin: 8px auto;
  }

  .comment-item {
    padding: 15px 0;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 8px;
    }

    .infos {
      position: relative;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }

    .name {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      cursor: pointer;
    }

    h3 {
      color: #152844;
      font-weight: 600;
      font-size: 14px;
      margin: 0;
    }

    .traingle {
      width: 0;
      height: 0;
      border-left: 6px solid #c3c9d5;
      border-right: 0;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      margin: 0 12px;
    }

    .time {
      color: #5f77a6;
      font-size: 12px;
      line-height: 16px;
      height: 16px;
      margin: 2px 0 8px;
    }

    .content {
      color: #484848;
      font-size: 14px;
      line-height: 22px;
      padding-right: 30px;
    }
  }
}
</style>
