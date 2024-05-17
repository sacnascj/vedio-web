<template>
  <div class="vidvid" ref="divref">{{ detailData.raw }}</div>
  <div class="detail">
    <Header />

    <div class="detail-content">
      <div class="detail-content-top">
        <div style="position: relative">
          <div class="thing-infos-view">
            <div class="thing-infos">
              <!-- <video
                id="thing-v"
                class="video"
                :src="detailData.raw"
                :poster="detailData.cover"
                controls
                autoplay
                style="background-color: #000"
              >
              </video> -->
              <!-- <Artplayer @get-instance="getInstance" :option="option" :style="style" /> -->
              
              <div class="video" id="thing-v"></div>
              <div class="title">{{ detailData.title }}</div>
              <div class="meta">{{ detailData.pv }}次观看</div>
              <div class="desc">简介：{{ detailData.description }}</div>
            </div>
            <div class="thing-counts hidden-sm">
              <div class="count-item flex-view pointer" @click="collect()">
                <div class="count-img">
                  <img :src="RecommendIcon" />
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">收藏</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text">{{ detailData.collect_count }}</span>
                  </div>
                </div>
              </div>
              <div class="count-item flex-view pointer" @click="addToWish()">
                <div class="count-img">
                  <img :src="WantIcon" />
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">喜欢</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text">{{ detailData.wish_count }}</span>
                  </div>
                </div>
              </div>
              <div class="count-item flex-view" @click="share()">
                <div class="count-img">
                  <img :src="ShareIcon" />
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">分享</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text"></span>
                    <img :src="WeiboShareIcon" class="mg-l" />
                  </div>
                </div>
              </div>
              <div style="margin-top: 24px" v-if="adData">
                <!--广告区域-->
                <img style="width: 250px; height: 100px; background-size: cover; object-fit: cover" src="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-content-bottom">
        <div class="thing-content-view flex-view">
          <div id="comment-view" class="main-content">
            <div class="order-view main-tab">
              <span
                class="tab"
                :class="selectTabIndex === index ? 'tab-select' : ''"
                v-for="(item, index) in tabData"
                :key="index"
                @click="selectTab(index)"
              >
                {{ item }}
              </span>
            </div>

            <!--评论-->
            <div class="thing-comment">
              <div class="title">发表新的评论</div>
              <div class="publish flex-view">
                <img :src="AvatarIcon" class="mine-img" />
                <input placeholder="说点什么..." class="content-input" ref="commentRef" />
                <button class="send-btn" @click="sendComment()">发送</button>
              </div>
              <div class="tab-view flex-view">
                <div class="count-text">共有{{ commentData.length }}条评论</div>
                <div class="tab-box flex-view" v-if="commentData.length > 0">
                  <span :class="sortIndex === 0 ? 'tab-select' : ''" @click="sortCommentList('recent')">最新</span>
                  <div class="line"></div>
                  <span :class="sortIndex === 1 ? 'tab-select' : ''" @click="sortCommentList('hot')">热门</span>
                </div>
              </div>
              <div class="comments-list">
                <div class="comment-item" v-for="item in commentData">
                  <div class="flex-item flex-view">
                    <img :src="AvatarIcon" class="avator" />
                    <div class="person">
                      <div class="name">{{ item.username }}</div>
                      <div class="time">{{ item.comment_time }}</div>
                    </div>
                    <div class="float-right">
                      <span @click="like(item.id)">推荐</span>
                      <span class="num">{{ item.like_count }}</span>
                    </div>
                  </div>
                  <p class="comment-content">{{ item.content }}</p>
                </div>
                <div class="infinite-loading-container">
                  <div class="infinite-status-prompt" style="">
                    <div slot="no-results" class="no-results">
                      <div></div>
                      <p>没有更多了</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="recommend" style="">
            <div class="title">热门推荐</div>
            <div class="things">
              <div v-for="item in recommendData" :key="item.id" @click="handleDetail(item)" class="thing-item item-column-3"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>
