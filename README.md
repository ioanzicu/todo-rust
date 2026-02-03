# Oh My Gorgeous Todo APP in Rust

### 🛠 Project Stack

#### 🦀 **Backend**
* [Rust](https://rust-lang.org/) — High-performance, memory-safe systems programming.
* [Diesel](https://diesel.rs/) — Safe, extensible ORM and Query Builder.
* [Postgres](https://www.postgresql.org/) — Robust relational database for data integrity.

---

#### 🖥️ **Frontend**
* [React](https://react.dev/) — Declarative UI components.
* [Electron](https://www.electronjs.org/) — Cross-platform desktop application framework.

#### **Tools** 
- newman
- postman
- docker 
- postgres
- redis

## An amazing to-do web app in Rust using Actix Framework!


- `/backend/`

    ```bash
    cd backend
    ```


    ```bash
    cargo run
    ```

- `/frontend/`

    ```bash
    cd frontend
    ```

    - React

        ```bash
        npx run dev
        ```

    - Electron

        ```bash
        npx electron:dev
        ```

## Version 0.01 - WEB 1.0 Static HTML
### SSR static HTML templates with CSS and JS injection on server side.

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/v1/item/get`

![HTML templates version](/assets/image-v1.png)


## Version 0.02 - WEB 2.0 Dynamic HTML
### React UI

```bash
make react-dev
```


- `http://localhost:5173/`

![alt text](/assets/image-v2.png)

## Version 0.03 - DESKTOP
### Electron UI

```bash
make electron-dev
```

OR

```bash
make electron-prod
```


![alt text](/assets/image-v3.png)