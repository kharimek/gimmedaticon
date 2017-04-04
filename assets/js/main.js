var Gimmie = {
  content: document.querySelector('.content'),
  form: document.querySelector('form'),
  toggleLoading: function() {
    this.content.classList.toggle('content--loading');
    var button = this.form.querySelector('button');
    button.setAttribute('disabled', true);
  },
  userInput: '',
  userInputIsValid: false,
  appId: '',
  urlToAsk: '',
  validate: function(input) {
    var regUrl = /^(http|https):\/\/itunes/;
    var regId = /\/id(\d+)/i;

    if(regUrl.test(this.userInput) && regId.test(this.userInput)) {
      this.userInputIsValid = true;
      var id = regId.exec(this.userInput);
      this.appId = id[1];
      this.urlToAsk = 'https://itunes.apple.com/lookup?id=' + this.appId;
    } else {
      this.userInputIsValid = false;
      this.appId = '';
      this.urlToAsk = '';
    }
  },
  throwError: function(header, text) {
    var errorMsg = '<p><strong>' + header + '</strong>' + text + '</p>';
    this.content.innerHTML = errorMsg;
    this.content.classList.toggle('content--error');
    this.content.classList.toggle('content--error-pop');
    this.toggleLoading();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  Gimmie.form.addEventListener('submit', function(e) {
    e.preventDefault();
    Gimmie.toggleLoading();
    Gimmie.userInput = document.querySelector('form input').value;
    Gimmie.validate();

    if(Gimmie.userInputIsValid) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
        }
      };

      xhttp.open("GET", Gimmie.urlToAsk, true);
      xhttp.send();

      xhttp.addEventListener("load", function(data) {
        alert('sukces');
        console.log(data);
      });
    } else {
      Gimmie.throwError(
        'Invalid link',
        'You must submit a standard iTunes store link with an ID, i.e. <br> <a href="https://itunes.apple.com/us/app/twitter/id333903271?mt=8">https://itunes.apple.com/us/app/twitter/<em>id333903271</em>?mt=8</a>'
      );
    }
  })
});
