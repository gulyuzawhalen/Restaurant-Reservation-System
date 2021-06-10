import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import ReservationCreate from "../reservations/ReservationCreate";
import Edit from "../reservations/Edit";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time";
import TableCreate from "../tables/TableCreate";
import Seat from "../reservations/Seat";
import Search from "../search/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreate />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <Edit />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="/tables/new">
        <TableCreate />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={query.get("date") || today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
