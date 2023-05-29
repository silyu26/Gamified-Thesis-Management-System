import { useEffect, useState } from 'react';
import { Container, Card, Row, Col, ProgressBar, Modal } from 'react-bootstrap';
import MA from '../Components/Pics/MA.png'
import BA from '../Components/Pics/BA.png'
import DA from '../Components/Pics/DA.jpg'
import Pcontainer from '../Components/plantContainer';


const All = () => {

    const [users, setUsers] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [visitId, setVisitId] = useState('')
    const [visiter, setVisiter] = useState('')
    const [workType, setWorkType] = useState('')
    const [workName, setWorkName] = useState('')

    const openModal = () => {
        setModalOpen(true)
    }
    const closeModal = () => {
        setModalOpen(false)
    }
    const handleClick = (id, fname, lname, workname, worktype) => {
        setVisitId(id)  
        setVisiter(fname+' '+lname)
        setWorkName(workname)
        setWorkType(worktype)
    } 

    useEffect ( () => {
        const getUserData = async() => {
            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_URI+'/api/user/visible')
                const json = await response.json()
                setUsers(json)

                const updatedUsers = []
                for (const user of json) {
                    const response2 = await fetch(
                      process.env.REACT_APP_BACKEND_URI+'/api/user/progress/'+user._id
                    )
                    const json2 = await response2.json()
            
                    const updatedUser = { ...user, progress: json2.progress }
                    updatedUsers.push(updatedUser);
                  }
                  setUsers(updatedUsers)                
            } catch (error) {
                console.error(error)
            }
        }
        getUserData()
    },[])

    return (
        <Container>
            <Modal show={modalOpen} onHide={closeModal} size='xl'>
              {/*cardId*/}
              <Modal.Header closeButton>
                <Modal.Title>{workName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5 className='text-center'>An Overview of The Selected Thesis</h5>
                <br />
                <Pcontainer id={visitId} />
              </Modal.Body>
            </Modal>

            <Row><br /></Row>
            <Row>
                <Col className='text-center'><h2 className='text-muted'>Peers' Projects</h2>
                <h6>Here you can find all visible thesis projects of your peer students, go see their status and say hi!</h6></Col>
                </Row>
            <Row><br /></Row>
            <hr />
            <Row >
            { users ?
            users.map(user => (
                <Col key={user._id} sm={2} md={3} >
                <Card style={{margin: '10px 10px 10px 10px',boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)', cursor: 'pointer', width: '200px', height: '100%'}}
                       onClick={()=>[handleClick(user._id, user.firstName, user.lastName, user.workName, user.workType),openModal()]}>
                    {
                        user.workType === "Bachelor Thesis" ?
                        <Card.Img variant="top" src={BA} /> :
                          user.workType === "Master Thesis" ? 
                          <Card.Img variant="top" src={MA} />  :
                          <Card.Img variant='top' src={DA} />
                    }
                    
                    <Card.Body>
                        <Card.Title>{user.firstName +" "+ user.lastName}</Card.Title>
                        <Card.Text>
                            {user.workName}
                        </Card.Text>
                        
                    </Card.Body>
                    <ProgressBar style={{height: '3px'}} striped variant="#6495ED" now={user.progress*100} />
                    <br />
                </Card>
                </Col>
            )) : <div>No Content Yet</div>}
            </Row>
            
        </Container>
    )
}

export default All