import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { auth } from './app/firebaseCfg';
import { connect } from 'react-redux';
import { setLanguage } from './app/appSlice';

import Home from './pages/Home';
import Signup from './pages/Signup';
import UserMgmt from './pages/UserMgmt';
import Loading from './components/layout/Loading';
import AlertMsg from './components/layout/AlertMsg';

import styles from './styles/App.module.sass';
import language from './lang/lang.json';


const App = ({ loading, alert, setLanguage }) => {
  useLayoutEffect(() => {
    auth.useDeviceLanguage();
    if (auth.languageCode.substring(0, 2) === 'pt') {
      setLanguage('pt');
      document.title = language.pt.text.title;
      document.getElementById('html').setAttribute('lang', 'pt');
    }
  }, [setLanguage]);

  return (
    <Router>
      <main className={styles.main}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/usermgmt' element={<UserMgmt />} />
        </Routes>
        {loading && <Loading />}
        {alert && <AlertMsg />}
      </main>
    </Router>
  );
}

const mapState = (state) => ({
  loading: state.app.loading,
  alert: state.app.alert
})

const mapDispatch = { setLanguage }

export default connect(mapState, mapDispatch)(App);