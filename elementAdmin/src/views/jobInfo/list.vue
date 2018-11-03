<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;"
                class="filter-item"
                :placeholder="$t('table.title')"
                v-model="listQuery.jobDesc">
      </el-input>
      <el-input style="width: 200px;"
                class="filter-item"
                placeholder="executorHandler"
                v-model="listQuery.executorHandler">
      </el-input>
      <!-- <el-select
          clearable
          style="width: 90px"
          class="filter-item"
          v-model="listQuery.importance"
          :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions"
                   :key="item"
                   :label="item"
                   :value="item">
        </el-option>
        </el-select>
        <el-select clearable
                   class="filter-item"
                   style="width: 130px"
                   v-model="listQuery.type"
                   :placeholder="$t('table.type')">
          <el-option v-for="item in  calendarTypeOptions"
                     :key="item.key"
                     :label="item.display_name+'('+item.key+')'"
                     :value="item.key">
          </el-option>
        </el-select>
        <el-select @change='handleFilter'
                   style="width: 140px"
                   class="filter-item"
                   v-model="listQuery.sort">
          <el-option v-for="item in sortOptions"
                     :key="item.key"
                     :label="item.label"
                     :value="item.key">
          </el-option>
        </el-select>
        -->
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 @click="handleCreate"
                 type="primary"
                 icon="el-icon-edit">{{$t('table.add')}}</el-button>

    </div>
    <el-table :data="list"
              v-loading.body="listLoading"
              border
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center"
                       label="jobkey">
        <template slot-scope="scope">
          <span>{{scope.row.id+'_'+scope.row.jobExecutorKey}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.jobDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="cron">
        <template slot-scope="scope">
          <span>{{scope.row.jobCron}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="负责人">
        <template slot-scope="scope">
          <span>{{scope.row.leader}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.jobStatus}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="日志">
        <template slot-scope="scope">
          <router-link :to="'/jobInfo/jobLog/'+scope.row.id">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit">日志</el-button>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="Actions"
                       align="center"
                       width="300"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="mini"
                     @click="handleTrigger(scope.row.id)">执行</el-button>
          <el-button type="primary"
                     v-if="scope.row.jobStatus=='Normal'||scope.row.jobStatus=='Paused'"
                     size="mini"
                     @click="handleStatus(scope.row)">{{scope.row.jobStatus=="Normal"?"暂停":scope.row.jobStatus=="Paused"?"启动":""}}</el-button>
          <el-button type="success"
                     size="mini"
                     @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger"
                     size="mini"
                     @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form :rules="rules"
               ref="dataForm"
               :model="temp"
               label-position="left"
               label-width="70px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="执行器"
                      prop="jobExecutorKey">
          <el-select class="filter-item"
                     @change='handlerLoad'
                     v-model="temp.jobExecutorKey"
                     placeholder="Please select">
            <el-option v-for="item in  executorOptions"
                       :key="item.key"
                       :label="item.description"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述"
                      prop="jobDesc">
          <el-input v-model="temp.jobDesc"></el-input>
        </el-form-item>
        <el-form-item label="Cron"
                      prop="jobCron">
          <el-input v-model="temp.jobCron"></el-input><a href="http://cron.qqe2.com/"
             target="_blank">参考</a>
        </el-form-item>
        <el-form-item label="JobHandler"
                      prop="executorHandler">
          <el-select class="filter-item"
                     v-model="temp.executorHandler"
                     placeholder="Please select">
            <el-option v-for="item in  handlerOptions"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行参数"
                      prop="executorHandler">
          <el-input v-model="temp.executorParam"></el-input>
        </el-form-item>
        <!--<el-form-item label="子任务key"
                      prop="childJobKey">
          <el-input v-model="temp.childJobKey"></el-input>
        </el-form-item>
        -->
        <el-form-item label="负责人"
                      prop="leader">
          <el-input v-model="temp.leader"></el-input>
        </el-form-item>
        <el-form-item label="报警邮件"
                      prop="alarmEmail">
          <el-input v-model="temp.alarmEmail"></el-input>
        </el-form-item>
        <el-form-item label="报警钉钉群"
                      prop="alarmDing">
          <el-input v-model="temp.alarmDing"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'"
                   type="primary"
                   @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else
                   type="primary"
                   @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics"
               :visible.sync="dialogPvVisible">
      <el-table :data="pvData"
                border
                fit
                highlight-current-row
                style="width: 100%">
        <el-table-column prop="key"
                         label="Channel"> </el-table-column>
        <el-table-column prop="pv"
                         label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  fetchJobList,
  createJob,
  deleteJob,
  triggerJob,
  updateJob,
  pauseJob,
  resumeJob
} from '@/api/jobInfo'
import {
  fetchOptions, fetchHandlerOptions
} from '@/api/jobexecutor'

const calendarTypeOptions = [{
  key: 'CN',
  display_name: 'China'
},
{
  key: 'US',
  display_name: 'USA'
},
{
  key: 'JP',
  display_name: 'Japan'
},
{
  key: 'EU',
  display_name: 'Eurozone'
}
]

export default {
  name: 'jobList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        jobExecutorId: 0,
        jobDesc: '',
        executorHandler: '',
        page: 1,
        size: 20
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{
        label: 'ID Ascending',
        key: '+id'
      }, {
        label: 'ID Descending',
        key: '-id'
      }],
      statusOptions: ['published', 'draft', 'deleted'],
      executorOptions: [],
      handlerOptions: [],
      showReviewer: false,
      temp: {
        id: undefined,
        jobExecutorKey: '',
        jobCron: '',
        jobDesc: '',
        leader: '',
        alarmEmail: '',
        alarmDing: '',
        childJobKey: '',
        executorParam: '',
        executorHandler: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        jobCron: [{
          required: true,
          message: '请填写jobCron',
          trigger: 'change'
        }],
        jobExecutorKey: [{
          required: true,
          message: '请选择任务执行器',
          trigger: 'change'
        }],
        jobDesc: [{
          required: true,
          message: '请填写任务描述',
          trigger: 'blur'
        }]
      },
      downloadLoading: false
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
    this.getJobExecutor()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchJobList(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.count
        this.listLoading = false
      })
    },
    getJobExecutor() {
      fetchOptions().then(response => {
        this.executorOptions = response.data.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        jobExecutorKey: '',
        jobCron: '',
        jobDesc: '',
        leader: '',
        alarmEmail: '',
        alarmDing: 'https://oapi.dingtalk.com/robot/send?access_token=699ec518d0188f1d336d3d5d017fd665371aec138497afd3bd6b70f8d5fd056c',
        childJobKey: '',
        executorParam: '',
        executorHandler: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createJob(this.temp).then(reponse => {
            this.temp.id = reponse.data.data
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateJob(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认关闭？').then(_ => {
        deleteJob(id).then(() => {
          for (const v of this.list) {
            if (v.id === id) {
              const index = this.list.indexOf(v)
              this.list.slice(index, index + 1)
              break
            }
          }
        })
      }).catch(_ => { })
    },
    handleStatus(row) {
      var msg = row.jobStatus === 'Normal' ? '确认暂停任务吗？' : row.jobStatus === 'Paused' ? '确认启动任务吗？' : ''
      this.$confirm(msg).then(_ => {
        if (row.jobStatus === 'Normal') {
          pauseJob(row.id).then(() => {
            row.jobStatus = 'Paused'
          })
        } else if (row.jobStatus === 'Paused') {
          resumeJob(row.id).then(() => {
            row.jobStatus = 'Normal'
          })
        }
      }).catch(_ => { })
    },
    handleTrigger(id) {
      this.$confirm('确认执行').then(_ => {
        triggerJob(id).then(() => {
          this.$notify({
            title: '成功',
            message: '执行成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handlerLoad() {
      fetchHandlerOptions(this.temp.jobExecutorKey).then(response => {
        this.handlerOptions = response.data.data
      })
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
