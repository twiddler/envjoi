import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as Joi from 'joi'
import { DefinePlugin } from 'webpack'

export function envjoi(schema: Joi.ObjectSchema, path = './.env') {
    const vars = parse(path)
    const validVars = validate(schema, vars)
    const prefixedVars = prefix(validVars)
    dotenv.config({ path })
    return new DefinePlugin(prefixedVars)
}

function parse(path: string) {
    try {
        const file = fs.readFileSync(path, 'utf8')
        return dotenv.parse(file)
    } catch (err) {
        console.warn(`Error while trying to parse ${path}: ${err}`)
        return {}
    }
}

function validate(schema: Joi.ObjectSchema, vars: Record<string, string>) {
    const { error, value } = schema.validate(vars)
    if (error)
        throw new Error(
            `Error while validating environment variables: ${error.message}`
        )
    return value
}

function prefix(vars: Record<string, string> = {}) {
    const prefixed = Object.entries(vars).reduce(function (obj, [key, value]) {
        // From webpack.DefinePlugin docs: "Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself."
        obj[`process.env.${key}`] = JSON.stringify(value)

        return obj
    }, {})

    return { 'process.env': vars, ...prefixed }
}
