import newGroup from '@test/newGroup';
import newTrack from '@test/newTrack';

describe('单个队列删除撤回测试', () => {
  const initial = [1, 2, 3, 4];
  const queue = newTrack(initial.concat());
  test('删除第3条数据', () => {
    queue.delete(2);
    const result = [1, 2, 4];
    expect(queue).toEqual(result);
  });
  test('撤回单条删除操作', () => {
    queue.undo();
    expect(queue).toEqual(initial);
  });
  test('删除多条数据', () => {
    queue.delete([1, 3]);
    const result = [1, 3];
    expect(queue).toEqual(result);
  });
  test('撤回多条删除操作', () => {
    queue.undo();
    expect(queue).toEqual(initial);
  });
});

describe('双队列删除撤回测试', () => {
  const initial = [[1, 2, 3, 4], ['A', 'B', 'C', 'D']];
  const queue = newGroup(initial.concat());
  const AQueue = queue[0];
  const BQueue = queue[1];
  test('删除A队列第3条数据', () => {
    AQueue.delete(2);
    const result = [1, 2, 4];
    expect(AQueue).toEqual(result);
  });
  test('删除B队列第3条数据', () => {
    BQueue.delete(2);
    const result = ['A', 'B', 'D'];
    expect(BQueue).toEqual(result);
  });
  test('撤回B队列删除', () => {
    queue.undo();
    const result = [[1, 2, 4], ['A', 'B', 'C', 'D']];
    expect(queue).toEqual(result);
  });
  test('撤回A队列删除', () => {
    queue.undo();
    expect(queue).toEqual(initial);
  });
  test('同时删除A队列第3条数据, B队列第2，4条数据', () => {
    AQueue.delete(2);
    BQueue.delete([1, 3]);
    const result = [[1, 2, 4], ['A', 'C']];
    expect(queue).toEqual(result);
  });
  test('撤回队列删除', () => {
    queue.undo();
    expect(queue).toEqual(initial);
  });
})