    const btnStartRecord= document.getElementById('btnStartRecord');
    const btnStopRecord= document.getElementById('btnStopRecord');
    const texto= document.getElementById('texto');
    // let recognition=new webkitSpeechRecognition();
    window.SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition =new window.SpeechRecognition();
    recognition.lang='es-ES';
    recognition.continuous = true;
    recognition.interimResults =true;
    // const recognition = new SpeechRecognition();
//   console.log(recognition);
//     recognition.start();
let p=document.createElement('p');
recognition.addEventListener('result',(e)=>{
    const text=Array.from(e.results)
    .map(result=result[0])
    .map(result=result.transcript)
    .join('');
    texto.appendChild(p);
    console.log("inicia func");
})
    if ("webkitSpeechRecognition" in window) {

        // Speech Recognition Stuff goes here
      
      } else {
        console.log("Speech Recognition Not Available")
      }
    recognition.onresult=(event)=>{
        const results=event.results;

        console.log(results);
        speechRecognition.lang = document.querySelector("#texto").value;
        const frase=results[results.length-1][0].transcript;
        texto.value+=frase;
    }
    // recognition.onend=(event)=>{
    //     console.log('el microfono deja de escuchar');
    // }
    recognition.addEventListener('error', function(event) {
        console.log('Speech recognition error detected: ' + event.error);
      });
      
    recognition.onerror=(event)=>{
        console.log(event.error);
    }

    btnStartRecord.addEventListener('click', ()=>{
        recognition.start();
        console.log("iniciar");

    });

    btnStopRecord.addEventListener('click', ()=>{
        recognition.abort();
        console.log("finalizar");
        
    });
