'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry=(data,className="")=>{
  const html=`
         <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population/1_000_000).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
    `;
  countriesContainer.insertAdjacentHTML("beforeend",html);
  // countriesContainer.style.opacity = 1;
}
function getCountryData(country){
  const request=new XMLHttpRequest();
  request.open("GET","https://restcountries.com/v2/name/"+country);
  request.send();
  request.addEventListener("load",function(){
    const [data]=JSON.parse(this.response);
    console.log(data);
    renderCountry(data);
    const neighbour=data.borders?.[0];
    if (!neighbour) return;
    const request2=new XMLHttpRequest();
    request2.open("GET","https://restcountries.com/v2/alpha/"+neighbour);
    request2.send();
    request2.addEventListener("load",function() {
      const data2=JSON.parse(this.response);
      console.log(data2);
      renderCountry(data2,"neighbour");
    })

  });

};

// getCountryData("italy");
// getCountryData("usa");
// getCountryData("germany");
const renderError=function(msg) {
  countriesContainer.insertAdjacentHTML("beforeend",msg);
  // countriesContainer.style.opacity=1;
}

const getJson=function(url,msg="Something went wrong") {
  return fetch(url).then(resp=>{
    console.log(resp);
    if (!resp.ok) throw new Error(msg);
    return resp.json();
  });
}
const getCountryDataFetch=async function(country) {
  getJson("https://restcountries.com/v2/name/"+country,"Country not found v1")
  .then(data=>{
    console.log(data);
    renderCountry(data[0]);
    console.log(data[0]);
    const neighbour=data[0].borders?.[0];
    if (!neighbour) throw new Error("no found neighbour");
    return getJson("https://restcountries.com/v2/name/"+neighbour,"Country not found");
    // getCountryDataFetch(neighbour);
  }).then(data=>{
      renderCountry(data[0]);
      return;
    })
    // .catch(err=>{
    //   alert(err);
    //   renderError(err.message);
    // })
    .finally(()=>{
      countriesContainer.style.opacity = 1;
    });

}
// getCountryDataFetch("italy");


async function whereAmI(lat,lng) {
  try {
    const response=await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    const data=await response.json();
    if (!response.ok) throw new Error(data.description);

    console.log(data);
    console.log(`You are in ${data.city}, ${data.countryName}`);
    getCountryDataFetch(data.countryName);
  }catch (e) {
    alert(e.message);
    console.log(e);
  }
}
// const coords={};
// navigator.geolocation.getCurrentPosition((pos)=>{
//   coords.lat=pos.coords.latitude;
//   coords.lng=pos.coords.longitude;
// },(err)=>{
//   alert(err.message);
//   console.log(err);
// });
// whereAmI(coords.lat,coords.lat);

// console.log("Test start");
//
//
// setTimeout(()=>{
//   console.log("0 sec timer");
// },0);
//
//
// Promise.resolve("Resolved Promise 1").then(res=>{
//   console.log(res);
// });
// Promise.resolve("Resolved Promise 2").then(res=>{
//   console.log(res);
// });
// Promise.resolve("Resolved Promise 3").then(res=>{
//   for (let i = 0; i < 10000; i++) {
//   }
//   console.log(res);
// });
//
// queueMicrotask(() => {
//   console.log("ciao");
//   /* code to run in the microtask here */
// });
// console.log("after");
// console.log("Test end");

const messageQueue = [];

// let sendMessage =async(message) => {
//   messageQueue.push(message);
//   console.log(messageQueue);
//
//   if (messageQueue.length === 1) {
//     await queueMicrotask(() => {
//       const json = JSON.stringify(messageQueue);
//       // messageQueue.length = 0;
//       console.log("sono dentro",messageQueue);
//       // fetch("url-of-receiver", json);
//     });
//   }
//   console.log("forse sono il secondo");
//   return messageQueue;
// };


btn.addEventListener("click",async function() {
  // getCountryDataFetch("italy");
  // const lista=await sendMessage("ciao");
  // console.log(lista);
  // lista.push("cane");
  // console.log(lista);
})

// async function test() {
//   try {
//     const lotteryPromise=await new Promise(function(res,rej) {
//       setTimeout(()=>{
//         if (Math.random()>=.5){
//           res("You win");
//         }else {
//           rej(new Error("You lost your money"));
//         }
//       },0);
//       console.log("Lotter draw is happening");
//     });
//     console.log(lotteryPromise);
//   } catch (e) {
//     console.log(e);
//   }
//
// }
//
// test();

const wait=function(seconds) {
  return new Promise(function(resolve) {
    setTimeout(resolve,seconds*1000);
  })
};
//
// let testWait=wait(4);

