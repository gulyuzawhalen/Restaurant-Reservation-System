import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import { formatAsDate } from "../utils/date-time";

function ReservationCreate() {
  const history = useHistory();

  const [error, setError] = useState(null);

  function submitHandler(reservation) {
    const abortController = new AbortController();
    setError(null);
    createReservation(reservation, abortController.signal)
      .then((savedReservation) => {
        history.push(
          `/dashboard?date=${formatAsDate(savedReservation.reservation_date)}`
        );
      })
      .catch(setError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.goBack();
  }

  return (
    <main>
      <h1>Create Reservation</h1>
      <ErrorAlert error={error} />
      <ReservationForm onSubmit={submitHandler} onCancel={cancelHandler} />
    </main>
  );
}

export default ReservationCreate;