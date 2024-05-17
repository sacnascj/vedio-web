/**
 * @name  AutoRegistryComponents
 * @description 按需加载，自动引入组件 
 */
// 注释是为了方便复制到项目中使用，实际使用时请删除注释
//
import Components from 'unplugin-vue-components/vite';
import {
  ElementPlusResolver,
  VueUseComponentsResolver,
  AntDesignVueResolver,
  TDesignResolver,
  NaiveUiResolver,
} from 'unplugin-vue-components/resolvers';
export const AutoRegistryComponents = () => {
  return Components({
    dirs: ['src/components'],
    extensions: ['vue'],
    deep: true,
    dts: 'types/components.d.ts',
    directoryAsNamespace: false,
    globalNamespaces: [],
    directives: true,
    importPathTransform: (v) => v,
    allowOverrides: false,
    include: [/\.vue$/, /\.vue\?vue/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    resolvers: [
      ElementPlusResolver(),
      VueUseComponentsResolver(),
      AntDesignVueResolver(),
      TDesignResolver({
        library: 'vue-next',
      }),
      NaiveUiResolver(),
    ],
  });
};
