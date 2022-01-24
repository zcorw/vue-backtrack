import newTrack from './newTrack';
export const Data = {
  _singletracks: () => [],
  trackIndex: () => 0,
  track: () => [],
  trackCallback: () => null,
};

export const Methods = {
  newCommand(index) {
    if (!this._singletracks.includes(index)) {
      this._singletracks.unshift(index);
    }
    Promise.resolve().then(() => {
      if (this._singletracks.length === 0) {
        return;
      }
      this.track.splice(0, this.trackIndex);
      this.track.unshift(this._singletracks);
      this.trackCallback && this.trackCallback(this._singletracks);
      this.trackIndex = 0;
      this._singletracks = [];
    });
  },
  clearCommand() {
    this.track = [];
    this.trackIndex = 0;
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
  bind,
  onTrack(callback) {
    return (...args) => callback(...args);
  }
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

function bind(track, i) {
  this.splice(i, 1, track);
  methodsToPatch.forEach((method) => {
    const func = track[method];
    track[method] = (...args) => {
      this.newCommand(i);
      return func.apply(track, args);
    }
  });
}

export default function newGroup(list) {
  const track = [];
  
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
  list.forEach((item, i) => {
    track.bind(newTrack(item), i);
  })
  return track;
}