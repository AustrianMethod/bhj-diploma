/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super( element ); 
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accSelect = document.querySelector('.accounts-select');
    Account.list( {}, ( err, response ) => {
      if (response?.success) {
        accSelect.insertAdjacentHTML('beforeend', `
          <option value="${response.id}">${response.name}</option>
          `)
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create( data, ( err, response) => {
      if (response?.success) {
        const form = this.element.closest('.modal');
        form.reset();
        Modal.close.call(form);
        App.update();
      }
    });

  }
}