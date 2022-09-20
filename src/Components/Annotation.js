import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, Vector2, Vector3 } from "three";
import { Perlin } from "three-noise";

function getD(positionsDecimal, dimentions, offset) {
    return `M
  ${Math.floor(
        MathUtils.clamp(window.innerWidth, 0, 400) *
        (positionsDecimal.left || 1.0 - positionsDecimal.right) +
        (positionsDecimal.right ? -dimentions.w / 2 : dimentions.w / 2) +
        offset.x
    )}
  ${
        Math.floor(
            MathUtils.clamp(window.innerHeight, 0, 750) *
            (positionsDecimal.top || 1 - positionsDecimal.bottom)
        ) +
        (positionsDecimal.bottom ? -dimentions.h : dimentions.h) +
        offset.y
    }  
  L 
  ${Math.floor(MathUtils.clamp(window.innerWidth, 0, 400) / 2)} 
  ${Math.floor(MathUtils.clamp(window.innerHeight, 0, 750) / 2)}`;
}

export default function Annotation({
                                       title,
                                       body,
                                       long,
                                       position,
                                       float,
                                       scale
                                   }) {
    const box = useRef();
    const lines = useRef();
    const dimentions = useMemo(
        () => ({
            w: long ? 240 : 140,
            h: 90
        }),
        [long]
    );

    const positionsDecimal = {
        top: parseInt((position?.top || "0").split("%")[0], 10) / 100,
        bottom: parseInt((position?.bottom || "0").split("%")[0], 10) / 100,
        left: parseInt((position?.left || "0").split("%")[0], 10) / 100,
        right: parseInt((position?.right || "0").split("%")[0], 10) / 100
    };

    const id = useMemo(() => Math.random(), []);
    const perlin = useMemo(() => new Perlin(Math.random()), []);

    useEffect(() => {
        let frame;
        if (box.current && lines.current && float) {
            const el = box.current;
            const path = lines.current;

            const animate = (t) => {
                const v = new Vector2(t, t).multiplyScalar(0.0005);
                const position = perlin.get2(v) * 5.6;

                el.style.transform = `scale(${
                    scale || 1
                }) translate(${position}px, ${position}px)`;

                path.setAttribute(
                    "d",
                    getD(positionsDecimal, dimentions, new Vector2(position, position))
                );

                frame = requestAnimationFrame(animate);
            };

            frame = requestAnimationFrame(animate);
        }

        return () => {
            if (frame) cancelAnimationFrame(frame);
        };
    }, [box, float]);

    return (
        <div
            style={{
                width: "100vw",
                maxWidth: "400px",
                height: "100vh",
                maxHeight: "750px",
                transformOrigin: "center",
                opacity: scale || 1,
                transform: `scale(${scale || 1})`
            }}
        >
            <div
                ref={box}
                style={{
                    maxWidth: "200px",
                    width: long ? "inherit" : "140px",
                    height: "90px",
                    backdropFilter: "blur(12px)",
                    position: "absolute",
                    top: position?.top || null,
                    bottom: position?.bottom || null,
                    left: position?.left || null,
                    right: position?.right || null,
                    background:
                        "linear-gradient(168.53deg, rgba(234, 255, 254, 0.2) 0.4%, rgba(201, 229, 241, 0.2) 97.87%)",
                    borderRadius: "10px",
                    boxShadow: `0px 0px 15px 0px rgba(0,0,0,${(scale || 1) * 0.15})`,
                    textAlign: !!position?.right ? "right" : "left"
                }}
            >
                <div
                    style={{
                        fontFamily: "sans-serif",
                        color: "white",
                        padding: "8px"
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "20px"
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "12px"
                        }}
                    >
                        {body}
                    </p>
                </div>
            </div>
            <svg
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10
                }}
            >
                <defs>
                    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                        {!!position?.right ? (
                            <>
                                <stop offset="30%" stopColor="rgba(255,255,255,0)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,1)" />
                            </>
                        ) : (
                            <>
                                <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                                <stop offset="70%" stopColor="rgba(255,255,255,0)" />
                            </>
                        )}
                    </linearGradient>
                </defs>
                <g fill="none" stroke={`url(#${id})`} strokeWidth="1">
                    {/* <g fill="none" stroke="white" strokeWidth="1"> */}
                    <path
                        ref={lines}
                        strokeDasharray="4,4" //
                        d={getD(positionsDecimal, dimentions, new Vector2(0, 0))}
                    />
                    {/* <circle
            cx={Math.floor((box.current?.clientWidth || 0) / 2)}
            cy={
              Math.floor(window.innerHeight * 0.2) +
              (box.current?.clientHeight || 0)
            }
            r="6"
            stroke="none"
            fill="white"
          /> */}
                </g>
            </svg>
        </div>
    );
}
