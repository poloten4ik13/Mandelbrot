/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from "react";
import {ColorPalette} from "./Color";
import {Constant} from './Constant';
import './Canvas.css';
import useWebWorker from "./useWebWorker";
import {Calculation} from "./Calculation";

const Canvas = () => {
    const height = Constant.height;
    const width = Constant.width;
    const canvasRef = useRef();
    const {result, run} = useWebWorker(Calculation);

    const draw = (arr) => {
        let iterTool = 0;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const [m, isMandelbrotSet] = arr[iterTool++];
                let c = isMandelbrotSet ? [0, 0, 0] : ColorPalette[m % (ColorPalette.length - 1)];
                canvasRef.current.getContext('2d').fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
                canvasRef.current.getContext('2d').fillRect(i, j, 1, 1)
            }
        }
    }

    useEffect(() => {
        run(width, height, Constant.realSetNum, Constant.imagSetNum, Constant.iteration)
    }, [])

    useEffect(() => {
        (async () => {
            const arrNum = await result
            if (arrNum !== null) {
                draw(arrNum)
            }
        })();
    }, [result]);

    const [click, setClick] = useState(0);
    const zoomHandler = (e) => {
        setClick(1);
        let zfw, zfh;
        if (click === 0) {
            zfw = (width * 0.01);
            zfh = (height * 0.01)
        } else {
            zfw = (width * Constant.zoomFactor);
            zfh = (height * Constant.zoomFactor)
        }
        Constant.realSetNum = {
            start: Constant.getRelativePoint(e.pageX - canvasRef.current.offsetLeft - zfw, width, Constant.realSetNum),
            end: Constant.getRelativePoint(e.pageX - canvasRef.current.offsetLeft + zfw, width, Constant.realSetNum)
        }
        Constant.imagSetNum = {
            start: Constant.getRelativePoint(e.pageY - canvasRef.current.offsetTop - zfh, height, Constant.imagSetNum),
            end: Constant.getRelativePoint(e.pageY - canvasRef.current.offsetTop + zfh, height, Constant.imagSetNum)
        }
        run(width, height, Constant.realSetNum, Constant.imagSetNum, Constant.iteration);
        draw(result)
    }

    return (
        <div className='container'>
            <canvas ref={canvasRef} onClick={zoomHandler} width={width} height={height}/>
        </div>
    )
};

export default Canvas;