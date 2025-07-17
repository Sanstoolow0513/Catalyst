# SERVICE 概述

## 方法归一化的问题

重写一个service大类
还是细化每一个子方法。

## 方法对于ADDPDATA缓冲区的约束去和问题

appdata访问同一使用包名+定向的base64编码，然后回到程序的执行
- 如何**在程序环境和用户环境中做区分**

## 空白路径和指定文件路径和单向暴露接口的问题

修改成统一的文件名称暴露给程序接口：
- userConfig直接给出
- userConfigBase为文件所在的文件夹__dirname
- userConfig访问方法用唯一指定机器码加密生成
- userconfig使用yaml，