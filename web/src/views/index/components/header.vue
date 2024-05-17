<template>
  <div class="main-bar-view">
    <div class="logo">
      <img :src="logoImage" class="search-icon" @click="$router.push({name:'portal'})">
    </div>
    <div class="search-entry">
      <img :src="SearchIcon" class="search-icon">
      <input placeholder="输入关键词" ref="keywordRef" @keyup.enter="search"/>
    </div>
    <div class="right-view">
      <a id="admin" href="/admin" type="a-link" style="line-height: 32px;width:60px;">后台入口</a>
      <template v-if="userStore.user_token">
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <img :src="AvatarIcon" class="self-img">
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="goUserCenter('collectThingView')">我的收藏</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="goUserCenter('wishThingView')">我的喜欢</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="goUserCenter('userInfoEditView')">账号设置</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAdd">用户上传</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="quit()">退出</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <!--        <div class="right-icon">-->
        <!--          <img src="@/assets/cart-icon.svg">-->
        <!--          <span>3</span>-->
        <!--        </div>-->
      </template>
      <template v-else>
        <button class="login btn hidden-sm" @click="goLogin()">登录</button>
      </template>

      <div class="right-icon" @click="msgVisible=true">
        <img :src="MessageIcon">
        <span class="msg-point" style=""></span>
      </div>
      <div>
        <a-drawer
            title="我的消息"
            placement="right"
            :closable="true"
            :maskClosable="true"
            :visible="msgVisible"
            @close="onClose"
        >
          <a-spin :spinning="loading" style="min-height: 200px;">
            <div class="list-content">
              <div class="notification-view">
                <div class="list">
                  <div class="notification-item flex-view" v-for="item in msgData">
                    <!---->
                    <div class="content-box">
                      <div class="header">
                        <span class="title-txt">{{ item.title }}</span>
                        <br/>
                        <span class="time">{{ item.create_time }}</span>
                      </div>
                      <div class="head-text">
                      </div>
                      <div class="content">
                        <p>{{ item.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-spin>
        </a-drawer>
      </div>
    </div>
    <!--弹窗区域-->
    <div>
      <a-modal
          :visible="modal.visile"
          :forceRender="true"
          :title="modal.title"
          width="880px"
          ok-text="确认"
          cancel-text="取消"
          @cancel="handleCancel"
          @ok="handleOk"
      >
        <template #footer>
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" :loading="submitting" @click="handleOk">确认</a-button>
        </template>
        <div style="padding-right: 16px; max-height:480px; overflow-x: hidden;overflow-y: auto;">
          <a-form ref="myform" :label-col="{ style: { width: '80px' } }" :model="modal.form" :rules="modal.rules">
            <a-row :gutter="24">
              <a-col span="24">
                <a-form-item label="视频名称" name="title">
                  <a-input placeholder="请输入" v-model:value="modal.form.title"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="12">
                <a-form-item label="分类" name="classification">
                  <a-select placeholder="请选择"
                            allowClear
                            :options="modal.cData"
                            :field-names="{ label: 'title', value: 'id',}"
                            v-model:value="modal.form.classification">
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="12">
                <a-form-item label="标签">
                  <a-select mode="multiple" placeholder="请选择" allowClear v-model:value="modal.form.tag">
                    <template v-for="item in modal.tagData">
                      <a-select-option :value="item.id">{{item.title}}</a-select-option>
                    </template>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="24">
                <a-form-item label="封面">
                  <a-upload-dragger
                      name="file"
                      accept="image/*"
                      :multiple="false"
                      :before-upload="beforeUpload"
                      v-model:file-list="fileList"
                  >
                    <p class="ant-upload-drag-icon">
                      <template v-if="modal.form.coverUrl">
                        <img :src="modal.form.coverUrl"  style="width: 60px;height: 80px;"/>
                      </template>
                      <template v-else>
                        <file-image-outlined />
                      </template>
                    </p>
                    <p class="ant-upload-text">
                      请选择要上传的封面图片
                    </p>
                  </a-upload-dragger>
                </a-form-item>
              </a-col>
              <a-col span="24">
                <a-form-item label="视频文件">
                  <a-upload-dragger
                      name="file"
                      accept=".mp4"
                      :multiple="false"
                      :before-upload="beforeUpload1"
                      v-model:file-list="fileList1"
                  >
                    <p class="ant-upload-drag-icon">
                      <video-camera-outlined />
                    </p>
                    <p class="ant-upload-text">
                      请选择要上传的文件（mp4格式）
                    </p>
                  </a-upload-dragger>
                </a-form-item>
              </a-col>
              <a-col span="24">
                <a-form-item label="内容简介">
                  <a-textarea placeholder="请输入" v-model:value="modal.form.description"></a-textarea>
                </a-form-item>
              </a-col>
              <!-- <a-col span="12">
                <a-form-item label="状态" name="status">
                  <a-select placeholder="待审核" :disabled=true allowClear v-model:value="modal.form.status">
                    <a-select-option key="0" value="0">上架</a-select-option>
                    <a-select-option key="1" value="1">下架</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
            </a-row>
          </a-form>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入通知列表的 API 方法和用户存储库
import { listApi } from '/@/api/index/notice';
import { useUserStore } from "/@/store";
import { FormInstance, message, SelectProps } from 'ant-design-vue';
import { createApi, listApi as listtingapi, updateApi, deleteApi } from '/@/api/admin/thing';
import {listApi as listClassificationApi} from '/@/api/admin/classification'
import {listApi as listTagApi} from '/@/api/admin/tag'
import {BASE_URL} from "/@/store/constants";
import { FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';
// 导入图片资源和路由相关方法
import logoImage from '/@/assets/images/k-logo.png';
import SearchIcon from '/@/assets/images/search-icon.svg';
import AvatarIcon from '/@/assets/images/avatar.jpg';
import MessageIcon from '/@/assets/images/message-icon.svg';

// 创建路由实例和用户存储库实例
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
console.log(userStore.user_name);

// 创建搜索关键字的引用和加载状态、消息弹窗可见性、消息数据的响应式变量
const keywordRef = ref();
let loading = ref(false);
let msgVisible = ref(false);
let msgData = ref([] as any);
const columns = reactive([

  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60
  },
  {
    title: '名称',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text, record, index, column }) => text === '0' ? '上架' : '下架'
  },
  {
    title: '简介',
    dataIndex: 'description',
    key: 'description',
    customRender: ({ text, record, index, column }) => text ? text.substring(0, 40) + '...' : '--',
    width: 600,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'operation',
    align: 'center',
    fixed: 'right',
    width: 140,
  },
]);
// 封面文件上传前处理函数
const beforeUpload = (file: File) => {
  // 改封面文件名
  const fileName = new Date().getTime().toString() + '.' + file.type.substring(6);
  const copyFile = new File([file], fileName);
  console.log(copyFile);
  modal.form.imageFile = copyFile;
  return false;
};
// 视频文件上传前处理函数
const beforeUpload1 = (file: File) => {
  // 改视频文件名
  const fileName = new Date().getTime().toString() + '.' + file.type.substring(6);
  const copyFile = new File([file], fileName);
  console.log(copyFile);
  modal.form.rawFile = copyFile;
  return false;
};
// 文件列表
const fileList = ref<any[]>([]);
const fileList1 = ref<any[]>([]);

