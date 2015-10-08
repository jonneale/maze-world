(ns maze-world.drawing
  (:require [quil.core :as q]
            [maze-world.config :as maze-config]))

(def canvas-size 500)

(def box-size (/ canvas-size maze-config/width))

(defn box-corners
  [width height]
  (reduce into
          (for [x (range 0 (- width box-size) box-size)
                y (range 0 (- height box-size) box-size)]
            [[x y] [x (+ y box-size)]
             [x y] [(+ x box-size) y]
             [x (+ y box-size)] [(+ x box-size) (+ y box-size)]
             [(+ x box-size) (+ y box-size)] [x (+ y box-size)]])))

(defn draw
  [width height]
  (q/background 255)
  (doseq [t (partition 2 (box-corners 500 500))]
    (apply q/line t)))

; run sketch
(q/defsketch trigonometry
  :size [canvas-size canvas-size]
  :draw #(draw (q/width) (q/height))
  :features [:keep-on-top :resizable])
