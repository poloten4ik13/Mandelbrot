
export const Calculation = (w, h, realSetNum, imagSetNum, iteration) => {
    let MandelbrotSet = [];
    const Mandelbrot = c => {
        let z = { x: 0, y: 0 }, n = 0, p, d;
        do {
            p = {
                x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
                y: 2 * z.x * z.y
            }
            z = {
                x: p.x + c.x,
                y: p.y + c.y
            }
            d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2))
            n += 1
        } while (d <= 2 && n < iteration)
        return [n, d <= 2]
    };
    for (let i = 0; i <w ; i++) {
        for (let j = 0; j < h; j++) {
            const complex = (x, y) => {
                x = realSetNum.start + (x / w) * (realSetNum.end - realSetNum.start);
                y = imagSetNum.start + (y / h) * (imagSetNum.end - imagSetNum.start)
                return {x, y}
            }

            MandelbrotSet.push(Mandelbrot(complex(i, j)))
        }
    }
   return MandelbrotSet
}











