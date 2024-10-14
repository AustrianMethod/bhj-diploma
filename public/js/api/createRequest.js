/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ( options ) => {
    const {
    url,
    method,
    callback,
    data: {
      email,
      password,
    } = {},
    
    //= ( err, response ) => {
    //       console.log( 'Ошибка:', err );
    //       console.log( 'Данные:', response );
    //   }, 
    } = options;

    console.log(callback)
  
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
      const encodedEmail = encodeURIComponent( email );
      const encodedPassword = encodeURIComponent( password );
      const newURL = `${url}?mail=${encodedEmail}&password=${encodedPassword}`;
      xhr.open( 'GET', newURL );
      xhr.send();
    } else if ( method === 'POST' ) {
      formData.append( 'mail', email );
      formData.append( 'password', password );
      xhr.open( 'POST', url );
      xhr.send( formData );   
    } else if ( method === 'DELETE' ) {
      formData.append( 'mail', email );
      formData.append( 'password', password );
      xhr.open( 'DELETE', url );
      xhr.send( formData );
    }
  };
