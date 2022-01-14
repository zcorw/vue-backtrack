const COMMAND = {
  insert: 'insert',
  replace: 'replace',
  delete: 'delete',
  swap: 'swap',
}

function insert(index, value, arr) {
  arr.splice(index, 0, value);
}

function replace(index, value, arr) {
  arr.splice(index, 1, value);
}

function del(index, arr) {
  arr.splice(index, 1);
}

function swap(index1, index2, arr) {
  const val1 = arr[index1];
  const val2 = arr[index2];
  arr.splice(index1, 1, val2);
  arr.splice(index2, 1, val1);
}
export const Methods = {
  newCommand (track) {
    this._singletracks.push(track);
    Promise.resolve().then(() => {
      if (this._singletracks.length === 0) {
        return;
      }
      this.track.splice(0, this.trackIndex);
      this.track.unshift(this._singletracks);
      this.trackIndex = 0;
      this._singletracks = [];
    });
  },
  clearCommand() {
    this.track = [];
    this.trackIndex = 0;
  },
  // 向原数组的第index位插入value，index为空时向数组尾部插入
  insert(value, index) {
    if (index === undefined) {
      index = this.length;
    }
    Object.freeze(value);
    insert(index, value, this);
    this.newCommand({
      type: COMMAND.insert,
      index,
      value,
    })
    return this;
  },
  // 对原数组第index位的元素进行替换（数组中的元素都是不可变对象，想要修改数组中的元素请重新传入新对象）
  replace(value, index) {
    if (typeof index !== 'number') {
      throw new TypeError('index is not a number');
    }
    Object.freeze(value);
    const original = this[index];
    replace(index, value, this);
    this.newCommand({
      type: COMMAND.replace,
      index,
      original,
      value,
    });
    return this;
  },
  // 删除原数组第index位的元素
  delete(index) {
    if (typeof index !== 'number') {
      throw new TypeError('index is not a number');
    }
    const original = this[index];
    del(index, this);
    this.newCommand({
      type: COMMAND.delete,
      index,
      original,
    });
    return this;
  },
  // 交换原数组第index1和index2位的元素
  swap(index1, index2) {
    console.log('swap')
    if (typeof index1 !== 'number') {
      throw new TypeError('index1 is not a number');
    }
    if (typeof index2 !== 'number') {
      throw new TypeError('index2 is not a number');
    }
    swap(index1, index2, this);
    this.newCommand({
      type: COMMAND.swap,
      index: [index1, index2],
    });
    return this;
  },
  // 撤回
  undo() {
    if (this.trackIndex === this.track.length) {
      return this;
    }
    const tracks = this.track[this.trackIndex];
    tracks.forEach((track) => {
      const index = track.index;
      switch (track.type) {
        case COMMAND.insert:
          del(index, this);
          break;
        case COMMAND.replace:
          replace(index, track.original, this);
          break;
        case COMMAND.delete:
          insert(index, track.original, this);
          break;
        case COMMAND.swap:
          swap(index[0], index[1], this);
          break;
        default:
          throw new Error('invalid instruction');
      }
    });
    this.trackIndex++;
    return this;
  },
  // 恢复
  redo() {
    if (this.trackIndex === 0) {
      return this;
    }
    const tracks = this.track[this.trackIndex - 1];
    tracks.forEach((track) => {
      const index = track.index;
      switch (track.type) {
        case COMMAND.insert:
          insert(index, track.value, this);
          break;
        case COMMAND.replace:
          replace(index, track.value, this);
          break;
        case COMMAND.delete:
          del(index, this);
          break;
        case COMMAND.swap:
          swap(index[0], index[1], this);
          break;
        default:
          throw new Error('invalid instruction');
      }
    });
    this.trackIndex--;
    return this;
  }
};

export const Data = {
  track: () => [],
  trackIndex: () => 0,
  _singletracks: () => [],
}

export const Computed = {
  canUndo() {
    return this.trackIndex < this.track.length;
  },
  canRedo() {
    return this.trackIndex > 0;
  }
}

export default function newTrack(list) {
  const track = list;
  track.forEach((item) => {
    Object.freeze(item);
  });
  for (let key in Methods) {
    Object.defineProperty(track, key, {
      value: Methods[key].bind(track),
      writable: true,
      configurable: false,
      enumerable: false,
    });
  }
  for (let key in Data) {
    Object.defineProperty(track, key, {
      value: Data[key](),
      writable: true,
      configurable: false,
      enumerable: false,
    });
  }
  for (let key in Computed) {
    Object.defineProperty(track, key, {
      get: Computed[key],
      configurable: false,
      enumerable: false,
    })
  }
  return track;
}