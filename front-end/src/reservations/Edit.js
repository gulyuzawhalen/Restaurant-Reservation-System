import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import { formatAsDate } from "../utils/date-time";

function Edit() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState({});
  const [reservationError, setReservationError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);

    return () => abortController.abort();
  }, [reservation_id]);

  function submitHandler(reservation) {
    const abortController = new AbortController();
    setReservationError(null);
    updateReservation(
      { reservation_id, ...reservation },
      abortController.signal
    )
      .then((updatedReservation) => {
        history.push(
          `/dashboard?date=${formatAsDate(updatedReservation.reservation_date)}`
        );
      })
      .catch(setReservationError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.goBack();
  }

  const child = reservation.reservation_id ? (
    <ReservationForm
      initialState={reservation}
      onSubmit={submitHandler}
      onCancel={cancelHandler}
    />
  ) : (
    <p>Loading...</p>
  );

  return (
    <main>
      <h1>Edit Reservation #{reservation.reservation_id}</h1>
      <ErrorAlert error={reservationError} />
      {child}
    </main>
  );
}

export default Edit;
