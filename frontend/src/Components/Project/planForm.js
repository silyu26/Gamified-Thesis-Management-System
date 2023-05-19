import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import {useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//require('dotenv').config()

const PlanForm = () => {
    const [title, setTitle] = useState('')
    const [ofUser, setUser] = useState('')
    const [content, setContent] = useState('')
    const [startDate, setStart] = useState('')
    const [endDate, setEnd] = useState('')
    const [tokens, setToken] = useState(null)
    const [plant, setPlant] = useState('')


    useEffect(() => {
        const token = sessionStorage.getItem('access-token')
        const tmp = jwt_decode(token)
        setToken(tmp)
        // const sub = tmp['sub']
        const mail = tmp['email']
        const fetchPlan = async () => {
        const userRes = await fetch(process.env.REACT_APP_BACKEND_URI_TEST+'/api/user/mail/'+mail)
        const userJson = await userRes.json()
        const uid = userJson._id
        setUser(uid)
        
        }
        fetchPlan()
      },[])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const sub = tokens['sub']
        const mail = tokens['email']
        if(!mail) {
            console.error("No Valid User Info!")
        }
/*
        const userRes = await fetch(process.env.REACT_APP_BACKEND_URI_TEST+'/api/user/mail/'+mail)
        const userJson = await userRes.json()
        console.log("user:",userJson)
        const uid = await userJson._id 
*/
        const plan = {"title":title, "content":content, "startDate":startDate, "endDate":endDate, "ofUser":ofUser, "plant": plant} //how to implement ofUser here?
        console.log(plan)
        const response = await fetch(process.env.REACT_APP_BACKEND_URI_TEST+'/api/plan/', {
            method: 'POST',
            body: JSON.stringify(plan),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        const pid = await json._id
       
        console.log("res: ",json)
        // insert Plan
        const response2 = await fetch(process.env.REACT_APP_BACKEND_URI_TEST+'/api/user/plan/token/',{
            method: 'POST',
            body: JSON.stringify({"token": sub,"pid":pid}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json2 = await response2.json()
        console.log(json2)

        //create History
        const response3 = await fetch(process.env.REACT_APP_BACKEND_URI_TEST+'/api/hist/',{
            method: 'POST',
            body: JSON.stringify({"types": "Create","ofUser":json2._id,"content":"Plan:"+title}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json3 = await response3.json()
        const hid = await json3._id
        console.log(json3)

        //pushHistToUser
        const response4 = await fetch(process.env.REACT_APP_BACKEND_URI_TEST+'/api/user/history/token/',{
            method: 'POST',
            body: JSON.stringify({"token": sub,"hid":hid}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json4 = await response4.json()
        console.log(json4)
            const username = tokens['preferred_username']
            const password = tokens['sub']
            const authData = username+':'+password
            //window.location.reload()
            const response5 = await fetch('https://mentoring.tech4comp.dbis.rwth-aachen.de/gamification/visualization/actions/thesis_system/2/'+username, {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(authData)
                    //'Content-Type': 'application/json',
                    //'Accept': 'application/json'
                }
            })

        if(response.ok && response2.ok && response3.ok && response4.ok && response5.ok) {
            // setError(null)
            setTitle('')
            setStart('')
            setEnd('')
            setContent('')
            console.log("New Plan added: ",json)
            window.location.reload()
        }
    }

    return(
        <Container fluid>
            <Form onSubmit={handleSubmit}>
            <h4 className='text-muted'>Let's create a Plan for today!</h4>
            <br/>
            <hr/>
                <Row>
                    <Col>
                        <Form.Group className='mb-3' controlId='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Plan Title" required
                          value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='mb-3' controlId='content'>
                        <Form.Label>Content</Form.Label>
                        <Form.Control as={"textarea"} placeholder="Plan Content" required
                          value={content} onChange={(e) => setContent(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='mb-3' controlId='workType'>
                        <Form.Label>Plant Type</Form.Label>
                        <Form.Select type="text" required
                            value={plant} onChange={(e) => setPlant(e.target.value)} > 
                            <option value="">-- Please select --</option>
                            <option value="Bushy">BushyPlantGenus</option>
                            <option value="Dragon">DragonTreeGenus</option>
                            <option value="Zamia">ZamiaGenus</option>
                            <option value="Pilea">PileaGenus</option>  
                        </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className='mb-3' controlId='startDate'>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" required 
                          value={startDate} onChange={(e) => setStart(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='mb-3' controlId='endDate'>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" required 
                          value={endDate} onChange={(e) => setEnd(e.target.value)}/>
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
            <Button variant="primary" type="submit">
                 Submit
            </Button>
            </Form>
        </Container>
    )
    /*
    return(
        <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='title'>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Plan Title" required
                value={title} onChange={(e) => setTitle(e.target.value)} />
                
            </Form.Group>
            <Form.Group className='mb-3' controlId='content'>
                <Form.Label>Content</Form.Label>
                <Form.Control as={"textarea"} placeholder="Plan Content" required
                value={content} onChange={(e) => setContent(e.target.value)} />
                
            </Form.Group>
            <Form.Group className='mb-3' controlId='startDate'>
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" required 
                value={startDate} onChange={(e) => setStart(e.target.value)}/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='endDate'>
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" required 
                value={endDate} onChange={(e) => setEnd(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                 Submit
            </Button>
        </Form>
    )*/

}
export default PlanForm