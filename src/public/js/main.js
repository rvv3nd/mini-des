const ascii = [
    "␀","␁","␂", "␃","␄",
    "␅","␆", "␇", "␈", "␉",
    "␊", "␋",  "␌",  "␍", "␎",
    "␏", "␐", "␑", "␒","␓",    
    "␔","␕", "␖", "␗","␘",
    "␙", "␚", "␛", "␜", "␝",
    "␞", "␟",  "␡", 
    " ",  "!",   "\"", "#",    
    "$",  "%",   "&",   "'",  "(",    
    ")",  "*",   "+",   ",",  "-",    
    ".",  "/",   "0",   "1",  "2",    
    "3",  "4",   "5",   "6",  "7",    
    "8",  "9",   ":",   ";",  "<",    
    "=",  ">",   "?",   "@",  "A",    
    "B",  "C",   "D",   "E",  "F",    
    "G",  "H",   "I",   "J",  "K",    
    "L",  "M",   "N",   "O",  "P",    
    "Q",  "R",   "S",   "T",  "U",    
    "V",  "W",   "X",   "Y",  "Z",    
    "[",  "\\",  "]",   "^",  "_",    
    "`",  "a",   "b",   "c",  "d",    
    "e",  "f",   "g",   "h",  "i",    
    "j",  "k",   "l",   "m",  "n",    
    "o",  "p",   "q",   "r",  "s",    
    "t",  "u",   "v",   "w",  "x",    
    "y",  "z",   "{",   "|",  "}",    
    "~",         "Ç",   "ü",  "é",
    "â",  "ä",   "à",   "å",  "ç",
    "ê",  "ë",   "è",   "ï",  "î",
    "ì",  "Ä",   "Å",   "É",  "æ",
    "Æ",  "ô",   "ö",   "ò",  "û",
    "ù",  "ÿ",   "Ö",   "Ü",  "ø",
    "£",  "Ø",   "×",   "ƒ",  "á",    
    "í",  "ó",   "ú",   "ñ",  "Ñ",   
    "ª",  "º",   "¿",   "®",  "¬",    
    "½",  "¼",   "¡",   "«",  "»",    
    "░",  "▒",   "▓",   "│",  "┤",
    "Á",  "Â",   "À",   "©",  "╣",
    "║",  "╗",   "╝",   "¢",  "¥",
    "┐",  "└",   "┴",   "┬",  "├",    
    "─",  "┼",   "ã",   "Ã",  "╚",
    "╔",  "╩",   "╦",   "╠",  "═",
    "╬",  "¤",   "ð",   "Ð",  "Ê",
    "Ë",  "È",   "ı",   "Í",  "Î",
    "Ï",  "┘",   "┌",   "█",  "▄",
    "¦",  "Ì",   "▀",   "Ó",  "ß",
    "Ô",  "Ò",   "õ",   "Õ",  "µ",
    "þ",  "Þ",   "Ú",   "Û",  "Ù",
    "ý",  "Ý",   "¯",   "´",  "≡",
    "±",  "‗",   "¾",   "¶",  "§",
    "÷",  "¸",   "°",   "¨",  "·",
    "¹",  "³",   "²",   "■",  " "
  ]

const equivalencias = {
    "0":0, "90":1, "180":0, //0 es igual a 180
    "45":0,"135":1,
}

const key = "zÇ{ouvw}kx" // == qwertyuiop