const submitting = ref<boolean>(false);
// 页面数据
const data = reactive({
  dataList: [],
  loading: false,
  keyword: '',
  selectedRowKeys: [] as any[],
  pageSize: 10,
  page: 1,
});
// 弹窗数据源
const modal = reactive({
  visile: false,
  editFlag: false,
  title: '',
  cData: [],
  tagData: [{}],
  form: {
    id: undefined,
    title: undefined,
    classification: undefined,
    tag: [],
    repertory: undefined,
    price: undefined,
    status: "1",
    cover: undefined,
    coverUrl: undefined,
    recommend_count:userStore.user_name,
    imageFile: undefined,
    rawFile: undefined
  },
  rules: {
    title: [{ required: true, message: '请输入名称', trigger: 'change' }],
    classification: [{ required: true, message: '请选择分类', trigger: 'change' }],
    repertory: [{ required: true, message: '请输入库存', trigger: 'change' }],
    price: [{ required: true, message: '请输入定价', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  },
});


// 表单实例引用
const myform = ref<FormInstance>();
// 组件挂载时执行获取数据列表和数据初始化
onMounted(() => {
  getDataList();
  getCDataList();
  getTagDataList();
});
// 获取数据列表函数
const getDataList = () => {
  data.loading = true;
  listtingapi({
    keyword: data.keyword,
  })
      .then((res) => {
        data.loading = false;
        console.log(res);
        res.data.forEach((item: any, index: any) => {
          item.index = index + 1;
        });
        data.dataList = res.data;
      })
      .catch((err) => {
        data.loading = false;
        console.log(err);
      });
}
// 获取分类列表函数
const getCDataList = () => {
  listClassificationApi({}).then(res => {
    modal.cData = res.data
  })
}
// 获取标签列表函数
const getTagDataList = ()=> {
  listTagApi({}).then(res => {
    res.data.forEach((item, index) => {
      item.index = index + 1
    })
    modal.tagData = res.data
  })
}
// 搜索框输入变化事件处理函数
const onSearchChange = (e: Event) => {
  data.keyword = e?.target?.value;
  console.log(data.keyword);
};
//获取数据列表
const onSearch = () => {
  getDataList();
};
// 表格行选择配置
const rowSelection = ref({
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    data.selectedRowKeys = selectedRowKeys;
  },
});
// 新增数据事件处理函数
const handleAdd = () => {
  resetModal();
  modal.visile = true;
  modal.editFlag = false;
  modal.title = '新增';
  // 重置
  for (const key in modal.form) {
    modal.form[key] = undefined;
  }
  modal.form.cover = undefined
};

// 提交表单事件处理函数
const handleOk = () => {
  myform.value
      ?.validate()
      .then(() => {
        const formData = new FormData();
        if(modal.editFlag) {
          formData.append('id', modal.form.id)
        }
        formData.append('title', modal.form.title)
        if (modal.form.classification) {
          formData.append('classification', modal.form.classification)
        }
        if (modal.form.tag) {
          modal.form.tag.forEach(function (value) {
            if(value){
              formData.append('tag', value)
            }
          })
        }
        if (modal.form.imageFile) {
          formData.append('cover', modal.form.imageFile)
        }
        if(modal.form.rawFile) {
          formData.append('raw', modal.form.rawFile)
        }
        formData.append('recommend_count', userStore.user_name,)
        formData.append('description', modal.form.description || '')
        formData.append('price', modal.form.price || '')
        if (modal.form.repertory >= 0) {
          formData.append('repertory', modal.form.repertory)
        }
        // if (modal.form.status) {
        //   formData.append('status', modal.form.status)
        // }
        formData.append('status', "1")
        if (modal.editFlag) {
          submitting.value = true
          updateApi({
            id: modal.form.id
          },formData)
              .then((res) => {
                submitting.value = false
                hideModal();
                getDataList();
              })
              .catch((err) => {
                submitting.value = false
                console.log(err);
                message.error(err.msg || '操作失败');
              });
        } else {
          submitting.value = true
          createApi(formData)
              .then((res) => {
                submitting.value = false
                hideModal();
                getDataList();
              })
              .catch((err) => {
                submitting.value = false
                console.log(err);
                message.error(err.msg || '操作失败');
              });
        }
      })
      .catch((err) => {
        console.log('不能为空');
      });
};
// 取消事件处理函数
const handleCancel = () => {
  hideModal();
};

// 恢复表单初始状态
const resetModal = () => {
  myform.value?.resetFields();
  fileList.value = []
  fileList1.value = []
};

// 关闭弹窗
const hideModal = () => {
  modal.visile = false;
};



// 获取消息列表函数
const getMessageList = () => {
  loading.value = true;
  listApi({}).then(res => {
    msgData.value = res.data;
    loading.value = false;
  }).catch(err => {
    console.log(err);
    loading.value = false;
  });
};

// 搜索事件处理函数
const search = () => {
  const keyword = keywordRef.value.value;
  if (route.name === 'search') {
    router.push({ name: 'search', query: { keyword: keyword } });
  } else {
    let text = router.resolve({ name: 'search', query: { keyword: keyword } });
    window.open(text.href, '_blank');
  }
};

// 跳转到登录页面事件处理函数
const goLogin = () => {
  router.push({ name: 'login' });
};

// 跳转到用户中心事件处理函数
const goUserCenter = (menuName) => {
  router.push({ name: menuName });
};

// 退出登录事件处理函数
const quit = () => {
  userStore.logout().then(res => {
    router.push({ name: 'portal' });
  });
};

// 关闭消息弹窗事件处理函数
const onClose = () => {
  msgVisible.value = false;
};


</script>

<style scoped lang="less">
.main-bar-view {
  position: fixed;
  top: 0;
  left: 0;
  height: 56px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #cedce4;
  padding-left: 16px;
  z-index: 16;
  display: flex;
  flex-direction: row;
  //justify-content: center; /*水平居中*/
  align-items: center; /*垂直居中*/
}

.logo {
  margin-right: 24px;

  img {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
}

.search-entry {
  position: relative;
  width: 50%;
  max-width: 300px;
  min-width: 140px;
  height: 32px;
  background: #ecf3fc;
  padding: 0 12px;
  border-radius: 16px;
  font-size: 0;
  cursor: pointer;

  img {
    max-width: 100%;
    height: auto;
  }

  .search-icon {
    width: 18px;
    margin: 7px 8px 0 0;
  }

  input {
    position: absolute;
    top: 4px;
    width: 65%;
    height: 24px;
    border: 0px;
    outline: none;
    color: #000;
    background: #ecf3fc;
    font-size: 14px;
  }
}

.right-view {
  padding-right: 16px;
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: flex-end; /* 内容右对齐 */

  .username {
    height: 32px;
    line-height: 32px;
    text-align: center;
  }

  button {
    outline: none;
    border: none;
    cursor: pointer;
  }

  img {
    cursor: pointer;
  }

  .right-icon {
    position: relative;
    width: 24px;
    margin: 4px 0 0 4px;
    cursor: pointer;
    display: inline-block;
    font-size: 0;

    span {
      position: absolute;
      right: -15px;
      top: -3px;
      font-size: 12px;
      color: #fff;
      background: #4684e2;
      border-radius: 8px;
      padding: 0 4px;
      height: 16px;
      line-height: 16px;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }

    .msg-point {
      position: absolute;
      right: -4px;
      top: 0;
      min-width: 8px;
      width: 8px;
      height: 8px;
      background: #4684e2;
      border-radius: 50%;
    }
  }

  .self-img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    vertical-align: middle;
    cursor: pointer;
  }

  .btn {
    background: #4684e2;
    font-size: 14px;
    color: #fff;
    border-radius: 32px;
    text-align: center;
    width: 66px;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
    margin-left: 32px;
  }
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

.notification-item {
  padding-top: 16px;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .content-box {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    border-bottom: 1px dashed #e9e9e9;
    padding: 4px 0 16px;
  }

  .header {
    margin-bottom: 12px;
  }

  .title-txt {
    color: #315c9e;
    font-weight: 500;
    font-size: 14px;
  }

  .time {
    color: #a1adc5;
    font-size: 14px;
  }

  .head-text {
    color: #152844;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;

    .name {
      margin-right: 8px;
    }
  }

  .content {
    margin-top: 4px;
    color: #484848;
    font-size: 14px;
    line-height: 22px;
  }

}


@media screen and (min-width: 100px) and (max-width: 600px) {
  // 隐藏我的消息
  .right-view{
    .right-icon{
      display: none;
    }
  }

  // 隐藏后台入口
  #admin {
    display: none;
  }

}

</style>
