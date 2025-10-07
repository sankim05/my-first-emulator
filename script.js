const RAM = new Uint8Array(65536);
const REGISTERS = new Uint8Array(16);
const FREGISTERS = new Uint8Array(16);
const AUDIOBUFFER = new Uint8Array(16);

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
const FONTSHIGHRES = [
0x00, 0x3C, 0x42, 0x46, 0x4A, 0x52, 0x62, 0x42, 0x3C, 0x00, //0
0x00, 0x08, 0x18, 0x28, 0x08, 0x08, 0x08, 0x08, 0x3E, 0x00, //1
0x00, 0x3C, 0x42, 0x02, 0x02, 0x0C, 0x30, 0x40, 0x7E, 0x00, //2
0x00, 0x3C, 0x42, 0x02, 0x02, 0x3C, 0x02, 0x42, 0x3C, 0x00, //3
0x00, 0x00, 0x80, 0x18, 0x28, 0x48, 0x7E, 0x08, 0x08, 0x00, //4
0x00, 0x7E, 0x80, 0x80, 0x7C, 0x02, 0x02, 0x02, 0x7C, 0x00, //5
0x00, 0x1C, 0x20, 0x40, 0x7C, 0x82, 0x82, 0x82, 0x3C, 0x00, //6
0x00, 0x7C, 0x02, 0x04, 0x04, 0x08, 0x08, 0x10, 0x10, 0x00, //7
0x00, 0x3C, 0x42, 0x42, 0x3C, 0x42, 0x42, 0x42, 0x3C, 0x00, //8
0x00, 0x3C, 0x42, 0x42, 0x3E, 0x02, 0x02, 0x02, 0x3C, 0x00, //9
0x00, 0x18, 0x24, 0x42, 0x42, 0x7E, 0x42, 0x42, 0x42, 0x00, //A
0x00, 0x7C, 0x42, 0x42, 0x42, 0x7C, 0x42, 0x42, 0x7C, 0x00, //B
0x00, 0x3C, 0x42, 0x40, 0x40, 0x40, 0x40, 0x42, 0x3C, 0x00, //C
0x00, 0x7C, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x7C, 0x00, //D
0x00, 0x7E, 0x40, 0x40, 0x7E, 0x40, 0x40, 0x40, 0x7E, 0x00, //E
0x00, 0x7E, 0x40, 0x40, 0x7E, 0x40, 0x40, 0x40, 0x40, 0x00  //F
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
let isxo = false;
let hires = false;
const byteboxes = document.querySelectorAll("#RAMSHOW .Bytebox");
const bytebox2s = document.querySelectorAll("#RAMSHOW .Bytebox2");
const rbyteboxes = document.querySelectorAll("#REGISHOW .Bytebox");
const rfbyteboxes = document.querySelectorAll("#fREGISHOW .Bytebox");
const rabyteboxes = document.querySelectorAll("#AREGISHOW .Bytebox");
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
ctx.fillRect(0, 0, 384, 192);
}
let bitplane = 1;
let pitch = 64;
const screen = new BigInt64Array(128) //128x64,y는 비트형태로 저장
const screen2 = new BigInt64Array(128);
let colorarr = ["rgb(0,0,0)","rgb(255,255,255)","rgb(255,0,255)","rgb(0,255,255)"];
let textsel = "??";

const waveform = new Uint8Array(16).fill(0);
let audioContext = null;
let nodge = null;












function updatesoundstate(){

    if(TIMER_SOUND){

        if(isxo){



           
            nodeg.port.postMessage({ type: 'wave', data: AUDIOBUFFER });

            nodeg.parameters.get('pitch').setValueAtTime(pitch, audioContext.currentTime);
            


            


        }else{


        audio.currentTime = 0;
        audio.play();

        }



    }else{

        if(isxo){

nodeg.port.postMessage({ type: 'wave', data: waveform });
    
  

        }else{

      audio.pause();

        }
    }
}

function clearscreen(){
    
    ctx.fillStyle = colorarr[0];
    ctx.fillRect(0, 0, 384, 192);
}
function renderscreen(){
    clearscreen();
    ctx.fillStyle = colorarr[1];
    for(let i=0;i<128;i++){
        for(let j=0;j<64;j++){
            if(screen[i] & (1n<<BigInt(j))){
                ctx.fillRect(i*3, j*3, 3, 3);
            }
        }
    }
    ctx.fillStyle = colorarr[2];
    for(let i=0;i<128;i++){
        for(let j=0;j<64;j++){
            if(screen2[i] & (1n<<BigInt(j))){
                ctx.fillRect(i*3, j*3, 3, 3);
            }
        }
    }
    ctx.fillStyle = colorarr[3];
    for(let i=0;i<128;i++){
        for(let j=0;j<64;j++){
            if((screen2[i] & (1n<<BigInt(j)))&&(screen[i] & (1n<<BigInt(j)))){
                ctx.fillRect(i*3, j*3, 3, 3);
            }
        }
    }
}
function showram(){
    document.getElementById("PCSHOWcontent").textContent = PC.toString(16).padStart(4, "0").toUpperCase();
    for(let i=0;i<=8;i++){
        let ramidx = PC-4+i;
        if(ramidx<0||ramidx>=65536){
        byteboxes[i].textContent = "00";
        bytebox2s[i].textContent = "0000";
        }else{
        byteboxes[i].textContent = RAM[ramidx].toString(16).padStart(2, "0").toUpperCase();
        bytebox2s[i].textContent = ramidx.toString(16).padStart(4, "0").toUpperCase();
        }

    }

}



