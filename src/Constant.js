
export const Constant = {
 "realSetNum": { start: -2, end: 1 },
 "imagSetNum": { start: -1, end: 1 },
 "iteration": 1000,
 "getRelativePoint": (pixel, length, set) => set.start + (pixel / length) * (set.end - set.start),
 "zoomFactor": 0.1,
};