$(function(){
    const socket = io();
    //console.log('works!')

    //getting items from html
    const $msgForm = $('#mensaje-form')
    const $msg = $('#mensaje')
    const $chat = $('#chat')
    
    const $nickForm = $('#nickForm')
    const $nickName = $('#nickName')
    //eventos
    $msgForm.submit( e => {
        e.preventDefault()
        console.log('sending data')
        var angulos = []
        for(let i=1;i<=10;i++){
            angulos.push($('#arrow_'+i).attr("alt"))
        }
        const txt = codifica($msg.val(),angulos) 
        $msg.val("");
        socket.emit('send message',txt,$('#my_user').text()) 
    })

    $nickForm.submit(e =>{
        e.preventDefault()
        if(claveValida($('#password').val())){
            console.log('Iniciando sesión')
            $('#user_name').append('<p id="my_user">'+'<i class="far fa-user"></i> '+$nickName.val()+'<p>')
            $('#containerWrap').css('display','block')
            $('#nickWrap').css('display','none')
        }
        else{
            alert("Contraseña incorrecta")
        }
    })

    socket.on('new message', function(text,user){
        var date = new Date()
        $chat.append('<p class="msg_onchat">'+user+' at '+ date.getHours()+':'+date.getMinutes()+':<br> '+text+'</p>'+'<br>')
        $(".msg_onchat").click(function(){
            var angulos = []
            for(let i=1;i<=10;i++){
                angulos.push($('#arrow_'+i).attr("alt"))
            }
            alert(decodifica(text,angulos))
        })
        $chat.scrollTop($chat.prop('scrollHeight'))
    })
})

function claveValida(attemp){
    return (cipherCajas(attemp) == key) ? true : false   
}

function codifica(msg, array_angulos){
    var palabras = [], res=""
    
    /*
        De cada letra del mensaje 
        obtiene los n bits correspondientes segun el ascii
        cada bit se almacena en un array que se va 
        en otro array de todas las letras
    */
    for(letra of msg){
        const letra_on_binary = ascii.indexOf(letra).toString(2) 
        palabras.push(letra_on_binary.split(""))  
    }
    // for(element of array_angulos){
    //     console.log(element)
    // }
    // for(element of palabras){
    //     console.log(element)
    // }

    /*
    Se recorre la matriz multiplicando bit por bit
    con las posiciones elegidas en las flechitas
    */

    for(word of palabras){
        var letra_codificada = "", i = 0
        for(element of word){
            //console.log(`${element}^${equivalencias[array_angulos[i]]} = ${element ^ equivalencias[array_angulos[i]]}`)
            letra_codificada += element ^ equivalencias[array_angulos[i++]] //cada elemento en binario se multiplica por el equivalente en binario del angulo
        }
        //console.log(`${letra_codificada} = ${binarioADecimal(letra_codificada)}`)
        res += ascii[binarioADecimal(letra_codificada)]
    }  

    return res 
}

function decodifica(text,array_angulos){
    var text_deco = "", code_words = []

    for(letra of text){
        const letra_on_binary = ascii.indexOf(letra).toString(2) 
        code_words.push(letra_on_binary.split(""))  
    }

    for(word of code_words){
        var letra_decodificada = "", i = 0
        for(element of word){
            letra_decodificada += element ^ equivalencias[array_angulos[i++]] //cada elemento en binario se multiplica por el equivalente en binario del angulo
        }
        text_deco += ascii[binarioADecimal(letra_decodificada)]
    }

    return text_deco
}

//funciones auxiliares 
function binarioADecimal(num) {
    let sum = 0;

    for (let i = 0; i < num.length; i++) {
       sum += +num[i] * 2 ** (num.length - 1 - i);
    }
    return sum;
}
function rotar(id){
    var val = Number($("#"+id).attr("alt")) + 45
    console.log(val)
    $("#"+id).css("transform",'rotate('+(val)+'deg)')
    $("#"+id).css("transition",".5s")
    if(val>=180) val = 0
    $("#"+id).attr("alt",val)
}

function cipherCajas(txt){
    txt = sus(txt)
    txt = per(txt)
    txt = sus(txt)
    txt = per(txt)
    return txt
}

function sus(cad){
    var res = ""
    for(char of cad){
        res += ascii[(ascii.indexOf(char)+3)%ascii.length]
    }
    return res
}
function per(cad){
    var res = ""
    var array = cad.split("")
    for(let i=0;i<array.length;i++){
        res += array[(i+2)%array.length]
    }
    return res
}