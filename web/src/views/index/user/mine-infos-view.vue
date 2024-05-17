<template>
  <div class="mine-infos-view">
    <div class="info-box flex-view">
      <img :src="AvatarImg" class="avatar-img">
      <div class="name-box">
        <h2 class="nick">{{ userStore.user_name }}</h2>
      </div>
    </div>
    <div class="order-box">
      <div class="title">交互中心</div>
      <div class="list">
        <div class="mine-item flex-view" @click="clickMenu('updateThingView')">
          <img :src="videoIconImage">
          <span>我的视频</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('collectThingView')">
          <img :src="MyOrderImg">
          <span>我的收藏</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('wishThingView')">
          <img :src="AddressIconImage">
          <span>我的喜欢</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('commentView')">
          <img :src="CommentIconImg">
          <span>我的评论</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('countThingView')">
          <img :src="PointIconImage">
          <span>我的统计</span>
        </div>
      </div>
    </div>
    <div class="setting-box">
      <div class="title">个人设置</div>
      <div class="list">
        <div class="mine-item flex-view" @click="clickMenu('userInfoEditView')">
          <img :src="SettingIconImage" alt="编辑资料">
          <span>编辑资料</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('securityView')">
          <img :src="SafeIconImage" alt="账号安全">
          <span>账号安全</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('pushView')">
          <img :src="PushIconImage" alt="推送设置">
          <span>推送设置</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('messageView')">
          <img :src="MessageIconImage" alt="消息管理">
          <span>消息管理</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入图片
import AvatarImg from '/@/assets/images/avatar.jpg';
import MyOrderImg from '/@/assets/images/order-icon.svg';
import CommentIconImg from '/@/assets/images/order-thing-icon.svg';
import AddressIconImage from '/@/assets/images/order-address-icon.svg';
import PointIconImage from '/@/assets/images/order-point-icon.svg';
import SettingIconImage from '/@/assets/images/setting-icon.svg';
import SafeIconImage from '/@/assets/images/setting-safe-icon.svg';
import PushIconImage from '/@/assets/images/setting-push-icon.svg';
import MessageIconImage from '/@/assets/images/setting-msg-icon.svg';
import videoIconImage from '/@/assets/images/tv.svg';

// 引入收藏和喜欢列表 API 方法
import { getCollectThingListApi, getWishThingListApi } from '/@/api/index/thing';

// 引入用户存储钩子
import { useUserStore } from '/@/store';

// 使用用户存储
const userStore = useUserStore();

// 使用路由钩子
const router = useRouter();

// 创建收藏和喜欢数量的响应式引用
let collectCount = ref(0);
let wishCount = ref(0);

// 组件挂载时获取收藏和喜欢数量
onMounted(() => {
  getCollectThingList(); // 获取收藏列表
  getWishThingList(); // 获取喜欢列表
});

// 点击菜单项函数
const clickMenu = (name) => {
  router.push({ name: name }); // 跳转到指定菜单项
};

// 获取收藏列表函数
const getCollectThingList = () => {
  let username = userStore.user_name; // 获取用户名
  // 调用收藏列表 API 方法
  getCollectThingListApi({ username: username }).then(res => {
    collectCount.value = res.data.length; // 更新收藏数量
  }).catch(err => {
    console.log(err.msg); // 打印错误信息
  });
};

// 获取喜欢列表函数
const getWishThingList = () => {
  let username = userStore.user_name; // 获取用户名
  // 调用喜欢列表 API 方法
  getWishThingListApi({ username: username }).then(res => {
    wishCount.value = res.data.length; // 更新喜欢条目
  }).catch(err => {
    console.log(err.msg); // 打印错误信息
  });
};


</script>

<style scoped lang="less">
.flex-view {
  display: flex;
}

.mine-infos-view {
  width: 235px;
  margin-right: 20px;
  margin-bottom: 32px;
  border: 1px solid #cedce4;
  height: fit-content;

  .info-box {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 16px 16px 0;
    overflow: hidden;
  }

  .avatar-img {
    width: 48px;
    height: 48px;
    margin-right: 16px;
    border-radius: 50%;
  }

  .name-box {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;

    .nick {
      color: #152844;
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
      height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      overflow: hidden;
    }

    .age {
      font-size: 12px;
      color: #6f6f6f;
      height: 16px;
      line-height: 16px;
      margin-top: 8px;
    }

    .give-point {
      color: #4684e2;
      cursor: pointer;
      float: right;
    }
  }

  .counts-view {
    border: none;
    padding: 16px;
  }

  .counts {
    margin-top: 12px;
    text-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .flex-item {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      cursor: pointer;
    }

    .text {
      height: 16px;
      line-height: 16px;
      color: #6f6f6f;
    }

    .num {
      height: 18px;
      line-height: 18px;
      color: #152844;
      font-weight: 600;
      font-size: 14px;
      margin-top: 4px;
    }

    .split-line {
      width: 1px;
      height: 24px;
      background: #dae6f9;
    }
  }

  .intro-box {
    border-top: 1px solid #cedce4;
    padding: 16px;

    .title {
      color: #6f6f6f;
      font-size: 12px;
      line-height: 16px;
    }

    .intro-content {
      color: #152844;
      font-size: 14px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 8px 0;
    }
  }

  .create-box {
    cursor: pointer;
    border-top: 1px solid #cedce4;
    padding: 16px;

    .title {
      position: relative;
      color: #152844;
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      height: 18px;
    }

    .counts {
      margin-top: 12px;
      text-align: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      .flex-item {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        cursor: pointer;
      }

      .split-line {
        width: 1px;
        height: 24px;
        background: #dae6f9;
      }
    }
  }

  .order-box {
    margin-top: 24px;
    border-top: 1px solid #cedce4;
    padding: 16px;

    .title {
      color: #152844;
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      height: 18px;
      margin-bottom: 8px;
    }

    .list {
      padding-left: 16px;

      .mine-item {
        border-top: 1px dashed #cedce4;
        cursor: pointer;
        height: 48px;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        img {
          width: 24px;
          margin-right: 8px;
          height: 24px;
        }

        span {
          color: #152844;
          font-size: 14px;
        }
      }

      .mine-item:first-child {
        border: none;
      }
    }
  }

  .setting-box {
    border-top: 1px solid #cedce4;
    padding: 16px;

    .title {
      color: #152844;
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      height: 18px;
      margin-bottom: 8px;
    }

    .list {
      padding-left: 16px;
    }

    .mine-item {
      border-top: 1px dashed #cedce4;
      cursor: pointer;
      height: 48px;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      img {
        width: 24px;
        margin-right: 8px;
        height: 24px;
      }

      span {
        color: #152844;
        font-size: 14px;
      }
    }

    .mine-item:first-child {
      border: none;
    }
  }
}
</style>
