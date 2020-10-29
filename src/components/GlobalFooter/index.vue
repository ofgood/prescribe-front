<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <span>admin</span> |
      <span>admin</span> |
      <span>admin</span> |
    </template>
    <template v-slot:copyright>
      <span>vueComponent</span>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
