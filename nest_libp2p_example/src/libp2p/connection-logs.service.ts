import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { NodeJoinLogEntity } from "../database/entities/node-join-log.entity.js";
import { extractIpPortFromMultiaddr } from "./libp2p.helpers.js";

type RecordJoinParams = {
  nodeName: string;
  remoteMultiaddr: string;
  peerId?: string | null;
};

@Injectable()
export class ConnectionLogsService {
  constructor(
    @InjectRepository(NodeJoinLogEntity)
    private readonly repository: Repository<NodeJoinLogEntity>,
  ) {}

  async recordJoin(params: RecordJoinParams): Promise<NodeJoinLogEntity> {
    const { ip, port } = extractIpPortFromMultiaddr(params.remoteMultiaddr);
    const entity = this.repository.create({
      nodeName: params.nodeName,
      remoteMultiaddr: params.remoteMultiaddr,
      peerId: params.peerId ?? null,
      ip,
      port,
    });

    return this.repository.save(entity);
  }
}
