import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "dial_requests" })
export class DialRequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 512 })
  multiaddr!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  peerId!: string | null;

  @Column({ type: "varchar", length: 512 })
  dialTarget!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
