import {useEffect, useRef} from "react";


const Canvas = ({...props}) => {
    const canvasRef = useRef();
    const zoomFactor = 0.1
    let context;


    useEffect(() => {
        const canvas = canvasRef.current
        context = canvas.getContext('2d')
        draw(context)
    }, [])

    const iteration = 80
    function mandelbrot(c) {
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
    }
    let REAL_SET = { start: -2, end: 1 }
    let IMAGINARY_SET = { start: -1, end: 1 }

    const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)

    const palette = (size = 250) => {
        const range = parseInt(size / 6)
        const colors = []
        let c
        for (let k = 0; k < size; k++) {
            if (k <= range)//red to yellow
                c = makeRGB(255, [[0, 0], [range, 255]], 0, k)
            else if (k <= range * 2)//yellow to green
                c = makeRGB([[range + 1, 255], [range * 2, 0]], 255, 0, k)
            else if (k <= range * 3)//green to cyan
                c = makeRGB(0, 255, [[range * 2 + 1, 0], [range * 3, 255]], k)
            else if (k <= range * 4)//cyan to blue
                c = makeRGB(0, [[range * 3 + 1, 255], [range * 4, 0]], 255, k)
            else if (k <= range * 5)//blue to purple
                c = makeRGB([[range * 4 + 1, 0], [range * 5, 255]], 0, 255, k)
            else//purple to red
                c = makeRGB(255, 0, [[range * 5 + 1, 255], [size - 1, 0]], k)

            colors.push(c)
        }
        return colors
    }

    const lagrange = ([X1, Y1], [X2, Y2], x) => (((Y1 * (x - X2)) / (X1 - X2)) + ((Y2 * (x - X1)) / (X2 - X1)))

    const makeRGB = (r, g, b, k) => {
        const calculate = pair => parseInt(lagrange(pair[0], pair[1], k))
        if (isNaN(r)) r = calculate(r)
        if (isNaN(g)) g = calculate(g)
        if (isNaN(b)) b = calculate(b)

        return [r, g, b]
    }


    let colorPalette = palette();
    const draw = (ctx) => {
        for (let i = 0; i < props.width; i++) {
            for (let j = 0; j < props.height; j++) {
                let complex = {
                    x: REAL_SET.start + (i / props.width) * (REAL_SET.end - REAL_SET.start),
                    y: IMAGINARY_SET.start + (j / props.height) * (IMAGINARY_SET.end - IMAGINARY_SET.start)
                }
                const [m, isMandelbrotSet] = mandelbrot(complex)
                let c = isMandelbrotSet ? [0, 0, 0] : colorPalette[m % (colorPalette.length - 1)]
                ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`
                ctx.fillRect(i, j, 1, 1)
            }
        }
    }


    const zoomHandler = (e) => {
        const zfw = (props.width * zoomFactor);
        const zfh = (props.height * zoomFactor)
        console.log(context.canvas.offsetLeft);
        REAL_SET = {
            start: getRelativePoint(e.pageX - context.canvas.offsetLeft - zfw, props.width, REAL_SET),
            end: getRelativePoint(e.pageX - context.canvas.offsetLeft + zfw, props.width, REAL_SET)
        }
        IMAGINARY_SET = {
            start: getRelativePoint(e.pageY - context.canvas.offsetTop - zfh, props.height, IMAGINARY_SET),
            end: getRelativePoint(e.pageY - context.canvas.offsetTop + zfh, props.height, IMAGINARY_SET)
        }
         draw(context)

    }
    const getRelativePoint = (pixel, length, set) => set.start + (pixel / length) * (set.end - set.start)

    return (
        <div className='conteiner' >
            <canvas ref={canvasRef} onClick={zoomHandler} {...props} />
        </div>
        )
};

export default Canvas;