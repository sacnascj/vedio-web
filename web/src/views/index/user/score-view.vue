<template>
  <div class="content-list">
    <div class="list-title">我的积分</div>
    <div class="my-score-view">
      <div class="score-title">积分余额：{{score}}</div>
    </div>
  </div>
</template>

<script setup>
// 引入用户详情 API 方法
import { detailApi } from '/@/api/index/user';

// 引入用户存储钩子
import { useUserStore } from "/@/store";

// 使用路由钩子
const router = useRouter();

// 使用用户存储
const userStore = useUserStore();

// 创建积分的响应式引用
let score = ref(0);

// 组件挂载时获取用户信息
onMounted(() => {
  getUserInfo(); // 调用获取用户信息函数
});

// 获取用户信息函数
const getUserInfo = () => {
  let userId = userStore.user_id; // 获取用户ID
  // 调用用户详情 API 方法
  detailApi({ id: userId }).then(res => {
    if (res.data) {
      score.value = res.data.score; // 更新积分值
    }
  }).catch(err => {
    console.log(err); // 打印错误信息
  });
};
</script>

<style scoped lang="less">
.flex-view {
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

.my-score-view {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-top: 16px;

  .score-title {
    color: #111111;
    font-size: 14px;
    font-weight: 700;
  }

}
</style>
