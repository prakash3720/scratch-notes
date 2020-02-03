<template>
    <div class="block">
        <h3>{{item.data().title}}</h3>
        <pre>{{item.data().content}}</pre>
    </div>
</template>

<script>
export default {
    name:'DataCard',
    props:['item'],
    data(){
        return{
        }
    }
}
</script>

<style scoped>
.block{
    height: 100%;
    overflow: hidden;
}
.block h3{
    padding-top: 5px;
    font-weight:550;
    padding-bottom: 20px;
    overflow: hidden;
    font-size: 1.15rem;
}
.block pre{
    overflow: hidden;
    font-size: 1.1rem;
}
</style>