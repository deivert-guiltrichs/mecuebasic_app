import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioGithubService } from '../servicio-github.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  constructor(private githubService: ServicioGithubService, private router: Router) { }

  selectedOptionAge: string = "Choose";
  selectedOptionGender: string = "Choose";
  nombre: string = "";
  isVisible: boolean = false;

  respuestasfront: string[] = [];

  ngOnInit(): void {
  }

  guardarInicio()
  {
    if(this.selectedOptionAge == "Choose" || this.selectedOptionGender == "Choose")
    {
      this.isVisible = true;
    }
    else
    {
      this.respuestasfront[0] = "MecueBasic";
      this.respuestasfront[1] = this.selectedOptionAge;
      this.respuestasfront[2] = this.selectedOptionGender;
      this.isVisible = false;
      this.githubService.contenidoJson += JSON.stringify(this.respuestasfront, null, 2) + ",";
      this.router.navigate(['/first']);
    }
  }

}
