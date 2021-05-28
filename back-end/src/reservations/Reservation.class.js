/**
 * A class that holds data for a specific reservation
 */
class Reservation {
  /**
   *
   * @param {string} first_name
   * @param {string} last_name
   * @param {string} mobile_number
   * @param {string} reservation_date
   * @param {string} reservation_time
   * @param {number} people - number of people for a reservation
   */
  constructor(
    first_name = null,
    last_name = null,
    mobile_number = null,
    reservation_date = null,
    reservation_time = null,
    people = null,
    status = null
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.mobile_number = mobile_number;
    this.reservation_date = reservation_date;
    this.reservation_time = reservation_time;
    this.people = people;
    this.status = status;
  }

  /**
   * Gets regex that will validate the data
   */
  get regexForData() {
    return {
      first_name: /\w{1,100}/,
      last_name: /\w{1,100}/,
      mobile_number: /([0-9]{3}[-][0-9]{3}[-][0-9]{4})|([0-9]{3}[-][0-9]{4})/,
      reservation_date: /[0-9]{4}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])/,
      reservation_time: /([0-1][0-9]|2[0-4]):[0-5][0-9]/,
      people: /[0-9]{1,3}/,
    };
  }

  validateArgs() {
    const reg = this.regexForData;
    let toReturn = "";
    for (const prop in reg) {
      if (!reg[prop].test(this[prop]) || this[prop] === null) {
        toReturn += ` ${prop}`;
      }
    }

    if (typeof this.people !== "number" || this.people === 0) {
      toReturn += " people";
    }

    if (this.status === "finished" || this.status === "seated") {
      toReturn += ` status, you entered ${this.status}`;
    }

    return toReturn ? toReturn : false;
  }
}

module.exports = Reservation;
