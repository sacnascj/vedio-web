<template>
  <div class="content-margin">
    <h1 class="search-name-box">{{ tData.keyword }}</h1>
    <div class="search-tab-nav clearfix">
      <div class="tab-text">
        <span>与</span>
        <span class="strong">{{ tData.keyword }}</span>
        <span>相关的内容</span>
      </div>
    </div>
    <div class="content-list">
      <div class="thing-list">
        <a-spin :spinning="tData.loading" style="min-height: 200px">
          <div class="pc-thing-list">
            <div v-for="item in tData.pageData" :key="item.id" @click="handleDetail(item)" class="thing-item item-column-3"
              ><!---->
              <div class="img-view">
                <img :src="item.cover" />
                <div style="position: absolute; left: 10px; bottom: 10px">
                  <img :src="PlayIcon" style="width: 30px; height: 30px" />
                </div>
              </div>
              <div class="info-view">
                <h3 class="thing-name">{{ item.title.substring(0, 12) }}</h3>
                <span style="color: #444; font-size: 11px; height: 11px">{{ item.create_time.substring(0, 16) }}</span>
                <br />
                <span style="color: #444; font-size: 11px; height: 11px">{{ item.pv }}次观看</span>
              </div>
            </div>
            <div v-if="tData.pageData.length <= 0 && !tData.loading" class="no-data" style="">暂无数据</div>
          </div>
        </a-spin>

        <!-- <div class="page-view" style="">
          <a-pagination
            v-model:value="tData.page"
            size="small"
            @change="changePage"
            :hideOnSinglePage="true"
            :defaultPageSize="tData.pageSize"
            :total="tData.total"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入列表 API 方法和常量
import { listApi as listThingList } from '/@/api/index/thing';
import { BASE_URL } from '/@/store/constants';

// 导入用户存储库
import { useUserStore } from '/@/store';

import PlayIcon from '/@/assets/images/Play.png';

// 创建路由实例和用户存储库实例
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// 创建包含数据和状态的响应式对象
const tData = reactive({
  loading: false,
  keyword: '',
  thingData: [],
  pageData: [],
  page: 1,
  total: 0,
  pageSize: 20,
});

onMounted(() => {
    search();
  });

// 当路由中的 query 参数发生变化时执行搜索
watch(
  () => route.query,
  (newPath, oldPath) => {
    search();
  },
  { immediate: false }
);

// 执行搜索函数
const search = () => {
  tData.keyword = route.query.keyword?.trim();
  getThingList({ keyword: tData.keyword });
};

// 分页事件处理函数
const changePage = (page) => {
  tData.page = page;
  let start = (tData.page - 1) * tData.pageSize;
  tData.pageData = tData.thingData.slice(start, start + tData.pageSize);
  console.log('第' + tData.page + '页');
};

// 查看详情事件处理函数
const handleDetail = (item) => {
  // 在新页面打开详情
  let text = router.resolve({ name: 'detail', params: { id: item.id } });
  window.open(text.href, '_blank');
};

// 获取列表数据函数
const getThingList = (data) => {
  tData.loading = true;
  listThingList(data)
    .then((res) => {
      res.data.forEach((item, index) => {
        if (item.cover) {
          item.cover = BASE_URL + item.cover;
        }
      });
      tData.thingData = res.data;
      tData.total = tData.thingData.length;
      changePage(1);
      tData.loading = false;
    })
    .catch((err) => {
      console.log(err);
      tData.loading = false;
    });
};

</script>
<style scoped lang="less">
  @media screen and (min-width: 100px) and (max-width: 480px) {
    .thing-item {
      width: calc((100% - 16px)) !important;
    }
  }

  @media screen and (min-width: 480px) and (max-width: 768px) {
    .thing-item {
      width: calc((100% - 32px) / 2) !important;
    }
  }

  @media screen and (min-width: 768px) {
    .thing-item {
      width: calc((100% - 48px) / 3);
    }
  }

  .content-margin {
    margin: 156px 0 100px;
  }

  .page-view {
    width: 100%;
    text-align: center;
    margin-top: 48px;
  }

  .search-name-box {
    background: #f5f9fb;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    color: #152844;
    text-align: center;
    position: fixed;
    top: 56px;
    left: 0;
    z-index: 1;
    width: calc(100% - 8px);
  }

  .search-tab-nav {
    position: relative;
    padding: 12px 0 16px;
    text-align: center;

    .tab-text {
      float: left;
      color: #5f77a6;
      font-size: 14px;
    }

    .strong {
      color: #152844;
      font-weight: 600;
      margin: 0 4px;
    }
  }

  .thing-list {
    //display: flex;
    //flex-direction: row;
    //flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .pc-thing-list {
    //width: 100%;
    //display: grid;
    //grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .thing-item {
    //width: calc((100% - 48px) / 3);
    width: 450px;
    position: relative;
    height: fit-content;
    cursor: pointer;
    box-shadow: 4px 4px 4px rgba(200, 200, 200, 0.3), -4px 4px 4px rgba(200, 200, 200, 0.3);

    .img-view {
      text-align: center;
      position: relative;
      height: 250px;
      width: 100%;

      img {
        height: 100%;
        width: 100%;
        margin: 0 auto;
        background-size: cover;
        object-fit: cover;
      }
    }

    .info-view {
      //background: #f6f9fb;
      overflow: hidden;
      padding: 16px 16px;

      .thing-name {
        line-height: 32px;
        color: #0f1111 !important;
        font-size: 20px !important;
      }

      .price {
        color: #ff7b31;
        font-size: 20px;
        line-height: 20px;
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .translators {
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

  .a-price-symbol {
    top: -0.5em;
    font-size: 12px;
  }

  .a-price {
    color: #0f1111;
    font-size: 21px;
  }
</style>
