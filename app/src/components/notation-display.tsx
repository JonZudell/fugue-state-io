"use client";
import { useEffect, useRef, useState } from "react";
import abcjs, { TuneObjectArray } from "abcjs";
import { selectNotationList, selectTimeElapsed, setTimingCallbacks, setNoteTimings } from "@/store/playback-slice";
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
  const cursorRef = useRef<SVGRectElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tunes, setTunes] = useState<TuneObjectArray | null>(null);
  const timeElapsed = useSelector(selectTimeElapsed);
  const notationList = useSelector(selectNotationList)

  const dispatch = useDispatch();
  const abc = notationList[0];
  const createCursor = () => {
    if (cursorRef.current) {
      cursorRef.current.remove();
    }
    if (svgRef.current) {
      const cursor = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      cursor.setAttribute("class", "abcjs-cursor");
      cursor.setAttributeNS(null, "x", "0");
      cursor.setAttributeNS(null, "y", "0");
      cursor.setAttributeNS(null, "width", "0");
      cursor.setAttributeNS(null, "height", "0");
      svgRef.current.prepend(cursor);
      cursorRef.current = cursor;
    }
  };
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
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width * 3, canvas.height);
        ctx.restore();
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
            wrap: { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: Infinity },
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
      createCursor();
      setTimingCallbacks( // @ts-expect-error
        new abcjs.TimingCallbacks(tunes[0], { // @ts-expect-error
          eventCallback: (ev: any) => {
            const x = ev.left - 2;
            const y = ev.top;
            const evWidth = ev.width + 4;
            const evHeight = ev.height;
            console.log(ev);
            if (cursorRef.current) {
              cursorRef.current.setAttribute("x", String(x));
              cursorRef.current.setAttribute("y", String(y));
              cursorRef.current.setAttribute("width", String(evWidth));
              cursorRef.current.setAttribute("stroke-width", "0");
              cursorRef.current.setAttribute("height", String(evHeight));
              cursorRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
              });
            }
          },
        }),
      );
    }
  }, [tunes]);
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
