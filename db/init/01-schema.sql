-- Se ejecuta automáticamente al crear el contenedor por primera vez.
CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT tasks_title_not_blank
    CHECK (LENGTH(TRIM(title)) > 0)
);

INSERT INTO tasks (title, completed)
VALUES ('Estudiar App Router', FALSE),
       ('Conectar PostgreSQL', TRUE);
