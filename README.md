# easypage
Make webapp easy.
#
Use it, you can easily create a page system.
#

# 对于效率的优化
#
1. 使用css3属性（-webkit-transform）来实现动画效果，而非传统的css样式
#
2. -webkit-transition-property中用-webkit-transform代替all
#
3. 使用js来直接修改动画样式，如此比修改动画样式类来改变样式更有效率
#
4. -webkit-transform:transition3d(0,0,0)，开启GPU硬件加速模式
#
5. 上一版本中是只有一个page有动画效果，所以整体切换很流畅，但动画单一，所以修改为进出都有效果，增加了至少一倍的消耗成本，但同时也去掉了上一版本中width和z-index的变化，一定程度上减少了重渲染的成本，减少卡顿
#
6. test中因只是简单的demo，page内元素不多，动画就只有page，环境单一。但实际使用中尽量避免同时多个动画，关键帧动画不用时，可以暂停掉（-webkit-animation-play-state），以免影响切换的流畅
#
7. 动画并没有使用到animation，因为js不能很方便地直接对它的属性进行控制，测试过修改动画样式类来改变animation，同环境下会不时出现明显的卡顿，效率相对比较低
#

# v1.2
改变图片加载判断的时间点，所需图片加载完成后再进行动画，这样更符合逻辑。
#
同时，把前面都忽略的背景图片加载算进去了。
#
增加了一个动画结束后的api。
#
