<template>
  <div class="home">
    <img src="../../static/lock.png" alt="logo" width="40" id="lock" @click.prevent="lock">
    <img src="../assets/logo.png" alt="logo" width="85">
    <div class="form" data-aos="fade" data-aos-duration="1000">
      <input type="text" name="Title" placeholder="Title" autocomplete="off" v-model="title">
      <textarea name="content" rows="7" placeholder="Take a Note..." v-model="content"></textarea>
      <p v-if="addFeed">{{addFeed}}</p>
      <PulseLoader :size="size" id="spins"/>
      <button @click.prevent="add">+</button>
    </div>
    <div class="cards" data-aos="fade" data-aos-duration="1000" v-if="arr.length">
      <div class="card" v-for="(item,index) in arr" :key="index" @click.prevent="edit(item.id)">
        <DataCard :item="item"/>
      </div>
    </div>
    <div id="modal" class="modal">
      <div class="overlay">
        <span @click.prevent="modaltoggle">X</span>
        <input type="text" name="Title" placeholder="Title" autocomplete="off" v-model="modaltitle">
        <textarea name="content" rows="12" placeholder="Take a Note..." v-model="modalcontent"></textarea>
        <PulseLoader :size="size" id="modalspins"/>
        <div>
          <button id="modalbutton" @click.prevent="update">Update</button>
          <button id="modalbutton2" @click.prevent="del">Delete</button>
          <button id="modalbutton3" @click.prevent="share">Share</button>
        </div>
      </div>
    </div>
    <div class="modal" id="sharemodal">
      <div class="overlay">
        <span @click.prevent="sharemodaltoggle">X</span>
        <input type="text" name="Share ID" placeholder="Sharing ID" autocomplete="off" v-model="shareid">
        <p v-if="shareFeed">{{shareFeed}}</p>
        <PulseLoader :size="size" id="sharespins"/>
        <div>
          <button id="modalbutton4" @click.prevent="shareit">Share</button>
        </div>
      </div>
    </div>
    <div class="modal" id="lockmodal">
      <div class="overlay">
        <span @click.prevent="lockmodaltoggle">X</span>
        <input type="password" name="Password" placeholder="Password" autocomplete="off" v-model="pass">
        <p v-if="passFeed">{{passFeed}}</p>
        <PulseLoader :size="size" id="passpins"/>
        <div id="sharediv">
          <button id="modalbutton5" @click.prevent="setpass">Set</button>
          <button id="modalbutton6" @click.prevent="rempass">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AOS from 'aos';
