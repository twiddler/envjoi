Use `envjoi` to read, validate and use environment variables from an `.env` file when building with webpack and in your finished build as well!

# Example usage

```ts
// webpack.config.ts

import { envjoi } from 'envjoi'

const envSchema = Joi.object({
    PORT: Joi.number().greater(0).default(8080),
    PUBLIC_PATH: Joi.string().required(),
})

const envjoiPlugin = envjoi(envSchema)

const configuration: webpack.Configuration = {
    output: {
        // Use all environment variables including
        // those from .env in your webpack config
        publicPath: process.env.PUBLIC_PATH,
    },

    plugins: [
        // Only expose environment variables
        // validated against your Joi schema in
        // your builds.
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
