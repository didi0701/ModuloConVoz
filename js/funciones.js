// RECONOCIMIENTO DE VOZ
animateDisplay = function (target, animationClass, displayType, timeout) {
	// timeout should be longer than css transition
	var doneTimedDisplay = false,
	  displaying = false;

	target.addEventListener('transitionend', function () {
	  if (!target.classList.contains('show')) {
		target.style.display = 'none';
	  }
	  doneTimedDisplay = true;
	});
	if (!target.style.display || target.style.display === 'none') {
	  displaying = true;
	  target.style.display = displayType;
	} else {
	  displaying = false;
	}

	setTimeout(function () {
	  target.classList.toggle(animationClass);
	  doneTimedDisplay = false;
	}, 10);

	if (!displaying) {
	  setTimeout(function () {
		// failsafe for transitioned not firing
		if (!doneTimedDisplay) {
		  target.style.display = 'none';
		}
		doneTimedDisplay = true;
	  }, timeout);
	}
  };

  document.querySelector('.mybutt1')
	.addEventListener('click', function () {
	  animateDisplay(document.querySelector('.informe1'), 'show', 'block', 600)
	});

  document.querySelector('.mybutt2')
	.addEventListener('click', function () {
	  animateDisplay(document.querySelector('.informe2'), 'show', 'block', 600)
	});



