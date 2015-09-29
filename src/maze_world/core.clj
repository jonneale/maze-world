(ns maze-world.core)

(def ^:private deltas
  {:N [0 -1]
   :E [1 0]
   :S [0 1]
   :W [-1 0]})

(def directions [:E :S :W :N])

(def opposite-direction
  {:N :S :E :W :S :N :W :E})


(defn apply-direction
  [[x y] direction]
  (let [[dx dy] (deltas direction)]
    [(+ x dx) (+ y dy)]))
