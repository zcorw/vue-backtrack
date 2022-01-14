import newTrack from './newTrack';
export const Data = {
  _singletracks: () => [],
  trackIndex: () => 0,
  track: () => [],
};

export const Methods = {
  newCommand(index) {
    if (!this._singletracks.includes(index)) {
      this._singletracks.push(index);
    }
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
  // 撤回
  undo() {
    if (this.trackIndex === this.track.length) {
      return;
    }
    const tracks = this.track[this.trackIndex];
    tracks.forEach((index) => {
      this[index].undo();
    });
    this.trackIndex++;
  },
  // 恢复
  redo() {
    if (this.trackIndex === 0) {
      return;
    }
    const tracks = this.track[this.trackIndex - 1];
    tracks.forEach((index) => {
      this[index].redo();
    });
    this.trackIndex--;
  },
  createTrack,
}

export const Computed = {
  canUndo() {
    return this.trackIndex < this.track.length;
  },
  canRedo() {
    return this.trackIndex > 0;
  }
}

const methodsToPatch = ['insert', 'replace', 'delete', 'swap'];

function createTrack(item, i) {
  const track = new newTrack(item);
  methodsToPatch.forEach((method) => {
    const func = track[method];
    track[method] = (...args) => {
      this.newCommand(i);
      return func.apply(track, args);
    }
  });
}

export default function newGroup(list) {
  const track = list;
  list.forEach(createTrack.bind(track));
  
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