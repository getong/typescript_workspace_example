import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { DialRequestEntity } from "../database/entities/dial-request.entity.js";

type RecordParams = {
  multiaddr: string;
  peerId?: string | null;
  dialTarget: string;
};

@Injectable()
export class DialRequestsService {
  constructor(
    @InjectRepository(DialRequestEntity)
    private readonly repository: Repository<DialRequestEntity>,
  ) {}

  async recordDialRequest(params: RecordParams): Promise<DialRequestEntity> {
    const entity = this.repository.create({
      multiaddr: params.multiaddr,
      peerId: params.peerId ?? null,
      dialTarget: params.dialTarget,
    });

    return this.repository.save(entity);
  }

  async listRecent(limit = 25): Promise<DialRequestEntity[]> {
    return this.repository.find({
      order: { createdAt: "DESC" },
      take: limit,
    });
  }
}
