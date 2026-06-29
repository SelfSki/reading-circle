# Architecture

## Design Principles

The project is intentionally built without frameworks.

The goal is to understand the fundamentals before introducing abstraction.

---

## Folder Structure

css/
Contains styling.

js/
Contains application logic.

assets/
Static resources.

---

## Rendering Flow

books.js

↓

app.js

↓

createBookCard()

↓

renderBooks()

↓

Browser

---

## Philosophy

Data drives the interface.

The interface should never contain hardcoded books.

Instead, the UI is generated from the data model.

We are not building the fastest solution. We are building the clearest solution.

If a beginner can open this repository a year from now and understand how it works in under an hour, we've succeeded.