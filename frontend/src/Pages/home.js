import Pcontainer from "../Components/plantContainer";
import { React, useState, useEffect } from "react";
import jwt_decode from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//require('dotenv').config()



const Home = () => {
    const [tokens, setToken] = useState('')
    const [uid, setUid] = useState('')

  const findOrCreate = async(fName,lName,mail,sub) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URI_TEST+'/api/user/mail/'+mail)
    const json = await response.json()
    if(response.ok && json !== null) {
      return json
      //setUserId(json._id)
    } else if(response.ok && json === null) {
      const user = {'firstName': fName,'lastName': lName,'email':mail,'token': sub, 'workType': 'Bachelor Thesis'}
      console.log('Creating new user')
      const response2 = await fetch(process.env.REACT_APP_BACKEND_URI_TEST+'/api/user/', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      const json2 = response2.json()
      //setUserId(json2._id)
      if(response.ok && json2 !== null) {
        return json2
      }
      }
  }

  const validateAndAddToGame = async(authData,username,token) => {
      const response = await fetch('https://mentoring.tech4comp.dbis.rwth-aachen.de/gamification/games/validation', {
          mode: 'cors',
          method: 'POST',
          headers: {
              'Authorization': 'Basic ' + btoa(authData),
              'access-token': token,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
      })
      if (response.ok) {
        const response2 = await fetch('https://mentoring.tech4comp.dbis.rwth-aachen.de/gamification/games/data/thesis_system/'+username, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(authData),
                'access-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        const json2 = await response2.json()
        console.log("GF says:",json2)
      }
  }
      
    useEffect(() => {
      const getUser = async() => {
        const token = sessionStorage.getItem('access-token')
        setToken(token)   
        const tmp = jwt_decode(token)       
        const lName = tmp['family_name']
        const fName = tmp['given_name']
        const email = tmp['email']
        const username = tmp['preferred_username']
        const sub = tmp['sub'] 
        const authData = username+':'+sub
        const currUser = await findOrCreate(fName,lName,email,sub)
        if(currUser) {
          await validateAndAddToGame(authData,username,token)
        }
        setUid(currUser._id)
      }
      getUser()
    },[]) 
  
    return( 
        <Container >{/**fluid */}
            <Row>
              <Col sm={12}>
                <Row><br /></Row>
                <Row><h1 className="text-center">Welcome to the thesis management system of the RWTH Informatik 5</h1></Row>
                <Row><hr /></Row>
                <Row>
                  <h4 className="text-center">Here you can find all the plans you defined for your thesis project:</h4>
                </Row>
                <Row><br /></Row>
                <Row>
                  <div style={{ maxHeight: '550px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                    <Pcontainer />
                  </div>
                </Row>
              </Col>
            </Row>            
        </Container> 
    )
}
export default Home