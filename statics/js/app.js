const { createApp } = Vue

const app = createApp({
  data() {
    return {
        message:'',
        messages:[]
    }
  },
  methods:{
    sendQuestion(){
        if(!this.message) return;
        let loader = this.$loading.show({            
            canCancel: false
        });
        const qmsg = [];
        for(const i in  this.messages){
           if(i%2===0){
              qmsg.push(`Q:${this.messages[i]}\n`);
           }else{
              qmsg.push(`A:${this.messages[i]}\n`);
           } 
        }
        qmsg.push(`Q:${this.message}\n`);
        const fq = qmsg.join('');
        const formData = new FormData();
        formData.append("q",fq);
        fetch("/ask",{
            method:"POST",
            mode:"cors",
            cache: 'no-cache',
            credentials:"include",
            body:JSON.stringify({q:fq})
        })
        .then(res=>res.text())
        .then(res=>{
            this.messages.push(this.message+"\n");
            this.messages.push(res+"\n");
            this.message="";
            loader.hide();
        }).catch(error=>console.error(error));
    }
  }
});
app.use(VueLoading.LoadingPlugin);
app.component('loading', VueLoading.Component)
app.mount('#app')
