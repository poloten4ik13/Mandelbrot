/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from "react";
import {ColorPalette} from "./Color";
import {Constant} from './Constant';
import './Canvas.css';
import useWebWorker from "./useWebWorker";
import {Calculation} from "./Calculation";
import MyVerticallyCenteredModal from "./Modal";

const Canvas = () => {
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();

    useEffect(() => {
        setWidth(Math.floor(window.innerWidth * 0.90));
        setHeight(Math.floor(window.innerHeight * 0.90));
    }, []);

    const canvasRef = useRef();
    const {result, run} = useWebWorker(Calculation);
    const [modalShow, setModalShow] = useState(false);
    const [loadShow, setShowLoad] = useState(false);


    useEffect(() => {
        run(Math.floor(window.innerWidth * 0.90), Math.floor(window.innerHeight* 0.90), Constant.realSetNum, Constant.imagSetNum, Constant.iteration);
        setModalShow(true);
    }, []);


    const draw = (arr) => {
        let iterTool = 0;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const [m, isMandelbrotSet] = arr[iterTool++];
                let c = isMandelbrotSet ? [0, 0, 0] : ColorPalette[m % (ColorPalette.length - 1)];
                canvasRef.current.getContext('2d').fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
                canvasRef.current.getContext('2d').fillRect(i, j, 1, 1);
            }
        }
      setShowLoad(true)
    };



    const load = () => {
        return (
            <div className="load">
                Loading...
            </div>
        )
    }

    useEffect(() => {
      (async () => {
            const arrNum = await result
            if (arrNum !== null) {
                draw(arrNum)
            }
        })()
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
    };

const resetHandler = () => {
    Constant.realSetNum = { start: -2, end: 1 };
    Constant.imagSetNum = { start: -1, end: 1 };
    run(width, height, Constant.realSetNum, Constant.imagSetNum, Constant.iteration);
    draw(result)
}

    return (
        <div className="main">
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
            <div className='container'>
                <button className="resetButton" onClick={resetHandler}>Reset</button>
                <canvas  ref={canvasRef} onClick={zoomHandler} width={width} height={height}/>
                {loadShow ? null : load()}
            </div>
        </div>
    )
};

export default Canvas;