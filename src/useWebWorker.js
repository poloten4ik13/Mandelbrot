import {useState} from "react";

const workerHandler = (fn) => {
    onmessage = (event) => {
        postMessage(fn(...event.data));

    }
};

const useWebWorker = (fn) => {
    const [result, setResult] = useState(null);

    const run = (...e) => {
        const worker = new Worker(
            URL.createObjectURL(new Blob([`(${workerHandler})(${fn})`]))
        );
        worker.onmessage = (event) => {
            setResult(event.data);
            worker.terminate();
        }
        worker.postMessage(e)
    }
    return {
        result,
        run
    }
};

export default useWebWorker;