/**
* PHP Email Form Validation - v3.1
* URL: https://bootstrapmade.com/contact-form/
* Author: BootstrapMade.com
*/
(async function () {
  "use strict";

  let forms = document.querySelectorAll('.contact-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', async function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if (!formData.get('h-captcha-response')) {
        return displayError(thisForm, 'Please complete the hCaptcha.');
      }

      if (!(formData.get('name') || formData.get('email') || formData.get('message'))) {
        return displayError(thisForm, 'Please fill all the fields.');
      }

      return await submit_form(thisForm, formData);
    });
  });

  async function submit_form(thisForm, formData) {
    await fetch("https://api.my-ip.io/ip.json", {
      method: 'GET'
    })
    .then(async res => {
      let response = await res.json();
      if( !response.ip) {
        return displayError(thisForm, 'An Internal Error Occurred while Handling the Request.');
      } else {
        let ip = response.ip;
        let name = formData.get('name');
        let email = formData.get('email');
        let message = formData.get('message');
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000*'+5.5'));
        var date = nd.toLocaleString().replace(",", " |");
        var text = `Name: ${name}%0Ae-Mail: ${email}%0AMessage: ${message}%0ATimestamp: ${date}%0AIP: %60${ip}%60%0AWebsite: ${window.location.href}`

        await fetch(`https://api.telegram.org/bot1842975601:AAHq11rgnXIyA2P2COG3OAqHoOFCYYVO-44/sendMessage?chat_id=1705132727&text=${text}&disable_web_page_preview=true&parse_mode=markdown`, {
          method: 'POST'
        })
        .then(response => {
          if( response.ok == false) {
            throw new Error(`${response.status} ${response.statusText}`); 
          }

          thisForm.querySelector('.loading').classList.remove('d-block');
          if (response.ok == true) {
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.reset();
            window.grecaptcha.reset();
          } else {
            throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
          }
        })
        .catch((error) => {
          displayError(thisForm, error);
        });
      }
    });
  }

    function displayError(thisForm, error) {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.error-message').innerHTML = error;
      thisForm.querySelector('.error-message').classList.add('d-block');
    }

})();
