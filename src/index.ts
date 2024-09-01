import fastify, { FastifyListenOptions } from 'fastify'
import authPlugin from '@fastify/auth'
import { PrismaClient as GuildWarClient } from '../prisma/generated/guildwar-client'
import { OccupyForm } from './interfaces'
import { GuildWarService } from './functions'

const secretKeys: string = process.env.SECRET_KEYS ? process.env.SECRET_KEYS : "[\"secret\"]"
const guildWarClient = new GuildWarClient()

const validateAppAccess = async(request: any, reply: any, done: (err?: Error) => void) =>
{
    const header = request.headers['x-api-key']!
    if (!header) {
        done(new Error('No secret key'))
        return
    }
    const keys = JSON.parse(secretKeys)
    if (keys.indexOf(header) < 0) {
        done(new Error('Invalid secret key'))
        return
    }
}

const functions = new GuildWarService(guildWarClient)
const server = fastify({ logger: true })
    .register(authPlugin)
    .after(() => {
        server.get('/:mapName', functions.getEntryApi)

        server.get('/occupy-history/:guildId', functions.getListApi)

        server.get('/occupy-history/:guildId/:mapName', functions.getListWithMapApi)

        server.get('/occupy-history-by-map/:mapName', functions.getListByMapApi)

        server.post<{ Body: OccupyForm }>('/internal/occupy', {
            preHandler: server.auth([
                validateAppAccess
            ]),
        }, functions.postOccupyApi)
    })


const options: FastifyListenOptions = {
    host: String(process.env.ADDRESS ? process.env.ADDRESS : "0.0.0.0"),
    port: Number(process.env.PORT ? process.env.PORT : 80),
}
server.listen(options, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})