import firedb from '../Firebase'
import 'aos/dist/aos.css'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import DataCard from './DataCard'
export default {
  name: 'Home',
  components:{
    PulseLoader,DataCard
  },
  data () {
    return {
      id:this.$route.params.id,
      size:'0.7rem',
      title:null,
      content:null,
      addFeed:null,
      arr:[],
      actionid:null,
      modaltitle:null,
      modalcontent:null,
      shareid:null,
      shareFeed:null,
      pass:null,
      passFeed:null
    }
  },
  methods:{
    add(){
      if(this.title && this.content){
        document.getElementById("spins").classList.remove("hide")
        this.addFeed=null
        var db = firedb.firestore()
        db.collection("users").doc(this.id).get().then(doc=>{
          if(!doc.exists){
            db.collection("users").doc(this.id).set({password:null})
            .then(()=>{
              db.collection("users").doc(this.id).collection("notes").doc().set({
                title:this.title,
                content:this.content
              })
              .then(()=>{
                this.title=null
                this.content=null
                document.getElementById("spins").classList.add("hide")
              })
            })
          }else{
            db.collection("users").doc(this.id).collection("notes").doc().set({
              title:this.title,
              content:this.content
            })
            .then(()=>{
              this.title=null
              this.content=null
              document.getElementById("spins").classList.add("hide")
            })
          }
        })
      }else{
        this.addFeed="Enter all the fields!"
      }
    },
    edit(docid){
      this.actionid=docid
      var db = firedb.firestore()
      document.getElementById("modalspins").classList.toggle("hide")
      document.getElementById("modalbutton").classList.toggle("hide")
      document.getElementById("modalbutton2").classList.toggle("hide")
      document.getElementById("modalbutton3").classList.toggle("hide")
      document.getElementById("modal").classList.toggle("hide")
      db.collection("users").doc(this.id).collection("notes").doc(this.actionid).get().then(doc=>{
        this.modaltitle=doc.data().title
        this.modalcontent=doc.data().content
        document.getElementById("modalspins").classList.toggle("hide")
        document.getElementById("modalbutton").classList.toggle("hide")
        document.getElementById("modalbutton2").classList.toggle("hide")
        document.getElementById("modalbutton3").classList.toggle("hide")
      })
    },
    share(){
      document.getElementById("modal").classList.add("hide")
      document.getElementById("sharespins").classList.add("hide")
      document.getElementById("sharemodal").classList.toggle("hide")
    },
    shareit(){
      if(this.shareid){
        document.getElementById("sharespins").classList.toggle("hide")
        this.shareFeed=null
        var db = firedb.firestore()
        db.collection("users").doc(this.shareid).get().then(doc=>{
          if(!doc.exists){
            document.getElementById("sharespins").classList.toggle("hide")
            this.shareFeed="The ID does not exist!"
          }else{
            this.shareFeed=null
            db.collection("users").doc(this.shareid).collection("notes").doc().set({
              title:this.modaltitle,
              content:this.modalcontent
            })
            .then(()=>{
              document.getElementById("sharespins").classList.toggle("hide")
              document.getElementById("sharemodal").classList.toggle("hide")
              this.shareid=null
            })
          }
        })
      }else{
        this.shareFeed="Enter the other person's ID!"
      }
    },
    update(){
      var db = firedb.firestore()
      document.getElementById("modalspins").classList.toggle("hide")
      document.getElementById("modalbutton").classList.toggle("hide")
      document.getElementById("modalbutton2").classList.toggle("hide")
      document.getElementById("modalbutton3").classList.toggle("hide")
      db.collection("users").doc(this.id).collection("notes").doc(this.actionid).update({
        title:this.modaltitle,
        content:this.modalcontent
      })
      .then(()=>{
        document.getElementById("modalspins").classList.toggle("hide")
        document.getElementById("modalbutton").classList.toggle("hide")
        document.getElementById("modalbutton2").classList.toggle("hide")
        document.getElementById("modalbutton3").classList.toggle("hide")
        document.getElementById("modal").classList.toggle("hide")
        this.modaltitle=this.modalcontent=null
      })
    },
    modaltoggle(){
      this.modaltitle=this.modalcontent=null
      document.getElementById("modal").classList.toggle("hide")
    },
    sharemodaltoggle(){
      this.shareid=null
      this.shareFeed=null
      document.getElementById("sharespins").classList.add("hide")
      document.getElementById("sharemodal").classList.toggle("hide")
    },
    del(){
      var db = firedb.firestore()
      document.getElementById("modalspins").classList.toggle("hide")
      document.getElementById("modalbutton").classList.toggle("hide")
      document.getElementById("modalbutton2").classList.toggle("hide")
      document.getElementById("modalbutton3").classList.toggle("hide")
      db.collection("users").doc(this.id).collection("notes").doc(this.actionid).delete().then(()=>{
        this.modaltitle=this.modalcontent=null
        document.getElementById("modalspins").classList.toggle("hide")
        document.getElementById("modalbutton").classList.toggle("hide")
        document.getElementById("modalbutton2").classList.toggle("hide")
        document.getElementById("modalbutton3").classList.toggle("hide")
        document.getElementById("modal").classList.toggle("hide")
      })
    },
    lock(){
      document.getElementById("lockmodal").classList.toggle("hide")
      this.pass=null
      this.passFeed=null
    },
    lockmodaltoggle(){
      document.getElementById("lockmodal").classList.toggle("hide")
    },
    setpass(){
      if(this.pass){
        this.passFeed=null
        document.getElementById("passpins").classList.remove("hide")
        var db = firedb.firestore()
        db.collection("users").doc(this.id).get().then((doc)=>{
          if(!doc.exists){
            db.collection("users").doc(this.id).set({password:this.pass})
            .then(()=>{
              this.passFeed="Password Set!"
              this.pass=null
              document.getElementById("passpins").classList.add("hide")
            })
          }else{
            db.collection("users").doc(this.id).update({
              password:this.pass
            })
            .then(()=>{
              this.passFeed="Password Set!"
              this.pass=null
              document.getElementById("passpins").classList.add("hide")
            })
          }
        })
      }else{
        this.passFeed="Enter Password"
      }
    },
    rempass(){
      this.passFeed=null
      document.getElementById("passpins").classList.remove("hide")
      this.pass=null
      var db = firedb.firestore()
      db.collection("users").doc(this.id).get().then((doc)=>{
        if(!doc.exists){
          this.passFeed="Doc. does not exist"
          document.getElementById("passpins").classList.add("hide")
        }else{
          db.collection("users").doc(this.id).update({
            password:this.pass
          })
          .then(()=>{
            this.passFeed="Password Removed!"
            document.getElementById("passpins").classList.add("hide")
          })
        }
      })
    }
  },
  created(){
    AOS.init();
    var db = firedb.firestore()
    db.collection("users").doc(this.id).collection("notes").onSnapshot(querySnapshot=>{
      this.arr=querySnapshot.docs
    })
  },
  mounted(){
    document.getElementById("spins").classList.add("hide")
    document.getElementById("modal").classList.add("hide")
    document.getElementById("sharemodal").classList.add("hide")
    document.getElementById("modalspins").classList.add("hide")
    document.getElementById("lockmodal").classList.add("hide")
    document.getElementById("passpins").classList.add("hide")
  }
}
</script>

