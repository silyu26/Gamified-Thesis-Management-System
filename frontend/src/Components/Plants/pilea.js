import { useEffect, useRef } from 'react';
import { SvgPlant, PileaGenus } from 'svg-plant';

const Pilea = ({seedd, status}) => {
    const svg = useRef(null)

    useEffect(() => {
        const genus = new PileaGenus( seedd )
        const cfg = {
            color: true,    // Boolean
            age: 0.5,         // Float [0,1]
            potSize: .3,    // Float [0,1]
            potPathAttr: {  // Object
                fill: '#123456',
                stroke: '#111111',
            },
        };
        const plant = new SvgPlant( genus,cfg )
        const pilea = plant.svgElement;
        plant.animate( 0, status/100, 1000 );

        svg.current.append(pilea)
    },[])
    return(
        <div>
            <div ref={svg} style={{width: "110px",height: "150px"}} />
        </div>
    )
}
export default Pilea