// VOZ A TEXTO
  var langs =
	[['Afrikaans', ['af-ZA']],
	['Bahasa Indonesia', ['id-ID']],
	['Bahasa Melayu', ['ms-MY']],
	['Català', ['ca-ES']],
	['Čeština', ['cs-CZ']],
	['Deutsch', ['de-DE']],
	['English', ['en-AU', 'Australia'],
	  ['en-CA', 'Canada'],
	  ['en-IN', 'India'],
	  ['en-NZ', 'New Zealand'],
	  ['en-ZA', 'South Africa'],
	  ['en-GB', 'United Kingdom'],
	  ['en-US', 'United States']],
	['Español', ['es-AR', 'Argentina'],
	  ['es-BO', 'Bolivia'],
	  ['es-CL', 'Chile'],
	  ['es-CO', 'Colombia'],
	  ['es-CR', 'Costa Rica'],
	  ['es-EC', 'Ecuador'],
	  ['es-SV', 'El Salvador'],
	  ['es-ES', 'España'],
	  ['es-US', 'Estados Unidos'],
	  ['es-GT', 'Guatemala'],
	  ['es-HN', 'Honduras'],
	  ['es-MX', 'México'],
	  ['es-NI', 'Nicaragua'],
	  ['es-PA', 'Panamá'],
	  ['es-PY', 'Paraguay'],
	  ['es-PE', 'Perú'],
	  ['es-PR', 'Puerto Rico'],
	  ['es-DO', 'República Dominicana'],
	  ['es-UY', 'Uruguay'],
	  ['es-VE', 'Venezuela']],
	['Euskara', ['eu-ES']],
	['Français', ['fr-FR']],
	['Galego', ['gl-ES']],
	['Hrvatski', ['hr_HR']],
	['IsiZulu', ['zu-ZA']],
	['Íslenska', ['is-IS']],
	['Italiano', ['it-IT', 'Italia'],
	  ['it-CH', 'Svizzera']],
	['Magyar', ['hu-HU']],
	['Nederlands', ['nl-NL']],
	['Norsk bokmål', ['nb-NO']],
	['Polski', ['pl-PL']],
	['Português', ['pt-BR', 'Brasil'],
	  ['pt-PT', 'Portugal']],
	['Română', ['ro-RO']],
	['Slovenčina', ['sk-SK']],
	['Suomi', ['fi-FI']],
	['Svenska', ['sv-SE']],
	['Türkçe', ['tr-TR']],
	['български', ['bg-BG']],
	['Pусский', ['ru-RU']],
	['Српски', ['sr-RS']],
	['한국어', ['ko-KR']],
	['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
	  ['cmn-Hans-HK', '普通话 (香港)'],
	  ['cmn-Hant-TW', '中文 (台灣)'],
	  ['yue-Hant-HK', '粵語 (香港)']],
	['日本語', ['ja-JP']],
	['Lingua latīna', ['la']]];

  for (var i = 0; i < langs.length; i++) {
	select_language.options[i] = new Option(langs[i][0], i);
  }
  select_language.selectedIndex = 7;
  updateCountry();
  select_dialect.selectedIndex = 5;
  showInfo('info_start');

  function updateCountry() {
	for (var i = select_dialect.options.length - 1; i >= 0; i--) {
	  select_dialect.remove(i);
	}
	var list = langs[select_language.selectedIndex];
	for (var i = 1; i < list.length; i++) {
	  select_dialect.options.add(new Option(list[i][1], list[i][0]));
	}
	select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
  }

  var create_email = false;
  var final_transcript = '';
  var recognizing = false;
  var ignore_onend;
  var start_timestamp;
  if (!('webkitSpeechRecognition' in window)) {
	upgrade();
  } else {
	start_button.style.display = 'inline-block';
	var recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function () {
	  recognizing = true;
	  showInfo('info_speak_now');
	  start_img.src = 'mic-animate.gif';
	};

	recognition.onerror = function (event) {
	  if (event.error == 'no-speech') {
		start_img.src = 'mic.gif';
		showInfo('info_no_speech');
		ignore_onend = true;

	  }
	  if (event.error == 'audio-capture') {
		start_img.src = 'mic.gif';
		showInfo('info_no_microphone');
		ignore_onend = true;
	  }
	  if (event.error == 'not-allowed') {
		if (event.timeStamp - start_timestamp < 100) {
		  showInfo('info_blocked');
		} else {
		  showInfo('info_denied');
		}
		ignore_onend = true;
	  }
	};

	recognition.onend = function () {
	  recognizing = false;
	  if (ignore_onend) {
		return;
	  }
	  start_img.src = 'mic.gif';
	  if (!final_transcript) {
		showInfo('info_start');
		return;
	  }
	  showInfo('');
	  if (window.getSelection) {
		window.getSelection().removeAllRanges();
		var range = document.createRange();
		range.selectNode(document.getElementById('final_span'));
		window.getSelection().addRange(range);

	  }
	  if (create_email) {
		create_email = false;
		createEmail();
	  }
	};

	recognition.onresult = function (event) {
	  var interim_transcript = '';
	  for (var i = event.resultIndex; i < event.results.length; ++i) {
		if (event.results[i].isFinal) {
		  final_transcript += event.results[i][0].transcript;
		  // console.log("Hola");
		} else {
		  interim_transcript += event.results[i][0].transcript;
		  console.log(interim_transcript);
		}
	  }
	  final_transcript = capitalize(final_transcript);
	  final_span.innerHTML = linebreak(final_transcript);
	  interim_span.innerHTML = linebreak(interim_transcript);
	  if (final_transcript || interim_transcript) {

		showButtons('inline-block');
	  }
	  console.log(final_transcript);
	  document.getElementById("resumenFinal").innerHTML += final_transcript;
	};
  }

  function upgrade() {
	start_button.style.visibility = 'hidden';
	showInfo('info_upgrade');
  }

  var two_line = /\n\n/g;
  var one_line = /\n/g;
  function linebreak(s) {
	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }

  var first_char = /\S/;
  function capitalize(s) {
	return s.replace(first_char, function (m) { return m.toUpperCase(); });
  }

  function createEmail() {
	var n = final_transcript.indexOf('\n');
	if (n < 0 || n >= 80) {
	  n = 40 + final_transcript.substring(40).indexOf(' ');
	}
	var subject = encodeURI(final_transcript.substring(0, n));
	var body = encodeURI(final_transcript.substring(n + 1));
	window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
  }

  function copyButton() {
	if (recognizing) {
	  console.log("copiar");
	  recognizing = false;
	  recognition.stop();
	}
	console.log("COIADO");
	console.log(recognizing);
	copy_button.style.display = 'none';
	copy_info.style.display = 'inline-block';
	showInfo('');
	// results.style.display = 'none';
  }

  function emailButton() {
	if (recognizing) {
	  create_email = true;
	  recognizing = false;
	  recognition.stop();
	} else {
	  createEmail();
	}
	email_button.style.display = 'none';
	email_info.style.display = 'inline-block';
	showInfo('');
  }

  function startButton(event) {
	if (recognizing) {
	  recognition.stop();
	  return;
	}
	final_transcript = '';
	recognition.lang = select_dialect.value;
	recognition.start();
	ignore_onend = false;
	final_span.innerHTML = '';
	interim_span.innerHTML = '';
	start_img.src = 'mic-slash.gif';
	showInfo('info_allow');
	showButtons('none');
	start_timestamp = event.timeStamp;
  }

  function showInfo(s) {
	if (s) {
	  for (var child = info.firstChild; child; child = child.nextSibling) {
		if (child.style) {
		  child.style.display = child.id == s ? 'inline' : 'none';
		}
	  }
	  info.style.visibility = 'visible';

	} else {
	  info.style.visibility = 'hidden';
	}
  }

  var current_style;
  function showButtons(style) {
	if (style == current_style) {
	  return;
	}
	current_style = style;
	copy_button.style.display = style;
	email_button.style.display = style;
	copy_info.style.display = 'none';
	email_info.style.display = 'none';
  }


