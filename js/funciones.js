
$('.tbl-accordion-nested').each(function(){
	
	var thead = $(this).find('thead');
	var tbody = $(this).find('tbody');
//OCULTAR
	//  tbody.hide();
	 thead.click(function(){
	 	tbody. slideToggle();
	 	document.getElementById("diagnostico").rows = "25";
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