function showall(){
    document.getElementById("CurrentACT").textContent = textsel;
    showram();

    for(let i=0;i<16;i++){
        
rbyteboxes[i].textContent = REGISTERS[i].toString(16).padStart(2, "0").toUpperCase();
        rfbyteboxes[i].textContent = FREGISTERS[i].toString(16).padStart(2, "0").toUpperCase();
     rabyteboxes[i].textContent = AUDIOBUFFER[i].toString(16).padStart(2, "0").toUpperCase();

    }

    document.getElementById("SOSHOWcontent").textContent = TIMER_SOUND.toString(16).padStart(2, "0").toUpperCase();
    updatesoundstate();
    document.getElementById("DESHOWcontent").textContent = TIMER_DELAY.toString(16).padStart(2, "0").toUpperCase();
    document.getElementById("IRSHOWcontent").textContent = REGI_I.toString(16).padStart(4, "0").toUpperCase();
    document.getElementById("PLSHOWcontent").textContent = bitplane.toString(16).padStart(2, "0").toUpperCase();
    document.getElementById("PTSHOWcontent").textContent = pitch.toString(16).padStart(2, "0").toUpperCase();

    renderscreen();

}


function clockstep(){
    
    let I1 = RAM[PC]>>4;
    let I2 = RAM[PC]&0xF;
    let I3 = RAM[PC+1]>>4;
    let I4 = RAM[PC+1]&0xF;
    let num = (I2 << 8)|(I3 << 4)|I4;



   
 
    switch(I1){
        case 0:
            if(I2===0){
            if(I3===0xC){
                if(bitplane&1){
                if(hires)for(let i=0;i<128;i++)screen[i] = screen[i] << BigInt(I4);
                else for(let i=0;i<128;i++)screen[i] = screen[i] << BigInt(I4*2);
                }
                 if(bitplane&2){
                if(hires)for(let i=0;i<128;i++)screen2[i] = screen2[i] << BigInt(I4);
                else for(let i=0;i<128;i++)screen2[i] = screen2[i] << BigInt(I4*2);
                }               
                textsel= "아래로  " + I4 + "픽셀 스크롤";
            }else if(I3===0xD){
                if(bitplane&1){
                if(hires)for(let i=0;i<128;i++)screen[i] = screen[i] >> BigInt(I4);
                else for(let i=0;i<128;i++)screen[i] = screen[i] >> BigInt(I4*2);
                }
                if(bitplane&2){
                if(hires)for(let i=0;i<128;i++)screen2[i] = screen2[i] >> BigInt(I4);
                else for(let i=0;i<128;i++)screen2[i] = screen2[i] >> BigInt(I4*2);
                }                
                textsel= "위로  " + I4 + "픽셀 스크롤";
            }
            else if(I3===0xE){



            
            if(I4===0){
                if(bitplane&1) for(let i=0;i<128;i++) screen[i] = 0n;
                if(bitplane&2) for(let i=0;i<128;i++) screen2[i] = 0n;
              
                textsel= "화면 지우기";

            }else if(I4===0xE){
                
                PC = STACK.pop();
                textsel= "PC = " + PC.toString(16).toUpperCase() + "로 서브루틴 복귀";
              
            }
            }else if(I3===0xF){
                switch(I4){

                      case 0xB:
                        if(bitplane&1){

                            if(hires){
                        for(let i=127;i>=4;i--) screen[i] = screen[i-4];
                        for(let i=3;i>=0;i--) screen[i] = 0n;  

                        }else{


                        for(let i=127;i>=8;i--) screen[i] = screen[i-8];
                        for(let i=7;i>=0;i--) screen[i] = 0n;  

                        }
                    



                        }
                        if(bitplane&2){

                            if(hires){
                        for(let i=127;i>=4;i--) screen2[i] = screen2[i-4];
                        for(let i=3;i>=0;i--) screen2[i] = 0n;  

                        }else{


                        for(let i=127;i>=8;i--) screen2[i] = screen2[i-8];
                        for(let i=7;i>=0;i--) screen2[i] = 0n;  

                        }
                    



                        }


                        

                        textsel= "오른쪽으로 4픽셀 스크롤";

                        break;
                      case 0xC:
                        if(bitplane&1){
                        if(hires){
                        for(let i=0;i<124;i++) screen[i] = screen[i+4];
                        for(let i=124;i<128;i++) screen[i] = 0n;
                        }else{
                        for(let i=0;i<120;i++) screen[i] = screen[i+8];
                        for(let i=120;i<128;i++) screen[i] = 0n;

                            
                        }
                    }
                        if(bitplane&2){
                        if(hires){
                        for(let i=0;i<124;i++) screen2[i] = screen2[i+4];
                        for(let i=124;i<128;i++) screen2[i] = 0n;
                        }else{
                        for(let i=0;i<120;i++) screen2[i] = screen2[i+8];
                        for(let i=120;i<128;i++) screen2[i] = 0n;

                            
                        }
                    }

                        textsel= "왼쪽으로 4픽셀 스크롤";

                        break;
                       case 0xD:
                        running = false;
                        document.getElementById("pausedtxt").textContent = "현재 정지 중";
                        textsel= "프로그램 탈출";

                        break;                                                                          
                     case 0xE:
                        if(isxo){

                if(bitplane&1) for(let i=0;i<128;i++) screen[i] = 0n;
                if(bitplane&2) for(let i=0;i<128;i++) screen2[i] = 0n;


                        }
                        hires = false;
                        textsel= "저화질 그래픽 활성화";

                        break;                   
                    case 0xF:
                        if(isxo){

                if(bitplane&1) for(let i=0;i<128;i++) screen[i] = 0n;
                if(bitplane&2) for(let i=0;i<128;i++) screen2[i] = 0n;


                        }                       
                        hires = true;
                        textsel= "고화질 그래픽 활성화";

                        break;





                }



            }


            }


            break;

        case 1:
            PC = num;
            textsel= "PC = " + PC.toString(16).toUpperCase() + "로 점프";
            PC-=2;

            break;
        case 2:
            STACK.push(PC);
            PC = num;
 
            textsel= "PC = " + PC.toString(16).toUpperCase() + "로 서브루틴 호출";
            PC-=2;

            break;
        case 3:
            if(REGISTERS[I2]===(num&0xFF)){
                  if(isxo){
                    if(((RAM[PC+2] << 8) | RAM[PC+3])===0xF000) PC+=2;                  
                  }
PC+=2;

            } 

             textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "가 " + (num&0xFF).toString(16).toUpperCase() + "이면 스킵";

            break;
        case 4:
            if(REGISTERS[I2]!==(num&0xFF)){
                  if(isxo){
                    if(((RAM[PC+2] << 8) | RAM[PC+3])===0xF000) PC+=2;                  
                  }
PC+=2;

            } 

             textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "가 " + (num&0xFF).toString(16).toUpperCase() + "이 아니면 스킵";

            break;
        case 5:
            if(I4===2){
                    let range = Math.abs(I2-I3);
                    let go = I2;
                    
                    for(let i = 0;i<=range;i++){
                        RAM[REGI_I+i] = REGISTERS[go];
                        if(go<I3)go++;
                        else go--;
                    }
                    
                    
                    
                    textsel= "램에 레지스터 V" + I2.toString(16).toUpperCase() + "부터 레지스터 V" + I3.toString(16).toUpperCase() + "까지 저장";

            }else if(I4===3){
                    let range = Math.abs(I2-I3);
                    let go = I2;
                    
                    for(let i = 0;i<=range;i++){
                        REGISTERS[go] = RAM[REGI_I+i];
                        if(go<I3)go++;
                        else go--;
                    }
                    
                    
                    
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "부터 레지스터 V" + I3.toString(16).toUpperCase() + "까지 램 저장";

            }
            else if(REGISTERS[I2]===REGISTERS[I3]){
                  if(isxo){
                    if(((RAM[PC+2] << 8) | RAM[PC+3])===0xF000) PC+=2;                  
                  }
            PC+=2;

                  } 
             textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "가 레지스터 V" + I3.toString(16).toUpperCase() + "이면 스킵";

            break;

        case 6:
            


            REGISTERS[I2] = 0xFF&num;
            textsel= "레지스터 V" + I2.toString(16).toUpperCase() + " = " + REGISTERS[I2].toString(16);
          

            break;
        case 7:
            


            REGISTERS[I2] += 0xFF&num;
            textsel= "레지스터 V" + I2.toString(16).toUpperCase() + " += " + (0xFF&num).toString(16);
          

            break;
        case 8:
            switch(I4){
                case 0:
                    REGISTERS[I2] = REGISTERS[I3];
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= 레지스터 V" + I3.toString(16).toUpperCase();
                    break;

                case 1:
                    REGISTERS[I2] = REGISTERS[I2] | REGISTERS[I3];
                    if(!issuper) REGISTERS[0xF] = 0;
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " OR V" + I3.toString(16).toUpperCase();
                    break;
                case 2:
                    REGISTERS[I2] = REGISTERS[I2] & REGISTERS[I3];
                    if(!issuper) REGISTERS[0xF] = 0;
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " AND V" + I3.toString(16).toUpperCase();
                    break;
                case 3:
                    REGISTERS[I2] = REGISTERS[I2] ^ REGISTERS[I3];
                    if(!issuper) REGISTERS[0xF] = 0;
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " XOR V" + I3.toString(16).toUpperCase();
                    break;
                case 4:
                    let res = REGISTERS[I2] + REGISTERS[I3];
                    
                    
                    REGISTERS[I2] = res;
                    if(res>255)REGISTERS[0xF] = 1;
                    else REGISTERS[0xF]  = 0;
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " + V" + I3.toString(16).toUpperCase();
                    break;
                case 5:
                    let res2 = REGISTERS[I2] - REGISTERS[I3];
                    
                    
                    REGISTERS[I2] = res2;
                    if(res2<0)REGISTERS[0xF] = 0;
                    else REGISTERS[0xF]  = 1;
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " - V" + I3.toString(16).toUpperCase();
                    break;
 
                case 6:
                    if(!issuper||isxo) REGISTERS[I2] = REGISTERS[I3];
                    let sav = REGISTERS[I2];
                    REGISTERS[I2] = REGISTERS[I2] >> 1;
                    REGISTERS[0xF] = sav&1;
                    
                    
                    if(!issuper) textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I3.toString(16).toUpperCase() + " >> 1";
                    else textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " >> 1";
                    break;
                                        
                    
                case 7:
                    let res3 = REGISTERS[I3] - REGISTERS[I2];
                    
                    
                    REGISTERS[I2] = res3;
                    if(res3<0)REGISTERS[0xF] = 0;
                    else REGISTERS[0xF]  = 1;
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I3.toString(16).toUpperCase() + " - V" + I2.toString(16).toUpperCase();
                    break;
                case 0xE:
                    
                    if(!issuper||isxo) REGISTERS[I2] = REGISTERS[I3];
                    let sav2 = REGISTERS[I2];
                    
                    REGISTERS[I2] = REGISTERS[I2] << 1;
                    REGISTERS[0xF] = (sav2&128)/128;
                    
                    
                    if(!issuper) textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I3.toString(16).toUpperCase() + " << 1";
                    else textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= V" + I2.toString(16).toUpperCase() + " << 1";
                    break;                                   
            }

           
            break;
        case 9:
            if(REGISTERS[I2]!==REGISTERS[I3]){
                  if(isxo){
                    if(((RAM[PC+2] << 8) | RAM[PC+3])===0xF000) PC+=2;                  
                  }
PC+=2;



            } 

             textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "가 레지스터 V" + I3.toString(16).toUpperCase() + "이 아니면 스킵";

            break;

        case 0xA:
            REGI_I = num;
            textsel= "인덱스 레지스터 = " + REGI_I.toString(16).toUpperCase();
            

            break;
        case 0xB:
            if(issuper&&!isxo){
            textsel= "PC = " + num.toString(16).toUpperCase() + " + " + REGISTERS[I2].toString(16).toUpperCase() + " 로 점프";
            PC = num + REGISTERS[I2];
            }else{
            textsel= "PC = " + num.toString(16).toUpperCase() + " + " + REGISTERS[0].toString(16).toUpperCase() + " 로 점프";
            PC = num + REGISTERS[0];

            }

            PC-=2;

            break;
        case 0xC:
            REGISTERS[I2] = Math.floor(Math.random() * 256) & num
            textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "= 랜덤";
           
            break;

        case 0xD:
            let x,y;
            
            x = REGISTERS[I2];
            y = REGISTERS[I3];
            if(hires){
            x = x%128;
            y = y%64;
            }else{
     
            x = x%64;
            y = y%32;

            
            
            
            }

            REGISTERS[0xF] = 0;

            if(I4===0&&issuper) I4=16;
            if(bitplane&1){

          if(hires){
            if(I4===16){

            for(let i=0;i<32;i+=2){
                let bytegot = RAM[REGI_I+i];
                let bytegot2 = RAM[REGI_I+i+1];
                let checker = false;
                let ny = y+i/2;
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = x+7-c;
                      
                        if(nx<128&&ny<64){
                            if(screen[nx]&(1n<<BigInt(ny)))checker = true;
                            screen[nx] = screen[nx]^(1n<<BigInt(ny));                      
                        }
                        if(ny>=64&&bytegot)checker = true;
                        

         
                }
                  if(bytegot2&(1<<c)){
                        let nx = x+15-c;
                        
                        if(nx<128&&ny<64){
                            if(screen[nx]&(1n<<BigInt(ny)))checker = true;
                            screen[nx] = screen[nx]^(1n<<BigInt(ny));                      
                        }
                        if(ny>=64&&bytegot2)checker = true;
                        

         
                }
            }   
if(checker) REGISTERS[0xF]++;

        }
            }else{

           
            for(let i=0;i<I4;i++){
                let bytegot = RAM[REGI_I+i];
                let checker = false;
                  let ny = y+i;
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = x+7-c;
                       
                        if(nx<128&&ny<64){
                            if(screen[nx]&(1n<<BigInt(ny)))checker = true;
                            screen[nx] = screen[nx]^(1n<<BigInt(ny));                      
                        }
                        if(ny>=64&&bytegot)checker = true;
                        

         
                }

                if(checker) REGISTERS[0xF]++;
            }    
            }                

 }
            }else{
          if(I4===16&&isxo){
            for(let i=0;i<32;i+=2){
                let bytegot = RAM[REGI_I+i];
                let bytegot2 = RAM[REGI_I+i+1];
                let ny = y+i/2;
                if(ny>=32) break;
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = (x+7-c);
                       


                
                        if(nx>=64) break;
                        
                            
                            let fx = nx*2;
                            let fy = ny*2;
                            for(let dx = 0;dx<2;dx++){
                                for(let dy=0;dy<2;dy++){

                            if(screen[fx+dx]&(1n<<BigInt(fy+dy)))REGISTERS[0xF] = 1;
                            screen[fx+dx] = screen[fx+dx]^(1n<<BigInt(fy+dy));    

                                }
                            }

         
                }
                    if(bytegot2&(1<<c)){
                        let nx = (x+15-c);
                       


                
                        if(nx>=64) break;
                        
                            
                            let fx = nx*2;
                            let fy = ny*2;
                            for(let dx = 0;dx<2;dx++){
                                for(let dy=0;dy<2;dy++){

                            if(screen[fx+dx]&(1n<<BigInt(fy+dy)))REGISTERS[0xF] = 1;
                            screen[fx+dx] = screen[fx+dx]^(1n<<BigInt(fy+dy));    

                                }
                            }

         
                }                
            }    

            }



          }else{

            for(let i=0;i<I4;i++){
                let bytegot = RAM[REGI_I+i];
                let ny = (y+i);
                if(ny>=32) break;
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = (x+7-c);
                       


                
                        if(nx>=64) break;
                        
                            
                            let fx = nx*2;
                            let fy = ny*2;
                            for(let dx = 0;dx<2;dx++){
                                for(let dy=0;dy<2;dy++){

                            if(screen[fx+dx]&(1n<<BigInt(fy+dy)))REGISTERS[0xF] = 1;
                            screen[fx+dx] = screen[fx+dx]^(1n<<BigInt(fy+dy));    

                                }
                            }

         
                }
                
            }    

            }

          }


            }
                
            }
  

            
            
            if(bitplane&2){
let fix = 0;
if(bitplane&1){
fix=I4;
if(I4===16){
    if(hires||isxo)fix = 32;
} 

} 
          if(hires){
            if(I4===16){

            for(let i=0;i<32;i+=2){
                let bytegot = RAM[REGI_I+i+fix];
                let bytegot2 = RAM[REGI_I+i+1+fix];
                let checker = false;
                let ny = y+i/2;
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = x+7-c;
                      
                        if(nx<128&&ny<64){
                            if(screen2[nx]&(1n<<BigInt(ny)))checker = true;
                            screen2[nx] = screen2[nx]^(1n<<BigInt(ny));                      
                        }
                        if(ny>=64&&bytegot)checker = true;
                        

         
                }
                  if(bytegot2&(1<<c)){
                        let nx = x+15-c;
                        
                        if(nx<128&&ny<64){
                            if(screen2[nx]&(1n<<BigInt(ny)))checker = true;
                            screen2[nx] = screen2[nx]^(1n<<BigInt(ny));                      
                        }
                        if(ny>=64&&bytegot2)checker = true;
                        

         
                }
            }   
if(checker) REGISTERS[0xF]++;

        }
            }else{

           
            for(let i=0;i<I4;i++){
                let bytegot = RAM[REGI_I+i+fix];
                let checker = false;
                  let ny = y+i;
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = x+7-c;
                       
                        if(nx<128&&ny<64){
                            if(screen2[nx]&(1n<<BigInt(ny)))checker = true;
                            screen2[nx] = screen2[nx]^(1n<<BigInt(ny));                      
                        }
                        if(ny>=64&&bytegot)checker = true;
                        

         
                }

                if(checker) REGISTERS[0xF]++;
            }    
            }                

 }
            }else{
          if(I4===16&&isxo){
            for(let i=0;i<32;i+=2){
                let bytegot = RAM[REGI_I+i+fix];
                let bytegot2 = RAM[REGI_I+i+fix+1];                
                let ny = y+i/2;
                if(ny>=32) break;
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = (x+7-c);
                       


                
                        if(nx>=64) break;
                        
                            
                            let fx = nx*2;
                            let fy = ny*2;
                            for(let dx = 0;dx<2;dx++){
                                for(let dy=0;dy<2;dy++){

                            if(screen2[fx+dx]&(1n<<BigInt(fy+dy)))REGISTERS[0xF] = 1;
                            screen2[fx+dx] = screen2[fx+dx]^(1n<<BigInt(fy+dy));    
                            

                                }
                            }


                            
             
                        
                        

         
                }
                    if(bytegot2&(1<<c)){
                        let nx = (x+15-c);
                       


                
                        if(nx>=64) break;
                        
                            
                            let fx = nx*2;
                            let fy = ny*2;
                            for(let dx = 0;dx<2;dx++){
                                for(let dy=0;dy<2;dy++){

                            if(screen2[fx+dx]&(1n<<BigInt(fy+dy)))REGISTERS[0xF] = 1;
                            screen2[fx+dx] = screen2[fx+dx]^(1n<<BigInt(fy+dy));    
                            

                                }
                            }


                            
             
                        
                        

         
                }                
            }    




            }

          }else{

            for(let i=0;i<I4;i++){
                let bytegot = RAM[REGI_I+i+fix];
                let ny = (y+i);
                if(ny>=32) break;
                for(let c=7;c>=0;c--){
                    if(bytegot&(1<<c)){
                        let nx = (x+7-c);
                       


                
                        if(nx>=64) break;
                        
                            
                            let fx = nx*2;
                            let fy = ny*2;
                            for(let dx = 0;dx<2;dx++){
                                for(let dy=0;dy<2;dy++){

                            if(screen2[fx+dx]&(1n<<BigInt(fy+dy)))REGISTERS[0xF] = 1;
                            screen2[fx+dx] = screen2[fx+dx]^(1n<<BigInt(fy+dy));    
                            

                                }
                            }


                            
             
                        
                        

         
                }
                
            }    




            }




          }


            }
                
            }
  


            
            if(hires&&I4===16) textsel= "X : " + x + " Y : " + y +" 위치에 고급 스프라이트 그리기";
            else textsel= "X : " + x + " Y : " + y +" 위치에 인덱스 레지스터 스프라이트 그리기 N : "+ I4;
           

            break;
        case 0xE:
            if((num&0xFF)===0x9E){
                if(VKEY[REGISTERS[I2]&15]){
                    
                  if(isxo){
                    if(((RAM[PC+2] << 8) | RAM[PC+3])===0xF000) PC+=2;                  
                  }
                    
                    PC+=2;

                }
                textsel= (REGISTERS[I2]&15).toString(16).toUpperCase() +"키가 눌려져 있으면 스킵"; 
                

            }else if((num&0xFF)===0xA1){
                if(!VKEY[REGISTERS[I2]&15]){
                    if(isxo){
                        if(((RAM[PC+2] << 8) | RAM[PC+3])===0xF000) PC+=2;
                    }    
                    
                    
                    PC+=2;
                }
                textsel= (REGISTERS[I2]&15).toString(16).toUpperCase() +"키가 눌려져 있지 않으면 스킵"; 
            }
            break;
        case 0xF:
            switch(num&0xFF){
                case 0x00:
                    if(I2===0&&isxo){
                        REGI_I = (RAM[PC+2] << 8) | RAM[PC+3];   
                        textsel= "인덱스 레지스터 = " + ((RAM[PC+2] << 8) | RAM[PC+3]).toString(16).toUpperCase() + "(long)";
                       
                        PC+=2;
                    }
                    break;
                case 0x01:
                    if(isxo){
                        bitplane = I2; 
                        textsel = "캔버스 모드 = " + I2;
                        
                        
                    }
                    break;
                case 0x02:
                    if(isxo&&I2===0){
                        for(let i=0;i<16;i++){
                            if(REGI_I+i<0xFFFF) AUDIOBUFFER[i] = RAM[REGI_I+i];
                        }
                       
                        textsel = "인덱스 레지스터에서 오디오 패턴 버퍼 가져오기";
                        
                        
                    }
                    break;                                              
                case 0x07:
                    REGISTERS[I2] = TIMER_DELAY;
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + " = DELAY 타이머"; 
              
                    break;
                case 0x0A:
                    secretregidx = I2;
                    paused = true;
                    
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "에 키 입력받을때까지 정지";
                    


                    break;                     
                case 0x15:
                    TIMER_DELAY = REGISTERS[I2];
                    textsel= "DELAY 타이머 = 레지스터 V" + I2.toString(16).toUpperCase(); 
                    
                    break;
                case 0x18:
                    TIMER_SOUND = REGISTERS[I2];
                    
                    textsel= "SOUND 타이머 = 레지스터 V" + I2.toString(16).toUpperCase(); 
                   


                    break;
                case 0x1E:
                    REGI_I = (REGI_I + REGISTERS[I2])&0xFFFF;
                    if(REGI_I>0xFFFF) REGISTERS[0xF]=1;
                    
                    textsel= "인덱스 레지스터 = 인덱스 레지스터 + 레지스터 V" + I2.toString(16).toUpperCase();
                  


                    break;

                case 0x29:
                    REGI_I = 0x50 + (REGISTERS[I2]&0xF)*5;
                
                    
                    textsel= "인덱스 레지스터 = " + (REGISTERS[I2]&0xF).toString(16).toUpperCase() + " 폰트 주소";
                    


                    break;
                case 0x30:
                    REGI_I = 0x100 + (REGISTERS[I2]&0xF)*10;
                
                   
                    textsel= "인덱스 레지스터 = " + (REGISTERS[I2]&0xF).toString(16).toUpperCase() + " 폰트(대형) 주소";
                    


                    break;                    
                case 0x33:
                    RAM[REGI_I] = (REGISTERS[I2]/100);
                    RAM[REGI_I+1] = ((REGISTERS[I2]/10)%10);
                    RAM[REGI_I+2] = (REGISTERS[I2]%10);
                    
                    textsel= "램에 레지스터 V" + I2.toString(16).toUpperCase() + " BCD화 한 결과 저장";
                    


                    break;
                case 0x3A:
                    if(isxo){

                    pitch = REGISTERS[I2];
                    
                    textsel= "PITCH = 레지스터 V" + I2.toString(16).toUpperCase();
                    


                    }



                    break;                    
                case 0x55:

                    for(let i = 0;i<=I2;i++){
                        RAM[REGI_I] = REGISTERS[i];
                        REGI_I++;
                        if((!issuper||isxo)&&REGI_I>0xFFFF) REGI_I = 0;
                    }
                    if(issuper&&!isxo)REGI_I-=(I2+1);
                    
                    
                    textsel= "램에 레지스터 V" + I2.toString(16).toUpperCase() + "까지 저장";
                    


                    break;
                case 0x65:

                    for(let i = 0;i<=I2;i++){
                        REGISTERS[i] = RAM[REGI_I];
                        REGI_I++;
                        if((!issuper||isxo)&&REGI_I>0xFFFF) REGI_I = 0;
                    }
                    if(issuper&&!isxo)REGI_I-=(I2+1);
                    
                    textsel= "레지스터 V" + I2.toString(16).toUpperCase() + "까지 램 저장";
                 


                    break;
                case 0x75:

                    for(let i = 0;i<=I2;i++){
                        FREGISTERS[i] = RAM[REGI_I+i];
                       
                       
                    }
                    
                    textsel= "플래그 레지스터 V" + I2.toString(16).toUpperCase() + "까지 램 저장";
                    


                    break;                     
                case 0x85:

                    for(let i = 0;i<=I2;i++){
                        RAM[REGI_I+i] = FREGISTERS[i];
                        
                       
                    }
                    
                    
                    textsel= "램에 플래그 레지스터 V" + I2.toString(16).toUpperCase() + "까지 저장";
                    


                    break;
                      
                default:
                    break;
            }
            break;
        default:
            textsel= "??";
            break;
    }

    
    PC+=2;
    if(PC>=65536) PC = 0;   

    
    
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
  
        showall();
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
    for(let i=0;i<FONTSHIGHRES.length;i++){
        RAM[i+0x100] = FONTSHIGHRES[i];
    }    
    showram();
}

