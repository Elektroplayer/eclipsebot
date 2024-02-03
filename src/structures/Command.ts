import { CommandInteraction } from "discord.js";

export default abstract class Command {
    abstract options:{ name:string, description:string };

    abstract exec(intr:CommandInteraction):any;
}