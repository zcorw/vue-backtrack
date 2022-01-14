import newTrack from './newTrack';
import newGroup from './newGroup';

const BackTrack = {};
BackTrack.install = function(Vue, options) {
  Vue.prototype.$createGroup = function(dataList) {
    return newGroup(dataList).map((track) => {
      return Vue.observable(track);
    });
  }
}

export default BackTrack