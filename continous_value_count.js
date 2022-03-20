/**
 * 问题：获取一个数组中符合条件的元素的最大重复个数
 * 此算法利用了已有最大重复个数，从而可以从找到的第一个匹配元素后，跨段求值，尽量减少查找的次数
 */
const findRepeatForward = (
  startIndex,
  curForward = 1,
  options = {},
  forward = curForward
) => {
  const { maxIndex } = options;
  let lastIndex = startIndex + curForward;
  if (lastIndex > maxIndex) {
    // 如果最后的值已经超出数组最大范围
    // 则表示后续值不需要再判断
    return {
      forward,
      index: maxIndex + 1,
    };
  } else {
    // 从后往前查找索引
    const { findHandle } = options;
    let prevIndex = lastIndex;
    while (prevIndex > startIndex) {
      if (findHandle(values[prevIndex])) {
        prevIndex--;
      } else {
        break;
      }
    }
    if (prevIndex === startIndex) {
      // 全部匹配，继续往后查找，进一步更新forward值
      let index = lastIndex + 1;
      for (; index <= maxIndex; index++) {
        if (findHandle(values[index])) {
          forward++;
        } else {
          break;
        }
      }
      return {
        found: true,
        forward: forward + 1,
        index: index + 1,
      };
    } else if (prevIndex === lastIndex) {
      // 一个匹配都没有
      return {
        forward,
        index: lastIndex + 1,
      };
    } else {
      // 找到部分匹配，递归找到完全匹配或完全不匹配为止
      let equalCount = lastIndex - prevIndex;
      return findRepeatForward(
        lastIndex,
        forward - equalCount + 1,
        options,
        forward
      );
    }
  }
};
const getContinousValueCount = (values, findHandle) => {
  const maxIndex = values.length - 1;
  let i = 0;
  let forward;
  while (i <= maxIndex) {
    const curItem = values[i];
    if (findHandle(curItem)) {
      const result = findRepeatForward(i, forward, {
        maxIndex,
        values,
        findHandle,
      });
      i = result.index;
      forward = result.forward;
    } else {
      i++;
    }
  }
  return forward ?? 0;
};
export default getContinousValueCount;