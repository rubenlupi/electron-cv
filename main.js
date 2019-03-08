'use strict'

const path = require('path')
const { app, ipcMain } = require('electron')
const Window = require('./Window')
const DataStore = require('./DataStore')
const registerWindowController = require('./renderer/controllers/register-window')
const windowNames = require('./global-constants').windowNames
require('electron-reload')(__dirname)

// create a new todo store name "Todos Main"
const todosData = new DataStore({ name: 'Todos Main' })
let openedWindows = {};
const registerWindows = ({ mainWindow, ipcMain, openedWindows }) => {
  const windows = windowNames.map(window => {
    return { file:  path.join('renderer', 'windows', window, `${window}.html`), name: window, event: window }
  });
  windows.forEach( window =>  registerWindowController.registerWindow({ mainWindow, ipcMain, openedWindows, window }));
}

const main = () => {
  // todo list window
  let mainWindow = new Window({
    width:600,
    height:800,
    file: path.join('renderer', 'index.html')
  });

  // initialize with todos
  mainWindow.once('show', () => {
    mainWindow.setResizable(false);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.send('todos', todosData.todos)
  });

  registerWindows({ mainWindow, ipcMain, openedWindows });

  ipcMain.on('add-todo', (event, todo) => {
    const updatedTodos = todosData.addTodo(todo).todos
    mainWindow.send('todos', updatedTodos)
  });

  ipcMain.on('delete-todo', (event, todo) => {
    const updatedTodos = todosData.deleteTodo(todo).todos
    mainWindow.send('todos', updatedTodos)
  });
}

app.on('ready', main);

app.on('window-all-closed', function () {
  app.quit()
});

