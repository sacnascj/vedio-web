<template>
  <div class="content-list">
    <div class="list-title">我的喜欢</div>
    <div role="tablist" class="list-tabs-view flex-view">
    </div>
    <div class="list-content">
      <div class="collect-thing-view">
        <a-spin :spinning="loading" style="min-height: 200px;">
          <div class="thing-list flex-view">
          <div class="thing-item item-column-3" v-for="(item,index) in wishData" :key="index">
            <div class="remove" @click="handleRemove(item)">移出</div>
            <div class="img-view" @click="handleClickItem(item)">
              <img :src="item.cover">
            </div>
            <div class="info-view">
              <h3 class="thing-name">{{item.title}}</h3>
              <p class="authors" v-if="item.author">{{item.author}}（作者)</p>
              <p class="translators" v-if="item.translator">{{item.translator}}（译者）</p>
            </div>
          </div>
          <template v-if="!wishData || wishData.length <= 0">
            <a-empty style="width: 100%;margin-top: 200px;"/>
          </template>
        </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入 Ant Design Vue 中的 message 组件
import { message } from 'ant-design-vue';

// 引入获取喜欢列表和移除喜欢用户的 API 方法
import { getWishThingListApi, removeWishUserApi } from '/@/api/index/thing';

// 引入存储常量的 BASE_URL
import { BASE_URL } from "/@/store/constants";

// 引入用户存储钩子
import { useUserStore } from "/@/store";

// 创建路由器和当前路由对象
const router = useRouter();
const route = useRoute();

// 使用用户存储
const userStore = useUserStore();
// 定义喜欢数据的响应式引用
let wishData = ref([]);

// 页面加载时执行
onMounted(() => {
  getWishThingList(); // 获取愿望列表
});

// 加载状态的响应式引用
const loading = ref(false);

// 点击条目处理函数
const handleClickItem = (record) => {
  // 解析路由
  let text = router.resolve({ name: 'detail', params: { id: record.id } });
  // 在新标签页中打开详情页
  window.open(text.href, '_blank');
};

// 移除喜欢处理函数
const handleRemove = (record) => {
  let username = userStore.user_name;
  // 调用移除喜欢用户的 API
  removeWishUserApi({ username: username, thingId: record.id })
    .then(res => {
      message.success('移除成功'); // 移除成功提示
      getWishThingList(); // 重新获取喜欢列表
    })
    .catch(err => {
      console.log(err); // 打印错误
    });
};

// 获取喜欢列表函数
const getWishThingList = () => {
  loading.value = true; // 开启加载状态
  let username = userStore.user_name; // 获取用户名
  // 调用获取喜欢列表的 API
  getWishThingListApi({ username: username })
    .then(res => {
      // 遍历喜欢列表数据，拼接图片路径
      res.data.forEach(item => {
        item.cover = BASE_URL + item.cover;
      });
      // 更新喜欢列表数据
      wishData.value = res.data;
      loading.value = false; // 关闭加载状态
    })
    .catch(err => {
      console.log(err.msg); // 打印错误消息
      loading.value = false; // 关闭加载状态
    });
};

</script>
<style scoped lang="less">
.flex-view {
  display: grid;  
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}

.content-list {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;

  .list-title {
    color: #152844;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    height: 24px;
    margin-bottom: 4px;
  }

  .list-tabs-view {
    position: relative;
    border-bottom: 1px solid #cedce4;
    height: 12px;
    line-height: 42px;
  }
}

.thing-list {
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  /* 添加网格间隙 */


  .thing-item {
    position: relative;
    //-webkit-box-flex: 1;
    //-ms-flex: 1;
    //flex: 1;
    margin-right: 20px;
    min-width: 310px;
    max-width: 310px;
    height: fit-content;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
    cursor: pointer;

    .remove {
      position: absolute;
      right: 8px;
      top: 8px;
      width: 48px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      color: #fff;
      background: #a1adc5;
      border-radius: 32px;
      cursor: pointer;
    }

    .img-view {
      background: #eaf1f5;
      font-size: 0;
      text-align: center;
      height: 180px;
      //padding: 8px 0;
      border-radius: 4px;
      overflow: hidden;
      
    }
    img {
        //max-width: auto;
        //height: 100%;
        width: 100%;
        height: 100%;
        display: block;
        margin: 0 auto;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        object-fit: cover;
      }

    .info-view {
      background: #f6f9fb;
      text-align: center;
      height: auto;
      overflow: hidden;
      padding: 0 16px;

      h3 {
        color: #1c355a;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin: 12px 0 8px;
      }

      .authors, .translators {
        color: #6f6f6f;
        font-size: 12px;
        line-height: 14px;
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
