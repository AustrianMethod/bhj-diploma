/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static URL = '';

  static list( { email = null, password = null } = {}, callback ){
    createRequest({
      url: this.URL,
      data: { email, password },
      callback: ( err, response ) => callback( err, response ),
      method: 'GET',
    });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create( { email = null, password = null } = {}, callback ) {
    createRequest({
      url: this.URL,
      data: { email, password },
      callback: ( err, response ) => callback( err, response ),
      method: 'PUT',
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove( { email = null, password = null } = {}, callback ) {
    createRequest({
      url: this.URL,
      data: { email, password },
      callback: ( err, response ) => callback( err, response ),
      method: 'DELETE',
    });
  }
}
