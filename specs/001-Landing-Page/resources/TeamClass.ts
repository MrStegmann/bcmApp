import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("teams")
export class Team {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    name!: string;
}