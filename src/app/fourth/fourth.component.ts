import { Component, OnInit } from '@angular/core';
import { isRegularExpressionLiteral } from 'typescript';
import { ServicioGithubService } from '../servicio-github.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fourth',
  templateUrl: './fourth.component.html',
  styleUrls: ['./fourth.component.css']
})
export class FourthComponent implements OnInit {

  constructor(private githubService: ServicioGithubService, private router: Router) { }

  preguntasEncuesta = new Map([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0]
  ]);

  opcionesPregunta = [1,2,3,4,5,6,7];

  respuestasfourth: number[] = [];
  isVisible: boolean = false;

  ngOnInit(): void {
    //this.pintarPreguntas();
  }

  selected: boolean = false;

  guardarRespuesta(pregunta:number, opcion: number): void{
    this.respuestasfourth[pregunta-1] = opcion;
    console.log(this.respuestasfourth);
  }

  guardarComoJSON(): void {
    this.guardarDatosMapa();
    this.githubService.guardarDatosEnGitHub(this.githubService.contenidoJson)
      .then(() => {
        console.log('Datos guardados en GitHub');
      })
      .catch(error => {
        console.error('Error al guardar los datos en GitHub:', error);
      });
  }

  guardarDatosMapa()
  {
    this.githubService.contenidoJson += JSON.stringify(this.respuestasfourth, null, 2) + ",";
  }

  validarRespuestas()
  {
    let vacio = false;
    for(let i = 0; i < 6; i++)
    {
      if(this.respuestasfourth[i] == undefined)
      {
        vacio = true;
        break;
      }
    }
    if(vacio)
    {
      this.isVisible = true;
    }
    else
    {
      this.isVisible = false;
      this.guardarDatosMapa();
      this.router.navigate(['/fifth']);
    }
  }

  cambiarImagen(pregunta:number, opcion:number): void{
    let img = document.getElementById("pipe"+pregunta+"_"+opcion) as HTMLImageElement;
    let dato = this.preguntasEncuesta.get(pregunta)!;
    if(dato > 0)
    {
      let imgLimpiar = document.getElementById("pipe"+pregunta+"_"+dato) as HTMLImageElement;
      imgLimpiar.src = "assets/images/kart_box.png";
      this.preguntasEncuesta.set(pregunta, opcion);
      img.src = "assets/images/aku.png";
    }
    else
    {
      this.preguntasEncuesta.set(pregunta, opcion);
      img.src = "assets/images/aku.png";
    }
  }

  pintarPreguntas():void
  {
    for(const item of this.preguntasEncuesta)
    {
      alert(item[0]);
      let fila = document.getElementById("pregunta"+item[0]) as HTMLTableRowElement;
      for(var i = 0; i < 10; i++)
      {
        fila.innerHTML += "<td class='text-center'><img id='pipe"+item[0]+"_"+i+"' class='img-rb' src='assets/images/kart_box.png' onClick='cambiarImagen("+item[0]+","+i+")' /></td>"
      }
    }
  }
}
