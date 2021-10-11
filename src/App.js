import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import HomeScreen from "screens/HomeScreen"




const App = () => {
    return (
        <Router>
            <div className='main'>
                <Switch>
                    <Route path='/' exact component={HomeScreen} />
                </Switch>
            </div>
        </Router>
    )
}

export default App
