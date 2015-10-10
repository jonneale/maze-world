(ns maze-world.drawing
  (:import [javax.swing JFrame JLabel]
           [java.awt.image BufferedImage]
           [java.awt Dimension Color])
  (:require [quil.core :as q]
            [maze-world.config :as maze-config]))

;; original point 0,0
;; no north - draw line from 0 0 to 1 0


(def directions
  "Subtly different for drawing than from traversing the grid"
  {:N [[0 0] [1 0]]
   :E [[1 0] [1 1]]
   :S [[0 1] [1 1]]
   :W [[0 0] [0 1]]})

(defn maze-width
  [maze]
  (inc (reduce max (map first (keys maze)))))

(defn maze-height
  [maze]
  (inc (reduce max (map last (keys maze)))))

(defn draw-line
  [width height w-scale h-scale [x y] [[ox oy] [dx dy]] graphics]
  (let  [x' (+ (* x w-scale) (* ox w-scale))
         y' (+ (* y h-scale) (* oy h-scale))
         nx (+ (* x w-scale) (* dx w-scale))
         ny (+ (* y h-scale) (* dy h-scale))]
    (.drawLine graphics x' y' nx ny)
    [[x' y' nx ny]]))

(defn draw-squares
  [image-width image-height maze graphics]
  (let [w-scale (int (/
                      ;;add a 1% buffer around the edge of the image
                      (- image-width (/ image-width 100.0))
                      (maze-width maze)))
        h-scale (int
                 (/
                  (- image-height (/ image-height 100.0))
                  (maze-height maze)))]
    (doseq [[[x y] moveable-directions] maze]
      ;; given these directions :N :E
      ;; draw these lines :S :W
      (doseq [direction (clojure.set/difference (-> directions keys set)
                                                (set moveable-directions))]
        (draw-line image-width
                   image-height
                   w-scale
                   h-scale
                   [x y]
                   (directions direction)
                   graphics)))))

(defn draw-maze
  [image-width image-height maze]
  (let [image  (BufferedImage. image-width image-height BufferedImage/TYPE_INT_RGB)
        canvas (proxy [JLabel] []
                 (paint [g]
                   (.drawImage g image 0 0 this)))
        graphics (.createGraphics image)]

    (.setColor graphics Color/green)
    (draw-squares image-width image-height maze graphics)

    (doto (JFrame.)
      (.add canvas)
      (.setSize (Dimension. image-width image-height))
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
