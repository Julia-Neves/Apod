class apodModel  {
    constructor(){
        this._descricao = "";
        this._img = "";
        this._data = "";
    }
    
    get descricao(){
        return this._descricao;
    }
    get img(){
        return this._img;
    }
    get data(){
        return this._data;
    }
    
    requestData(data){
        
        let request = new XMLHttpRequest;
        this._data = data;
        request.open("GET",`
        https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${this._data}`,false);

        request.addEventListener("load",() =>{
            if(request.status == 200){
                let response = JSON.parse(request.responseText);
    
                this._img = response.url;
                this._descricao = response.explanation;
               
            }
            else{
                console.log(`something wrong.. Error:[${request.status}] ${request.statusText}`);
            }
        })        
        
        request.send();
    }
}


class apodView {
    constructor(model){
        
        this._data = document.createElement("p");
        this._descricao = document.createElement("p");
        this._img = document.createElement("img");
        
        this._img.src = model.img;
        this._data.innerText = model.data;
        this._descricao.innerText = `Explicação: ${model.descricao}`;
       
        this._data.setAttribute("id", "data");
    }
    
    criarElementos(){
       
        this._div = document.createElement("div");
        this._div.appendChild(this._data);
        this._div.appendChild(this._img);
        this._div.appendChild(this._descricao);
       
        this._div.setAttribute("id","divContainer");
        
        document.getElementById('main').appendChild(this._div);
    }
}

class apodController {
    
    pegaImagem(data){
        let model = new apodModel;
        model.requestData(data);
        let views = new apodView(model);
        views.criarElementos();

    }
    
    verificaData(data,operador){
        
        let dataFix = new Date(data+"T00:00:00");
        
        if(operador == "+"){
            if(dataFix.getTime() == new Date("Jun 16 1995").getTime()){
                
                dataFix.setDate(dataFix.getDate() + 4);
            }
            else{
                dataFix.setDate(dataFix.getDate() + 1);
                if(dataFix > Date.now()){
                    alert("Não dá para buscar imagens de dias futuros,Sinto muito.");
                    dataFix = new Date();
                }
            }
        }
        else if(operador == "-"){
            
            if(dataFix.getTime() == new Date("Jun 20 1995").getTime()){
                
                dataFix.setDate(dataFix.getDate() - 4);
            }
            else{
                dataFix.setDate(dataFix.getDate() - 1);

                if(dataFix < new Date("Jun 16 1995")){
                    alert("A data mínima para buscar é 16/06/1995");
                    dataFix.setDate(dataFix.getDate() + 1);
                }
            }    
        }
            else{
            if(dataFix > Date.now()){
            
                alert("Não dá para buscar imagens de dias futuros");
                dataFix = new Date();
            }
            if(dataFix < new Date("Jun 16 1995")){
       
                alert("A data mínima para buscar é 16/06/1995");
                dataFix = new Date();
            }
            if(dataFix.getTime() == new Date("Jun 17 1995").getTime() || dataFix.getTime() == new Date("Jun 18 1995").getTime() || dataFix.getTime() == new Date("Jun 19 1995").getTime()){
                
                alert("Infelizmente este dia não consta em nosso banco de dados.");
                dataFix = new Date();
            }
        }
        
        let arrData = dataFix.toISOString();

        let dataFix2 = arrData.split("T");
        
        return dataFix2[0];
    }
}

let date = document.getElementById("date"); 
let btEspecifico = document.getElementById("btEspecifico"); 
let btDiaAnterior = document.getElementById("btAnterior"); 
let btDiaPosterior = document.getElementById("btProximo"); 

let apod = new apodController;

var diaAtual = new Date();
var dd = diaAtual.getDate();
var mm = diaAtual.getMonth()+1; 
var yyyy = diaAtual.getFullYear();

if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
diaAtual = yyyy+'-'+mm+'-'+dd;



window.onload = apod.pegaImagem(diaAtual);

btEspecifico.addEventListener("click",function(){
    document.getElementById("divContainer").remove();
    let data = apod.verificaData(date.value,"");
    date.value = "";
    apod.pegaImagem(data);
});

btDiaPosterior.addEventListener("click",function(){
    let diaAtual = document.getElementById("data");
    diaAtual = diaAtual.textContent;
    let novoDia = apod.verificaData(diaAtual,"+");
    document.getElementById("divContainer").remove();
    
     apod.pegaImagem(novoDia);
});

btDiaAnterior.addEventListener("click",function(){
    let diaAtual = document.getElementById("data");
    diaAtual = diaAtual.textContent;
    let novoDia = apod.verificaData(diaAtual,"-");
    document.getElementById("divContainer").remove();
    
     apod.pegaImagem(novoDia);
});