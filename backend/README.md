
## Migration


```bash
docker-compose up
```

```bash
diesel migration generate create_users
```

```bash
diesel migration run
```

### Run

```bash
cargo run config.yml
```


## Docker

```bash
docker build . -t rust_app
```

```bash
docker image ls
```

```bash
docker run -d --name rust_app -p 8000:8000 rust_app
```
