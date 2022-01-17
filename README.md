# Vue-BackTrack
这是一个帮助管理数组操作的 vue 插件，可以对过往操作进行回溯和恢复。
## Start
import BackTrack from './bin/index.js';
Vue.use(BackTrack);
```javascript
组件内调用
// 新建一个多数组管理对象
const trackGroup = this.$createGroup([...]);
// 新建一个可回溯数组
const track = this.$createTrack([...]);
```
# 多数组管理队列
可同时对多个数组进行管理，可按不同数组间操作顺序进行逐一回退。它是个数组，每个元素都是一个可回溯的数组。
## Method
|方法名|说明|参数|类型|
|:----:|:----:|:----:|:----:|
| undo | 撤回 | - | - |
| redo | 恢复 | - | - |
## Attributes
|参数|说明|类型|
|:----:|:----:|:----:|
|canUndo| 是否可以撤回|boolean|
|canRedo| 是否可以恢复|boolean|

# 可进行操作回溯的数组
利用该对象可以记录该数组进行过的操作，并对操作进行撤回和恢复。
```
注意1：该数组内的所有元素将被冻结，不可直接对其中元素进行任何操作，必须通过类提供的方法进行操作。
注意2：在一次宏任务中对数组进行的所有操作会作为一次操作被记录，撤回时也会同时撤回所有此次的操作，具体可以看 demo 中的拆分操作。
注意3：该对象是个数组，但请不要使用数组原生的方法，将不会被记录。
```
## Method
|方法名|说明|参数|类型|
|:----:|:----:|:----:|:----:|
|insert| 向原数组的第index位插入value，index为空时向数组尾部插入 |value, index|any, number|
| replace| 对原数组第index位的元素进行替换（数组中的元素都是不可变对象，想要修改数组中的元素请重新传入新对象） |value, index |any, number|
| delete | 删除原数组第index位的元素 | index |number|
| swap | 交换原数组第index1和index2位的元素 | index1, index2 |number,number|
| undo | 撤回 | - | - |
| redo | 恢复 | - | - |
## Attributes
|参数|说明|类型|
|:----:|:----:|:----:|
|data|操作的数组|array|
|canUndo| 是否可以撤回|boolean|
|canRedo| 是否可以恢复|boolean|


## Demo
yarn 
yarn start