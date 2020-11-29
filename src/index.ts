import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as Joi from 'joi'
import { DefinePlugin } from 'webpack'

export function envjoi(schema: Joi.ObjectSchema, path = './.env') {
    const fileContent = readFile(path)
    const vars = parse(fileContent)
    const validVars = validate(schema, vars)
    const prefixedVars = prefix(validVars)
    dotenv.config({ path })
    return new DefinePlugin(prefixedVars)
}

function readFile(path: string) {
    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        if (err.code === 'ENOENT') throw new Error('File was not found')
        throw err
    }
}

function parse(fileContent: string) {
    try {
        return dotenv.parse(fileContent)
    } catch (err) {
        throw new Error(
            `Error while trying to parse the file with dotenv ${err}`
        )
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
