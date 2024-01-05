![smart-book-readme-top-image](https://github.com/weilantian/smart-book-app/assets/13176782/1729c3cc-1312-4f68-a5a5-1497745d9de1)

SmartBook is an open-source event scheduling tool powered by React and Nestjs.

<p align="center">
<a href="https://github.com/weilantian/smart-book-server">
<img alt="Static Badge" src="https://img.shields.io/badge/check-Server_Repo-red"/>
</a>
<img alt="" src="https://camo.githubusercontent.com/a383406ed85b562e8eecb5f832165f837f2a049a70c574ddc54b3a6e4318ddef/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f406e6573746a732f636f72652e737667" />
<a href="https://api.smart-book.ericwei.fyi/api">
<img alt="Static Badge" src="https://img.shields.io/badge/Api_Doc-Swagger-green"/>
</a>

</p>

## Features

**Create links for booking and reservation**

For the event host, simply use the dragging gesture to block out available slots, an event link is then generated ready to be shared.

**Intelligently compute available slots for bookers**

The link created for booking and reservation can be accessed by event participants, which shows all the available slots that are not been booked.

**An intuitive interface to view all booked slots**

Once events are booked, the event schedulers are able to see all the booked slots on the home page

## Technology Overview

### Frontend

The frontend of SmartBook is powered by NextJS. It utilizes components from the Mantine UI library together with custom styling defined in CSS Modules.

The Interactive Event View was made from scratch, and to better define how it responds to gestures, it connects to a state machine made with the XState library.

Axios is used to make API calls, and it utilizes react-query to manage caching for better performance.

### Backend

The backend of SmartBook is powered by Nest.js, it handles user authentication and validation with JWT and connects to a Postgres database. For more details on the backend, please check the server repo.
