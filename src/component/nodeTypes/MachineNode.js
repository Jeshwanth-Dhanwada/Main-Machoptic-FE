import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/apiConstants';

export default memo((props) => {
  const [data, setData] = useState(props.data);
  const [Nodedata, setNodedata] = useState([]);
  // const [ImageLink, setImage] = useState(data.node.url);
  const [height, setheight] = useState([]);
  const [width, setwidth] = useState([]);
  // This effect will run whenever props.data changes
  useEffect(() => {
    setData(props.data);
    // setImage(props.data.node.url) 
  }, [props.data]);
  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setNodedata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const [imageSrc, setImageSrc] = useState([]);
  useEffect(() => {
    const image = Nodedata.filter((item) => item.nodeName == data.label).map((item) => item.nodeImage)
    console.log(image,"imageSrc")
    const height = Nodedata.filter((item) => item.nodeName == data.label).map((item) => item.height)
    const width = Nodedata.filter((item) =>  item.nodeName == data.label).map((item) => item.width)
    setheight(height)
    setwidth(width)
    // Fetch the image from your server
    axios.get(`${BASE_URL}/image/${image}`, { responseType: 'blob' })
      .then(response => {
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl)
        })
      .catch(err => {
        console.log(err);
      });

    // Cleanup function to revoke the object URL when component unmounts
    return () => {
        URL.revokeObjectURL(imageSrc);
    };
  }, [data.label,Nodedata])

  console.log(imageSrc,"imageSrc")

  return (
    <div>
        <img src={imageSrc} 
             style={{ width: '130px', 
                      height: '80px', 
                      borderRadius:'10px',
                      backgroundColor:'#FFFFFF',
                      position:'absolute',
                      left:'100px',
                      top:'-30px'
                   }} alt='machine'>
                   </img>
    </div>
  );
});
