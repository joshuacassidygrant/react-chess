
export const white = "#eee";
export const black = "#111";
export function getOpponent(color: string) {
    return color === white ? black : white;
}