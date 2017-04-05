var Gimmie = {
  content: document.querySelector('.content'),
  form: document.querySelector('form'),
  toggleLoading: function() {
    this.content.classList.toggle('content--loading');
    var button = this.form.querySelector('button');
  },
  userInput: '',
  userInputIsValid: false,
  appId: '',
  urlToAsk: '',
  throwError: function(header, text) {
    var errorMsg = '<p><strong>' + header + '</strong>' + text + '</p>';
    this.content.innerHTML = errorMsg;
    this.content.classList.add('content--error');
    this.content.classList.add('content--error-pop');
    this.toggleLoading();
    setTimeout(function() {
      Gimmie.content.classList.remove('content--error-pop');
    }, 333);
  },
  doRequest: function(url) {
    var head = document.head;
    var script = document.createElement("script");

    script.setAttribute("src", url);
    head.appendChild(script);
    head.removeChild(script);
  },
  requestCallback: function (data) {
    var response = data.results[0];
    if(response && response.artworkUrl512 != null){
      Gimmie.render(response);
    } else {
      Gimmie.throwError(
        'Invalid Response',
        'The request you made appears to not have an associated icon. <br> Try a different URL.'
      );
    }
  },
  render: function(response) {
    var result = document.createDocumentFragment();

    var icon = new Image();
    icon.src = response.artworkUrl512;
    result.appendChild(icon);
    var h4 = document.createElement('h4');
    h4.innerHTML = response.trackName;
    result.appendChild(h4);

    while (Gimmie.content.hasChildNodes()) {
      Gimmie.content.removeChild(Gimmie.content.lastChild);
    }
    Gimmie.content.classList.remove('content--error');
    Gimmie.content.appendChild(result);

    Gimmie.toggleLoading();

    if(response.kind != 'mac-software') {
      var mask = new Image();
      mask.src = 'assets/img/icon-mask.png';
      mask.onload = function() {
          Gimmie.content.prepend(this);
      }
    }
  },
  validate: function(input) {
    var regUrl = /^(http|https):\/\/itunes/;
    var regId = /\/id(\d+)/i;

    if(regUrl.test(this.userInput) && regId.test(this.userInput)) {
      this.userInputIsValid = true;
      var id = regId.exec(this.userInput);
      this.appId = id[1];
      this.urlToAsk = 'https://itunes.apple.com/lookup?id=' + this.appId + '&callback=Gimmie.requestCallback';
    } else {
      this.userInputIsValid = false;
      this.appId = '';
      this.urlToAsk = '';
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  Gimmie.form.addEventListener('submit', function(e) {
    e.preventDefault();
    Gimmie.toggleLoading();
    Gimmie.userInput = document.querySelector('form input').value;
    Gimmie.validate();

    if(Gimmie.userInputIsValid) {
      Gimmie.doRequest(Gimmie.urlToAsk);
    } else {
      Gimmie.throwError(
        'Invalid link',
        'You must submit a standard iTunes store link with an ID, i.e. <br> <a href="https://itunes.apple.com/us/app/twitter/id333903271?mt=8">https://itunes.apple.com/us/app/twitter/<em>id333903271</em>?mt=8</a>'
      );
    }
  })
});
