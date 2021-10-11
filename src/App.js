import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import HomeScreen from "screens/HomeScreen"
import TokenScreen from "screens/TokenScreen"




const App = () => {
    return (
        <Router>
            <div className='main'>
                <Switch>
                    <Route path='/' exact component={HomeScreen} />
                    <Route path='/create-token' exact component={TokenScreen} />
                </Switch>
            </div>
        </Router>
    )
}

export default App
