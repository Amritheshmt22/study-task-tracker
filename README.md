# Study Task Tracker

A simple frontend-only web app to plan study tasks, mark them done, and filter the list. Built with plain HTML, CSS and JavaScript - no frameworks, no build step, no backend.

## Features

- Add study tasks
- Mark tasks as completed (or undo)
- Delete tasks
- Filter by All / Active / Completed
- "Tasks left" counter
- Clear all completed tasks at once
- Tasks are saved in the browser (`localStorage`), so they survive a page reload
- Responsive layout that works on desktop and mobile

## How to run

No installation needed. Either:

- Double-click `index.html` to open it in your browser, or
- Serve the folder with any static server, e.g.:

```bash
npx serve .
```

## How it works

- `index.html` - page structure: the add-task form, filter buttons and the task list
- `styles.css` - all styling, including the responsive layout for small screens
- `script.js` - app logic:
  - tasks are kept in a JavaScript array
  - every change (add / toggle / delete / clear) re-renders the list and saves the array to `localStorage`
  - on page load, saved tasks are read back from `localStorage`

## Note

This project was built with the help of an AI assistant (Instinct) as a learning project.
