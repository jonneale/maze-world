(ns maze-world.drawing
  (:import [javax.swing JFrame JLabel]
           [java.awt.image BufferedImage]
           [java.awt Dimension Color])
  (:require [quil.core :as q]
            [maze-world.config :as maze-config]))

(def canvas-size 500)

;; original point 0,0
;; no north - draw line from 0 0 to 1 0


(def directions
  "Subtly different for drawing than from traversing the grid"
  {:N [[0 0] [1 0]]
   :E [[1 0] [1 1]]
   :S [[0 1] [1 1]]
   :W [[0 0] [0 1]]})


(defn draw-line
  [width height [x y] [[ox oy] [dx dy]] graphics]
  (let  [scale 20
         x' (+ (* x scale) (* ox scale))
         y' (+ (* y scale) (* oy scale))
         nx (+ (* x scale) (* dx scale))
         ny (+ (* y scale) (* dy scale))]
    (.drawLine graphics x' y' nx ny)
    [[x' y' nx ny]]))

(defn draw-squares
  [width height maze graphics]
  ;; always assume a 2x2 grid for starters
  (doseq [[[x y] moveable-directions] maze]
    ;; given these directions :N :E
    ;; draw these lines :S :W
    (doseq [direction (clojure.set/difference (-> directions keys set)
                                            (set moveable-directions))]
      (draw-line width height [x y] (directions direction) graphics))))

(defn draw-maze
  [width height maze]
  (let [image  (BufferedImage. width height BufferedImage/TYPE_INT_RGB)
        canvas (proxy [JLabel] []
                 (paint [g]
                   (.drawImage g image 0 0 this)))
        graphics (.createGraphics image)]

    (.setColor graphics Color/green)
    (draw-squares width height maze graphics)

    (doto (JFrame.)
      (.add canvas)
      (.setSize (Dimension. width height))
      (.show))))


;; (doseq [coord (take max-points (iterate transform [0 1]))]
;;   (paint-point width height coord graphics))

#_(def g (draw 500 500))

;; ; run skentch
;; (q/defsketch trigonometry
;;   :size [canvas-size canvas-size]
;;   :draw #(draw (q/width) (q/height))
;;   :features [:keep-on-top :resizable])


;; (import 'javax.swing.JFrame)
;; (def frame (JFrame. "Hello Frame"))
;; (.setSize frame 200 200)
;; (.setVisible frame true)


;; (def maze (maze-world.generators.recursive-backtracker/carve-passages-from maze-world.generators.recursive-backtracker/initial-grid))
