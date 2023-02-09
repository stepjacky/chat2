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
        fetch("/ask?q="+this.message)
        .then(res=>res.text())
        .then(res=>{
            this.messages.push(this.message+"\n");
            this.messages.push(res+"\n");
            this.message="";
            loader.hide();
        });
    }
  }
});
app.use(VueLoading.LoadingPlugin);
app.component('loading', VueLoading.Component)
app.mount('#app')
