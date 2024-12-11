import { useEffect } from "react"
import "./slider.css"
const Slider = ({setIsExpandedFull, isExpandedFull, onclick}) => {

    useEffect(() => {
        const resizer = document.querySelector("#resizer");
        const sidebar = document.querySelector("#dasboard-footer-container");
        resizer.addEventListener("mousedown", () => {
          document.addEventListener("mousemove", resize, false);
          document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", resize, false);
          }, false);
        });

        // function resize(e) {
        //   // const windowHeight = window.screen.height - e.y
        //   // const windowHeight = (window.screen.height - 160) - e.y
        //   const windowHeight = window.innerHeight - e.clientY
          
        //   if(windowHeight > 150 && !isExpandedFull) setIsExpandedFull(true);
        //   else if(windowHeight <= 150 && isExpandedFull) setIsExpandedFull(false);
        //   const size = `${windowHeight}px`;
        //   sidebar.style.height = size;
        // }

        function resize(e) {
          // Calculate the new height of the sidebar based on mouse position
          let newHeight = window.innerHeight - e.clientY;
        
          // Limit the resizing to a maximum height of 400 pixels
          newHeight = Math.min(newHeight, 500);
        
          // Update the sidebar height
          const size = `${newHeight}px`;
          sidebar.style.height = size;
          console.log(size,"JKL")
          // Update the isExpandedFull state based on the new height
          onclick(size)
          if (newHeight > 150 && !isExpandedFull) {
            setIsExpandedFull(true);
            console.log(size,"JKL")
          } else if (newHeight <= 150 && isExpandedFull) {
            setIsExpandedFull(false);
            onclick('0px')
            console.log(size,"JKL")
          }
        }
        
    },[isExpandedFull, onclick, setIsExpandedFull])

    return (
        <div id="resizer"></div>
    )
}

export default Slider