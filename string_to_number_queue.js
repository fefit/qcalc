/**
 * 问题：一个数字字符串，是由一个升序正整数组成的数组顺序拼接而成，同时这个数组满足以下特性：
 * 1、首数和尾数的位数差应尽量最小，即优先使得元素尽量均匀分布
 * 2、在满足条件1的情况下，首数应尽量小，即在满足均匀分布的情况下尽量拆分成更多元素
 * 现在需要将这个数字字符串还原成数组，需要怎样计算？
 * 举例：
 * "1234567891011" => [1,2,3,4,5,6,7,8,9,10,11] => 最小值尽量小
 * "121131" => [1,2,11,31] => 前后元素差尽量小
 * "13579121131" => [1,3,5,7,9,12,1131]
 *
 */
export default (str) => {
  let total = str.length;
  let beginWithZero = false;
  if (str.charAt(0) === "0") {
    total--;
    str = str.slice(1);
    beginWithZero = true;
  }
  const result = (function calc(startLen = 1, startIndex = 0) {
    // 先求出首数
    let i = startIndex + startLen;
    let min = Number(str.slice(startIndex, i));
    let result = [min];
    let minLen = startLen;
    const half = Math.floor((total - startIndex) / 2);
    while (i < total) {
      // 如果首位为0，则表示这不是下一个数的开头
      // 而只能为上一个数的结尾或中间部分
      if (str.charAt(i) === "0") {
        // 前一个数和最小值都翻10倍
        const lastIndex = result.length - 1;
        min = result[lastIndex] = result[lastIndex] * 10;
        minLen++;
        i++;
        continue;
      }
      // 不为0的情况，则根据最小长度截取一段值
      // 如果值没有出现进位，则表示可以测试后面的数
      let endIndex = i + minLen;
      let cur = Number(str.slice(i, endIndex));
      // 大于，无需进位
      if (cur >= min) {
        result.push(cur);
        min = cur;
        i = endIndex;
        continue;
      }
      // 如果等长度值小于前值，则必须进一位
      // 进位后剩余的字符串当成子问题解决
      if (endIndex < total) {
        const nextResult = calc(minLen + 1, i);
        if (nextResult) {
          return result.concat(nextResult);
        }
      }
      // 如果初始长度小于半数值
      // 则还可以继续尝试
      if (startLen < half) {
        return calc(startLen + 1, startIndex);
      }
      // 否则直接返回，不符合要求
      return;
    }
    return result;
  })();
  if (result && beginWithZero) {
    result.unshift(0);
  }
  return result;
};
