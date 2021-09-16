import * as dotenv from 'dotenv'
import * as Joi from 'joi'
import { resolve } from 'path'
import { DefinePlugin } from 'webpack'

export function envjoi(
    schema: Joi.ObjectSchema,
    path = resolve(process.cwd(), '.env')
) {
    // Add environment variables from .env file to process.env
    config(path)

    // Validate and set defaults
    const validVars = validate(schema)
    setEnvironmentVariables(validVars)

    // Return webpack plugin
    const prefixedVars = prefix(validVars)
    return new DefinePlugin(prefixedVars)
}

function config(path: string) {
    try {
        const { error } = dotenv.config({ path })
        if (error) throw error
    } catch (error) {
        if ((error as any).code === 'ENOENT') {
            // .env file is not required
            console.warn(`Could not find ${path}: ${error}`)
            return {}
        } else {
            // .env file must be parsable
            throw error
        }
    }
}

function validate(schema: Joi.ObjectSchema) {
    // dotenv.parse(file) only returns those environment variables that were defined in that file. However, some environment variables might already be exported and not supplied through the .env file. To also validate those, we validate process.env after parsing instead of what dotenv.parse(file) returns. Exposing undescribed environment variables to the app poses a security risk, so we strip those.
    const { error, value } = schema.validate(process.env, {
        stripUnknown: true,
    })

    if (error)
        throw new Error(
            `Error while validating environment variables: ${error.message}`
        )

    return value
}

function prefix(vars: Record<string, string> = {}) {
    return Object.entries(vars).reduce(function (obj, [key, value]) {
        // Webpack 5 does not polyfill `process` anymore, so we need to do it ourselves. See https://webpack.js.org/migrate/5/#run-a-single-build-and-follow-advice
        obj['process'] = JSON.stringify({ env: {} })
        obj['process.env'] = JSON.stringify({})

        // From webpack.DefinePlugin docs: "Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself."
        obj[`process.env.${key}`] = JSON.stringify(value)

        return obj
    }, {})
}

function setEnvironmentVariables(vars: Record<string, string>) {
    process.env = { ...process.env, ...vars }
}
