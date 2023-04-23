import { FastifyRequest, FastifyReply } from 'fastify'
import { DateTime } from 'luxon';
import { PrismaClient as GuildWarClient } from '../../prisma/generated/guildwar-client'
import { OccupyForm } from '../interfaces';

export class GuildWarService {
    guildWarClient: GuildWarClient;

    constructor(guildWarClient: GuildWarClient) {
        this.guildWarClient = guildWarClient;
        (BigInt.prototype as any).toJSON = function () {
            return this.toString();
        };
    }

    public getListApi = async (request: FastifyRequest, reply: FastifyReply) => {
        const query: any = request.query
        const params: any = request.params
        const limit = Number(query.limit ? query.limit : 20)
        const page = Number(query.page ? query.page : 1)
        const guildId = Number(params.guildId)
        const list: any[] = await this.guildWarClient.guildwar_occupy_logs.findMany({
            where: {
                guildId: guildId,
            },
            skip: (page - 1) * limit,
            take: limit,
        })
        const count = await this.guildWarClient.guildwar_occupy_logs.count({
            where: {
                guildId: guildId,
            }
        })
        const totalPage = Math.ceil(count / limit);
        reply.code(200).send({
            list,
            limit,
            page,
            totalPage,
        })
    }

    public getListWithMapApi = async (request: FastifyRequest, reply: FastifyReply) => {
        const query: any = request.query
        const params: any = request.params
        const limit = Number(query.limit ? query.limit : 20)
        const page = Number(query.page ? query.page : 1)
        const guildId = Number(params.guildId)
        const mapName = String(params.mapName)
        const list: any[] = await this.guildWarClient.guildwar_occupy_logs.findMany({
            where: {
                mapName: mapName,
                guildId: guildId,
            },
            skip: (page - 1) * limit,
            take: limit,
        })
        const count = await this.guildWarClient.guildwar_occupy_logs.count({
            where: {
                mapName: mapName,
                guildId: guildId,
            }
        })
        const totalPage = Math.ceil(count / limit);
        reply.code(200).send({
            list,
            limit,
            page,
            totalPage,
        })
    }

    public getListByMapApi = async (request: FastifyRequest, reply: FastifyReply) => {
        const query: any = request.query
        const params: any = request.params
        const limit = Number(query.limit ? query.limit : 20)
        const page = Number(query.page ? query.page : 1)
        const mapName = String(params.mapName)
        const list: any[] = await this.guildWarClient.guildwar_occupy_logs.findMany({
            where: {
                mapName: mapName,
            },
            skip: (page - 1) * limit,
            take: limit,
        })
        const count = await this.guildWarClient.guildwar_occupy_logs.count({
            where: {
                mapName: mapName,
            }
        })
        const totalPage = Math.ceil(count / limit);
        reply.code(200).send({
            list,
            limit,
            page,
            totalPage,
        })
    }

    public getEntryApi = async (request: FastifyRequest, reply: FastifyReply) => {
        const params: any = request.params
        const mapName = String(params.mapName)
        const log: any = await this.guildWarClient.guildwar_occupy_logs.findFirst({
            where: {
                mapName: mapName,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        if (!log) {
            reply.code(404).send()
            return
        }
        reply.code(200).send(log)
    }

    public postOccupyApi = async (request: FastifyRequest, reply: FastifyReply) => {
        const form: OccupyForm = request.body as OccupyForm
        const newOccupy = await this.guildWarClient.guildwar_occupy_logs.create({
            data: {
                mapName: form.mapName,
                guildId: form.guildId,
                guildName: form.guildName,
                guildOptions: form.guildOptions,
                attackerWin: form.attackerWin,
                createdAt: DateTime.local().toJSDate(),
            }
        })
        if (!newOccupy) {
            reply.code(500).send()
            return
        }
        reply.code(200).send()
    }
}