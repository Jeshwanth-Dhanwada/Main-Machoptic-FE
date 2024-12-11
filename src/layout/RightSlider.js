// import { useEffect } from "react"
// import "./slider.css"
// const RightSlider = ({setIsExpandedFull, isExpandedFull, onclick}) => {

//     useEffect(() => {
//         const resizer = document.querySelector("#rightresizer");
//         const sidebar = document.querySelector(".employee-list-container");
//         resizer.addEventListener("mouseright", () => {
//           document.addEventListener("mousemove", resize, false);
//           document.addEventListener("mouseleft", () => {
//             document.removeEventListener("mousemove", resize, false);
//           }, false);
//         });

//         // function resize(e) {
//         //   // const windowHeight = window.screen.height - e.y
//         //   // const windowHeight = (window.screen.height - 160) - e.y
//         //   const windowHeight = window.innerHeight - e.clientY
          
//         //   if(windowHeight > 150 && !isExpandedFull) setIsExpandedFull(true);
//         //   else if(windowHeight <= 150 && isExpandedFull) setIsExpandedFull(false);
//         //   const size = `${windowHeight}px`;
//         //   sidebar.style.height = size;
//         // }

//         function resize(e) {
//           // Calculate the new height of the sidebar based on mouse position
//           let newHeight = window.innerHeight - e.clientY;
        
//           // Limit the resizing to a maximum height of 400 pixels
//           newHeight = Math.min(newHeight, 500);
        
//           // Update the sidebar height
//           const size = `${newHeight}px`;
//           sidebar.style.height = size;
//           console.log(size,"JKL")
//           onclick(size)
//           // Update the isExpandedFull state based on the new height
//           if (newHeight > 150 && !isExpandedFull) {
//             setIsExpandedFull(true);
//             console.log(size,"JKL")
//           } else if (newHeight <= 150 && isExpandedFull) {
//             setIsExpandedFull(false);
//             console.log(size,"JKL")
//           }
//         }
        
//     },[isExpandedFull, onclick, setIsExpandedFull])

//     return (
//         <div id="rightresizer"></div>
//     )
// }

// export default RightSlider

import { useEffect } from "react";
import "./slider.css";

const RightSlider = ({ setIsExpandedFull, isExpandedFull, onclick, active }) => {
  useEffect(() => {
    const resizer = document.querySelector("#rightresizer");
    const sidebar = document.querySelector("#dasboard-right-container");

    resizer.addEventListener("mousedown", () => {
      document.addEventListener("mousemove", resize, false);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", resize, false);
        },
        false
      );
    });

//     function resize(e) {
//       // Calculate the new width of the sidebar based on mouse position
//       let newWidth = e.clientX;
//       newWidth = Math.max(newWidth, 200); // Limit minimum width

//       // Update the sidebar width
//       const size = `${newWidth}px`;
//       sidebar.style.width = size;
// //       onclick(size);

//       // Update the isExpandedFull state based on the new width
//       if (newWidth > 200 && !isExpandedFull) {
//         setIsExpandedFull(true);
//       } else if (newWidth <= 200 && isExpandedFull) {
//         setIsExpandedFull(false);
//       }
//     }
// console.log(active,"2204")

function resize(e) {
  console.log(isExpandedFull,"llll")
  // Calculate the change in mouse position
  const deltaX = e.movementX;
  
  // Calculate the new width of the sidebar based on mouse movement
  let newWidth = sidebar.offsetWidth - deltaX;
  
  // Limit the minimum width of the sidebar
  // newWidth = Math.max(newWidth, 10);

      newWidth = Math.max(Math.min(newWidth,885), 10);

      // newWidth = active === 'FG Mapping' ? Math.max(Math.min(newWidth, 785), 10) : Math.max(Math.min(newWidth, 385), 10);

      
      // Update the sidebar width
      const size = `${newWidth}px`;
      sidebar.style.width = size;
      console.log(size,"llll")
      onclick(size)
      // Update the isExpandedFull state based on the new width
      if (size > 100 && !isExpandedFull) {
        setIsExpandedFull(true);
      } else if (size <= 100 && isExpandedFull) {
        setIsExpandedFull(false);
      }
    }
        
  }, [isExpandedFull, onclick, setIsExpandedFull]);

  return <div id="rightresizer"></div>;
};

export default RightSlider;
