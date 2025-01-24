"use client";
import { useEffect, useRef, useState } from "react";
import abcjs, { TuneObjectArray } from "abcjs";
import { selectNotationList, selectTimeElapsed, setTimingCallbacks, setNoteTimings, selectTimingCallbacks } from "@/store/playback-slice";
import { useDispatch, useSelector } from "react-redux";
interface NotationDisplayProps {
  className?: string;
  width: number;
  height: number;
}

const NotationDisplay: React.FC<NotationDisplayProps> = ({
  width,
  height,
}) => {
  const notationRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tunes, setTunes] = useState<TuneObjectArray | null>(null);
  const timeElapsed = useSelector(selectTimeElapsed);
  const notationList = useSelector(selectNotationList);
  const timingCallbacks = useSelector(selectTimingCallbacks);
  const [translateX, setTranslateX] = useState(0);
  const dispatch = useDispatch();
  const abc = notationList[0];
  const svgToDataURL = (svg: Node) => {
    const svgString = new XMLSerializer().serializeToString(svg);
    console.log(svgString);
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  const renderSvgToCanvas = (svg: SVGSVGElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      console.log("drawing image");
      if (ctx) {
        ctx.clearRect(0, 0, img.width, canvas.height);
        const centerX = canvas.width / 2;
        ctx.drawImage(img, centerX - translateX - 4, 0, img.width, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fillRect(centerX - 2, 0, 4, canvas.height);
      }
    };
    img.src = svgToDataURL(svg);
  };
  useEffect(() => {
    if (notationRef.current) {
      divRef.current = document.createElement("div");
      divRef.current.style.width = `${width}px`;
      divRef.current.style.height = `${height}px`;
      try {
        setTunes(
          abcjs.renderAbc(divRef.current, abc, {
            foregroundColor: "#fbcfe8",
            selectionColor: "#00FF00",
            wrap: { minSpacing: 2.7, maxSpacing: 2.7, preferredMeasuresPerLine: Infinity },
            staffwidth: 40000,
            clickListener: (abcElem: any) => {
              console.log(abcElem);
              if (abcElem.startChar && abcElem.endChar) {
          // props.setChangedSelection({
          //   start: abcElem.startChar,
          //   end: abcElem.endChar,
          // });
              }
              if (abcElem.midiPitches) {
                console.log(abcElem.midiPitches);
                dispatch(setNoteTimings(abcElem.midiPitches));
              }
            },
          }),
        );
        svgRef.current = divRef.current.querySelector("svg");
        if (svgRef.current && canvasRef.current) {
          console.log("rendering to canvas");
          renderSvgToCanvas(svgRef.current, canvasRef.current);
        }
        if (notationRef.current) {
            notationRef.current.style.height = `${height}px`;
          // notationRef.current.scrollIntoView({
          //   behavior: "smooth",
          //   inline: "center",
          // });
        }
    
      } catch (e) {
        console.error(e);
      }
    }
  }, [abc, height, width]);

  useEffect(() => {
    if (tunes) {
      dispatch(setTimingCallbacks( // @ts-expect-error
        new abcjs.TimingCallbacks(tunes[0], { // @ts-expect-error
          eventCallback: (ev: any) => {
            const x = ev.left;
            console.log("setting x", x);
            // const y = ev.top;
            // const evWidth = ev.width + 4;
            // const evHeight = ev.height;
            setTranslateX(x);
          },
        }),
      ));
    }
  }, [tunes]);
  useEffect(() => {
    if (timingCallbacks) {
      console.log("setting progress", timeElapsed);
      timingCallbacks.setProgress(timeElapsed, "seconds");
    }
  }, [timeElapsed, timingCallbacks]);

  useEffect(() => {
    if (svgRef.current && canvasRef.current) {
      renderSvgToCanvas(svgRef.current, canvasRef.current);
    }
  }, [translateX]);
  return (
    <div ref={notationRef} id="notation" style={{ color: "#fbcfe8", height: height, width: width }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: width + "px", height: height + "px" }}
      />
    </div>
  );
};
export default NotationDisplay;
