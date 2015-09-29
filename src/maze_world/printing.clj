(ns maze-world.printing
  (:require [maze-world.config :refer [width height]]))

(def mask
  {:N 1
   :S 2
   :E 4
   :W 8})

(defn mask-print
  [grid]
  (doseq [y (range 0 height)]
    (println "")
    (doseq [x (range 0 width)]
      (let [directions-at-point (grid [x y])]
        (print (reduce + (map mask directions-at-point)))))))

(defn pretty-print
  [grid]
  (doseq [x (range 0 width)]
    (print " _"))
  (doseq [y (range 0 width)]
    (do (println "")
        (print "|")
        (doseq [x (range 0 height)]
          (let [directions-at-point (grid [x y])]
            (if (nil? (some #{:S} (set directions-at-point)))
              (print "_")
              (print " "))
            (if (nil? (some #{:E} (set directions-at-point)))
              (print "|")
              (print " ")))))))
