import Annotation from "./Annotation";
import {Html} from "@react-three/drei";

export default function UI(props) {
    return (
        <group {...props}>
            <Html center>
                <Annotation
                    title="MP4"
                    body="Shoots in MP4 video at 17Mbps"
                    position={{
                        top: "20%",
                        left: "10%"
                    }}
                />
            </Html>

            <Html center>
                <Annotation
                    title="SD XC"
                    body="Comes included with a 16gb SD"
                    position={{
                        bottom: "25%",
                        left: "1%"
                    }}
                />
            </Html>

            <Html center>
                <Annotation
                    title="Full HD"
                    body="Resolution at 1920x1080"
                    position={{
                        top: "25%",
                        right: "5%"
                    }}
                />
            </Html>

            <Html center>
                <Annotation
                    title="Battery"
                    body="180 minutes of filming"
                    position={{
                        bottom: "10%",
                        right: "5%"
                    }}
                />
            </Html>
        </group>


    );
}
