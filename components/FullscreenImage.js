import { useCallback, useEffect, useState } from "react";
import classnames from "classnames";

import styles from "./FullscreenImage.module.css";

const FORWARD = "forward";
const BACKWARD = "backward";

export const FullscreenImage = ({ src }) => {
  const [overlayAnimateIn, setOverlayAnimateIn] = useState(false);
  const [isOverlayAnimationFinished, setIsOverlayAnimationFinished] =
    useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [isImgOnStage, setIsImgOnStage] = useState(false);
  const [direction, setDirection] = useState(FORWARD);

  const imgRef = useCallback(imgNode => {
    if (!imgNode) return;
    imgNode.addEventListener("load", () => {
      setIsImgLoaded(true);
    });
  }, []);

  const rootNodeRef = useCallback(rootNode => {
    if (!rootNode) return;
    rootNode.addEventListener("animationend", e => {
      if (e.animationName === styles.overlayInAnim) {
        setIsOverlayAnimationFinished(true);
        setIsImgOnStage(false);
      }
      if (e.animationName === styles.imgInAnim) {
        setIsImgOnStage(true);
      }
      if (e.animationName === styles.overlayOutAnim) {
        setIsOverlayAnimationFinished(false);
        setOverlayAnimateIn(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!src) return;
    setIsImgLoaded(false);
    setDirection(FORWARD);
    setOverlayAnimateIn(true);
  }, [src]);

  const overlayClassNames = classnames(styles.overlay, styles["overlay-1"], {
    [styles.startOverlayIn]:
      overlayAnimateIn && (!isOverlayAnimationFinished || !isImgLoaded),
    [styles.startOverlayOut]: isOverlayAnimationFinished && isImgLoaded,
  });

  const imgClassNames = classnames(styles.img, {
    [styles.startImgIn]:
      isOverlayAnimationFinished && isImgLoaded && direction === FORWARD,
    [styles.onStage]: isImgOnStage,
  });

  const overlay2ClassNames = classnames(
    [styles.overlay],
    [styles["overlay-2"]]
  );
  const overlay3ClassNames = classnames(
    [styles.overlay],
    [styles["overlay-3"]]
  );

  const close = () => {
    setOverlayAnimateIn(true);
    setDirection(BACKWARD);
  };

  return (
    <div ref={rootNodeRef}>
      <div className={overlayClassNames}>
        <div className={overlay2ClassNames}>
          <div className={overlay3ClassNames}>
            <div className={styles.loader}></div>
          </div>
        </div>
      </div>
      <img className={imgClassNames} src={src} ref={imgRef} />
      <button className={styles.btnLoad} onClick={close}>
        Fermer
      </button>
      <ul className={styles.debug}>
        <li>overlayAnimateIn: {overlayAnimateIn.toString()}</li>
        <li>
          isOverlayAnimationFinished: {isOverlayAnimationFinished.toString()}
        </li>
        <li>isImgLoaded: {isImgLoaded.toString()}</li>
        <li>isImgOnStage: {isImgOnStage.toString()}</li>
        <li>direction: {direction.toString()}</li>
      </ul>
    </div>
  );
};
