Angular 19 Recursive Tree Editor

This project is a dynamic, recursive tree structure editor built with Angular 19.2.0 and powered by Reactive Forms. All operations are fully synchronized with a REST API, backed by a json-server running on port 3000.

Tech Stack

Framework: Angular 19.2.0

Runtime: Node.js v22.x or v23.x

Database: json-server (mock API with db.json)

📂 Features

✅ Recursive component rendering using standalone components

✅ Add/edit/delete tree nodes with nested children

✅ Expand/collapse nodes UI behavior

✅ REST API sync on every operation (add/update/delete)

✅ Form state tracking (dirty check, validation)

✅ UUID-based client-side ID generation

✅ Type-safe implementation using TreeNodeFormGroup

✅ Fully decoupled form logic and API layer via services

⚙️ Setup Instructions

1. Clone the repository

git clone https://github.com/your-username/angular-tree-project.git
cd angular-tree-project

2. Install dependencies

npm install

3. Start the Angular dev server

ng serve

By default, the app runs on http://localhost:4200

  Start JSON Server

This project uses a local json-server for data persistence.

1. Install json-server globally (if not yet)

npm install -g json-server

2. Run the server on port 3000

json-server --watch db.json --port 3000

API base URL: http://localhost:3000


Requirements

Node.js version v22.x or v23.x is required.

Angular CLI installed globally:
npm install -g @angular/cli