// Custom Http Module
function customHttp() {
  return {
    getUrl(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = '25eed8f7cb9c40f8b692cdf754b8c0e8',
    apiUrl = 'https://news-api-v2.herokuapp.com';

  return {
    topHeadlines(country = 'ru', cb) {
      http.getUrl(`${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,
        cb);

    },
    everything(query, cb) {
      http.getUrl(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,
        cb);
    }
  };

})();

//Elements 

const form = document.forms['newsControls'],
  countrySelect = form.elements['country'],
  searchInput = form.elements['search'];

form.addEventListener('submit', e => {
  e.preventDefault();
  loadNews();
});




//  init selects
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
  loadNews();
});

function loadNews() {
  showLoader();
  const country = countrySelect.value,
    searchText = searchInput.value;

  if (!searchText) {
    newsService.topHeadlines(country, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }
}

function onGetResponse(err, res) {
  removeLoader();
  if (err) {
    showAlert(err, 'error-msg');
    return;
  }
  renderNews(res.articles);
}

function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = '';

  news.forEach(item => {
    const el = newsTemplate(item);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML('afterbegin', fragment);


}

function clearContainer(container) {
  let child = container.lastElementChild;

  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }

}

function newsTemplate({
  urlToImage,
  title,
  url,
  description
}) {
  return `
  <div class="col s12">
    <div class="card">
      <div class="card-image">
        <img src="${urlToImage}" alt="img">
        <span class="card-title">${title || ''}</span>
      </div>
      <div class="card-content">
        <p>${description || ''}</p>
      </div>
      <div class="card-action">
       <a href=${url}>Read more</a>
      </div>
    </div>
  </div>
  `;

}

function showAlert(msg, type = 'success') {
  M.toast({
    html: msg,
    classes: type
  });
}

function showLoader() {
  document.body.insertAdjacentHTML('afterbegin', `

  <div class="progress">
    <div class="indeterminate"></div>
  </div>
  
  `);
}

function removeLoader() {
  const loader = document.querySelector('.progress');
  if (loader) {
    loader.remove();
  }
}