// for (let i = 4; i >=0 ; i=response) {
//
//   testWait=testWait.then((res)=>{
//       console.log(`I have waited ${res} seconds`);
//       response=res-1;
//       return wait(res-1);
//   });
// }
const getPosition=function() {
  return new Promise(function(resolve, reject) {
    // navigator.geolocation.getCurrentPosition((position)=>{
    //   resolve(position);
    // },(err)=>{
    //   reject(err);
    // });
    navigator.geolocation.getCurrentPosition(resolve,reject);
  });
}

let position;
getPosition().then(data=>{
  position=data;
  console.log(position);
}).catch(err=>console.log(err.message));
console.log("hello");

function createImage(imgPath) {
  return new Promise(function(resolve, reject) {
    const imgEl=document.createElement("img");
    imgEl.src=imgPath;
    imgEl.addEventListener("load",function(e) {
        const imagesContainer=document.querySelector("div.images");
        imagesContainer.append(this);
        resolve(this);
    });
    imgEl.addEventListener("error",function(e) {
      reject(new Error("image not found"));
    })

  });
}

const imgList=[];

async function testLoadImg() {
  try {
    let imgEl=await createImage("img/img-3.jpg");
    imgList.push(imgEl);
    await wait(4);
    imgEl.style.display="none";
    await wait(4);
    imgEl=await createImage("img/img-2.jpg");
    imgList.push(imgEl);
    await wait(4);
    imgEl.style.display="none";
    await wait(4);
    imgEl=await createImage("img/img-1.jpg");
    imgList.push(imgEl);
    await wait(4);
    imgEl.style.display="none";
    return "Your last img src is "+imgEl.getAttribute("src");
  }catch (e) {
    console.error(e);
    return {
      message:e.message
    };
  }

}


// (async ()=>{
//   const testImg=await testLoadImg();
//   if (typeof testImg === "object") {
//     console.log(testImg.message);
//     return;
//   }
//   console.log(testImg);
// })();
// const testImg=testLoadImg();
// testImg.then((val)=>{
//   if (typeof val === "object") {
//     console.log(val.message);
//     return;
//   }
//   console.log(val);
//
// });


// createImage("img/img-3.jpg").then((el)=>{
//   imgList.push(el);
//   return wait(4);
// }).then(()=>{
//   imgList.at(-1).style.display="none";
//   return wait(4);
// }).then(()=>{
//   return createImage("img/img-2.jpg");
// }).then((el)=>{
//   imgList.push(el);
//   return wait(4);
// }).then(()=>{
//   imgList.at(-1).style.display="none";
//   return wait(4);
// }).then(()=>{
//   return createImage("img/img-1.jpg");
// }).then((el)=>{
//   imgList.push(el);
//   return wait(4);
// }).then(()=>{
//   imgList.at(-1).style.display="none";
// }).catch((e)=>{
//   console.error(e);
// });

async function getCountries(...countries) {
  try {

    // for (const country of countries) {
    //   const [data]=await getJson("https://restcountries.com/v2/name/"+country,"Country not found v1");
    //   capitals.push(data.capital);
    // }
    const data=await Promise.all([getJson("https://restcountries.com/v2/name/"+countries[0],"Country not found v1"),getJson("https://restcountries.com/v2/name/"+countries[1],"Country not found v1"),getJson("https://restcountries.com/v2/name/"+countries[2],"Country not found v1")]);
    const capitals=data.map((arr)=>arr[0].capital);
    console.log(capitals);
  }catch (e) {
    console.error(e);
  }
}

// getCountries("italy","ukraine","russia");

function timeout(s) {
  return new Promise(function(_, reject) {
    setTimeout(()=>{
      reject(new Error("time out!!"));
    },s*1000);
  });
}

// (async ()=>{
//   const res=await Promise.race([getJson("https://restcountries.com/v2/name/italy","Country not found v1"),getJson("https://restcountries.com/v2/name/egypt","Country not found v1"),getJson("https://restcountries.com/v2/name/mexico","Country not found v1"),timeout(1)]);
//   console.log(res);
// })();
//
// (async ()=>{
//   const res=await Promise.allSettled([getJson("https://restcountries.com/v2/name/italy","Country not found v1"),getJson("https://restcountries.com/v2/name/egypt","Country not found v1"),getJson("https://restcountries.com/v2/name/mexico","Country not found v1")]);
//   console.log(res);
// })();
//
// (async ()=>{
//   const res=await Promise.any([getJson("https://restcountries.com/v2/name/itly","Country not found v1"),getJson("https://restcountries.com/v2/name/egypt","Country not found v1"),getJson("https://restcountries.com/v2/name/mexico","Country not found v1")]);
//   console.log(res);
// })();

async function loadAll(imgArr){

  try {
    const imgs=imgArr.map(async(path)=>await createImage(path));
    console.log(imgs);
    const imgsEl=await Promise.all(imgs);
    console.log(imgsEl);
    imgsEl.forEach((el)=>{
      el.classList.add("parallel");
    });
  }catch (e) {
    console.error(e);
  }
}

loadAll(["img/img-3.jpg","img/img-2.jpg","img/img-1.jpg"]);