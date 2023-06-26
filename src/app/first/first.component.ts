import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isRegularExpressionLiteral } from 'typescript';
import { ServicioGithubService } from '../servicio-github.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit {

  constructor(private githubService: ServicioGithubService, private router: Router) {
  }

  preguntasEncuesta = new Map([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0]
  ]);

  respuestasfirst: number[] = [];
  isVisible: boolean = false;

  imagesRespuesta = new Map([
    [1, "red_shell.png"],
    [2, "blue_shell.png"],
    [3, "bomb.png"],
    [4, "banana.png"],
    [5, "bullet.png"],
    [6, "blue_shell_wings.png"],
    [7, "thunder.png"],
    [8, "hongo.png"],
    [9, "star.png"],
    [10, "ghost.png"],
    [11, "boomerang.png"],
    [12, "plant.png"],
    [13, "flower.png"],
  ]);

  opcionesPregunta = [1,2,3,4,5,6,7];

  fila = 0;

  ngOnInit(): void {
    //this.pintarPreguntas();
  }

  selected: boolean = false;

  guardarRespuesta(pregunta:number, opcion: number): void{
    this.respuestasfirst[pregunta-1] = opcion;
    console.log(this.respuestasfirst);
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
    this.githubService.contenidoJson += JSON.stringify(this.respuestasfirst, null, 2) + ",";
  }

  validarRespuestas()
  {
    let vacio = false;
    for(let i = 0; i < 6; i++)
    {
      if(this.respuestasfirst[i] == undefined)
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
      this.router.navigate(['/second']);
    }
  }

  cambiarImagen(pregunta:number, opcion:number): void{
    let img = document.getElementById("pipe"+pregunta+"_"+opcion) as HTMLImageElement;
    let dato = this.preguntasEncuesta.get(pregunta)!;
    let imagen = this.getRandomIntInclusive(1, 13);
    let mario = document.getElementById("mario") as HTMLImageElement;
    let posicionMario = mario.parentElement as HTMLTableCellElement;
    if(dato > 0)
    {
      if(dato != opcion)
      {
        let imgLimpiar = document.getElementById("pipe"+pregunta+"_"+dato) as HTMLImageElement;
        imgLimpiar.src = "assets/images/kart_box.png";
        this.preguntasEncuesta.set(pregunta, opcion);
        img.src = "assets/images/" + this.imagesRespuesta.get(imagen);
        //this.detenerImagen(this.imagesRespuesta.get(imagen)!);
        if(this.fila != pregunta)
        {
          console.log("aqui)");
          this.moverCarro(mario, posicionMario);
          this.fila = pregunta;
        }
        else  
        {
          console.log("mover");
        }
        //this.moverCarro(luigi, posicionLuigi);
      }
      else
      {
        let imgLimpiar = document.getElementById("pipe"+pregunta+"_"+dato) as HTMLImageElement;
        imgLimpiar.src = "assets/images/kart_box.png";
        this.preguntasEncuesta.set(pregunta, 0);
        this.retrocederCarro(mario, posicionMario);
      }
    }
    else
    {
      this.preguntasEncuesta.set(pregunta, opcion);
      img.src = "assets/images/" + this.imagesRespuesta.get(imagen);
      //this.detenerImagen(this.imagesRespuesta.get(imagen)!);
      //if(this.fila != pregunta)
      //{
        this.moverCarro(mario, posicionMario);
        this.fila = pregunta;
      //}
    }
  }

  pintarPreguntas():void
  {
    for(const item of this.preguntasEncuesta)
    {
      let fila = document.getElementById("pregunta"+item[0]) as HTMLTableRowElement;
      for(var i = 0; i < 7; i++)
      {
        fila.innerHTML += "<td class='text-center'><img id='pipe"+item[0]+"_"+i+"' class='img-rb' src='assets/images/kart_box.png' onClick='cambiarImagen("+item[0]+","+i+")' /></td>"
      }
    }
  }

  getRandomIntInclusive(min:number, max:number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  sleep() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  async detenerImagen(imagen:string) {
    let luigi = document.getElementById("luigi") as HTMLImageElement;
    console.log('Taking a break...');
    luigi.src = "assets/images/" + imagen;
    await this.sleep();
    luigi.src = "assets/images/luigi.png";
    console.log('Two second later');
  }

  moverCarro(carro:HTMLImageElement, posicionActual:HTMLTableCellElement)
  {
    let nActual = posicionActual.id.replace("pos", "");
    let numActual: number =+ nActual;
    if(numActual != 0)
    {
      if(numActual != 1)
      {
        let siguientePosicion = document.getElementById("pos"+(numActual-1)) as HTMLTableCellElement;
        posicionActual.innerHTML = "";
        siguientePosicion.appendChild(carro);
      }
      else  
      {
        let luigi = document.getElementById("luigi") as HTMLImageElement;
        let siguientePosicion = document.getElementById("pos"+(numActual-1)) as HTMLTableCellElement;
        posicionActual.appendChild(luigi);
        siguientePosicion.appendChild(carro);
      }
    }
    else
    {
      let siguientePosicion = document.getElementById("meta") as HTMLTableCellElement;
      posicionActual.removeChild(carro);
      siguientePosicion.appendChild(carro);
    }
  }

  retrocederCarro(carro:HTMLImageElement, posicionActual:HTMLTableCellElement)
  {
    let nActual = posicionActual.id.replace("pos", "");
    let numActual: number =+ nActual;
    console.log(numActual);
    if(numActual != 0)
    {
      if(numActual != 1)
      {
        let siguientePosicion = document.getElementById("pos"+(numActual+1)) as HTMLTableCellElement;
        posicionActual.innerHTML = "";
        siguientePosicion.appendChild(carro);
      }
      else  
      {
        console.log("movimiento");
      }
    }
    else
    {
      let luigi = document.getElementById("luigi") as HTMLImageElement;
      let siguientePosicion = document.getElementById("pos"+(numActual+1)) as HTMLTableCellElement;
      posicionActual.appendChild(luigi);
      siguientePosicion.appendChild(carro);
      /*let siguientePosicion = document.getElementById("meta") as HTMLTableCellElement;
      posicionActual.removeChild(carro);
      siguientePosicion.appendChild(carro);*/
    }
  }

}
