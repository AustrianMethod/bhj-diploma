/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('переданный element не существует');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccBtn = document.querySelector('.remove-account');
    const removeTrBtn = document.querySelector('.transaction__remove');

    removeAccBtn.addEventListener('click', () => {
      this.removeAccount();
    });

    removeTrBtn?.addEventListener('click', () => {
      this.removeTransaction();
    })

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if( this.lastOptions ) {
      const userResponse = confirm('Вы действительно хотите удалить счёт?');
      if( userResponse ) {
        Account.remove( this.lastOptions.account_id, ( err, response ) => {
          if ( response?.success ) {
            App.updateForms();
            App.updateWidgets();
          };
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const userResponse = confirm('Вы действительно хотите удалить счёт?');
    if( userResponse ) {
      Transaction.remove( id, ( err, response ) => {
        if ( response?.success ) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ){
    if( options ) {
      this.lastOptions = options;
      const { account_id } = options;
      Account.get(account_id, ( err, response ) => {
        if(response.success) {
          TransactionsPage.renderTitle( account_id );
          Transaction.list( ( err, response ) => {
            TransactionsPage.renderTransactions();
          } );
        } else {
          console.log( 'Ошибка:', err.success )
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const title = document.querySelector('.content-title');
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const newDate = new Date(date);
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const day = newDate.getDate();
    const month = months[newDate.getMonth()];
    const year = newDate.getFullYear();
    const hours = newDate.getHours().toString().padStart(2, '0');
    const minutes = newDate.getMinutes().toString().padStart(2, '0');

    
    return `${day} ${month} ${year} г. в ${hours}:${minutes}`
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">Новый будильник</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id=${item.id}>
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = document.querySelector('.content');
    data.forEach( item => content.insertAdjacentHTML('beforeend', this.getTransactionHTML(item)) ); 
  }
}