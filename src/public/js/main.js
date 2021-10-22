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

var ok_clave1, ok_clave2, bloques = 0

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
        //console.log('sending data')
        const txt = codifica($msg.val(),ok_clave1,ok_clave2,bloques) 
        $msg.val("");
        socket.emit('send message',txt,$('#my_user').text()) 
    })

    $nickForm.submit(e =>{
        e.preventDefault()
        if(validaClaves() && bloques!=0){
            //console.log('Iniciando sesión')
            ok_clave1 = "BUCKET" //$("#clave_uno").val()
            ok_clave2 = "QWERTY" //$("#clave_dos").val()
            //console.log(`${ok_clave1} && ${bloques} &&${ok_clave2} `)
            $('#user_name').append('<p id="my_user">'+'<i class="far fa-user"></i> '+$nickName.val()+'<p>')
            $('#containerWrap').css('display','block')
            $('#nickWrap').css('display','none')
        }
    })

    socket.on('new message', function(text,user){
        var date = new Date()
        $chat.append('<p class="msg_onchat">'+user+' at '+ date.getHours()+':'+date.getMinutes()+':<br> '+text+'</p>'+'<br>')
        $(".msg_onchat").click(function(){
            alert(decodifica(text,ok_clave1,ok_clave2))
        })
        $chat.scrollTop($chat.prop('scrollHeight'))
    })

    $(".form-check-input").on( 'change', function() {
        if( $(this).is(':checked') ) {
            // Hacer algo si el checkbox ha sido seleccionado
            //console.log(typeof($(this).val()))
            bloques = Number( $(this).val())
            //console.log(typeof(bloques))
        }
    });
})

function validaClaves(){
    const k1 = $("#clave_uno").val()
    const k2 = $("#clave_dos").val()
    var aux = [] 
    if (k1.length == 0 || k2.length == 0) {
        alert("Falta completar las claves de transposición")
        return false
    }
    if(k1.length%2 != k2.length%2 ){
        alert("Contraseñas incompatibles")
        return false
    }
    for(letra of k1){
        if(aux.includes(letra)){ 
            alert("La clave uno no es valida. Intente sin caracteres repetidos")
            return false
        }
        aux.push(letra)
    }
    aux = []
    for(letra of k2){
        if(aux.includes(letra)){ 
            alert("La clave dos no es valida. Intente sin caracteres repetidos")
            return false
        }
        aux.push(letra)
    }
    return true
}

/*
    Funciones de cifrado y decifrado
*/

function codifica(text,k1,k2,nbits){
    //text = transposicion(text,k1)
    text = cipherBloques(text,nbits)
    console.log(new_text)
    //text = transposicion(text,k2)
    return new_text
}

function decodifica(text,k1,k2,nbits){
    var res = ""
    text = destrans(text,k2)
    text = descipherBloques(text,nbits)
    text = destrans(text,k1)
    text = text.split("")
    for(element of text){
        res += (element != "_") ? element : ""
    }
    return res
}

function transposicion(text,key){
    var res = ""
    //console.log(`${text} =>`)
    text = text.split("")
    const columns = (text.length > key.length) ? key.length : text.length
    const rows = Math.ceil(text.length / columns)
    
    var indices = getIndices(key) //array con los indices de cada caracter segun el codigo ascii
    /*
        En cada iteración se obtiene el menor indice para ir agregando los caracteres correspondientes
        a esa columna
    */
    for (let i=0; i<columns; i++){ //recorre la clave
        var menor = getMenor(indices)
        indices[menor] = 9999
        var idx = menor
        while(idx < rows*columns){//recorre el texto
            res += text[idx] != undefined ? text[idx] : "_" 
            idx += columns
        }
    }
    //console.log(res)
    return res
}

function destrans(text,key){
    /*
        Decifra la transposición 
    */
    const columns = (text.length > key.length) ? key.length : text.length
    const rows = Math.ceil(text.length / columns)
    text = text.split("").reverse()
    //console.log(`Reversed text: ${text}`)
    var res = [text.length]
    var indices = getIndices(key)
    var aux = [] 
    while(text.length>0){ 
        for(let i=0;i<rows;i++){ 
            aux.push(text.pop()) 
        }
        //console.log(`Elementos obtenidos:`)
        //console.log(aux)
        /*
            Desde este indice empieza a recuperar los caracteres
        */
        var idx = getMenor(indices)
        indices[idx] = 999  
        // console.log(`indice por donde se empieza: ${idx}`)
        for(element of aux){
            res[idx] = element
            idx += columns 
        }
        aux = []
    }
    // console.log(res.join(""))
    return res.join("")
}

function cipherBloques(text,n){
    var allBits = getBits(text) //array de bloques iguales
    console.log(typeof(n))
    const restos =  allBits.length % n 
    console.log(restos)
    var i = restos
    /*
    Segun el modulo serán caracteres que no encontrarás un n-conjunto para intercambiarse 
    Para evitar errores en el decifrado se excluyen del intercambio a lo sumo n-1 bits
    i es un indice que es de donde se empezarán los intercambios
    */
    var aux = []
    while(i<allBits.length*n){
       aux.push(allBits.slice(i,(i+n).toString()))
       console.log(`${i}=>`)
       i += n
       console.log(i)
       console.log(aux)
    }
    var array = [aux.length]
    for(let i=0;i<array.length/2;i++){
        array[i] = aux[n-i]
        array[n-i] = aux[i]
    }
    console.log(array)
    array.unshift(allBits.slice(0,restos)) //agrega los restos
    var res = ""
    console.log(array)
    for(element of array){
        res += binarioADecimal(Number(element))
    }
    return res
}

function descipherBloques(text,n){

}

/*
*FUNCIONE AUXILIARES
*/

function getIndices(key){
    key = key.split("")
    var indices = []
    for(element of key){
        indices.push(ascii.indexOf(element))
    }
    return indices
}

function getMenor(array){
    /*Obtiene el indice menor */
    menor = array[0]
    for (let i=1;i<array.length;i++){
        if (menor > array[i]) menor = array[i]
    }
    return array.indexOf(menor)
}

function binarioADecimal(num) {
    let sum = 0;

    for (let i=0;i<num.length;i++) {
       sum += +num[i] * 2 ** (num.length - 1 - i);
    }
    return sum;
}

function getBits(text){
        /*
        *Devuelve un string con los bits
        del asciis correspondiente al caracter
        */
        var res = []
        for(char of text){
            res .push(ascii.indexOf(char).toString(2))
        }
        console.log(typeof(res),`:`,res)
        return res
}

/**
 * 
 * 
 * 
 * 
 * 
 * 
 */
    