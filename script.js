const RAM = new Uint8Array(4096);
const REGISTERS = new Uint8Array(16);
const FONTS = [
0x60, 0x90, 0x90, 0x90, 0x60, //0
0x20, 0x60, 0xA0, 0x20, 0xF0, //1
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
let secretregidx; 
let issuper = false;
const byteboxes = document.querySelectorAll("#RAMSHOW .Bytebox");
const bytebox2s = document.querySelectorAll("#RAMSHOW .Bytebox2");
const rbyteboxes = document.querySelectorAll("#REGISHOW .Bytebox");
const buttons = document.getElementsByClassName("keypadbtn");
let lastTime = 0;    // 마지막 루프가 돌았던 시각 (ms)
let accTime  = 0;    // 남은 누적 시간(ms)
let accTimer = 0;
var audio = new Audio('beep.mp3');
audio.loop = true;
const VKEY = new Array(16).fill(false);
let paused = false;
var canvas = document.getElementById("Display");
if (canvas.getContext) {
var ctx = canvas.getContext("2d"); 
ctx.fillStyle = "rgb(0,0,0)";
ctx.fillRect(0, 0, 320, 160);
}
const screen = new BigInt64Array(32) //64x32,x는 비트형태로 저장


function updatesoundstate(){

    if(TIMER_SOUND){
        audio.currentTime = 0;
        audio.play();


    }else{
        audio.pause();
    }
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
                ctx.fillRect((63-j)*5, i*5, 5, 5);
    

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
            if(I3===0xE){



            
            if(I4===0){
                for(let i=0;i<32;i++) screen[i] = 0n;
                clearscreen();
                document.getElementById("CurrentACT").textContent = "화면 지우기";

            }else if(I4===0xE){
                
                PC = STACK.pop();
                document.getElementById("CurrentACT").textContent = "PC = " + PC.toString(16).toUpperCase() + "로 서브루틴 복귀";
              
            }
            }

            break;

        case 1:
            PC = num;
            document.getElementById("CurrentACT").textContent = "PC = " + PC.toString(16).toUpperCase() + "로 점프";
            PC-=2;

            break;
        case 2:
            STACK.push(PC);
            PC = num;
 
            document.getElementById("CurrentACT").textContent = "PC = " + PC.toString(16).toUpperCase() + "로 서브루틴 호출";
            PC-=2;

            break;
        case 3:
            if(REGISTERS[I2]===(num&0xFF)) PC+=2;

             document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "가 " + (num&0xFF).toString(16).toUpperCase() + "이면 스킵";

            break;
        case 4:
            if(REGISTERS[I2]!==(num&0xFF)) PC+=2;

             document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "가 " + (num&0xFF).toString(16).toUpperCase() + "이 아니면 스킵";

            break;
        case 5:
            if(REGISTERS[I2]===REGISTERS[I3]) PC+=2;

             document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "가 레지스터 V" + I3.toString(16).toUpperCase() + "이면 스킵";

            break;

        case 6:
            


            REGISTERS[I2] = 0xFF&num;
            document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + " = " + REGISTERS[I2].toString(16);
            showregi();

            break;
        case 7:
            


            REGISTERS[I2] += 0xFF&num;
            document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + " += " + (0xFF&num).toString(16);
            showregi();

            break;
        case 8:
            switch(I4){
                case 0:
                    REGISTERS[I2] = REGISTERS[I3];
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= 레지스터 V" + I3.toString(16).toUpperCase();
                    break;

                case 1:
                    REGISTERS[I2] = REGISTERS[I2] | REGISTERS[I3];
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " OR V" + I3.toString(16).toUpperCase();
                    break;
                case 2:
                    REGISTERS[I2] = REGISTERS[I2] & REGISTERS[I3];
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " AND V" + I3.toString(16).toUpperCase();
                    break;
                case 3:
                    REGISTERS[I2] = REGISTERS[I2] ^ REGISTERS[I3];
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " XOR V" + I3.toString(16).toUpperCase();
                    break;
                case 4:
                    REGISTERS[0xF] = 0;
                    if(REGISTERS[I2] + REGISTERS[I3]>255) REGISTERS[0xF] = 1;
                    
                    REGISTERS[I2] = REGISTERS[I2] + REGISTERS[I3];
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " + V" + I3.toString(16).toUpperCase();
                    break;
                case 5:
                    REGISTERS[0xF] = 1;
                    if(REGISTERS[I2] - REGISTERS[I3]<0) REGISTERS[0xF] = 0;
                    
                    REGISTERS[I2] = REGISTERS[I2] - REGISTERS[I3];
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " - V" + I3.toString(16).toUpperCase();
                    break;
 
                case 6:
                    if(!issuper) REGISTERS[I2] = REGISTERS[I3];
                    
                    REGISTERS[I2] = REGISTERS[I2] >> 1;
                    REGISTERS[0xF] = REGISTERS[I2]&1;
                    
                    
                    if(!issuper) document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I3.toString(16).toUpperCase() + " >> 1";
                    else document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " >> 1";
                    break;
                                        
                    
                case 7:
                    REGISTERS[0xF] = 1;
                    if(REGISTERS[I3] - REGISTERS[I2]<0) REGISTERS[0xF] = 0;
                    
                    REGISTERS[I2] = REGISTERS[I3] - REGISTERS[I2];
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I3.toString(16).toUpperCase() + " - V" + I2.toString(16).toUpperCase();
                    break;
                case 0xE:
                    
                    if(!issuper) REGISTERS[I2] = REGISTERS[I3];
                    
                    REGISTERS[I2] = REGISTERS[I2] << 1;
                    REGISTERS[0xF] = Math.floor(REGISTERS[I2]/0x100);
                    
                    
                    if(!issuper) document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I3.toString(16).toUpperCase() + " << 1";
                    else document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " << 1";
                    break;                                   
            }

            showregi();
            break;
        case 9:
            if(REGISTERS[I2]!==REGISTERS[I3]) PC+=2;

             document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "가 레지스터 V" + I3.toString(16).toUpperCase() + "이 아니면 스킵";

            break;

        case 0xA:
            REGI_I = num;
            document.getElementById("CurrentACT").textContent = "인덱스 레지스터 = " + REGI_I.toString(16).toUpperCase();
            document.getElementById("IRSHOWcontent").textContent = REGI_I.toString(16).padStart(4, "0").toUpperCase();

            break;
        case 0xB:
            if(issuper){
            document.getElementById("CurrentACT").textContent = "PC = " + num.toString(16).toUpperCase() + " + " + REGISTERS[I2].toString(16).toUpperCase() + " 로 점프";
            PC = num + REGISTERS[I2];
            }else{
            document.getElementById("CurrentACT").textContent = "PC = " + num.toString(16).toUpperCase() + " + " + REGISTERS[0].toString(16).toUpperCase() + " 로 점프";
            PC = num + REGISTERS[0];

            }

            PC-=2;

            break;
        case 0xC:
            REGISTERS[I2] = Math.floor(Math.random() * 256) & num
            document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "= 랜덤";
            showregi();
            break;

        case 0xD:
            let x = REGISTERS[I2]&63;
            let y = REGISTERS[I3]&31;
            REGISTERS[0xF] = 0;
            for(let i=0;i<I4;i++){
                let bytegot = RAM[REGI_I+i];
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = x+7-c;
                        let ny = y+i;
                        if(nx<64&&ny<32){
                            if(screen[ny]&(1n<<BigInt(63-nx))){
                                REGISTERS[0xF] = 1;

                            }
                            screen[ny] = screen[ny]^(1n<<BigInt(63-nx));
                        }
                        

                    }

                }
                
            }    


            renderscreen();
            document.getElementById("CurrentACT").textContent = "X : " + x + " Y : " + y +" 위치에 인덱스 레지스터 스프라이트 그리기 N : "+ I4;
             showregi();

            break;
        case 0xE:
            if((num&0xFF)===0x9E){
                if(VKEY[REGISTERS[I2]&15])PC+=2;
                document.getElementById("CurrentACT").textContent = (REGISTERS[I2]&15).toString(16).toUpperCase() +"키가 눌려져 있으면 스킵"; 
                

            }else if((num&0xFF)===0xA1){
                if(!VKEY[REGISTERS[I2]&15])PC+=2;
                document.getElementById("CurrentACT").textContent = (REGISTERS[I2]&15).toString(16).toUpperCase() +"키가 눌려져 있지 않으면 스킵"; 
            }
            break;
        case 0xF:
            switch(num&0xFF){
                case 0x07:
                    REGISTERS[I2] = TIMER_DELAY;
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + " = DELAY 타이머"; 
                     showregi();
                    break;
                case 0x15:
                    TIMER_DELAY = REGISTERS[I2];
                    document.getElementById("CurrentACT").textContent = "DELAY 타이머 = 레지스터 V" + I2.toString(16).toUpperCase(); 
                    document.getElementById("DESHOWcontent").textContent = TIMER_DELAY.toString(16).padStart(2, "0").toUpperCase();
                    break;
                case 0x18:
                    TIMER_SOUND = REGISTERS[I2];
                    updatesoundstate();
                    document.getElementById("CurrentACT").textContent = "SOUND 타이머 = 레지스터 V" + I2.toString(16).toUpperCase(); 
                    document.getElementById("SOSHOWcontent").textContent = TIMER_SOUND.toString(16).padStart(2, "0").toUpperCase();


                    break;
                case 0x1E:
                    REGI_I = (REGI_I + REGISTERS[I2])&0xFFFF;
                    if(REGI_I>0xFFF) REGISTERS[0xF]=1;
                    
                    document.getElementById("CurrentACT").textContent = "인덱스 레지스터 = 인덱스 레지스터 + 레지스터 V" + I2.toString(16).toUpperCase();
                    document.getElementById("IRSHOWcontent").textContent = REGI_I.toString(16).padStart(4, "0").toUpperCase();


                    break;
                case 0x0A:
                    secretregidx = I2;
                    paused = true;
                    
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "에 키 입력받을때까지 정지";
                    


                    break; 
                case 0x29:
                    REGI_I = 0x50 + (REGISTERS[I2]&0xF)*5;
                
                    
                    document.getElementById("CurrentACT").textContent = "인덱스 레지스터 = " + (REGISTERS[I2]&0xF).toString(16).toUpperCase() + " 폰트 주소";
                    


                    break;
                case 0x33:
                    RAM[REGI_I] = (REGISTERS[I2]/100);
                    RAM[REGI_I+1] = ((REGISTERS[I2]/10)%10);
                    RAM[REGI_I+2] = (REGISTERS[I2]%10);
                    
                    document.getElementById("CurrentACT").textContent = "램에 레지스터 V" + I2.toString(16).toUpperCase() + " BCD화 한 결과 저장";
                    


                    break;
                case 0x55:

                    for(let i = 0;i<=I2;i++){
                        RAM[REGI_I] = REGISTERS[i];
                        REGI_I++;
                        if(REGI_I>0xFFFF) REGI_I = 0;
                    }
                    if(issuper)REGI_I-=(I2+1);
                    
                    document.getElementById("CurrentACT").textContent = "램에 레지스터 V" + I2.toString(16).toUpperCase() + "까지 저장";
                    


                    break;
                case 0x65:

                    for(let i = 0;i<=I2;i++){
                        REGISTERS[i] = RAM[REGI_I];
                        REGI_I++;
                        if(REGI_I>0xFFFF) REGI_I = 0;
                    }
                    if(issuper)REGI_I-=(I2+1);
                    
                    document.getElementById("CurrentACT").textContent = "레지스터 V" + I2.toString(16).toUpperCase() + "까지 램 저장";
                     showregi();


                    break;                                                                                                  
            }
            break;
        default:
            document.getElementById("CurrentACT").textContent = "??";
            break;
    }

    showram();
    PC+=2;
    if(PC>=4096) PC = 0;   

    
    
}
  const msPerTimer = 1000/60;


