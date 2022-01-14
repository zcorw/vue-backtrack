<template>
  <div id="app">
    <el-button-group>
      <el-button icon="el-icon-refresh-left" :disabled="!canUndo" @click="undo">撤回</el-button>
      <el-button icon="el-icon-refresh-right" :disabled="!canRedo" @click="redo">重做</el-button>
    </el-button-group>
    <div class="frame">
      <div class="row" v-for="(list, i) in track" :key="i">
        <CustomList :list="list" @insert="(index, value) => openInsert(index, value, i)" />
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="内容" label-width="120px">
          <el-input v-model="form.value" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="颜色" label-width="120px">
          <el-select v-model="form.color" placeholder="请选择字体颜色">
            <el-option label="红色" value="red"></el-option>
            <el-option label="绿色" value="green"></el-option>
            <el-option label="黑色" value="black"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insert">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomList from './List.vue';

export default {
  name: "App",
  components: {CustomList},
  data() {
    return {
      track: [],
      dialogFormVisible: false,
      form: {},
      insertOrUpdate: 'insert',
    };
  },
  computed: {
    canUndo() {
      return !!(this.track && this.track.canUndo);
    },
    canRedo() {
      return !!(this.track && this.track.canRedo);
    }
  },
  mounted() {
    // this.track = new TrackGroup([this.list1, this.list2]);
    this.track = this.$createGroup([[
        {
          value: '左一行',
          color: 'red',
        },
        {
          value: '左二行',
          color: 'green',
        },
        {
          value: '左三行',
          color: 'black',
        },
      ], [
        {
          value: '右一行',
          color: 'red',
        },
        {
          value: '右二行',
          color: 'green',
        },
        {
          value: '右三行',
          color: 'black',
        },
      ]]);
  },
  methods: {
    openInsert(index, value, listIndex) {
      this.insertOrUpdate = 'insert';
      if (typeof value !== 'number') {
        this.form = {...value};
        this.insertOrUpdate = 'update';
      } else {
        listIndex = value;
      }
      this.$set(this.form, 'index', index);
      this.$set(this.form, 'listIndex', listIndex);
      this.dialogFormVisible = true;
    },
    insert() {
      const {index, listIndex, ...value} = this.form;
      if (this.insertOrUpdate === 'insert') {
        this.track[listIndex].insert(value, index);
      } else {
        this.track[listIndex].replace(value, index);
      }
      this.dialogFormVisible = false;
      this.form = {};
    },
    undo() {
      this.track.undo();
    },
    redo() {
      this.track.redo();
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.frame {
  display: flex;
}
.row {
  flex: 1 1;
}
</style>
