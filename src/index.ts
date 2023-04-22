import fastify, { FastifyListenOptions } from 'fastify'
import authPlugin from '@fastify/auth'
import bearerAuthPlugin from '@fastify/bearer-auth'
import { PrismaClient as GuildWarClient } from '../prisma/generated/guildwar-client'
import { OccupyForm } from './interfaces'
import { GuildWarService } from './functions'

const secretKeys: string = process.env['SECRET_KEYS']!
const guildWarClient = new GuildWarClient()

const functions = new GuildWarService(guildWarClient)
const server = fastify({ logger: true })
    .register(authPlugin)
    .register(bearerAuthPlugin, {
        keys: JSON.parse(secretKeys),
        addHook: false,
    })
    .after(() => {
        server.get('/:id', functions.getEntryApi)

        server.get('/occupy-history/:guildId', functions.getListApi)

        server.get('/occupy-history/:guildId/:mapName', functions.getListWithMapApi)

        server.get('/occupy-history-by-map/:mapName', functions.getListByMapApi)

        server.post<{ Body: OccupyForm }>('/internal/occupy', {
            preHandler: server.auth([
                server.verifyBearerAuth!
            ]),
        }, functions.postOccupyApi)
    })


const options: FastifyListenOptions = {
    host: String(process.env['ADDRESS']),
    port: Number(process.env['PORT']),
}
server.listen(options, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})