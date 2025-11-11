import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "node_join_logs" })
export class NodeJoinLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 128 })
  nodeName!: string;

  @Column({ type: "varchar", length: 512 })
  remoteMultiaddr!: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  peerId!: string | null;

  @Column({ type: "varchar", length: 128, nullable: true })
  ip!: string | null;

  @Column({ type: "integer", nullable: true })
  port!: number | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
