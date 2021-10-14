import './App.css';
import EntryPage from './components/EntryPage/EntryPage'; 
import Rooms from './components/Rooms/Rooms';
import { Route, Switch, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import RoomInside from './components/RoomInside/RoomInside';
import { setUsername } from './redux/actions'


function App( { username, setUsername } ) {

  const history = useHistory();

  if ( !username ) {  // Если пользователь не переходил со страницы ввода имени ранее, то его туда перекинет, если он уже был на сайте, при попытке перехода в обход главной страницы имя возьмется из local storage

    if ( !localStorage.getItem('name')) {

      history.push('/')

      return (
        <EntryPage />
      )

    } else {
      setUsername(localStorage.getItem('name'))
    }
  }

  return (
    <Switch>
      <Route exact path="/" component={EntryPage} />
      <Route exact path="/rooms" component={Rooms}/>
      <Route path="/rooms/:id" component={RoomInside} />
      <Route path="*">
        <h1>Страница не найдена</h1>
      </Route>
    </Switch>
  );
}

const mapStateToProps = (store) => {
  return {
    username: store.username
  }
}

const mapDispatchToProps = {
  setUsername
}

export default connect(mapStateToProps, mapDispatchToProps)(App)