<style scoped>
#lock{
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(40%,40%);
  cursor: pointer;
}
.home{
  position: relative;
  min-height: 100vh;
  background-color: #edf7fa;
  padding: 50px 50px!important;
}
.cards{
  margin-top: 70px;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-gap: 30px;
}
.card img{
  position: absolute;
  right: 15px;
  cursor: pointer;
  background-color: #fff;
}
.modal p{
  text-align: center;
  color: crimson;
}
.card{
  position: relative;
  height: 255px;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  border: 0.4px solid;
  transition: all 0.15s ease;
  border-color: rgba(60,64,67,.15);
  overflow: hidden;
}
.card:hover{
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
}
.form{
  position: relative;
  margin-left: 20%;
  margin-right: 20%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
  border-radius: 8px;
}
.form input{
  margin-bottom: 10px;
  border: 0;
  font-size: 1.3rem;
  outline-style: none;
  font-family: 'Roboto Slab', serif;
}
.v-spinner{
  text-align: center;
}
.form button{
  position: absolute;
  font-size: 2rem;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #52de97;
  border: none;
  top: 100%;
  color: white;
  right: 0;
  transform: translate(-50%,-50%);
  outline-style: none;
  transition: all 0.15s ease;
  cursor: pointer;
}
.form p{
  text-align: center;
  color: crimson;
}
.form button:hover{
  background-color: #41b175;
}
textarea{
  resize: none;
  border: 0;
  font-size: 1.15rem;
  outline-style: none;
}
.hide{
  display: none!important;
}
.modal{
  height: 100vh;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}
#sharemodal .overlay{
  height: 110px;
  width: 310px;
}
#sharemodal button{
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%,0);
}
#sharemodal input{
  margin-bottom: 0;
  font-size: 1.2rem;
}
#lockmodal .overlay{
  height: 110px;
  width: 310px;
}
#lockmodal input{
  margin-bottom: 0;
  font-size: 1.2rem;
}
#sharediv{
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: row;
  left: 50%;
  transform: translate(-50%,0);
}
#lockmodal .overlay div button{
  margin: 0 3px;
}
.overlay{
  position: relative;
  height:380px;
  width: 780px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 15px;
}
.overlay span{
  position: absolute;
  right: 15px;
  cursor: pointer;
}
.overlay button{
  width: 80px;
  padding: 5px;
  margin-top: 5px;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.15s ease;
  border-radius: 8px;
  border: 1px solid #52de97;
  font-size: 1.1rem;
  outline-style: none;
}
.overlay div{
  text-align: center;
}
.overlay button:hover{
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
}
.overlay input{
  margin-bottom: 15px;
  border: 0;
  font-size: 1.3rem;
  outline-style: none;
  font-family: 'Roboto Slab', serif;
}
@media screen and (max-width: 850px){
  .cards{
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
  .overlay{
    width: 580px;
  }
}
@media screen and (max-width: 600px){
  .home{
    padding: 30px!important;
  }
  .form{
    margin-left: 0;
    margin-right: 0;
  }
  .cards{
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }
  .overlay{
    width: 310px;
  }
}
.home img{
  position: relative;
  left: 50%;
  transform: translate(-50%,0);
  margin-bottom: 15px;
}
</style>
