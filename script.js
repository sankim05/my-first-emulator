const RAM = new Uint8Array(4096);
const REGISTERS = new Uint8Array(16);
const FONTS = [
0x60, 0x90, 0x90, 0x90, 0x60, //0
0x20, 0x60, 0xA0, 0x20, 0x90, //1
0x60, 0x90, 0x20, 0x40, 0xF0, //2
0xE0, 0x10, 0xE0, 0x10, 0xE0, //3
0x20, 0x60, 0xA0, 0xF0, 0x20, //4
0xF0, 0x80, 0xE0, 0x10, 0xE0, //5
0x70, 0x80, 0xE0, 0x90, 0x60, //6
0xF0, 0x10, 0x20, 0x40, 0x40, //7
0x60, 0x90, 0x60, 0x90, 0x60, //8
0x60, 0x90, 0x70, 0x10, 0x60, //9
0x60, 0x90, 0xF0, 0x90, 0x90, //A
0xE0, 0x90, 0xE0, 0x90, 0xE0, //B
0xE0, 0x80, 0x80, 0x80, 0xE0, //C
0xE0, 0x90, 0x90, 0x90, 0xE0, //D
0xE0, 0x80, 0xF0, 0x80, 0xE0, //E
0xE0, 0x80, 0xF0, 0x80, 0x80  //F
];
let PC = 0x200;
let REGI_I = 0;
let STACK = [];
let TIMER_DELAY = 0;
let TIMER_SOUND = 0;
let running = false;
let hz = 512;

var canvas = document.getElementById("Display");
if (canvas.getContext) {
var ctx = canvas.getContext("2d"); 
ctx.fillStyle = "rgb(0,0,0)";
ctx.fillRect(0, 0, 320, 160);
}

function loadRom(){

}

function emureset(){
    console.log("RESET");
    running = false;
    document.getElementById("pausedtxt").textContent = "현재 정지 중"; 
    ctx.fillRect(0, 0, 320, 160);
    loadRom();
}


function clockstep(){

}


emureset();

   



document.getElementById("EmuStep").addEventListener("click",clockstep);
document.getElementById("EmuReset").addEventListener("click",emureset);
document.getElementById("EmuRun").addEventListener("click",function(){
    running = true
    document.getElementById("pausedtxt").textContent = "현재 실행 중";
});
document.getElementById("EmuPause").addEventListener("click",function(){
    running = false
    document.getElementById("pausedtxt").textContent = "현재 정지 중"; 
});
document.getElementById("Speeddown").addEventListener("click",function(){
    
    if(hz>1)hz = hz/2;
    document.getElementById("Speedshow").textContent = hz + "hz";
});
document.getElementById("Speedup").addEventListener("click",function(){
    
    if(hz<4096)hz = hz*2;
    document.getElementById("Speedshow").textContent = hz + "hz";
});