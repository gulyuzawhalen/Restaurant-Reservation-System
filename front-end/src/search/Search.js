import React, { useState } from "react";
import { cancelReservation, listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../dashboard/ReservationsList";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [showResults, setShowResults] = useState(false);

  function changeHandler({ target: { value } }) {
    setMobileNumber(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    performSearch();
  }

  function performSearch() {
    setSearchError(null);
    setShowResults(false);
    listReservations({ mobile_number: mobileNumber })
      .then(setReservations)
      .then(() => setShowResults(true))
      .catch(setSearchError);
  }

  function onCancel(reservation_id) {
    const abortController = new AbortController();
    setCancelError(null);
    cancelReservation(reservation_id, abortController.signal)
      .then(performSearch)
      .catch(setCancelError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Search reservations</h1>
      <ErrorAlert error={searchError} />
      <ErrorAlert error={cancelError} />
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="form-group col-md-4 col-sm-12">
              <label htmlFor="mobile_number">Mobile Number:</label>
              <div className="input-group">
                <input
                  type="text"
                  id="mobile_number"
                  name="mobile_number"
                  className="form-control"
                  value={mobileNumber}
                  placeholder="Enter the customer's mobile number"
                  onChange={changeHandler}
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary">
                    <span className="oi oi-magnifying-glass" /> Find
                  </button>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
      {showResults && (
        <ReservationsList onCancel={onCancel} reservations={reservations} />
      )}
    </main>
  );
}

export default Search;
