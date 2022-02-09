import newGroup from '@test/newGroup';
import newTrack from '@test/newTrack';

describe('单个队列移动撤回测试', () => {
  const initial = [1, 2, 3, 4, 5, 6, 7, 8];
  const queue = newTrack(Array.from(initial));
  test('交换第2和第4位数据', () => {
    queue.swap(1, 3);
    const result = [1, 4, 3, 2, 5, 6, 7, 8];
    expect(queue).toEqual(result);
  });
  test('撤回交换操作', () => {
    queue.undo();
    expect(queue).toEqual(initial);
  });
  test("将第2位移动到第7位", () => {
    queue.insert(queue[1], 6);
    queue.delete(1);
    const result = [1, 3, 4, 5, 6, 7, 2, 8];
    expect(queue).toEqual(result);
  })
})