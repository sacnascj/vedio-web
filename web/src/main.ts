// 导入Vue的createApp函数
import { createApp } from 'vue';

// 导入根组件App.vue
import App from './App.vue';

// 导入路由实例
import router from './router';

// 导入Pinia状态管理实例
import piniaStore from './store';

// 导入应用初始化函数
import bootstrap from './core/bootstrap';

// 导入Ant Design Vue组件库样式文件
import '/@/styles/reset.less';
import '/@/styles/index.less';

// 导入Ant Design Vue组件库
import Antd from 'ant-design-vue';

// 创建Vue应用实例
const app = createApp(App);

// 使用Ant Design Vue组件库
app.use(Antd);

// 使用路由
app.use(router);

// 使用Pinia状态管理
app.use(piniaStore);

// 使用应用初始化函数
app.use(bootstrap);

// 挂载应用到DOM节点
app.mount('#app');
