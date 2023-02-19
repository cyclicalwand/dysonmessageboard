import { createApp, reactive } from "https://unpkg.com/petite-vue?module";
      
     window.store = reactive({
        DYS_DOMAIN: "",
        CLEAR_DOMAIN: "",
        accountData: null,
        storage: [],
        newPost: "",
        newReply: "",
        setNodeInfo(nodeInfo) {
          this.DYS_DOMAIN = nodeInfo.DYS_DOMAIN;
          this.CLEAR_DOMAIN = nodeInfo.CLEAR_DOMAIN;
        },
        
        fetchStorage() {
          // Query Storage of this script
          dysonVueStore
          .dispatch("dyson/QueryPrefixStorage",{
              query: {"prefix": "dys178nsz4x7f3rew089w35cuhsfuxqwf7kc98y2tt"},
            }
          ) 
        },
        setNodeInfo(nodeInfo) {
          this.DYS_DOMAIN = nodeInfo.DYS_DOMAIN;
          this.CLEAR_DOMAIN = nodeInfo.CLEAR_DOMAIN;
        },
       
       submit() {  
        event.preventDefault();
        if(store.accountData == null){
            alert("Connecting your wallet. Submit your post again once connected.");
            this.connectToKeplr();
        }else{
        dysonVueStore.dispatch("dyson/sendMsgRun",{
         "value": {
        "creator": store.accountData.bech32Address, 
        "address": "dys178nsz4x7f3rew089w35cuhsfuxqwf7kc98y2tt", // your script
        "function_name": "new_post",
        "kwargs": JSON.stringify({"body": store.newPost}),
        "coins": ""
        },
        "fee": [ {amount: '300', denom: 'dys'}], gas: "300000"})
        .then(() => {
            alert("Post successful. Refreshing page.");
            location.reload();
        })
        .catch(() => {
            alert("Post failed. Please try again");
            });
        }
        },
       
       submitReply(id) {
        event.preventDefault();
        if(store.accountData == null){
            alert("Connecting your wallet. Submit your reply again once connected.");
            this.connectToKeplr();
        }else{
        dysonVueStore.dispatch("dyson/sendMsgRun",{
         "value": {
        "creator": store.accountData.bech32Address, 
        "address": "dys178nsz4x7f3rew089w35cuhsfuxqwf7kc98y2tt", // your script
        "function_name": "add_reply",
        "kwargs": JSON.stringify({"body": store.newReply, "post_id": id}),
        "coins": ""
        },
        "fee": [ {amount: '400', denom: 'dys'}], gas: "400000"})
        .then(() => {
            alert("Reply successful. Refreshing page.");
            location.reload();
        })
        .catch(() => {
            alert("Reply failed. Please try again");
            });
        }
        },
       
       submitDelete(id) {
        event.preventDefault();
        if(store.accountData == null){
            alert("Connecting your wallet. Try to delete your post again once connected.");
            this.connectToKeplr();
        }else{
        dysonVueStore.dispatch("dyson/sendMsgRun",{
         "value": {
        "creator": store.accountData.bech32Address, 
        "address": "dys178nsz4x7f3rew089w35cuhsfuxqwf7kc98y2tt", // your script
        "function_name": "delete_post",
        "kwargs": JSON.stringify({"post_id": id}),
        "coins": ""
        },
        "fee": [ {amount: '300', denom: 'dys'}], gas: "300000"})
        .then(() => {
            alert("Delete successful. Refreshing page.");
            location.reload();
        })
        .catch(() => {
            alert("Delete failed. Are you the original poster? Only the original poster can delete the post not repliers. If so try again");
            });
        }
    },
    
    
    connectToKeplr() {
            window.dysonUseKeplr((accountData) => {
                console.log("Keplr Ready!", accountData);
                this.accountData = accountData;
                alert("Wallet ready.");
            }).catch((e) => {
                console.log("Keplr error:", e);
            })
        },
});

fetch(
    "https://api-dys-testnet.dysonvalidator.com/dyson/storageprefix?prefix=dys178nsz4x7f3rew089w35cuhsfuxqwf7kc98y2tt"
)
    .then((response) => response.json())
    .then((data) => {
        data.storage = data.storage.map((d) => {
            try {
                d.data = JSON.parse(d.data);
            } catch {}
            return d;
        });
        return data;
    })
    .then((data) => (store.storage = store.storage.concat(data.storage)));


      // Mount the Vue app
      createApp().mount();
      

      
      // Fetch the node info and store it
      fetch("/_/node_info")
        .then((response) => response.json())
        .then((nodeInfo) => {
          store.setNodeInfo(nodeInfo);
        });

      // load dyson vue store and subscribe to updates
      DysonLoader().then(() => {
        console.log("DysonLoader loaded");
      });
