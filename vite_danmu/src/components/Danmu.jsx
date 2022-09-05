import { defineComponent,ref,toRefs,nextTick,getCurrentInstance,reactive,onMounted,onBeforeUnmount } from 'vue'
export default defineComponent({
    props: {
        list: Array,
        direction: {
            type: String,
            default: 'left'
        },
        // 发射的路程时间
        duration: {
            type: Number,
            default: 5
        },
        // 前后俩条发射的间隔时长
        interval: {
            type: Number,
            default: 5
        },
        // toplist的长度代表航道数量
        toplist: {
            type: Array,
            default: ['20px','40px','60px','80px']
        },
        // 同时发射条数
        shootnum: {
            type: Number,
            default: 1,
        },
        isRandom: {
            type: Boolean,
            default: false
        },
        timingfun: {
            type: String,
            default: 'linear'
        },
        // 弹幕同时存在Dom数量
        cachenum: {
            type: Number,
            default: 10
        }
    },
    setup(props,content) {
        const {duration,toplist,isRandom,direction,interval,timingfun,cachenum,shootnum} = toRefs(props)
        const directionEnum = ['left','right']
        direction.value = directionEnum.includes(direction.value) ? direction.value : directionEnum[0]
        const instance = getCurrentInstance();
        const { list } = toRefs(props)
        const cacheVnode = ref(null)
        const cacheIdx = ref(0)
        const nodeList = reactive([])
        let currenIdx = ref(0);
        const danmuList = list[currenIdx.value]
        const shootTimes = ref(0)

        const danmuContain = ref(null)

        const shootMsg = (item) => {
            list.value.splice(currenIdx.value,0,item)
        }
    
        onMounted(() => {
            const slotObj = {list:list.value,index:currenIdx.value,item:list.value[currenIdx.value]}
            const item = content.slots.default(slotObj)[0]  // 用户传入的子选项模版，可能需要更多的样式选项

            // 起点与终点
            const start = `${danmuContain.value.offsetWidth}px`
            const end = '-'+ (item.props.style.width || `${danmuContain.value.offsetWidth}px`)
    
            const initBullet = () => {
                const slotObj = {list:list.value,index:currenIdx.value,item:list.value[currenIdx.value],shoot:shootMsg}
                const newItem = content.slots.default(slotObj)[0]
                const oldStyle = newItem.props.style
                const len = toplist.value.length
                const currentTopIdx = isRandom.value ? (Math.floor(Math.random()*10) % len) : (shootTimes.value % len)
                // console.log('当前Top索引:',currentTopIdx)
                const currentHeight = toplist.value[currentTopIdx]
                // 装载属性
                const style = {
                    width: '200px',
                    position: 'absolute',
                    top: currentHeight,
                    [direction.value]: start,
                    'transition-property':'none'
                }
                // 保留用户的样式设定
                const newStyle = Object.assign({},style,oldStyle)
                const newProps = Object.assign({},newItem.props,{style:newStyle})
                newItem.props = newProps
                if(cacheVnode.value) {
                    nodeList[cacheIdx.value] = newItem
                    nodeList.splice(cacheIdx.value,1,newItem)
                    cacheIdx.value++
                } else {
                    nodeList.push(newItem)
                }
                return newItem
            }
    
            const shoot = (item) => {
                item.el.style['transition-property'] = 'left,right';
                item.el.style['transition-duration'] = `${duration.value}s`;
                item.el.style['transition-timing-function'] = timingfun.value;
                item.el.style[direction.value] = end;
            }
    
            // 页面中装载太多dom会导致页面卡顿，但是也不需要清理的太频繁。当nodelist长度大于50时进行清理
            const clear = () => {
                // nodeList.shift()
                if(cacheIdx.value == cachenum.value) {
                    cacheIdx.value = 0
                }
                
                cacheVnode.value = nodeList[cacheIdx.value]
            }

            // 调度弹幕发射
            const schedule = () => {
                // 发射前做清理
                if(nodeList.length >= cachenum.value) {
                    clear();
                }
                if(currenIdx.value == list.value.length) {
                    currenIdx.value = 0
                }
                if(shootTimes.value == 362880) {
                    shootTimes.value = 0
                }
                // console.log('当前索引:',currenIdx.value)
                const item = initBullet()
                setTimeout(() => {
                    shoot(item)
                },10)
                currenIdx.value++
                shootTimes.value++
            }

            for(let i = 0;i< shootnum.value;i++) {
                schedule();
            }
            
            const intervalId = setInterval(() => {
                for(let i = 0;i< shootnum.value;i++) {
                    schedule()
                }
            },interval.value * 1000)


            onBeforeUnmount(() => {
                clearInterval(intervalId)
                while(nodeList.length){
                    nodeList.pop()
                }
            })
        })
        
        // 生成弹幕
        return {
            shootMsg,
            danmuContain,
            nodeList,
            shootTimes
        }
    },
    render() {
        return <div ref="danmuContain" class="danmu">{this.nodeList}</div>
    }
})
