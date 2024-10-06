/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ( options ) => {
    const {
      url,
      data: {
        email,
        password,
        name,
      },
    method,
    callback, //= ( err, response ) => {
    //       console.log( 'Ошибка:', err );
    //       console.log( 'Данные:', response );
    //   }, 
    } = options;
  
    const encodedEmail = encodeURIComponent( email );
    const encodedPassword = encodeURIComponent( password );
    const newURL = `${url}?mail=${encodedEmail}&password=${encodedPassword}`;
  
    const xhr = new XMLHttpRequest, formData = new FormData;
    xhr.responseType = 'json';
    xhr.onload = () => {
      if ( xhr.response.success ) {
        callback( null, xhr.response );
      } else {
        callback( xhr.response )
      }
    }
  
    if ( method === 'GET' ) {
      xhr.open( 'GET', newURL );
      xhr.send();
    } else if ( method === 'POST' ) {
      formData.append( 'mail', email );
      formData.append( 'password', password );
      xhr.open( 'POST', newURL );
      xhr.send( formData );   
    } else if ( method === 'DELETE' ) {
      xhr.open( 'DELETE', newURL );
      xhr.send();
    }
  };
