Use `envjoi` to read and validate your environment variables from an `.env` file and make them available in your finished build as well!

# Example webpack configuration

```ts
import { envjoi } from 'envjoi'

const envSchema = Joi.object({
    PORT: Joi.string()
        .regex(/^[0-9]+$/u)
        .default('8080'),
})

const envjoiPlugin = envjoi(envSchema)

const configuration: webpack.Configuration = {
    plugins: [
        envjoiPlugin,
    ],
    ...
```

# Example use in build

You can access a single environment variable ...

```js
const FOO = process.env.FOO
```

... or all at once ...

```js
const env = process.env
```

... or destructure what you need ...

```js
const { foo, bar, baz } = process.env
```

# Installation

`npm install --save-dev @twiddler/envjoi`

# API

`function envjoi(schema: Joi.ObjectSchema, path?: string): DefinePlugin`:

-   `schema` of your environment variables defined with `Joi`
-   `path` to your `.env` file (default to `./.env`)
-   returns an instance of `webpack.DefinePlugin`

# Limitations

You can only use strings in your `schema`. Use regular expressions to allow only numbers and parse to your desired types when needed.

# Contributors

Pull requests are always welcome! :)
