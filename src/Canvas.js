import {useEffect, useRef} from "react";
import {ColorPalette} from "./Color";
import {Constant} from './Constant';
import {Mandelbrot} from "./Math";

const Canvas = ({width, height}) => {
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current
       let  context = canvas.getContext('2d')
        draw(context)
    })

    const draw = (ctx) => {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let complex = {
                    x: Constant.realSetNum.start + (i / width) * (Constant.realSetNum.end - Constant.realSetNum.start),
                    y: Constant.imagenSetNum.start + (j / height) * (Constant.imagenSetNum.end - Constant.imagenSetNum.start)
                }
                const [m, isMandelbrotSet] = Mandelbrot(complex)
                let c = isMandelbrotSet ? [0, 0, 0] : ColorPalette[m % (ColorPalette.length - 1)]
                ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`
                ctx.fillRect(i, j, 1, 1)
            }
        }
    }

    const zoomHandler = (e) => {
        const zfw = (width * Constant.zoomFactor);
        const zfh = (height * Constant.zoomFactor)

        Constant.realSetNum = {
            start: Constant.getRelativePoint(e.pageX - canvasRef.current.offsetLeft - zfw, width, Constant.realSetNum),
            end: Constant.getRelativePoint(e.pageX - canvasRef.current.offsetLeft + zfw, width, Constant.realSetNum)
        }
        Constant.imagenSetNum = {
            start: Constant.getRelativePoint(e.pageY - canvasRef.current.offsetTop - zfh, height, Constant.imagenSetNum),
            end: Constant.getRelativePoint(e.pageY - canvasRef.current.offsetTop + zfh, height, Constant.imagenSetNum)
        }
         draw(canvasRef.current.getContext('2d'))

    }

    return (
        <div className='conteiner'>
            <canvas  ref={canvasRef} onClick={zoomHandler} width={width} height={height} />
        </div>
    )
};

export default Canvas;