<script setup>
// 导入相关模块和组件
import { message } from 'ant-design-vue';
import Header from '/@/views/index/components/header.vue';
import Footer from '/@/views/index/components/footer.vue';
import AddIcon from '/@/assets/images/add.svg';
import WantIcon from '/@/assets/images/want-read-hover.svg';
import RecommendIcon from '/@/assets/images/recommend-hover.svg';
import ShareIcon from '/@/assets/images/share-icon.svg';
import WeiboShareIcon from '/@/assets/images/wb-share.svg';
import AvatarIcon from '/@/assets/images/avatar.jpg';
import PlayIcon from '/@/assets/images/Play.png';
//import Artplayer from '/@/views/index/Artplayer.vue';
import { detailApi, listApi as listThingList } from '/@/api/index/thing';
import { listThingCommentsApi, createApi as createCommentApi, likeApi } from '/@/api/index/comment';
import { addWishUserApi } from '/@/api/index/thing';
import { addCollectUserApi } from '/@/api/index/thing';
import { BASE_URL } from '/@/store/constants';
import { useRoute, useRouter } from 'vue-router/dist/vue-router';
import { useUserStore } from '/@/store';
import { getFormatTime } from '/@/utils';
import Artplayer from 'artplayer';
import user from '../admin/user.vue';

import {defineProps, defineEmits} from 'vue';
const props = defineProps({
  title: {
    type: String,
    required: true
  },
});
console.log(props.title);
const emit = defineEmits(['close']);

const closeDialog = () => {
  emit('close');
};
// 获取路由相关信息
const router = useRouter();
const route = useRoute();

// 使用用户存储模块
const userStore = useUserStore();

// 页面数据和状态
let adData = ref();
const videoUrl = ref('https://artplayer.org/assets/sample/video.mp4');
let thingId = ref('');
const detailData = ref({});
let tabUnderLeft = ref(6);
let tabData = ref(['评论']);
let selectTabIndex = ref(0);
var base = ref('');
let commentData = ref([]);
let recommendData = ref([]);
let sortIndex = ref(0);
let order = ref('recent'); // 默认排序最新
let commentRef = ref();
const scrollContainer = ref(null);  
let scrollDistance = ref(0);  

// 页面初始化
onMounted(() => {
  if (props.title) {
    thingId.value = props.title;
  }else{
    thingId.value = route.params.id.trim();
  }
  // thingId.value = route.params.id.trim(); 
  getThingDetail();
  getRecommendThing();
  getCommentList();
  // art_player();
  
});



  


// 选择标签页
const selectTab = (index) => {
  selectTabIndex.value = index;
  tabUnderLeft.value = 6 + 54 * index;
};
// 获取事物详情
const getThingDetail = () => {
  detailApi({ id: thingId.value })
    .then((res) => {
      detailData.value = res.data;
      videoUrl.value = res.data;
      //console.log("123"+JSON.stringify(detailData.value))
      setSEO();
      
      if (detailData.value.cover) {
        detailData.value.cover = BASE_URL + detailData.value.cover;
      }
      detailData.value.raw = BASE_URL + detailData.value.raw;
      art_player();
    })
    .catch((err) => {
      //message.error('获取详情失败');
    });
    //console.log("123"+JSON.stringify(detailData.value))
};

// 设置 SEO
const setSEO = () => {
  let title = detailData.value.title;
  if (title) {
    let seoTitle = title + '-播放中';
    let seoKeywords = title + ',在线观看,';
    let seoDescription = title + ',在线观看,';
    document.title = seoTitle;
    document.querySelector('meta[name="keywords"]').setAttribute('content', seoKeywords);
    document.querySelector('meta[name="description"]').setAttribute('content', seoDescription);
  }
};

// 添加至心愿单
const addToWish = () => {
  let username = userStore.user_name;
  if (username) {
    addWishUserApi({ thingId: thingId.value, username: username })
      .then((res) => {
        message.success(res.msg);
        getThingDetail();
      })
      .catch((err) => {
        console.log('操作失败');
      });
  } else {
    message.warn('请先登录');
  }
};

