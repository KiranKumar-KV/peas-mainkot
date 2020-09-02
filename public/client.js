
let publicVapidKey = '';
const API_URL = 'http://localhost:5000'
if('serviceWorker' in navigator) {
    send().catch(err => console.error(err));

    self.addEventListener('beforeinstallprompt', function(e) {
        console.log(e)
    })


    if(navigator.onLine){
        console.log("online")
        syncData().catch(err => console.error(err));
    }
    else{
        console.log("offline")
    }


    self.addEventListener('offline',async  function(e) { 
         await navigator.serviceWorker.ready.then(function (registration){
            registration.showNotification('offline mode', {
                body: 'Now you are in offline',
                icon: '../offline.png',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'vibration-sample'
            }); 
        })
    });

    self.addEventListener('online', function(e) { 
        syncData().catch(err => console.error(err));
    });

    
}

async function syncData(){
    await fetch(API_URL+'/hms/syncData/synckotDB', {
        method : "post",
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    })
    .then(response => response.json())
    .then(async (data)=>{
        await navigator.serviceWorker.ready.then(function (registration){
            registration.showNotification('Now online', {
                body: data.message,
                icon: '../online.png',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'vibration-sample'
            }); 
        })
    })
}

async function send() {
     fetch(API_URL+'/hms/kitchenmaster/getKeys', {
        method : "get",
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    })
    .then(response => response.json())
    .then(async (data) => {
        publicVapidKey = data[0].public_key
        console.log('Registering Service worker');

        const register = await navigator.serviceWorker.register('./worker.js',{
            scope : '/'
        })

        console.log('Service Worker Registered')
        const newvapidkey = urlBase64ToUint8Array(publicVapidKey);
        console.log('Registering Push...');

        const subscription = await register.pushManager.subscribe({
            userVisibleOnly : true,
            applicationServerKey : newvapidkey 
        })  
         
        console.log('Push Registered...');
        console.log('sending Push...');
        let role = "mainkot"
        await fetch(API_URL+'/hms/kitchenmaster/subscribe/'+role, {
            method :"POST",
            body :JSON.stringify(subscription),
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            }
        })
        console.log("push sent")
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
