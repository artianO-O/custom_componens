
<script setup>
import {ref,reactive} from 'vue'
import Danmu from './components/Danmu.jsx'
const list = reactive([
        {text:'1',img:'https://static-test.tapechat.net/dashboard/test/0139080727912ea20ca62f874ed7aa26.jpeg'},
        {text:'2'},
        {text:'3',img:'https://static-test.tapechat.net/dashboard/test/c0feb75436b9192d6d47b52be1b36a33.jpeg'},
        {text:'4',img:'https://static-test.tapechat.net/dashboard/test/51bb95e3b11bfdab462b859d205a0e51.jpg'},
        {text:'5',img:'https://static-test.tapechat.net/dashboard/test/51bb95e3b11bfdab462b859d205a0e51.jpg'},
        {text:'6',img:'https://static-test.tapechat.net/dashboard/test/51bb95e3b11bfdab462b859d205a0e51.jpg'},
        {text:'7',img:'https://static-test.tapechat.net/dashboard/test/51bb95e3b11bfdab462b859d205a0e51.jpg'},
        {text:'8',img:'https://static-test.tapechat.net/dashboard/test/51bb95e3b11bfdab462b859d205a0e51.jpg'},
        {text:'9',img:'https://static-test.tapechat.net/dashboard/test/51bb95e3b11bfdab462b859d205a0e51.jpg'},
        {text:'10',img:'https://static-test.tapechat.net/dashboard/test/51bb95e3b11bfdab462b859d205a0e51.jpg'},
        {text:'11',img:'https://static-test.tapechat.net/dashboard/test/51bb95e3b11bfdab462b859d205a0e51.jpg'},
      ])
const print = (msg) => {
  // console.log(msg)
}
const msg = ref('')
const danmu = ref(null)
const shoot = (text) => {
  const item = {text:text,img:'https://static-test.tapechat.net/dashboard/test/c0feb75436b9192d6d47b52be1b36a33.jpeg'}
  danmu.value.shootMsg(item)
  msg.value = ''
}
const toplist = ['20px','120px','220px','320px']
</script>

<template>
  <Danmu 
    ref="danmu" 
    :duration="5" 
    :interval="1" 
    :list="list" 
    v-slot="{item,shoot}"
    :toplist="toplist"
  >
    <div class="item" style="width:200px">
      <div>{{item.text}}{{print(shoot)}}</div>
      <img :src="item.img" alt="">
    </div>
  </Danmu>
  <input type="text" v-model="msg">
  <button @click="shoot(msg)">发射</button>
</template>

<style scoped>
.danmu {
    width: 800px;
    height: 400px;
    margin: auto;
    margin-top: 100px;
    background: #c6cf93;
    position: relative;
    overflow: hidden;
}
.item {
  width: 600px;
  height: 80px;
  background: red;
}
img {
  width: 30px;
  height: 30px;
}
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