//var url='https://artplayer.org/assets/sample/video.mp4';
const art_player=()=>{
  let username = userStore.user_name;
  let url=detailData.value.raw;

  const art = new Artplayer({
    container: '.video',
    url,
    autoplay: true,
    muted: false,
    loop: true,
    
    playbackRate: true,
    aspectRatio: true,
    screenshot: true,
    hotkey: true,
    pip: true,
    fullscreen: true,
    fullscreenWeb: true,
    miniProgressBar: true,
    setting: true,
    settings: [
    {
            html: '<a href="/images/logo.png" download="/images/logo.png">Download</a>',
            width: 250,
        }
    ],
  
  });
  const handleOrder = () => {
  art.pip = !art.pip;
};
  art.contextmenu.add({
    name: 'your-menu',
    html: 'Your Menu',
    click: function (...args) {
        console.log(detailData.value.raw);
        console.info(args);
        handleOrder()
        art.contextmenu.show = false;
    },
  });
//   art.pip=true
  art.on('view', (state) => {
    //console.info('view', state);
    if (state && art.pip!=null){
      console.info('view', state);
      handleOrder()
    }else if(!state && art.pip==null){
      console.info('vieww', state);
      handleOrder()
    }
});

};
// 收藏
const collect = () => {
  let username = userStore.user_name;
  if (username) {
    addCollectUserApi({ thingId: thingId.value, username: username })
      .then((res) => {
        message.success(res.msg);
        getThingDetail();
      })
      .catch((err) => {
        console.log('收藏失败');
      });
  } else {
    message.warn('请先登录');
  }
};

// 分享
const share = () => {
  let content = '分享一个非常好玩的网站 ' + window.location.href;
  let shareHref = 'http://service.weibo.com/share/share.php?title=' + content;
  window.open(shareHref);
};

// 处理订单
const handleOrder = (detailData) => {
  console.log(detailData);
  const userId = userStore.user_id;
  router.push({
    name: 'confirm',
    query: {
      id: detailData.id,
      title: detailData.title,
      cover: detailData.cover,
      price: detailData.price,
    },
  });
};

// 获取推荐事物列表
const getRecommendThing = () => {
  listThingList({ sort: 'recommend' })
    .then((res) => {
      res.data.forEach((item, index) => {
        if (item.cover) {
          item.cover = BASE_URL + item.cover;
        }
      });
      console.log(res);
      recommendData.value = res.data.slice(0, 6);
    })
    .catch((err) => {
      console.log(err);
    });
};

// 处理详情点击
const handleDetail = (item) => {
  // 跳转新页面
  let text = router.resolve({ name: 'detail', params: { id: item.id } });
  window.open(text.href, '_blank');
};