// FIN RECONOCIMIENTO DE VOX








$('.tbl-accordion-nested').each(function(){
	
	var thead = $(this).find('thead');
	var tbody = $(this).find('tbody');
//OCULTAR
	 tbody.hide();
	 thead.click(function(){
	 	tbody. slideToggle();
	 	document.getElementById("diagnostico").rows = "10";
	 	document.getElementById("listaAcor").style.width = "100%";
	 	document.getElementById("contenido").style.width = "100%";
	 })
	});
function resettWin(){
	location.reload();
}
function expandir() {
	var x = document.getElementById("inforPaciente");
	var y = document.getElementById("estudio");
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
    // alert("OLCULTADA")
//     x.removeClass('col-md-4').addClass('col-md-6');
	 // y.removeClass('col-md-8').addClass('col-md-6');
	}
}
function ocultaExpandir() {
	var x = document.getElementById("inforPaciente");
	var y = document.getElementById("estudio");
	if (x.style.display === "none") {
		x.style.display = "block";
		
      display: inline-flex;
		// alert("MOSTRAR")
	} else {
		x.style.display = "none";
	}
}
function expandirInforme() {
	var x = document.getElementById("informe");
	if (x.style.display === "none") {
		x.style.display = "block";
		// alert("MOSTRAR")
	} else {
		x.style.display = "none";
	}
}
function expandirResultados() {
	var a = document.getElementById("ResultadosLista");
	if (a.style.display === "none") {
		a.style.display = "block";
		// alert("MOSTRAR")
	} else {
		a.style.display = "none";
	}
}
function ocultaInforme() {
	var x = document.getElementById("informe");
	if (x.style.display === "none") {
		x.style.display = "block";
	// alert("MOSTRAR")
} else {
	x.style.display = "none";
    // alert("OLCULTADA")
//     x.removeClass('col-md-4').addClass('col-md-6');
	 // y.removeClass('col-md-8').addClass('col-md-6');
	}
}
function mostrarMenu() {
	var  y= document.getElementById("Herramientas");
	var  z= document.getElementById("zoomww");
	if (y.style.display === "none"||z.style.display === "none" ) {
		y.style.display = "block";
		z.style.display = "block";
	} else {
		y.style.display = "none";
		z.style.display = "none";
	}
}
function ocultaZoom() {
	var x = document.getElementById("zoomww");
	if (x.style.display === "none") {
		x.style.display = "block";
	// alert("MOSTRAR")
} else {
	x.style.display = "none";
    // alert("OLCULTADA")
//     x.removeClass('col-md-4').addClass('col-md-6');
	 // y.removeClass('col-md-8').addClass('col-md-6');
	}
}
// OBTENER DATOS JSON
var height = $(window).height();
$('#main').height(height-5);
$('#tabContent').height(height-10);
var studyViewerTemplate = $(document.getElementsByClassName("tab-pane active"));
var viewportTemplate = $(document.getElementsByClassName("viewportWrapper"));
loadStudy(studyViewerTemplate, viewportTemplate, StudyInstanceUID);
var contenido = document.querySelector('#contenido')
function traer() {
	fetch('temp/Paciente.json')
	.then(res => res.json())
	.then(datos => {
		tabla(datos)
		// console.log(datos)
	})
}
function tabla(datos) {
	//FECHA ACTUAL
	const fecha = new Date();
	const añoActual = fecha.getFullYear();
	
	const mesActual = fecha.getMonth() + 1; 
	const hoy = fecha.getDate();
	// console.log(añoActual,mesActual, hoy); //2020
	// console.log(datos.seriesList)
	var cliente=Object.values(datos);
	cliente[3].toString(); 
    	
    	var anio=cliente[3].substr(0,4);
    	var mes=cliente[3].substr(-4,2);
    	var dia=cliente[3].substr(6,8);
    	
    	var anio1=cliente[2].substr(0,4);
    	var mes1=cliente[2].substr(-4,2);
    	var dia1=cliente[2].substr(6,8);
    
    	var edad=añoActual-anio1;
    	var edadmes=mesActual-mes1;
    	var edaddia=hoy-dia1;
    	var d = new Date(añoActual, mesActual, 0);
    	
    	if (edaddia<0){
    		edadmes=edadmes-1;
    		var edadhoy=d.getDate()+edaddia;
    	}
    	if (edaddia=0){
    		var edadhoy=0;
    	}
    	if(edadmes<0){
    		edadmes=mes1-mesActual;
    	}
    	
    	contenido.innerHTML = ''
	           //console.log(valor)
	           contenido.innerHTML += `
	           <tr>
	           <th   style=" text-align: left; font-size:11px;  background-color:  #345c94  ; color: #f2f2f2 " scope="row">DATOS PACIENTE  </th>
	         	<th   style=" text-align: right; font-size:15px;  background-color:  #345c94  ; color: #f2f2f2 " scope="row">${ cliente[1] } </th>
	           </tr>
	            
	           <tr>
	           <th   scope="row"><strong>NOMBRE</strong></th>
	           <th   scope="row">${ cliente[0] }</th> 
	           </tr>
	              <tr>
	           <th  scope="row"><strong>EDAD ACTUAL</strong></th>
	           <th   colspan="2 scope="row">${ edad +" años, "+ edadmes +" meses"}</th>
	           </tr>
	           <tr>
	           <th  scope="row"><strong>NACIMIENTO</strong></th>
	           <th   colspan="2 scope="row">${ anio1 +" - "+ mes1 +" - "+dia1 }</th>
	           </tr>
	        
	           
	           `
	           for(const valor1 of Object.values(datos.seriesList)){
	           	// console.log(valor1.instanceList)
	           	contenido.innerHTML += `
	           	<tr >
	           	<th  colspan="2" style=" text-align: left; font-size:11px;  background-color:  #345c94  ; color: #f2f2f2 " scope="row">RESULTADOS</th>
	           	</tr> 
	           	<tr>
	           	<th   scope="row"><strong>FECHA EXAMEN</strong></th>
	           	<th   colspan="2 scope="row">${ anio +" - "+ mes +" - "+dia }</th>
	           	</tr>                
	           	<tr>
	           	<th   scope="row"><strong>PROCESO</strong></th>
	           	<th   scope="row">${ valor1.seriesUid}</th></tr>
	           	<tr>
	           	<th   scope="row"><strong>DESCRIPCIÓN</strong></th>
	           	<th   scope="row">${ valor1.seriesDescription}</th> </tr>
	           	<tr>           	
	           	           	
	           	`
	           }
	       }
	       	// <tr >
	        //    	<th  colspan="2" style=" text-align: left; font-size:11px;  background-color: #054286 ; color: #f2f2f2 " scope="row">RESULTADOS</th>
	        //    	</tr> 
	        //    	<tr>
	        //    	<th   scope="row"><strong>FECHA EXAMEN</strong></th>
	        //    	<th   colspan="2 scope="row">${ anio +" - "+ mes +" - "+dia }</th>
	        //    	</tr>                
	        //    	<tr>
	        //    	<th   scope="row"><strong>PROCESO</strong></th>
	        //    	<th   scope="row">${ valor1.seriesUid}</th></tr>
	        //    	<tr>
	        //    	<th   scope="row"><strong>DESCRIPCIÓN</strong></th>
	        //    	<th   scope="row">${ valor1.seriesDescription}</th> </tr>
	        //    	<tr>           	
	        //    	<th   scope="row"><strong>NÚMERO SERIE</strong></th>
	        //    	<th   scope="row">${ valor1.seriesNumber}</th> </tr>
	        //    	<tr>
	        //    	<th   scope="row"><strong>MODALIDAD</strong></th>
	        //    	<th   scope="row">${ valor1.modality}</th>   </tr>		