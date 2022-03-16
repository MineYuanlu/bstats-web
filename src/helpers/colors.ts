export type Color = [number, number, number];

/** https://flatuicolors.com/palette/in */
const palette_in: Color[] = t(
    "#FEA47F #25CCF7 #EAB543 #55E6C1 #CAD3C8 #F97F51 #1B9CFC #F8EFBA #58B19F #2C3A47 #B33771 #3B3B98 #FD7272 #9AECDB #D6A2E8 #6D214F #182C61 #FC427B #BDC581 #82589F".split(
        " "
    )
);

export function getColorByStringHash(str: string): Color {
    if (!str) return palette_in[0];
    const hash: number = hashCode(str);
    return palette_in[hash % palette_in.length];
}

export function toHighSaturation(color: Color): Color {
    const colorHSL: Color = colorRGB2HSL(color);
    colorHSL[1] += (100 - colorHSL[1]) / 2;
    return colorHSL2RGB(colorHSL);
}
export function toLowSaturation(color: Color): Color {
    const colorHSL: Color = colorRGB2HSL(color);
    colorHSL[1] -= colorHSL[1] / 2;
    colorHSL[2] += (100 - colorHSL[2]) / 1.2;
    return colorHSL2RGB(colorHSL);
}

export function getColorString(color: Color): string {
    return `rgb(${color.join(",")})`;
}

function hashCode(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = h * 31 + str.charCodeAt(i);
    }
    return h;
}

function t(colors: string[]): Color[] {
    return colors.map((str): Color => {
        if (!/^#[A-Fa-f0-9]+$/.test(str)) throw `Bad Color: ${str}`;
        str = str.slice(1);
        const size = str.length;
        if (3 <= size && size <= 4) {
            return [
                parseInt(str[0] + str[0], 16),
                parseInt(str[1] + str[1], 16),
                parseInt(str[2] + str[2], 16),
            ];
        } else if (6 <= size && size <= 7) {
            return [
                parseInt(str[0] + str[1], 16),
                parseInt(str[2] + str[3], 16),
                parseInt(str[4] + str[5], 16),
            ];
        } else throw `Bad Color: ${str}`;
    });
}

function colorRGB2HSL(rgb: Color): Color {
    const r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        delta = max - min;
    let h, s;

    if (max === min) h = 0;
    else if (r === max) h = (g - b) / delta;
    else if (g === max) h = 2 + (b - r) / delta;
    else if (b === max) h = 4 + (r - g) / delta;
    h = Math.min(h * 60, 360);
    if (h < 0) h += 360;
    const l = (min + max) / 2;

    if (max === min) s = 0;
    else if (l <= 0.5) s = delta / (max + min);
    else s = delta / (2 - max - min);
    return [h, s * 100, l * 100];
}
function colorHSL2RGB(hsl: Color): Color {
    const h = hsl[0] / 360,
        s = hsl[1] / 100,
        l = hsl[2] / 100;

    let val: number;

    if (s === 0) return (val = l * 255), [val, val, val];

    const t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const t1 = 2 * l - t2;

    const rgb: Color = [0, 0, 0];
    for (let i = 0; i < 3; ) {
        let t3 = h + (1 / 3) * -(i - 1);
        t3 < 0 ? t3++ : t3 > 1 && t3--;
        val =
            6 * t3 < 1
                ? t1 + (t2 - t1) * 6 * t3
                : 2 * t3 < 1
                ? t2
                : 3 * t3 < 2
                ? t1 + (t2 - t1) * (2 / 3 - t3) * 6
                : t1;
        rgb[i++] = val * 255;
    }

    return rgb;
}