// 发送评论
const sendComment = () => {
  console.log(commentRef.value);
  let text = commentRef.value.value.trim();
  console.log(text);
  if (text.length <= 0) {
    return;
  }
  commentRef.value.value = '';
  let userId = userStore.user_id;
  if (userId) {
    createCommentApi({ content: text, thing: thingId.value, user: userId })
      .then((res) => {
        getCommentList();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    message.warn('请先登录！');
    router.push({ name: 'login' });
  }
};

// 点赞评论
const like = (commentId) => {
  likeApi({ commentId: commentId })
    .then((res) => {
      getCommentList();
    })
    .catch((err) => {
      console.log(err);
    });
};

// 获取评论列表
const getCommentList = () => {
  listThingCommentsApi({ thingId: thingId.value, order: order.value })
    .then((res) => {
      commentData.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

// 排序评论列表
const sortCommentList = (sortType) => {
  if (sortType === 'recent') {
    sortIndex.value = 0;
  } else {
    sortIndex.value = 1;
  }
  order.value = sortType;
  getCommentList();
};
console.log();



</script>
<script>
// import Artplayer from '/@/views/index/Artplayer.vue';
// var url='detailData.raw111'
// //console.log()
// console.log(url)
// export default {
//     data() {
//         return {
//             option: {
//                 url,
//                 autoSize: true,
//             },
//             style: {
//                 width: '600px',
//                 height: '400px',
//                 margin: '60px auto 0',
//             },
//         };
//     },
//     components: {
//         Artplayer,
//     },
//     methods: {
//         getInstance(art) {
//             console.log(art);
//         },
//     },
// };
</script>
<style>
  .artplayer-app {
    width: calc(100% - 48px);
    height: calc(45vw - 48px);
    min-height: 250px;
  }

</style>

<!-- 样式表 -->
<style scoped lang="less">

  @media screen and (min-width: 1px) and (max-width: 768px) {
    // 隐藏左侧
    .thing-counts {
      display: none;
    }
    // 视频
    #thing-v {
      width: 100% !important;
    }

    .thing-content-view {
      flex-direction: column;
    }
  }

  @media screen and (min-width: 768px) {
  }

  .hide {
    display: none;
  }

  .detail-content {
    display: flex;
    flex-direction: column;
    width: calc(100% - 32px);
    margin: 4px auto;
  }

  .flex-view {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }

  .hidden-lg {
    display: none !important;
  }

  .thing-infos-view {
    display: flex;
    margin: 89px 0 16px;
    overflow: hidden;

    .thing-infos {
      flex: 1;
      display: flex;
      flex-direction: column;

      .video {
        width: calc(100% - 48px);
        height: calc(45vw - 48px);
        min-height: 250px;
      }

      .title {
        margin-top: 16px;
        font-size: 24px;
        font-weight: 400;
        color: #1e1e1e;
      }

      .meta {
        font-size: 12px;
        color: #1e1e1e;
      }

      .desc {
        width: 100%;
        margin-top: 10px;
        font-size: 14px;
        color: #1e1e1e;
      }
    }

    .mobile-share-box {
      height: 38px;
      background: transparent;
      padding: 0 16px;
      margin: 12px 0;
      font-size: 0;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;

      .state {
        width: 64px;
        height: 24px;
        line-height: 24px;
        background: rgba(70, 132, 226, 0.1);
        border-radius: 2px;
        font-weight: 500;
        font-size: 12px;
        color: #4684e2;
        text-align: center;
      }

      .share-img {
        background: #fff;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        text-align: center;

        img {
          position: relative;
          top: 4px;
          width: 24px;
        }
      }
    }

    .thing-img-box {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 235px;
      flex: 0 0 235px;
      margin: 0 40px 0 0;

      img {
        width: 200px;
        height: 186px;
        display: block;
      }
    }

    .thing-info-box {
      text-align: left;
      padding: 0;
      margin: 0;
    }

    .thing-state {
      height: 26px;
      line-height: 26px;

      .state {
        font-weight: 500;
        color: #4684e2;
        background: rgba(70, 132, 226, 0.1);
        border-radius: 2px;
        padding: 5px 8px;
        margin-right: 16px;
      }

      span {
        font-size: 14px;
        color: #152844;
      }
    }

    .thing-name {
      line-height: 32px;
      margin: 16px 0;
      color: #0f1111 !important;
      font-size: 15px !important;
      font-weight: 400 !important;
      font-style: normal !important;
      text-transform: none !important;
      text-decoration: none !important;
    }

    .translators,
    .authors {
      line-height: 18px;
      font-size: 14px;
      margin: 8px 0;
      -webkit-box-align: start;
      -ms-flex-align: start;
      align-items: flex-start;
      -webkit-box-pack: start;
      -ms-flex-pack: start;
      justify-content: flex-start;

      .name {
        color: #315c9e;
        white-space: normal;
      }
    }

    .tags {
      position: absolute;
      bottom: 20px;
      margin-top: 16px;

      .category-box {
        color: #152844;
        font-size: 14px;

        .title {
          color: #787878;
        }
      }
    }

    .thing-counts {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 235px;
      flex: 0 0 235px;
      margin-left: 20px;
      min-width: 300px;
    }

    .pointer {
      cursor: pointer;
    }

    .count-item {
      height: 64px;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      cursor: pointer;
    }

    .count-img {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 32px;
      flex: 0 0 32px;
      margin-right: 24px;
      font-size: 0;

      img {
        width: 100%;
        display: block;
      }
    }

    .count-box {
      position: relative;
      border-bottom: 1px solid #cedce4;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      height: 100%;
    }

    .count-text-box {
      font-size: 0;

      .count-title {
        color: #152844;
        font-weight: 600;
        font-size: 16px;
        line-height: 18px;
        display: block;
        height: 18px;
      }
    }

    .count-num-box {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      color: #152844;
    }
  }

  .buy-btn {
    cursor: pointer;
    display: block;
    background: #4684e2;
    border-radius: 4px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    width: 110px;
    outline: none;
    border: none;
    margin-top: 18px;
  }

  .buy-btn img {
    width: 12px;
    margin-right: 2px;
    vertical-align: middle;
  }

  .buy-btn span {
    vertical-align: middle;
  }

  .buy-way {
    overflow: hidden;

    .title {
      font-weight: 600;
      font-size: 18px;
      height: 26px;
      line-height: 26px;
      color: #152844;
      margin-bottom: 12px;
    }
  }

  .thing-content-view {
    margin-top: 4px;
    padding-bottom: 50px;
    gap: 16px;
  }

  .main-content {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding-right: 16px;

    .text {
      color: #484848;
      font-size: 16px;
      line-height: 26px;
      padding-left: 12px;
      margin: 11px 0;
      white-space: pre-wrap;
    }
  }

  .main-tab {
    border-bottom: 1px solid #cedce4;
  }

  .order-view {
    position: relative;
    color: #6c6c6c;
    font-size: 14px;
    line-height: 40px;

    .title {
      margin-right: 8px;
    }

    .tab {
      margin-right: 20px;
      cursor: pointer;
      color: #5f77a6;
      font-size: 16px;
      cursor: pointer;
    }

    .tab-select {
      color: #152844;
      font-weight: 600;
    }

    .tab-underline {
      position: absolute;
      bottom: 0;
      left: 84px;
      width: 16px;
      height: 4px;
      background: #4684e2;
      -webkit-transition: left 0.3s;
      transition: left 0.3s;
    }
  }

  .recommend {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 235px;
    flex: 0 0 235px;

    min-width: 300px;

    .title {
      font-weight: 600;
      font-size: 18px;
      line-height: 26px;
      color: #152844;
      margin-bottom: 12px;
    }

    .things {
      border-top: 1px solid #cedce4;

      .thing-item {
        width: 100%;
        position: relative;
        flex: 1;
        margin-right: 20px;
        height: fit-content;
        overflow: hidden;
        margin-top: 26px;
        margin-bottom: 36px;
        cursor: pointer;
        box-shadow: 4px 4px 4px rgba(200, 200, 200, 0.3), -4px 4px 4px rgba(200, 200, 200, 0.3);

        .img-view {
          //text-align: center;
          position: relative;
          height: 220px;
          width: 100%;

          img {
            height: 220px;
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
            color: #0f1111;
            font-size: 20px;
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
    }
  }

  .flex-view {
    display: flex;
  }

  .thing-comment {
    .title {
      font-weight: 600;
      font-size: 14px;
      line-height: 22px;
      height: 22px;
      color: #152844;
      margin: 24px 0 12px;
    }

    .publish {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      .mine-img {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 40px;
        flex: 0 0 40px;
        margin-right: 12px;
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }

      .content-input {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        background: #f6f9fb;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        color: #484848;
        padding: 5px 12px;
        white-space: nowrap;
        outline: none;
        border: 0px;
      }

      .send-btn {
        margin-left: 10px;
        background: #4684e2;
        border-radius: 4px;
        -webkit-box-flex: 0;
        -ms-flex: 0 0 80px;
        flex: 0 0 80px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        height: 32px;
        line-height: 32px;
        outline: none;
        border: 0px;
        cursor: pointer;
      }
    }

    .tab-view {
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      font-size: 14px;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      margin: 24px 0;

      .count-text {
        color: #484848;
        float: left;
      }

      .tab-box {
        color: #5f77a6;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        .tab-select {
          color: #152844;
        }

        span {
          cursor: pointer;
        }
      }

      .line {
        width: 1px;
        height: 12px;
        margin: 0 12px;
        background: #cedce4;
      }
    }
  }

  .comments-list {
    .comment-item {
      .flex-item {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding-top: 16px;

        .avator {
          -webkit-box-flex: 0;
          -ms-flex: 0 0 40px;
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          margin-right: 12px;
          border-radius: 50%;
          cursor: pointer;
        }

        .person {
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
        }

        .name {
          color: #152844;
          font-weight: 600;
          font-size: 14px;
          line-height: 22px;
          height: 22px;
          cursor: pointer;
        }

        .time {
          color: #5f77a6;
          font-size: 12px;
          line-height: 16px;
          height: 16px;
          margin-top: 2px;
        }

        .float-right {
          color: #4684e2;
          font-size: 14px;
          float: right;

          span {
            margin-left: 19px;
            cursor: pointer;
          }

          .num {
            color: #152844;
            margin-left: 6px;
            cursor: auto;
          }
        }
      }
    }
  }

  .comment-content {
    margin-top: 8px;
    color: #484848;
    font-size: 14px;
    line-height: 22px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #cedce4;
    margin-left: 52px;
    overflow: hidden;
    word-break: break-word;
  }

  .infinite-loading-container {
    clear: both;
    text-align: center;
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
