const getLocalIP=()=>{let e=new XMLHttpRequest;e.open("GET","http://localhost:8383/ip",!0),e.onreadystatechange=function(){if(4==this.readyState&&200==this.status){console.log(this.responseText),console.log(this.response);let e="",t=JSON.parse(this.responseText);console.log(t);let o=0;t.forEach((t=>{e+=`<a href='/qrcode?i=${o++}' > ${t} </a></br>\n`})),document.getElementById("main").innerHTML+=e}},e.send()};