function emureset(){
    
    running = false;
    lastTime = 0;
    accTime  = 0; 
    accTimer = 0;
    bitplane = 1;
    pitch = 64;
    for(let i=0;i<128;i++) screen[i] = 0n;
    for(let i=0;i<128;i++) screen2[i] = 0n;
    paused = false;
    hires = false;
    
    for(let i=0;i<65536;i++) RAM[i]=0;
    for(let i=0;i<16;i++) REGISTERS[i]=0;
    for(let i=0;i<16;i++) FREGISTERS[i]=0;
    for(let i=0;i<16;i++) AUDIOBUFFER[i]=0;
    PC = 0x200;
    REGI_I = 0;
    STACK = [];
    TIMER_DELAY = 0;
    TIMER_SOUND = 0;
    textsel = "??";
    document.getElementById("pausedtxt").textContent = "현재 정지 중"; 
    clearscreen();
    loadRom();
    showall();

}






   


document.getElementById("EmuStep").addEventListener("click",function(){


    if (!running){
clockstep();
        showall();
    } 



});
document.getElementById("EmuReset").addEventListener("click",emureset);
document.getElementById("EmuRun").addEventListener("click",async function(){
    if(audioContext == null){

    audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule('./audioprocess.js');
 nodeg = new AudioWorkletNode(audioContext, 'xoaudioProcessor', {
  numberOfOutputs: 1,
  outputChannelCount: [1],
  parameterData: {
    pitch: 64
  }
});



nodeg.port.postMessage({ type: 'wave', data: waveform });

nodeg.connect(audioContext.destination);    









    }
    if(running) return;
    audio.play();
    audio.pause();
    running = true;
    document.getElementById("pausedtxt").textContent = "현재 실행 중";
       lastTime = 0;
  accTime  = 0;
  accTimer = 0;
  showall();
  requestAnimationFrame(runLoop);
    
});
document.getElementById("EmuPause").addEventListener("click",function(){
    running = false;
    document.getElementById("pausedtxt").textContent = "현재 정지 중";
    showall();
});
document.getElementById("Speeddown").addEventListener("click",function(){
    
    if(hz>1)hz = hz >> 1;
    document.getElementById("Speedshow").textContent = hz + "hz";

});
document.getElementById("Speedup").addEventListener("click",function(){
    
    if(hz<4000000)hz = hz << 1;
    document.getElementById("Speedshow").textContent = hz + "hz";

});
document.getElementById("super").addEventListener ("click",function(newvalue){


    issuper = newvalue.target.checked;
    if(issuper)document.getElementById("fREGISHOW").style.display = 'inline-block';
        
    else{
        document.getElementById("fREGISHOW").style.display = 'none';
        bitplane = 1;
        isxo = false;
        document.getElementById("xo").checked = false;
            document.getElementById("PLSHOWcontent").style.display = 'none';
document.getElementById("PLSHOW").style.display = 'none';
        document.getElementById("PTSHOWcontent").style.display = 'none';
document.getElementById("PTSHOW").style.display = 'none';    
document.getElementById("AREGISHOW").style.display = 'none';
    } 

});
document.getElementById("xo").addEventListener ("click",function(newvalue){


    isxo = newvalue.target.checked;
    if(isxo){
        issuper = true;
        document.getElementById("AREGISHOW").style.display = 'inline-block';
        document.getElementById("PLSHOWcontent").style.display = 'inline-block';
document.getElementById("PLSHOW").style.display = 'inline-block';
        document.getElementById("PTSHOWcontent").style.display = 'inline-block';
document.getElementById("PTSHOW").style.display = 'inline-block';
    } 
    else{
bitplane = 1;
        document.getElementById("PLSHOWcontent").style.display = 'none';
document.getElementById("PLSHOW").style.display = 'none';
        document.getElementById("PTSHOWcontent").style.display = 'none';
document.getElementById("PTSHOW").style.display = 'none';
document.getElementById("AREGISHOW").style.display = 'none';

    } 
    if(issuper){
        document.getElementById("fREGISHOW").style.display = 'inline-block';
        document.getElementById("super").checked = true;
    }
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
document.querySelectorAll(".colorz").forEach(iput => {
  

  
  iput.addEventListener("change", (E) => {
    colorarr[parseInt(iput.id.match(/\d/g))-1] = E.target.value;
    renderscreen();



  });

  



});

let uploadedfile = null;
const reader = new FileReader();

function tharg(arraybfer){
    const array2 = new Uint8Array(arraybfer);
    let finstring = "";
    for(let i=0;i<array2.length;i++){
        finstring = finstring + array2[i].toString(16) + " ";

    }
    document.getElementById("romtextarea").value = finstring;
    emureset();

}
reader.onload = function(e) {
    const arrayBufferz = e.target.result; 
    tharg(arrayBufferz); 
};

document.getElementById("userUpload").addEventListener('change',function(event){
    if(event.target.files.length > 0){
        uploadedfile = event.target.files[0];
        reader.readAsArrayBuffer(uploadedfile); 
    }else{
        uploadedfile = null;
    }
    document.getElementById("romselect").value = "upload";
});

document.getElementById("romselect").addEventListener('change', function() {
  const Pathz = this.value;
  if(Pathz === "none") {
    document.getElementById("romtextarea").value = "";
    emureset();
    return;
  }
  else if(Pathz == "upload"){
    if(document.getElementById("userUpload").files[0]===undefined){
    document.getElementById("romtextarea").value = "";
    emureset();
    return;        
    }else{



   reader.readAsArrayBuffer(uploadedfile);
    }

  }else{

  fetch(Pathz)
    .then(response => {
      return response.arrayBuffer();
    })
    .then(arrayBuffer => {
      tharg(arrayBuffer);

    })
  }
});



emureset();