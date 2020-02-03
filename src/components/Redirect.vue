<template>
    <div class="redirect">
        <SyncLoader/>
    </div>
</template>

<script>
import username from 'superhero-name-library'
import firedb from '../Firebase'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
export default {
    name:'Redirect',
    components:{
        SyncLoader
    },
    data(){
        return{
            id:null
        }
    },
    created(){
        var db = firedb.firestore()
        this.id=username.random()
        this.id=this.id.replace(/ /g,"-")
        db.collection('users').doc(this.id).get().then(doc=>{
            if(!doc.exists){
                this.$router.push({name:'Home',params:{id:this.id}})
            }else{
                this.$router.push({name:'Redirect'}).catch(err=>{})
            }
        })
    }
}
</script>

<style scoped>
.redirect{
    display:flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: #edf7fa;
}
</style>