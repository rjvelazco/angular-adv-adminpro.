import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Services
import { UsuarioService } from '../../services/usuario.service';

declare const gapi:any


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:['./login.component.css']
  // styleUrls: ["../../../assets/css/pages/login-register-lock.css"]
})
export class LoginComponent implements OnInit {

  public formSubmitted: boolean = false;
  public auth2: any;
  
  public loginForm: FormGroup = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [localStorage.getItem('remember') || false]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.renderButton();
  }

  login() {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.usuarioService.login(this.loginForm.value)
      .subscribe((resp) => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
          localStorage.setItem('remember', this.loginForm.get('remember').value);
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('remember');

        }
        this.router.navigateByUrl('/dashboard');
      }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.error.msg,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
      });
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    
    this.startApp();
  }

  async startApp() {
    
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token)
            .subscribe((resp) => {
              this.ngZone.run(() => {
                this.router.navigateByUrl('/dashboard');
              });
            });
          
        }, (error) =>{
          alert(JSON.stringify(error, undefined, 2));
        });
  }

  validarCampos(campo: string): boolean{
    return this.loginForm.get(campo).invalid && this.formSubmitted;

  }

}
