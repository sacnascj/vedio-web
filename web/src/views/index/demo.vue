<template>
  <div class="page">


    <div class="content">
      <div class="item">aaa</div>
      <div class="item">bbb</div>
      <div class="item">ccc</div>
      <div class="item">ddd</div>
      <div class="item">eee</div>
      <div class="item">ggg</div>
    </div>
  </div>

</template>

<script setup>

// 获取窗口信息
const getWindowInfo = () => {
  const windowInfo = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  console.log(windowInfo);
};

// 页面挂载后执行
onMounted(() => {
  window.addEventListener('resize', getWindowInfo); // 监听窗口大小变化
  getWindowInfo(); // 获取窗口信息
});




</script>

<style scoped lang="less">
.page {
  height: 200px;
}

.content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  //.item {
  //  background-color: #2a9a44;
  //  width: 100px;
  //  height: 100px;
  //}
}

@media screen and (min-width: 1px) {
  .page {
    width: calc(100vw - 10px);
    font-size: 16px;
    .item {
      background-color: #2a9a44;
      width: calc(100vw - 16px);
      height: 200px;
    }
  }
}

@media screen and (min-width: 400px) {
  .page {
    width: calc(100vw - 10px);
    font-size: 26px;
    .item {
      background-color: #2a9a44;
      width: 100px;
      height: 100px;
    }
  }
}


@media screen and (min-width: 600px) {
  .page {
    width: calc(100vw - 10px);
    font-size: 36px;
  }
}



</style>
