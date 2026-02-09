import { Component, inject } from '@angular/core';
import { Usuarios } from '../../Services/usuarios';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
usuarioService = inject(Usuarios);
  Router=inject(Router);


loginForm: FormGroup = new FormGroup({
  email: new FormControl(),
  password: new FormControl(),
})


 async onSubmit() {
   // 1. Verificamos si el formulario es válido antes de enviar
  console.log('Datos del formulario:', this.loginForm.value);
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched(); // Marca los campos para que salten los errores de CSS
    return;
  }

  try {
    const response = await this.usuarioService.login(this.loginForm.value);

    // 2. Guardamos el token 
    if (response && response.token) {
      localStorage.setItem('token', response.token);

    //  ### TODO ://PROBAMOS LA PAGINA QUE DIJO MARIO ? angular toastr
      await Swal.fire({
        title: '¡Bienvenido!',
        text: 'Inicio de sesión correcto',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      if (this.loginForm.value.email === 'admin@retaurante.com'){
        this.Router.navigateByUrl('/admin')
      }else
      
      this.Router.navigateByUrl('/reserva'); 
    }

  } catch (error) {

    await Swal.fire({
      title: 'Error al iniciar sesión',
      text: 'Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.',
      icon: 'error', 
      confirmButtonColor: '#ffc107',
      confirmButtonText: 'Reintentar'
    });
    console.error('Error en Login:', error);
  }
}

}
