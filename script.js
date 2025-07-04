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
const byteboxes = document.querySelectorAll("#RAMSHOW .Bytebox");
const bytebox2s = document.querySelectorAll("#RAMSHOW .Bytebox2");
const rbyteboxes = document.querySelectorAll("#REGISHOW .Bytebox");

let lastTime = 0;    // 마지막 루프가 돌았던 시각 (ms)
let accTime  = 0;    // 남은 누적 시간(ms)



var canvas = document.getElementById("Display");
if (canvas.getContext) {
var ctx = canvas.getContext("2d"); 
ctx.fillStyle = "rgb(0,0,0)";
ctx.fillRect(0, 0, 320, 160);
}
const screen = new BigInt64Array(32) //64x32,x는 비트형태로 저장

function draw(x,y){
        screen[y] = screen[y] ^ (1n<<BigInt(x-1));
}



function clearscreen(){
    
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 320, 160);
}
function renderscreen(){
    clearscreen();
    ctx.fillStyle = "rgb(255,255,255)";
    for(let i=0;i<32;i++){
   
        for(let j=0;j<64;j++){
            if(screen[i] & (1n<<BigInt(j))){
                ctx.fillRect(j*5, i*5, 5, 5);
    

            }
            
        }

    }


}
function showram(){
    document.getElementById("PCSHOWcontent").textContent = PC.toString(16).padStart(3, "0").toUpperCase();
    for(let i=0;i<=8;i++){
        let ramidx = PC-4+i;
        if(ramidx<0||ramidx>=4096){
        byteboxes[i].textContent = "00";
        bytebox2s[i].textContent = "000";
        }else{
        byteboxes[i].textContent = RAM[ramidx].toString(16).padStart(2, "0").toUpperCase();
        bytebox2s[i].textContent = ramidx.toString(16).padStart(3, "0").toUpperCase();
        }

    }

}

function showregi(){
    for(let i=0;i<16;i++){
        

        rbyteboxes[i].textContent = REGISTERS[i].toString(16).padStart(2, "0").toUpperCase();
     

    }
}

function clockstep(){
    let I1 = RAM[PC]>>4;
    let I2 = RAM[PC]&0xF;
    let I3 = RAM[PC+1]>>4;
    let I4 = RAM[PC+1]&0xF;
    let num = (I2 << 8)|(I3 << 4)|I4;
    switch(I1){
        case 0:
            if(I4=0){
                for(let i=0;i<16;i++) screen[i] = 0n;
                clearscreen();
                document.getElementById("CurrentACT").textContent = "화면 지우기";

            }


            break;

        case 1:
            PC = num;
            document.getElementById("CurrentACT").textContent = "PC = " + PC.toString(16);
            PC-=2;

            break;




        case 6:
            


            REGISTERS[I2] = 0xFF&num;
            document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16) + " = " + REGISTERS[I2].toString(16);
            showregi();

            break;
        case 7:
            


            REGISTERS[I2] += 0xFF&num;
            document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16) + " += " + (0xFF&num).toString(16);
            showregi();

            break;

        case 0xA:
            REGI_I = num;
            document.getElementById("CurrentACT").textContent = "인덱스 레지스터 = " + REGI_I.toString(16);
            document.getElementById("IRSHOWcontent").textContent = REGI_I.toString(16).padStart(4, "0").toUpperCase();

            break;



        case 0xD:
            let x = REGISTERS[I2]&63;
            let y = REGISTERS[I3]&31;
            REGISTERS[0xF] = 0;
            for(let i=0;i<I4;i++){
                let bytegot = RAM[REGI_I+i];
                for(let c=0;c<8;c++){
                    if(bytegot&(1<<c)){
                        let nx = x+8-c;
                        let ny = y+i;
                        if(nx<64&&ny<32){
                            if(screen[ny]&(1n<<BigInt(nx-1))){
                                REGISTERS[0xF] = 1;
                            }
                            draw(nx,ny);
                        }
                        

                    }

                }
                
            }    


            renderscreen();
            document.getElementById("CurrentACT").textContent = "X : " + x + " Y : " + y +" 위치에 인덱스 레지스터 스프라이트 그리기 N : "+ I4;
            

            break;


        default:
            document.getElementById("CurrentACT").textContent = "??";
            break;
    }

    showram();

    if(PC<4094)PC+=2; 
    
    
}



function runLoop(now) {
  if (!running) {
    lastTime = now;
    return;
  }

  if (lastTime === 0) lastTime = now;

  accTime += (now - lastTime);
  lastTime = now;

  let msPerTick = 1000 / hz;

  while (accTime >= msPerTick) {
    clockstep();
    accTime -= msPerTick;
  }

  requestAnimationFrame(runLoop);
}







function loadRom(){
    let loadedrom = document.getElementById("romtextarea").value.replace(/\s/g,'');
    for(let i=0;i<loadedrom.length;i+=4){
        RAM[i/2+0x200]= parseInt(loadedrom.substr(i,2), 16);
        RAM[i/2+0x201]= parseInt(loadedrom.substr(i+2,2), 16);
    }
    showram();
}

function emureset(){
    running = false;
    lastTime = 0;
    accTime  = 0; 
    for(let i=0;i<32;i++) screen[i] = 0n;

    for(let i=0;i<4096;i++) RAM[i]=0;
    for(let i=0;i<16;i++) REGISTERS[i]=0;
    PC = 0x200;
    REGI_I = 0;
    STACK = [];
    TIMER_DELAY = 0;
    TIMER_SOUND = 0;
    document.getElementById("pausedtxt").textContent = "현재 정지 중"; 
    clearscreen();
    loadRom();
    document.getElementById("CurrentACT").textContent = "??";
    showram();
    showregi();
     document.getElementById("IRSHOWcontent").textContent = REGI_I.toString(16).padStart(4, "0").toUpperCase();
}






   


document.getElementById("EmuStep").addEventListener("click",function(){


    if (!running) clockstep();



});
document.getElementById("EmuReset").addEventListener("click",emureset);
document.getElementById("EmuRun").addEventListener("click",function(){
    if(running) return;

    running = true
    document.getElementById("pausedtxt").textContent = "현재 실행 중";
       lastTime = 0;
  accTime  = 0;
  requestAnimationFrame(runLoop);
    
});
document.getElementById("EmuPause").addEventListener("click",function(){
    running = false
    document.getElementById("pausedtxt").textContent = "현재 정지 중";
    
});
document.getElementById("Speeddown").addEventListener("click",function(){
    
    if(hz>1)hz = hz >> 1;
    document.getElementById("Speedshow").textContent = hz + "hz";

});
document.getElementById("Speedup").addEventListener("click",function(){
    
    if(hz<4096)hz = hz << 1;
    document.getElementById("Speedshow").textContent = hz + "hz";

});

document.getElementById("romtextarea").addEventListener("input",loadRom);





emureset();