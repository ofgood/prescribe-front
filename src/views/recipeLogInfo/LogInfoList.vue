<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input :maxLength="20" @pressEnter="$refs.table.refresh(true)" v-model="queryParam.userName" placeholder="请输入客户名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' } || {} ">
                <a-button icon="redo" @click="() => this.queryParam = {}">重置</a-button>
                <a-button icon="search" style="margin-left: 8px" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span class="main-color" slot="userName" slot-scope="text">
          {{ text }}
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { recipeLogInfoList } from '@/api/recipeLogInfo'

const columns = [
  {
    title: '用户名',
    dataIndex: 'userName',
    scopedSlots: { customRender: 'userName' }
  },
  {
    title: '操作内容',
    dataIndex: 'description'
  },
  {
    title: 'ip地址',
    dataIndex: 'ip'
  },
  {
    title: '时间',
    dataIndex: 'updateTime'
  }
]

export default {
  name: 'RecipeLogInfoList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      rowSelection: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return recipeLogInfoList(requestParameters)
          .then(res => {
            return res.data
          })
      }
    }
  }
}
</script>
