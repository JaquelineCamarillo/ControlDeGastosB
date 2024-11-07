import { Component, OnInit, HostBinding } from '@angular/core';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';  // Importa NotificationService

@Component({
  selector: 'app-registrarse-form',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit {
  @HostBinding('class') classes = 'row';

  usuario: Usuario = {
    Nombre: '',
    ApPaterno: '',
    ApMaterno: '',
    NumTelefono: '',
    Correo: '',
    FechaNacimiento: '',
    Usuario: '',
    Contrasena: ''
  };

  confirmarContrasena: string = ''; // Nueva propiedad para confirmar la contraseña

  errorMessages: { [key: string]: string } = {};

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private notificationService: NotificationService  // Inyecta NotificationService
  ) {}

  ngOnInit() {}

  validateForm(): boolean {
    this.errorMessages = {}; // Reset error messages

    if (!this.usuario.Nombre || !this.isValidName(this.usuario.Nombre)) {
      this.errorMessages['Nombre'] = 'Ingrese un nombre válido (solo letras, inicia con mayúscula)*';
    }
    if (!this.usuario.ApPaterno || !this.isValidName(this.usuario.ApPaterno)) {
      this.errorMessages['ApPaterno'] = 'Ingrese un apellido paterno válido (solo letras, inicia con mayúscula)*';
    }
    if (!this.usuario.ApMaterno || !this.isValidName(this.usuario.ApMaterno)) {
      this.errorMessages['ApMaterno'] = 'Ingrese un apellido materno válido (solo letras, inicia con mayúscula)*';
    }
    if (!this.usuario.NumTelefono || !this.isValidPhoneNumber(this.usuario.NumTelefono)) {
      this.errorMessages['NumTelefono'] = 'Ingrese un número de teléfono válido (10 dígitos)*';
    }
    if (!this.usuario.Correo || !this.isValidEmail(this.usuario.Correo)) {
      this.errorMessages['Correo'] = 'Ingrese un correo electrónico válido*';
    }
    if (!this.usuario.FechaNacimiento || !this.isOver18(this.usuario.FechaNacimiento)) {
      this.errorMessages['FechaNacimiento'] = 'Debe tener al menos 18 años para registrarse*';
    }
    if (!this.usuario.Usuario) {
      this.errorMessages['Usuario'] = 'Ingrese un nombre de usuario*';
    }
    if (!this.usuario.Contrasena || !this.isValidPassword(this.usuario.Contrasena)) {
      this.errorMessages['Contrasena'] = 'La contraseña debe tener al menos 8 caracteres, incluyendo un número o carácter especial*';
    }
    if (this.usuario.Contrasena !== this.confirmarContrasena) {
      this.errorMessages['ConfirmarContrasena'] = 'Las contraseñas no coinciden*';
    }

    return Object.keys(this.errorMessages).length === 0;
  }

  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isOver18(dateOfBirth: string): boolean {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  }

  isValidName(name: string): boolean {
    const nameRegex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/;
    return nameRegex.test(name);
  }

  isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  saveNewUsuario() {
    if (this.validateForm()) {
      this.usuarioService.createUser(this.usuario).subscribe(
        res => {
          this.notificationService.showNotification('Cuenta creada exitosamente');  // Muestra notificación
          this.router.navigate(['/home']);
        },
        err => {
          // Dependiendo del error devuelto por el backend, muestra el mensaje adecuado
          let errorMessage = 'Hubo un error al crear la cuenta';
          
          if (err.status === 400) {
            // Error específico basado en el código de estado HTTP 400
            if (err.error && err.error.error) {
              if (err.error.error === 'Correo electrónico ya registrado') {
                errorMessage = 'Este correo electrónico ya está registrado.';
              } else if (err.error.error === 'Nombre de usuario ya registrado') {
                errorMessage = 'Este nombre de usuario ya está registrado.';
              }
            }
          }
  
          this.notificationService.showNotification(errorMessage);  // Muestra notificación de error
          console.error(err);  // Muestra el error en la consola para fines de depuración
        }
      );
    }
  }
  
}