
export const Constant = {
 "realSetNum": { start: -2, end: 1 },
 "imagenSetNum": { start: -1, end: 1 },
 "iteration": 400,
 "getRelativePoint": (pixel, length, set) => set.start + (pixel / length) * (set.end - set.start),
 "zoomFactor": 0.1
}




