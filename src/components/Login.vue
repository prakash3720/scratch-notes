<template>
<div class="login">
	<label for="password">Password</label>
	<input type="password" v-model="pass">
	<p v-if="feedback">{{feedback}}</p>
	<button @click.prevent="login">Login</button>
</div>
</template>

<script>
import firedb from '../Firebase'
export default {
    name:'Login',
    data(){
        return{
            feedback:null,
            pass:null,
            id:this.$route.params.id,
            pval:null
        }
    },
    methods:{
        login(){
            if(this.pval==this.pass){
                this.feedback=null
                this.$router.push({name:'Home',params:{id:this.id,pass:1}})
            }else{
                 this.feedback="Wrong Password"
            }
        }
    },
    mounted(){
        var db = firedb.firestore();
        db.collection("users").doc(this.id).get().then(doc=>{
            this.pval=doc.data().password
		})
		.then(()=>{
			if(this.pval===null){
				this.$router.push({name:'Home',params:{id:this.id,pass:1}})
			}
		})
    }
}
</script>

<style scoped>
.login{
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
input{
	width: 280px;
	border-radius: 8px;
	border: 1px solid;
	border-color: #41b175;
	padding: 5px;
	outline: none;
}
label{
	font-size: 1.5em;
	color: #41b175;
	margin-bottom: 10px;
}
p{
    text-align: center;
    color: crimson;
	margin-top: 10px;
    font-size: 1.1em;
}
button{
	cursor: pointer;
	margin-top: 10px;
	padding: 5px;
	font-size: 1.1em;
	background-color: #41b175;
	border: none;
	color: #fff;
	border-radius: 8px;
	transition: all 0.15s ease;
	outline: none;
}
button:hover{
	box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
}
</style>