(ns maze-world.generators.recursive-backtracker
  (:require [maze-world.config  :refer [width height]]
            [maze-world.core    :as core]
            [maze-world.drawing :as drawing]))

(def initial-grid
  (into {}
   (for [y (range 0 height)
         x (range 0 width)]
     {[x y] []})))

(defn is-valid-direction?
  [position grid direction]
  (let [[nx ny] (core/apply-direction position direction)]
    (and (>= nx 0)
         (>= ny 0)
         (< nx width)
         (< ny height)
         (empty? (grid [nx ny])))))

(defn update-grid
  [position grid direction]
  (-> grid
      (update-in [position] #(conj % direction))
      (update-in [(core/apply-direction position direction)] #(conj % (core/opposite-direction direction)))))

(defn carve-passages-from
  ([grid]
   (into {} (carve-passages-from [0 0] grid)))
  ([position grid]
   (reduce (fn [current-grid direction]
             (if (is-valid-direction? position current-grid direction)
               (-> (core/apply-direction position direction)
                   (carve-passages-from (update-grid position current-grid direction)))
               current-grid))
           grid
           (shuffle core/directions))))


;; (pretty-print (carve-passages-from initial-grid))
;; Currently blows the stack at about 40x40
