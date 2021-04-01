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

# Can I use or destructure `process.env` directly?

No. We use webpack's `DefinePlugin` to replace occurrences of `process.env.FOO` in your code with the value of `FOO` as defined in your `.env` file. To support something like

```js
const env = process.env
```

or

```js
const { FOO, BAR, BAZ } = process.env
```

we would need to replace all occurrences of `process.env` with everything you put in your `.env`, **including secrets** you do not want in your finished builds. To protect you from accidentally exposing your secrets, `envjoi` does not support destructuring.

# Installation

`npm install --save-dev @twiddler/envjoi`

# API

`function envjoi(schema: Joi.ObjectSchema, path?: string): DefinePlugin`:

-   `schema` of your environment variables defined with `Joi`
-   `path` to your `.env` file (default to `./.env`)
-   returns an instance of `webpack.DefinePlugin`

# Contributors

Pull requests are always welcome! :)
