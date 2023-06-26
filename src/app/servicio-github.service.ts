import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { Octokit } from '@octokit/rest';

const MyBuffer = Buffer;

@Injectable({
  providedIn: 'root'
})
export class ServicioGithubService {
  private octokit: Octokit;

  public contenidoJson: string = "";

  currentDateTime = new Date();

  // Create a string representation of the current date and time
  dateTimeString = this.currentDateTime.toLocaleString().replace(/\//g, '_');

  constructor() {
    this.octokit = new Octokit({
      auth: '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'
    });
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async guardarDatosEnGitHub(datos: any): Promise<void> {
    const owner = 'deivert-guiltrichs';
    const repo = 'mecuebasic';
    const path = 'datos_' + this.getRandomInteger(1,500) + '_' + this.dateTimeString + '.json';
    console.log(path);

    //const content = JSON.stringify(datos, null, 2);
    const response = await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: 'Actualizar datos',
      content: MyBuffer.from(datos).toString('base64')
    });

    console.log('Archivo actualizado en GitHub:', response.data);
  }
}
