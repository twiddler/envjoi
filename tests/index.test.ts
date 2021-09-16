/**
 * @jest-environment node
 */

import * as Joi from 'joi'
import { resolve } from 'path'
import { envjoi } from '../src/index'

const envSchema = Joi.object({
    PORT: Joi.number().greater(0).default(8080),
})

describe('Valid .env', function () {
    let definitions
    const originalProcessEnv = {
        SOMEKEY: 'SOMEVALUE',
    }
    const envFileVars = {
        PORT: 7070,
        FOO: 'bar',
    }

    beforeAll(function () {
        // Clear process.env
        process.env = { ...originalProcessEnv }

        const env = resolve(__dirname, 'valid.env')
        const envjoiPlugin = envjoi(envSchema, env)
        definitions = envjoiPlugin.definitions
    })

    test('Add everything from .env to process.env', function () {
        expect(process.env).toMatchObject({
            ...originalProcessEnv,
            ...envFileVars,
        })
    })

    test('Only use declared and valid properties', function () {
        expect(definitions).toEqual({
            process: JSON.stringify({ env: {} }),
            'process.env': JSON.stringify({}),
            'process.env.PORT': JSON.stringify(envFileVars.PORT),
        })
    })
})

describe('Invalid .env', function () {
    let env

    beforeAll(function () {
        // Clear process.env
        process.env = {}

        env = resolve(__dirname, 'invalid.env')
    })

    test('Fail on invalid .env', function () {
        expect(() => envjoi(envSchema, env)).toThrow()
    })
})
