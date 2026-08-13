import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 20 })
  name!: string;

  @Column({ type: "int", default: 0 })
  wins!: number;

  @Column({ type: "int", default: 0 })
  losses!: number;

  @Column({ type: "int", default: 0 })
  totalPlayers!: number;
}
