import React, { useState } from "react";
import validate from "./validate";
import ValidationErrors from "./ValidationErrors";

function ReservationForm({
  onSubmit,
  onCancel,
  initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  },
}) {
  const [reservation, setReservation] = useState(initialState);
  const [errors, setErrors] = useState([]);

  function changeHandler({ target: { name, value } }) {
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }

  function numberChangeHandler({ target: { name, value } }) {
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: Number(value),
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    const validationErrors = validate(reservation);

    if (validationErrors.length) {
      return setErrors(validationErrors);
    }

    onSubmit(reservation);
  }

  return (
    <form onSubmit={submitHandler}>
      <ValidationErrors errors={errors} />
      <fieldset>
        <div className="row">
          <div className="form-group col">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-control"
              value={reservation.first_name}
              required={true}
              placeholder="First Name"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group col">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              value={reservation.last_name}
              required={true}
              placeholder="Last Name"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group col">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              className="form-control"
              value={reservation.mobile_number}
              required={true}
              placeholder="Mobile Number"
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col">
            <label htmlFor="reservation_date">Date</label>
            <input
              type="date"
              id="reservation_date"
              name="reservation_date"
              className="form-control"
              value={reservation.reservation_date}
              required={true}
              placeholder="yyyy-mm-dd"
              pattern="\d{4}-\d{2}-\d{2}"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group col">
            <label htmlFor="date">Time</label>
            <input
              type="time"
              id="reservation_time"
              name="reservation_time"
              className="form-control"
              value={reservation.reservation_time}
              required={true}
              placeholder="09:20"
              pattern="[0-9]{2}:[0-9]{2}"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group col">
            <label htmlFor="people">People</label>
            <input
              type="number"
              id="people"
              name="people"
              className="form-control"
              aria-label="Number of people"
              required={true}
              value={reservation.people}
              min={1}
              onChange={numberChangeHandler}
            />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-2 cancel"
          onClick={onCancel}
        >
          <span className="oi oi-x" /> Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <span className="oi oi-check" /> Submit
        </button>
      </fieldset>
    </form>
  );
}

export default ReservationForm;