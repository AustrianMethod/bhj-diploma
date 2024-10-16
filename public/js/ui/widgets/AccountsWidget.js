/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if ( !element ) throw new Error( 'передан пустой элемент' );
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAcc = document.querySelector( '.create-account' );
    const accPanel = document.querySelector( '.accounts-panel' );

    createAcc.addEventListener( 'click', ( e ) => {
      e.preventDefault();
      App.getModal( 'createAccount' );
    })

    accPanel.addEventListener( 'click', ( e ) => {
      e.preventDefault();
      if  ( e.target.closest( 'account' ) ) {
        this.onSelectAccount( e.target.closest('account') )
      };
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if ( User.current() && User.current() !== 'undefined' ) {
      console.log(User.current())
      Account.list( {}, ( err, response ) => {
        if ( response?.success ) {
          this.clear();
          console.log(response)
        }
      })?.forEach( e => this.renderItem( e ) );
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accElems = document.querySelectorAll('.sidebar-menu .account');
    accElems.forEach( element => element.remove() );
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    let prevElement = null;
    if (prevElement) {
      prevElement.classList.remove('.active')
    }
    element.classList.add('.active');
    prevElement = element;
    App.showPage( 'transactions', { account_id: element.account_id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const str = 
     `<li class="active account" data-id="${item.id}">
        <a href="#">
          <span>${item.name}</span> /
          <span>${item.sum}</span>
        </a>
      </li>`;
    return str;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(data));
  }
}
