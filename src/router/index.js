import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Redirect from '@/components/Redirect'
import Login from '@/components/Login'
import firedb from '../Firebase'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Redirect',
      component: Redirect
    },
    {
      path: '/:id',
      name: 'Home',
      component: Home,
      props:true,
      beforeEnter:(to,from,next)=>{
        if(typeof to.params.pass==='undefined'){
          let pass=null;
          var db = firedb.firestore();
          db.collection("users").doc(to.params.id).get().then(doc=>{
            if(doc.exists){
              pass=doc.data().password
              if(pass){
                next({name:'Login',params:{id:to.params.id}})
              }else{
                next()
              }
            }else{
              next()
            }
          })
        }else{
          next()
        }
      }
    },
    {
      path: '/login/:id',
      name: 'Login',
      component: Login
    }
  ]
})
