import newTrack from './newTrack';
import newGroup from './newGroup';

const BackTrack = {};
BackTrack.install = function(Vue, options) {
  Vue.prototype.$createGroup = function(dataList) {
    const group = Vue.observable(newGroup(dataList));
    group.onTrack(() => {
      group.dep.notify();
    });
    return group;
  };
  Vue.prototype.$createTrack = function(list) {
    const track = Vue.observable(newTrack(list));
    return track;
  }
}

export default BackTrack