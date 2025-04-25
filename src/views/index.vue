<template>
  <div class="wrap">
    <h1 class="main-tit">授权码管理系统</h1>
    <el-form  size="small" :inline="true">
      <el-form-item label="code">
        <el-input v-model="searchForm.code"/>
      </el-form-item>
      <el-form-item label="是否激活">
        <el-select v-model="searchForm.active" placeholder="请选择">
          <el-option label="激活" :value="true"/>
          <el-option label="失效" :value="false"/>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input placeholder="请输入手机号" v-model="searchForm.phone"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="code" label="激活码"/>
      <el-table-column prop="startDate" label="开始时间" width="120"/>
      <el-table-column prop="endDate" label="结束时间" width="120"/>
      <el-table-column prop="phone" label="手机号" width="120"/>
      <el-table-column prop="active" label="是否激活" width="100">
        <template slot-scope="scope">
          {{ scope.row.active ? '激活' : '失效' }}
        </template>
      </el-table-column>
      <el-table-column label="操作"  fixed="right" width="300">
        <template slot-scope="scope">
          <div style="display: flex">
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrap">
      <el-pagination
          :current-page="page"
          :page-size="10"
          @current-change="getPageList"
          background
          layout="prev, pager, next"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="code" prop="code">
          <el-input v-model="form.code"/>
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker
              v-model="form.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否激活" prop="active">
          <el-select v-model="form.active" placeholder="请选择">
            <el-option label="激活" :value="true"/>
            <el-option label="失效" :value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input placeholder="请输入手机号" v-model="form.phone"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import {createClient} from '@supabase/supabase-js'

const supabase = createClient('https://taqgurcocnamesqzuytt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcWd1cmNvY25hbWVzcXp1eXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDk1OTksImV4cCI6MjA2MTEyNTU5OX0.cXJqPeBFlQNKPTMHm7_eTcPB_27psHpPUOoh2Qfpw8A')
let formInit = {
  date: [],
  code: '',
  phone: '',
  active: false
}
export default {
  data() {
    return {
      title: '新建',
      page: 1,
      total: 0,
      tableData: [],
      dialogVisible: false,
      searchForm: {
        ...formInit
      },
      rules: {
        code: [
          {required: true, message: '请输入激活码', trigger: 'blur'},
        ],
        date: [
          {required: true, message: '请选择时间', trigger: 'blur'},
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
        ],
        active: [
          {required: true, message: '请选择是否激活', trigger: 'blur'},
        ],

      },
      form: {
        ...formInit
      },
      currentRow: null
    }
  },
  computed: {
    innerHeight() {
      return innerHeight - 300
    }
  },
  methods: {
    reset(){
      this.searchForm = {
        ...formInit
      }
      this.getPageList(1,10)
    },
    edit(row) {
      this.title = '编辑'
      this.currentRow = row
      this.dialogVisible = true
      this.form.date = [row.startDate, row.endDate]
      this.form.code = row.code
      this.form.active = row.active
      this.form.phone = row.phone
    },
    del(row) {
      this.$confirm('是否删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success({message: '操作成功!'});
        supabase.from('users').delete().eq('id', row.id).then(res => {
          this.getPageList(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async getPageList(page = 1, pageSize = 10, keyword='',active=null, phone='',) {
      console.log(keyword);
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      let query= supabase
          .from('users')
          .select('*', {count: 'exact'})  // 这里会返回总条数，方便计算总页数
          .order('created_at', {ascending: false})
          .range(from, to)
      if(keyword&&keyword.trim()!==''){
        query = query.ilike('code', `%${keyword}%`)
      }
      if(phone&&phone.trim()!==''){
     //   query = query.eq('phone', phone)
        query = query.ilike('phone', `%${phone}%`)
      }
      if (active !== null) {
        query = query.eq('active', active)
      }

      const { data, error, count } = await query
      if (error) {
        console.error('查询失败:', error)
        return { data: [], totalPages: 0 }
      }
      this.total = count
      this.tableData = data
      console.log(this.tableData);

    },
    add() {
      this.title = '新建'
      this.form = {
        ...formInit
      }
      this.dialogVisible = true
    },
    search() {
      this.getPageList(1, 10,this.searchForm.code, this.searchForm.active, this.searchForm.phone)
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        let data = {
          code: this.form.code,
          startDate: this.form.date[0],
          endDate: this.form.date[1],
          active: this.form.active,
          phone: this.form.phone
        }
        if (this.title === '新建') {
          supabase.from('users').insert([data]).then(res => {
            this.$message.success({message: '操作成功!'});
            this.dialogVisible = false
            this.getPageList(this.page)
          })
        } else {
          supabase.from('users').update(data).eq('id', this.currentRow.id).then(res => {
            this.dialogVisible = false
            this.$message.success({message: '操作成功!'});
            this.getPageList(this.page)
          })
        }
      })
    }
  },
  mounted() {
    this.getPageList()
  }
}

</script>
<style lang="stylus">
.wrap {
  padding: 24px;
}

.main-tit {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.page-wrap {
  margin-top: 10px;
  justify-content: end;
  display: flex;
}
</style>