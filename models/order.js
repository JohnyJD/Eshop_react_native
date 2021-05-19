import moment from "moment";
// Model objednavky
class Order {
  constructor(id, items, total, date) {
    this.id = id;
    this.items = items;
    this.total = total;
    this.date = date;
  }
  // Formatovanie datumu pridania objednavky
  get formatDate() {
    return moment(this.date).format("MMMM Do YYYY, h:mm");
  }
}

export default Order;
