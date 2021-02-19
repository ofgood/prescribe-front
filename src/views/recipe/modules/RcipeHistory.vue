<template>
  <a-drawer
    :title="model && model.id > 0 ? '编辑处方模板': '新建处方模板'"
    width="80%"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @close="() => { $emit('cancel') }"
  >
  </a-drawer>
</template>
