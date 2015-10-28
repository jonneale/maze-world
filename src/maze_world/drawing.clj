(ns maze-world.drawing
  (:use [seesaw.core]
        [seesaw.dev])
  (:import [javax.swing JFrame JLabel JPanel]
           [java.awt.image BufferedImage]
           [java.awt Dimension Color])
  (:require [quil.core :as q]
            [maze-world.config :as maze-config]
            [maze-world.generators.recursive-backtracker :as generator]
            [seesaw.graphics :as sg]
            [seesaw.color    :as sc]))

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
    (.drawLine graphics x' y' nx ny)))

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

(defn draw-frame
  []
  (JFrame.))


(def g (atom nil))


(def p
  )
(defn big-frame
  [content]
  (frame
   :title "Canvas Example"
   :width 600 :height 600
   :content content))

;; (doseq [coord (take max-points (iterate transform [0 1]))]
;;   (paint-point width height coord graphics))

#_(def g (draw 500 500))

;; ; run skentch
;; (q/defsketch trigonometry
;;   :size [canvas-size canvas-size]
;;   :draw #(draw (q/width) (q/height))
;;   :features [:keep-on-top :resizable])




(def main-panel
  (border-panel :center my-canvas))

(defn draw-step
  [grid canvas graphics]
  (draw-squares 500 500 grid graphics))

(defn draw-fn
  [panel]
  (fn [grid]
    (let [old-canvas (seesaw.core/select panel [:#canvas])]
      (replace! panel old-canvas (canvas :id :canvas :background "#BBBBDD" :paint (partial draw-step grid))))))

(defn empty-draw
  [c g])

(defn run
  []
  (let [c (canvas :id :canvas :background "#BBBBDD" :paint empty-draw)
        panel (border-panel :hgap 5 :vgap 5 :border 5
                            :center c)]
    (show! (big-frame panel))
    (maze-world.generators.recursive-backtracker/carve-passages-from maze-world.generators.recursive-backtracker/initial-grid (draw-fn panel))))

;; (def maze (maze-world.generators.recursive-backtracker/carve-passages-from maze-world.generators.recursive-backtracker/initial-grid))

;; (defn test-run
;;   []
  ;; (let [f (draw-frame)
  ;;       i (draw-image)
  ;;       g (.createGraphics i)]
  ;;   (.setColor g Color/green)
  ;;   (draw-squares 500 500 generator/initial-grid g)
  ;;   (.add f (draw-canvas i))
  ;;   (.setVisible f true)
  ;;   (.setSize f 500 500)
  ;;   (.show f)))
