# ts-axios

使用ts造axios的轮子

项目初始化基于`typescript-library-starter`
https://github.com/alexjoverm/typescript-library-starter

## 笔记

### url参数的处理

需要处理以下情况：

- 参数为数组
- 参数为对象
- 参数为Date类型
- 特殊字符支持
- 空值忽略
- 丢弃url上的哈希标记
- 保留url上已存在的参数



### 请求错误的情况

- 网络异常错误

- 网络超时

- 处理非200状态码

  正常请求一般是返回200-300（不包括300）之间的状态码，网络错误和超时status是0



#### ts类需要明确指定原型截图

https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-linke-error-array-and-map-may-no-loger-work

![image-20221105060959967](E:\code\study\ts-axios\assets\image-20221105060959967.png)


## 参考资料

[XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
