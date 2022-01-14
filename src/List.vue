<template>
  <ul>
    <li v-for="(item, index) in list" :key="item.value">
      <span :style="`color: ${item.color}`">{{ item.value }}</span>
      <el-button-group>
        <el-button
          icon="el-icon-top"
          title="上升"
          v-if="index !== 0"
          @click="swap(index, index - 1)"
        ></el-button>
        <el-button
          icon="el-icon-bottom"
          title="下降"
          v-if="index !== list.length - 1"
          @click="swap(index, index + 1)"
        ></el-button>
        <el-button
          icon="el-icon-plus"
          title="插入"
          @click="openInsert(index)"
        ></el-button>
        <el-button
          icon="el-icon-edit"
          title="编辑"
          @click="openInsert(index, item)"
        ></el-button>
        <el-button
          icon="el-icon-delete"
          title="删除"
          @click="remove(index)"
        ></el-button>
        <el-button
          icon="el-icon-scissors"
          title="拆分"
          @click="scissors(index)"
        ></el-button>
      </el-button-group>
    </li>
  </ul>
</template>

<script>
export default {
  name: "List",
  props: {
    list: Array
  },
  methods: {
    show(index) {
      return index !== 0;
    },
    swap(index1, index2) {
      this.list.swap(index1, index2);
    },
    remove(index) {
      this.list.delete(index);
    },
    scissors(index) {
      const value = this.list[index];
      const n = Math.floor(value.value.length / 2);
      const forard = value.value.slice(0, n);
      const after = value.value.slice(n);
      this.list.replace({
        color: value.color,
        value: forard,
      }, index);
      this.list.insert({
        color: value.color,
        value: after,
      }, index + 1);
    },
    openInsert(index, value) {
      this.$emit('insert', index, value);
    }
  }
}
</script>