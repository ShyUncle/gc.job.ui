<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="执行器">
        <template slot-scope="scope">
          <span>{{scope.row.jobExecutorId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="调度时间">
        <template slot-scope="scope">
          <span>{{scope.row.triggerTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="调度结果">
        <template slot-scope="scope">
           <span>{{scope.row.triggerCode}}</span>
        </template>
      </el-table-column>

        <el-table-column align="center" label="执行时间">
        <template slot-scope="scope">
          <span>{{scope.row.handleTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="执行结果">
        <template slot-scope="scope">
           <span>{{scope.row.handleCode}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/jobLog'

export default {
  name: 'logList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        jobInfoId: 0,
        page: 1,
        size: 20
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const id = this.$route.params && this.$route.params.id
      this.listLoading = true
      this.listQuery.jobInfoId = id
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.listLoading = false
        this.total = response.data.data.count
      })
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
