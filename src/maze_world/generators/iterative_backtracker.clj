(ns maze-world.generators.iterative-backtracker
  (:require [maze-world.config  :refer [width height]]
            [maze-world.core    :as core]))

(defn is-valid-direction?
  [position grid direction]
  (let [directions (grid position)
        _    (println "position " position)
        _    (println "directions " directions)
        _    (println "direction " direction)

        [nx ny] (core/apply-direction position direction)
        _ (println "NX " nx)]

    (and (>= nx 0)
         (>= ny 0)
         (< nx width)
         (< ny height)
         (empty? directions))))

(defn update-cell
  [grid position direction]
  (println "pos " position)
  (println "dir " direction)
  (println grid)
  (-> grid
      (update-in [position] #(conj % direction))
      (update-in grid [:agenda] #(conj % (core/apply-direction position)))))

(defn carve-passages-tick
  [grid]
  (let [agenda (:agenda grid)
        position (first agenda)]
    (reduce
     (fn [[p current-grid] direction]
       (println "p " p)
       (println "g " (grid p))
       (if (is-valid-direction? p current-grid direction)
         [p (update-cell current-grid p direction)]
         [p (assoc current-grid :agenda (rest agenda))]))
     [position grid]
     core/directions)))

(def initial-grid
  (let [cells (into {}
                    (for [y (range 0 height)
                          x (range 0 width)]
                      {[x y] []}))]
    (assoc cells :agenda [(-> cells keys first)])))
