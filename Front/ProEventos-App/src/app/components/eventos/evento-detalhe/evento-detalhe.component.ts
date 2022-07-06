import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/Evento';
import { Lote } from 'src/app/models/Lote';


@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  evento = {} as Evento;
  form: FormGroup;
  estadoSalvar = 'post';

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private router: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService)
  {
    this.localeService.use("pt-br");
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam !== null) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento};
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!')
          console.error(error);
        },
        () => this.spinner.hide(),
      )
    }
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();

  }

  /* Parâmetros que definem o tipo e especificidades dos valores aceitos pelos campos */
  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([])
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
        id: [lote.id],
        nome: [lote.nome, Validators.required],
        quantidade: [lote.quantidade, Validators.required],
        preco: [lote.preco, Validators.required],
        dataInicio: [lote.dataInicio],
        dataFim: [lote.dataFim]
      });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid': campoForm.errors && this.f.local.touched};
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
      if (this.estadoSalvar === 'post') {
        this.evento = {...this.form.value};
        this.eventoService.postEvento(this.evento).subscribe(
          () => this.toastr.success('Evento salvo com Sucesso"', "Sucesso!"),
          (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao salvar o evento', 'Erro!');
          },
          () => this.spinner.hide()
        );
      } else {
        this.evento = {id: this.evento.id, ...this.form.value};
        this.eventoService.putEvento(this.evento.id, this.evento).subscribe(
          () => this.toastr.success('Evento salvo com Sucesso"', "Sucesso!"),
          (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao salvar o evento', 'Erro!');
          },
          () => this.spinner.hide()
        );
      }
    }
  }
}
