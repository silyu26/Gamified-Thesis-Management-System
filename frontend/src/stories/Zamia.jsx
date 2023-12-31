import { useEffect, useRef } from 'react';
import { SvgPlant, ZamiaGenus} from 'svg-plant';

const Zamia = ({seedd, status}) => {
    const svg = useRef(null)

    useEffect(() => {
        const genus = new ZamiaGenus( seedd )
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
        const zamia = plant.svgElement;
        plant.animate( 0, status/100, 1000 );

        svg.current.append(zamia)
    },[])
    return(
        <div>
            <div ref={svg} style={{width: "110px",height: "150px"}} />
        </div>
    )
}
export default Zamia