// const xhttp = new XMLHttpRequest();
const getLocalIP = ()=>{
    // Creating Our XMLHttpRequest object 
    let xhr = new XMLHttpRequest();
  
    // Making our connection  
    let url = 'http://localhost:8383/ip';
    xhr.open("GET", url, true);

    // function execute after request is successful 
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            console.log(this.response);
            let htmlResp = '';
            let resJson = JSON.parse(this.responseText);
            console.log(resJson);
            let index =0;
            resJson.forEach((r)=>{
                htmlResp += `<a href='/qrcode?i=${index++}' > ${r} </a></br>\n`;
            });
            document.getElementById("main").innerHTML += htmlResp;
        }
    }
    // Sending our request 
    xhr.send();
}