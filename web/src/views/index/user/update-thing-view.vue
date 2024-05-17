<template>
  <div class="content-list">
    <div class="list-title">我的视频</div>
    <div role="tablist" class="list-tabs-view flex-view">
    </div>
    <div class="list-content">
      <div class="collect-thing-view">
        <a-spin :spinning="loading" style="min-height: 200px;">
          <div class="thing-list flex-view">
          <div class="thing-item item-column-3" v-for="(item,index) in pageData.collectData" :key="index">
            <div class="remove" @click="handleRemove(item.id)">移出</div>
            <div class="img-view" @click="handleClickItem(item)">
              <img :src="item.cover">
            </div>
            <div class="info-view">
              <h3 class="thing-name">{{item.title}}</h3>
              <!-- <p class="authors" v-if="item.recommend_count">作者：{{item.recommend_count}}</p> -->
              <p class="translators" v-if="item. create_time">上传时间：{{item. create_time}}</p>
            </div>
          </div>
          <template v-if="!pageData.collectData || pageData.collectData.length <= 0">
            <a-empty style="width: 100%;margin-top: 200px;"/>
          </template>
        </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 引入必要的组件和函数
  import { message } from 'ant-design-vue';
  import { getCollectThingListApi, removeCollectUserApi } from '/@/api/index/thing';
  import { deleteApi } from '/@/api/admin/thing';
  import { BASE_URL } from "/@/store/constants";
  import { useRouter } from 'vue-router';
  import { useUserStore } from "/@/store";
  import { listApi as listThingList } from '/@/api/index/thing';

  // 获取路由实例和用户信息存储实例
  const router = useRouter();
  const userStore = useUserStore();

  // 响应式定义页面数据
  const pageData = reactive({
    collectData: [] // 数据列表
  });

  // 加载状态引用
  const loading = ref(false);

  // 组件挂载时获取列表数据
  onMounted(()=>{
    getCollectThingList(); // 获取物品列表
  });

  // 点击条目处理函数，跳转至详情页面
  const handleClickItem =(record) =>{
    let text = router.resolve({name: 'detail', params: {id: record.id}});
    window.open(text.href, '_blank');
  };

  // 移除处理函数
  const handleRemove =(record)=> {
    let username = userStore.user_name; // 获取用户名
    console.log("删除物品："+record);
    deleteApi({ ids: record})
        .then((res) => {
          getCollectThingList();
        })
        .catch((err) => {
          message.error(err.msg || '操作失败');
        });
  };

  // 获取收藏物品列表数据
  const getCollectThingList =()=> {
    loading.value = true; // 设置加载状态为true
    let username = userStore.user_name; // 获取用户名
    listThingList({username: username}) // 调用获取收藏物品列表API
    .then(res => {
      res.data.forEach(item => {
        console.log("视频表："+item);
        item.cover = BASE_URL + item.cover; // 拼接物品封面URL
        item.title = item.title.length > 10 ? item.title.substring(0, 10) + '...' : item.title; // 截取物品标题

      });
      console.log(res.data);
      pageData.collectData = res.data; // 更新收藏物品列表数据
      loading.value = false; // 设置加载状态为false
    })
    .catch(err => {
      console.log(err.msg); // 打印错误信息
      loading.value = false; // 设置加载状态为false
    });
  };
</script>

<style scoped lang="less">
.flex-view {
  // display: grid;
  // grid-template-columns: repeat(auto-fit, minmax(255px));
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
    //color: #fff;
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

  .thing-item {
    position: relative;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-right: 16px;
    min-width: 310px;
    max-width: 310px;
    height: fit-content;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 16px;
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
      //text-align: right;
      height: auto;
      overflow: hidden;
      padding: 0 10px;

      h3 {
        color: #000000;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin: 12px 0 8px;
      }

      .authors, .translators {
        color: #6f6f6f;
        text-align: left;
        font-size: 12px;
        line-height: 12px;
        margin: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .authors{
        text-align: right;
      }
    }
  }
}
</style>
