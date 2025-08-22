import { initDraw } from "@/draw"; 
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pen, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rectangle" | "pencil";

export function Canvas({    
    roomId,
    socket
}: {
    roomId: string;
    socket: WebSocket;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool,setSelectedTool] =useState<Tool>("circle");

    useEffect(() => {

        if (canvasRef.current) {
            const gameInstance = new Game(canvasRef.current, roomId, socket);
            setGame(gameInstance);

            return () => {
                gameInstance.destroy();
            }
        }
    }, [canvasRef]);

    return <div style = {{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref ={canvasRef} width ={window.innerWidth} height ={window.innerHeight}></canvas>
        <Topbar setSelectedTool={ setSelectedTool} selectedTool={selectedTool}></Topbar>
    </div>
    function Topbar({selectedTool, setSelectedTool}: {
        selectedTool: Tool;
        setSelectedTool: (s: Tool) => void
     }) {
        return <div style={{
            position : "fixed",
            top : 10,
            left :10
        }}>
            <div className="flex gap-t">
                <IconButton onClick = {() => {
                    setSelectedTool("circle")
                }}
                activated ={selectedTool === "circle"} 
                icon={<Circle />}
                />
                <IconButton onClick = {() => {
                    setSelectedTool("rectangle")
                }}
                activated ={selectedTool === "rectangle"} 
                icon={<RectangleHorizontalIcon />}
                />
                <IconButton onClick = {() => {
                    setSelectedTool("pencil")
                }}
                activated ={selectedTool === "pencil"} 
                icon={<Pencil />}
                />
            </div>
        </div>
     }


}