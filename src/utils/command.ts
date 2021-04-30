import {changeName} from "./requests";

type CommandAction = {
    arg_range: number[],
    fn: (args: string[], ctx: any) => string
}

const actions = new Map<string, CommandAction>([
    ["changename", {
        arg_range: [1,1],
        fn: (args: string[], ctx: any): string => {
            const name = args[0];
            changeName(ctx.socket, ctx.room, name);
            return `Changing name to ${name}`;
        }
    }],
]);

export function isLegalFunctionSyntax(cmd: string): boolean {
    return cmd[0] === "/";
}

export function execute(cmd: string, ctx: any): string {
    cmd = cmd.slice(1, cmd.length);
    const tokens = cmd.split(" ");

    const action = actions.get(tokens[0]);
    if (!action) return `No action found for command ${tokens[0]}`
    
    const args = tokens.slice(1, tokens.length);
    if (args.length < action.arg_range[0] || args.length > action.arg_range[1]) {
        return `No version of ${tokens[0]} takes ${args.length} arguments.`
    }
    const res = action.fn(args, ctx);
    return res;


}