function runLoop(now) {
  if (!running) {
    lastTime = now;
    return;
  }

  if (lastTime === 0) lastTime = now;
  let delta = now - lastTime;
  accTime  += delta;
  accTimer += delta;
  lastTime = now;

  let msPerTick = 1000 / hz;

  if (accTimer >= msPerTimer) {
    
    if (TIMER_DELAY > 0) TIMER_DELAY--;
    if (TIMER_SOUND > 0) TIMER_SOUND--;
    document.getElementById("SOSHOWcontent").textContent = TIMER_SOUND.toString(16).padStart(2, "0").toUpperCase();

    document.getElementById("DESHOWcontent").textContent = TIMER_DELAY.toString(16).padStart(2, "0").toUpperCase();

    if(!TIMER_SOUND) updatesoundstate();
    accTimer -= msPerTimer;
  }  
  while (accTime >= msPerTick) {
    if(!paused) clockstep();
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
    for(let i=0;i<FONTS.length;i++){
        RAM[i+0x50] = FONTS[i];
    }
    showram();
}

function emureset(){
    running = false;
    lastTime = 0;
    accTime  = 0; 
    accTimer = 0;
    for(let i=0;i<32;i++) screen[i] = 0n;
    paused = false;

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
    document.getElementById("SOSHOWcontent").textContent = TIMER_SOUND.toString(16).padStart(2, "0").toUpperCase();

    document.getElementById("DESHOWcontent").textContent = TIMER_DELAY.toString(16).padStart(2, "0").toUpperCase();
    document.getElementById("IRSHOWcontent").textContent = REGI_I.toString(16).padStart(4, "0").toUpperCase();
}






   


document.getElementById("EmuStep").addEventListener("click",function(){


    if (!running) clockstep();



});
document.getElementById("EmuReset").addEventListener("click",emureset);
document.getElementById("EmuRun").addEventListener("click",function(){
    if(running) return;
    audio.play();
    audio.pause();
    running = true
    document.getElementById("pausedtxt").textContent = "현재 실행 중";
       lastTime = 0;
  accTime  = 0;
  accTimer = 0;
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
document.getElementById("super").addEventListener ("click",function(newvalue){


    issuper = newvalue.target.checked;
   

});
document.getElementById("romtextarea").addEventListener("input",loadRom);


const keyMap = {
  "1": 0x1, "2": 0x2, "3": 0x3, "4": 0xC,
  "q": 0x4, "w": 0x5, "e": 0x6, "r": 0xD,
  "a": 0x7, "s": 0x8, "d": 0x9, "f": 0xE,
  "z": 0xA, "x": 0x0, "c": 0xB, "v": 0xF
};

document.addEventListener("keydown", (e) => {
 
  if (e.key in keyMap) {
    VKEY[keyMap[e.key]] = true;
    if(paused){
        REGISTERS[secretregidx] = keyMap[e.key];
        paused = false;
    } 
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key in keyMap) {
    VKEY[keyMap[e.key]] = false;

  }
});



document.querySelectorAll(".keypadbtn").forEach(btn => {
  const index = parseInt(btn.dataset.hex, 16);

  
  btn.addEventListener("mousedown", () => {
    VKEY[index] = true;
    if(paused){
        REGISTERS[secretregidx] = index;
        paused = false;
    } 
  });

  
  btn.addEventListener("mouseup", () => {
    VKEY[index] = false;

  });


});


emureset();