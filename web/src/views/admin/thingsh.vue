<template >
    <div>
      <!--页面区域-->
      <div class="page-view">
        <div class="table-operations">
          <a-space>
            <a-button type="primary" @click="handleAdd">预览</a-button>
            <a-button @click="handleBatchDelete">批量删除</a-button>
            <a-input-search addon-before="名称" enter-button @search="onSearch" @change="onSearchChange" />
          </a-space>
          
        </div>
        <!--表格区域-->
        <a-table
            size="middle"
            rowKey="id"
            :loading="data.loading"
            :columns="columns"
            :data-source="data.dataList"
            :scroll="{ x: 'max-content' }"
            :row-selection="rowSelection"
            :pagination="{
            size: 'default',
            current: data.page,
            pageSize: data.pageSize,
            onChange: (current) => (data.page = current),
            showSizeChanger: false,
            showTotal: (total) => `共${total}条数据`,
          }"
        >
          <template #bodyCell="{ text, record, index, column }">
            <template v-if="column.key === 'operation'">
              <span>
                <a @click="handleUpdate(record)">上架</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定删除?" ok-text="是" cancel-text="否" @confirm="confirmDelete(record)">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </template>
          </template>
        </a-table>
      </div>
  
      <!--弹窗区域-->
      <div >
        <a-modal
            :visible="modal.visile"
            :forceRender="true"
            :wrapClassName="'my-modal-wrap'"
            destroyOnClose
            width="80%"
            ok-text="确认"
            @cancel="handleCancel"
            @ok="handleUpdate"
          >
            <div class="component-body">
          <component :is="dynamicComponent" :title="data.selectedRowKeys.join('')" />
        </div>
          <template #footer >
            <!-- <a-button key="back" @click="handleCancel">取消</a-button> -->
            <a-button key="submit" type="primary" :loading="submitting" @click="handleUpdate">上架</a-button>
          </template>
        </a-modal>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // 导入表单实例、消息提示、选择器属性、文件图标和接口方法
  import { FormInstance, message, SelectProps } from 'ant-design-vue';
  import { createApi, listApi, updateApi, deleteApi } from '/@/api/admin/thing';
  import {listApi as listClassificationApi} from '/@/api/admin/classification'
  import {listApi as listTagApi} from '/@/api/admin/tag'
  import {BASE_URL} from "/@/store/constants";
  import { FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';
  import detailinfo from '/@/views/index/detail.vue'
  const router = useRouter();
  // 创建表格列配置
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
    staus: '1',
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
      status: undefined,
      cover: undefined,
      coverUrl: undefined,
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
    listApi({
      keyword: data.keyword,
      staus: data.staus,
    })
        .then((res) => {
          data.loading = false;
          console.log(res);
          res.data.forEach((item: any, index: any) => {
            item.index = index + 1;
          });
          data.dataList = res.data;
          //console.log(JSON.stringify(res.data))
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

//弹窗
  const handleDetail = () => {
    console.log("选择的是："+typeof data.selectedRowKeys.join(''));
  if (data.selectedRowKeys.length <= 0) {
    console.log('hello');
    message.warn('请勾选预览项');
    return;
  }else if(data.selectedRowKeys.length > 1){
    message.warn('只能选择一项进行预览');
    return;
  }
  let textt = router.resolve({ name: 'detail', params: { id: data.selectedRowKeys.join('') } });
  window.open(textt.href, '_blank' ,'height=800px,width=600px');
};

const dynamicComponent = ref(null);


  //更新处理函数
  const handleUpdate = (record: any) => {
    console.log('update', record);
    const formData = new FormData();
    formData.append('status','0' );
    if (data.selectedRowKeys.join('')) {
      record.id = data.selectedRowKeys.join('');
    }
    updateApi({ id: record.id }, formData)
        .then((res) => {
          getDataList();
        })
        .catch((err) => {
          message.error(err.msg || '操作失败');
        });


  };
  console.log(modal.form);
  // 删除数据事件处理函数
  const confirmDelete = (record: any) => {
    console.log('delete', record);
    deleteApi({ ids: record.id })
        .then((res) => {
          getDataList();
        })
        .catch((err) => {
          message.error(err.msg || '操作失败');
        });
  };
  // 批量删除数据事件处理函数
  const handleBatchDelete = () => {
    console.log(data.selectedRowKeys);
    if (data.selectedRowKeys.length <= 0) {
      console.log('hello');
      message.warn('请勾选删除项');
      return;
    }
    deleteApi({ ids: data.selectedRowKeys.join(',') })
        .then((res) => {
          message.success('删除成功');
          data.selectedRowKeys = [];
          getDataList();
        })
        .catch((err) => {
          message.error(err.msg || '操作失败');
        });
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
          // if(modal.form.rawFile) {
          //   formData.append('raw', modal.form.rawFile)
          // }
          formData.append('description', modal.form.description || '')
          formData.append('price', modal.form.price || '')
          if (modal.form.repertory >= 0) {
            formData.append('repertory', modal.form.repertory)
          }
          if (modal.form.status) {
            formData.append('status', modal.form.status)
          }
          if (modal.editFlag) {
            console.log("数据"+formData)
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
  const handleAdd = () => {
  if (data.selectedRowKeys.length <= 0) {
    console.log('hello');
    message.warn('请勾选预览项');
    return;
  }else if(data.selectedRowKeys.length > 1){
    message.warn('只能选择一项进行预览');
    return;
  }
  resetModal();
  dynamicComponent.value = detailinfo;
  modal.visile = true;
  modal.editFlag = false;
  modal.title = '新增';
  // 重置
  for (const key in modal.form) {
    modal.form[key] = undefined;
  }
  modal.form.cover = undefined
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
  </script>
  
  <style scoped lang="less">

.component-body{
  overflow-y: auto;
  height: 600px;

}
  .page-view {
    min-height: 100%;
    background: #fff;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }
  
  .table-operations {
    margin-bottom: 16px;
    text-align: right;
  }
  
  .table-operations > button {
    margin-right: 8px;
  }
  

  
  </style>
  <!-- <style >
   .my-modal-wrap .ant-modal-body{
      overflow-y: auto;
      height: 800px;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.5715;
      padding: 24px;
  }
    </style> -->
  