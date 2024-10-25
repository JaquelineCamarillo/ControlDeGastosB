import { Component, OnInit } from '@angular/core';
import { Gasto } from '../../models/Gasto';
import { GastosService } from '../../services/gastos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-gasto-form',
  templateUrl: './gasto-form.component.html',
  styleUrls: ['./gasto-form.component.css']
})
export class GastoFormComponent implements OnInit {

  gasto: Gasto = {
    Descripcion: '',
    Categoria: '',
    Monto: '',
    FechaTransaccion: '',
    MetodoPago: '',
    Comprobante: ''
  };

  isEditMode = false;
  gastoId: string | null = '';
  errorMessages: { [key: string]: string } = {};
  idUsuario: string | null = null;
  emailUsuario: string | null = null; // Variable para almacenar el correo del usuario

  constructor(
    private gastosService: GastosService,
    private emailService: EmailService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.idUsuario = localStorage.getItem('IdUsuario'); 
    this.emailUsuario = localStorage.getItem('EmailUsuario'); // Obtener el correo del usuario
    this.gastoId = this.route.snapshot.paramMap.get('id');
    this.gasto.FechaTransaccion = new Date().toISOString().split('T')[0];
    if (this.gastoId) {
      this.isEditMode = true;
      this.gastosService.getGasto(this.gastoId, this.idUsuario).subscribe(
        (gasto: Gasto) => {
          this.gasto = gasto;
        },
        err => console.log(err)
      );
    }
  }

  validateForm(): boolean {
    this.errorMessages = {}; 

    if (!this.gasto.Descripcion) {
      this.errorMessages['Descripcion'] = 'Agregue una descripción*';
    }
    if (!this.gasto.Categoria) {
      this.errorMessages['Categoria'] = 'Seleccione una categoría*';
    }
    if (!this.gasto.Monto || isNaN(Number(this.gasto.Monto)) || Number(this.gasto.Monto) <= 0) {
      this.errorMessages['Monto'] = 'Ingrese un monto válido (debe ser un número positivo)*';
    }
    if (!this.gasto.FechaTransaccion) {
      this.errorMessages['FechaTransaccion'] = 'Seleccione una fecha de transacción*';
    }
    if (!this.gasto.MetodoPago) {
      this.errorMessages['MetodoPago'] = 'Seleccione un método de pago*';
    }

    return Object.keys(this.errorMessages).length === 0;
  }

  saveGasto() {
    if (this.validateForm()) {
      console.log('IdUsuario:', this.idUsuario);
      console.log('Gasto:', this.gasto);
      const monto = Number(this.gasto.Monto);

      if (isNaN(monto) || monto <= 0) {
        this.errorMessages['Monto'] = 'Ingrese un monto válido (debe ser un número positivo)*';
        return;
      }

      this.gasto.Monto = monto.toString();

      const subject = this.isEditMode ? 'Gasto Actualizado' : 'Nuevo Gasto Registrado';
      const body = `Se ha ${this.isEditMode ? 'actualizado' : 'registrado'} un gasto:\n
        Descripción: ${this.gasto.Descripcion}\n
        Categoría: ${this.gasto.Categoria}\n
        Monto: ${this.gasto.Monto}\n
        Fecha: ${this.gasto.FechaTransaccion}\n
        Método de Pago: ${this.gasto.MetodoPago}`;

      if (this.isEditMode && this.gastoId) {
        this.gastosService.updateGasto(this.gastoId, this.idUsuario, this.gasto).subscribe(
          res => {
            console.log(res);
            this.notificationService.showNotification('Gasto actualizado correctamente');
            this.sendEmailNotification(subject, body); // Send email notification
            this.router.navigate(['/gastos/list']);
          },
          err => {
            console.log(err);
            this.notificationService.showNotification('Error al actualizar el gasto');
          }
        );
      } else {
        this.gastosService.saveGastos(this.idUsuario, this.gasto).subscribe(
          res => {
            console.log(res);
            this.notificationService.showNotification('Gasto guardado correctamente');
            this.sendEmailNotification(subject, body); // Send email notification
            this.router.navigate(['/gastos/list']);
          },
          err => {
            console.log(err);
            this.notificationService.showNotification('Error al guardar el gasto');
          }
        );
      }
    }
  }

  // Helper method to send email notifications
  private sendEmailNotification(subject: string, body: string) {
    if (this.emailUsuario) { // Verifica que el correo no sea nulo
      this.emailService.sendEmail(this.emailUsuario, subject, body).subscribe(
        res => {
          console.log('Email sent successfully:', res);
        },
        err => {
          console.log('Error sending email:', err);
        }
      );
    } else {
      console.log('No se encontró el correo electrónico del usuario.');
    }
  }
}
